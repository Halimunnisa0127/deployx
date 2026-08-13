const Docker = require('dockerode');

// Default dockerode connects to the local docker socket automatically.
const docker = new Docker();

class DockerClient {
  /**
   * Verifies that the Docker daemon is reachable.
   */
  static async ping() {
    try {
      await docker.ping();
      return true;
    } catch (error) {
      console.error('[DockerClient] Docker daemon is unreachable:', error.message);
      return false;
    }
  }

  /**
   * Runs a strictly isolated smoke test container.
   * This ensures the worker can execute isolated code without giving it privileges.
   */
  static async runSmokeTest(deploymentId) {
    const isAvailable = await this.ping();
    if (!isAvailable) {
      throw new Error('Docker daemon is unavailable. Cannot perform execution.');
    }

    const imageName = 'alpine:latest';
    
    // Ensure image exists
    try {
      console.log(`[DockerClient] Pulling image ${imageName}...`);
      await new Promise((resolve, reject) => {
        docker.pull(imageName, (err, stream) => {
          if (err) return reject(err);
          docker.modem.followProgress(stream, (onFinishedErr, output) => {
            if (onFinishedErr) return reject(onFinishedErr);
            resolve(output);
          });
        });
      });
    } catch (pullError) {
      console.error(`[DockerClient] Failed to pull image ${imageName}:`, pullError.message);
      throw new Error(`Failed to initialize Docker container image.`);
    }

    const containerOptions = {
      Image: imageName,
      Cmd: ['echo', 'DeployX Docker worker ready'],
      Tty: false,
      NetworkDisabled: true, // Strict isolation
      HostConfig: {
        Privileged: false,
        Memory: 512 * 1024 * 1024, // 512 MB
        NanoCPUs: 1 * 1e9, // 1 CPU Core
        PidsLimit: 100,
        Binds: [] // No host mounting
      }
    };

    let container;
    try {
      console.log(`[DockerClient] Creating isolated container for deployment ${deploymentId}...`);
      container = await docker.createContainer(containerOptions);

      console.log(`[DockerClient] Starting container ${container.id}...`);
      await container.start();

      console.log(`[DockerClient] Waiting for container ${container.id} to finish...`);
      const data = await container.wait();

      if (data.StatusCode !== 0) {
        throw new Error(`Container exited with non-zero status code: ${data.StatusCode}`);
      }
      
      console.log(`[DockerClient] Smoke test completed successfully (Exit code 0).`);
      return true;

    } catch (error) {
      console.error(`[DockerClient] Smoke test execution failed for deployment ${deploymentId}:`, error.message);
      throw new Error(`Docker execution failed: ${error.message}`);
    } finally {
      if (container) {
        try {
          console.log(`[DockerClient] Cleaning up container ${container.id}...`);
          // Force remove in case it's still running or stuck
          await container.remove({ force: true });
          console.log(`[DockerClient] Container ${container.id} removed.`);
        } catch (cleanupError) {
          console.error(`[DockerClient] Failed to remove container ${container.id}:`, cleanupError.message);
        }
      }
    }
  }
  /**
   * Executes a real build inside a strictly isolated container.
   * Allows capturing logs via onLog callback incrementally.
   * Calls onSuccess(container) strictly when build finishes before cleanup.
   */
  static async runBuild(deployment, githubToken, envVars = {}, onLog = null, onSuccess = null) {
    const isAvailable = await this.ping();
    if (!isAvailable) {
      throw new Error('Docker daemon is unavailable. Cannot perform execution.');
    }

    // Default node image.
    const imageName = 'node:20-alpine';
    
    // Ensure image exists
    try {
      console.log(`[DockerClient] Pulling image ${imageName}...`);
      await new Promise((resolve, reject) => {
        docker.pull(imageName, (err, stream) => {
          if (err) return reject(err);
          docker.modem.followProgress(stream, (onFinishedErr, output) => {
            if (onFinishedErr) return reject(onFinishedErr);
            resolve(output);
          });
        });
      });
    } catch (pullError) {
      console.error(`[DockerClient] Failed to pull image ${imageName}:`, pullError.message);
      throw new Error(`Failed to initialize Docker container image.`);
    }

    // We must install git in alpine if it doesn't exist, node:20-alpine does not always have git.
    const b64Token = Buffer.from(`x-access-token:${githubToken}`).toString('base64');
    
    // Create the secure script.
    // We use http.extraHeader to avoid writing credentials to .git/config
    const script = `
set -e
echo "Installing git client dependency..."
apk add --no-cache git
mkdir -p /workspace
cd /workspace
git init > /dev/null
git remote add origin "https://github.com/${deployment.source.repositoryFullName}.git"

echo "Fetching commit ${deployment.source.commitSha}..."
git -c http.extraHeader="AUTHORIZATION: basic ${b64Token}" fetch --depth 1 origin "${deployment.source.commitSha}" > /dev/null

git checkout -qf FETCH_HEAD

ACTUAL_SHA=$(git rev-parse HEAD)
if [ "$ACTUAL_SHA" != "${deployment.source.commitSha}" ]; then
  echo "Commit SHA mismatch. Expected: ${deployment.source.commitSha}, Actual: $ACTUAL_SHA"
  exit 1
fi
echo "Verified commit SHA."

echo "Verifying environment variables..."
${Object.keys(envVars).map(key => `if [ -z "$${key}" ]; then echo "Warning: ${key} is empty or not set"; else echo "Verified ${key} is injected"; fi`).join('\n')}

echo "Installing dependencies..."
cd "/workspace/${deployment.buildSettings.rootDirectory || ''}"
${deployment.buildSettings.installCommand}

echo "Building project..."
${deployment.buildSettings.buildCommand}

echo "Build complete."
exit 0
`;

    // Map object to Docker Env array format (KEY=VALUE)
    const dockerEnv = Object.entries(envVars).map(([key, value]) => `${key}=${value}`);

    const containerOptions = {
      name: `deployx-build-${deployment._id}`,
      Image: imageName,
      Cmd: ['sh'],
      OpenStdin: true,
      StdinOnce: true,
      AttachStdin: true,
      Tty: false,
      NetworkDisabled: false, // Network required for npm install and git clone
      Env: dockerEnv,
      Labels: {
        deployx: 'true',
        deploymentId: String(deployment._id),
        projectId: String(deployment.project),
      },
      HostConfig: {
        Privileged: false,
        Memory: 512 * 1024 * 1024, // 512 MB
        NanoCPUs: 1 * 1e9, // 1 CPU Core
        PidsLimit: 100,
        Binds: [] // No host mounting
      }
    };

    let container;
    try {
      console.log(`[DockerClient] Creating isolated container for deployment ${deployment._id}...`);
      container = await docker.createContainer(containerOptions);
      console.log({ event: 'docker.container.created', containerId: container.id });

      // Stream the script into the container's stdin securely
      const stream = await container.attach({ stream: true, stdin: true, stdout: true, stderr: true, hijack: true });
      console.log({ event: 'docker.container.attached', containerId: container.id });
      
      if (onLog) {
        // Demux stdout and stderr safely for incremental logging
        container.modem.demuxStream(
          stream,
          { write: (chunk) => onLog('info', chunk.toString('utf8')) },
          { write: (chunk) => onLog('error', chunk.toString('utf8')) }
        );
      }

      console.log(`[DockerClient] Starting container ${container.id}...`);
      await container.start();
      console.log({ event: 'docker.container.started', containerId: container.id });

      // Small delay to ensure sh is fully spawned and reading from the stdin pipe
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log({ event: 'docker.script.write.started', containerId: container.id });
      await new Promise((resolve, reject) => {
        stream.write(script, 'utf8', (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      console.log({ event: 'docker.script.write.completed', containerId: container.id });

      console.log(`[DockerClient] Waiting for container ${container.id} to finish (with 5 min timeout)...`);
      console.log({ event: 'docker.wait.started', containerId: container.id });
      
      const timeoutMs = 5 * 60 * 1000;
      let timeoutHandle;
      
      const waitPromise = container.wait();
      const timeoutPromise = new Promise((_, reject) => {
        timeoutHandle = setTimeout(() => reject(new Error('BUILD_TIMEOUT')), timeoutMs);
      });

      let data;
      try {
        data = await Promise.race([waitPromise, timeoutPromise]);
        console.log({ event: 'docker.wait.completed', containerId: container.id });
      } catch (raceError) {
        if (raceError.message === 'BUILD_TIMEOUT') {
          console.error(`[DockerClient] Build timed out for container ${container.id}`);
          try { await container.kill(); } catch (killErr) {} // Force kill
          throw new Error('Build execution exceeded maximum timeout.');
        }
        throw raceError;
      } finally {
        clearTimeout(timeoutHandle);
      }

      if (data.StatusCode !== 0) {
        throw new Error(`Container exited with non-zero status code: ${data.StatusCode}`);
      }
      
      console.log(`[DockerClient] Build completed successfully (Exit code 0).`);

      if (onSuccess) {
        console.log(`[DockerClient] Executing onSuccess artifact extraction...`);
        await onSuccess(container);
      }
      
      return true;

    } catch (error) {
      // Sanitize Docker API errors to ensure Env array (which might contain secrets) is stripped
      const safeErrorMsg = error.message ? error.message.replace(/Env:\s*\[[^\]]+\]/g, 'Env: [REDACTED]') : 'Unknown error';
      console.error(`[DockerClient] Build execution failed for deployment ${deployment._id}:`, safeErrorMsg);
      throw new Error(`Docker execution failed: ${safeErrorMsg}`);
    } finally {
      if (container) {
        try {
          console.log(`[DockerClient] Cleaning up container ${container.id}...`);
          await container.remove({ force: true });
          console.log(`[DockerClient] Container ${container.id} removed.`);
        } catch (cleanupError) {
          console.error(`[DockerClient] Failed to remove container ${container.id}:`, cleanupError.message);
        }
      }
    }
  }

  /**
   * Finds a deployment container using its deploymentId label or name.
   */
  static async findDeploymentContainer(deploymentId) {
    try {
      const list = await docker.listContainers({
        all: true,
        filters: JSON.stringify({
          label: [`deploymentId=${deploymentId}`]
        })
      });
      if (list && list.length > 0) {
        return docker.getContainer(list[0].Id);
      }
      // Fallback name search
      const nameList = await docker.listContainers({
        all: true,
        filters: JSON.stringify({
          name: [`deployx-build-${deploymentId}`]
        })
      });
      if (nameList && nameList.length > 0) {
        return docker.getContainer(nameList[0].Id);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Stops a deployment build container if it is running.
   */
  static async stopDeploymentContainer(deploymentId) {
    try {
      const container = await this.findDeploymentContainer(deploymentId);
      if (container) {
        await container.stop();
      }
    } catch (error) {
      // Ignore if container is already stopped or cannot be stopped
    }
  }

  /**
   * Removes a deployment build container.
   */
  static async removeDeploymentContainer(deploymentId) {
    try {
      const container = await this.findDeploymentContainer(deploymentId);
      if (container) {
        await container.remove({ force: true });
      }
    } catch (error) {
      // Ignore if already removed
    }
  }

  /**
   * Finds an available dynamic port.
   */
  static async findFreePort() {
    const net = require('net');
    return new Promise((resolve, reject) => {
      const server = net.createServer();
      server.unref();
      server.listen(0, () => {
        const { port } = server.address();
        server.close(() => resolve(port));
      });
      server.on('error', (err) => reject(err));
    });
  }

  /**
   * Removes all existing runtime containers for a given project.
   */
  static async removePreviousRuntimeContainers(projectId) {
    try {
      const list = await docker.listContainers({
        all: true,
        filters: JSON.stringify({
          label: [
            `projectId=${projectId}`,
            'type=runtime'
          ]
        })
      });
      for (const cInfo of list) {
        try {
          const container = docker.getContainer(cInfo.Id);
          await container.stop().catch(() => {});
          await container.remove({ force: true }).catch(() => {});
        } catch (err) {
          // Ignore
        }
      }
    } catch (error) {
      // Ignore
    }
  }

  /**
   * Starts a dedicated nginx:alpine container serving the deployment's artifact.
   */
  static async startRuntimeContainer(deployment, artifact) {
    const net = require('net');
    const http = require('http');
    const tar = require('tar-stream');
    const LocalArtifactStorageProvider = require('../../modules/storage/providers/LocalArtifactStorageProvider');
    const storageProvider = new LocalArtifactStorageProvider();

    const isAvailable = await this.ping();
    if (!isAvailable) {
      throw new Error('Docker daemon is unavailable. Cannot launch runtime.');
    }

    const imageName = 'nginx:alpine';

    // Ensure Nginx image exists
    try {
      console.log(`[DockerClient] Pulling image ${imageName}...`);
      await new Promise((resolve, reject) => {
        docker.pull(imageName, (err, stream) => {
          if (err) return reject(err);
          docker.modem.followProgress(stream, (onFinishedErr, output) => {
            if (onFinishedErr) return reject(onFinishedErr);
            resolve(output);
          });
        });
      });
    } catch (pullError) {
      console.error(`[DockerClient] Failed to pull image ${imageName}:`, pullError.message);
      throw new Error(`Failed to initialize runtime container image.`);
    }

    // Allocate dynamic host port
    const freePort = await this.findFreePort();
    console.log(`[DockerClient] Allocated port ${freePort} for deployment ${deployment._id}`);

    const containerOptions = {
      name: `deployx-runtime-${deployment._id}`,
      Image: imageName,
      ExposedPorts: { '80/tcp': {} },
      HostConfig: {
        PortBindings: { '80/tcp': [{ HostPort: String(freePort) }] },
        Memory: 128 * 1024 * 1024, // 128 MB limit
        NanoCPUs: 0.5 * 1e9,       // 0.5 CPU Core
        PidsLimit: 50
      },
      Labels: {
        deployx: 'true',
        deploymentId: String(deployment._id),
        projectId: String(deployment.project),
        type: 'runtime'
      }
    };

    let container;
    try {
      console.log(`[DockerClient] Creating runtime container for deployment ${deployment._id}...`);
      container = await docker.createContainer(containerOptions);

      console.log(`[DockerClient] Starting runtime container ${container.id}...`);
      await container.start();

      // Configure default Nginx SPA rule
      const outputDir = deployment.buildSettings.outputDirectory || 'dist';
      const nginxConfig = `
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html/${outputDir};
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
`;
      const configPack = tar.pack();
      configPack.entry({ name: 'default.conf' }, nginxConfig);
      configPack.finalize();

      console.log(`[DockerClient] Injecting SPA Nginx configuration...`);
      await container.putArchive(configPack, { path: '/etc/nginx/conf.d' });

      // Inject project artifacts
      console.log(`[DockerClient] Injecting artifact files...`);
      const artifactStream = await storageProvider.getArtifactStream(artifact.storageKey);
      await container.putArchive(artifactStream, { path: '/usr/share/nginx/html' });

      // Reload Nginx configuration
      console.log(`[DockerClient] Reloading Nginx server...`);
      const execInstance = await container.exec({
        Cmd: ['nginx', '-s', 'reload'],
        AttachStdout: false,
        AttachStderr: false
      });
      await execInstance.start();

      // Run health check with retries
      console.log(`[DockerClient] Verifying container health on port ${freePort}...`);
      let healthy = false;
      for (let attempt = 1; attempt <= 10; attempt++) {
        const up = await new Promise((resolve) => {
          const req = http.get(`http://localhost:${freePort}/`, (res) => {
            resolve(res.statusCode >= 200 && res.statusCode < 400);
          });
          req.on('error', () => resolve(false));
          req.end();
        });

        if (up) {
          healthy = true;
          break;
        }
        await new Promise((r) => setTimeout(r, 500));
      }

      if (!healthy) {
        throw new Error(`Runtime health check failed on port ${freePort}.`);
      }

      console.log(`[DockerClient] Runtime container is healthy and running on port ${freePort}.`);
      return { containerId: container.id, port: freePort };

    } catch (err) {
      console.error(`[DockerClient] Failed to setup runtime container:`, err.message);
      if (container) {
        await container.remove({ force: true }).catch(() => {});
      }
      throw err;
    }
  }
}

module.exports = DockerClient;
