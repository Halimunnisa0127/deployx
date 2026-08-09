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
apk add --no-cache git > /dev/null 2>&1
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
${deployment.buildSettings.installCommand}

echo "Building project..."
${deployment.buildSettings.buildCommand}

echo "Build complete."
`;

    // Map object to Docker Env array format (KEY=VALUE)
    const dockerEnv = Object.entries(envVars).map(([key, value]) => `${key}=${value}`);

    const containerOptions = {
      name: `deployx-build-${deployment._id}`,
      Image: imageName,
      Cmd: ['sh'],
      OpenStdin: true,
      StdinOnce: true,
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

      console.log(`[DockerClient] Starting container ${container.id}...`);
      await container.start();

      // Stream the script into the container's stdin securely
      const stream = await container.attach({ stream: true, stdin: true, stdout: true, stderr: true });
      
      if (onLog) {
        // Demux stdout and stderr safely for incremental logging
        container.modem.demuxStream(
          stream,
          { write: (chunk) => onLog('info', chunk.toString('utf8')) },
          { write: (chunk) => onLog('error', chunk.toString('utf8')) }
        );
      }

      stream.write(script);
      stream.end();

      console.log(`[DockerClient] Waiting for container ${container.id} to finish (with 5 min timeout)...`);
      
      const timeoutMs = 5 * 60 * 1000;
      let timeoutHandle;
      
      const waitPromise = container.wait();
      const timeoutPromise = new Promise((_, reject) => {
        timeoutHandle = setTimeout(() => reject(new Error('BUILD_TIMEOUT')), timeoutMs);
      });

      let data;
      try {
        data = await Promise.race([waitPromise, timeoutPromise]);
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
}

module.exports = DockerClient;
