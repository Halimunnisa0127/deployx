const domainRoutingService = require('../modules/domains/services/domainRouting.service');
const ArtifactService = require('../modules/storage/services/artifact.service');
const http = require('http');

const domainRouter = async (req, res, next) => {
  const path = req.path;

  // 1. Skip middleware for API, authentication, health checks, or integration paths
  if (
    path.startsWith('/api') ||
    path.startsWith('/health') ||
    path.startsWith('/domains') ||
    path.startsWith('/deployments') ||
    path.startsWith('/auth') ||
    path.startsWith('/projects') ||
    path.startsWith('/users') ||
    path.startsWith('/integrations')
  ) {
    return next();
  }

  // 2. Extract and normalize hostname from HTTP Host header safely
  const hostHeader = req.headers.host;
  if (!hostHeader) {
    return next();
  }

  // Extract hostname and drop any port numbers
  let hostname = hostHeader.split(':')[0].trim().toLowerCase();

  // Strip trailing dot where appropriate
  if (hostname.endsWith('.')) {
    hostname = hostname.slice(0, -1);
  }

  // Bypass router for localhost / direct local environment testing
  // Only route verified domains in production or configured local test hosts (e.g. example.localhost)
  if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') {
    return next();
  }

  try {
    // 3. Resolve target deployment mapping
    const deployment = await domainRoutingService.resolveDeploymentForHost(hostname);
    if (!deployment) {
      return next(); // Bypass if host does not match any registered, verified active domain
    }

    // 4. Route request to Nginx runtime container if dynamic port is set
    if (deployment.runtimePort) {
      const proxyReq = http.request({
        host: 'localhost',
        port: deployment.runtimePort,
        path: req.originalUrl,
        method: req.method,
        headers: req.headers
      }, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      });

      proxyReq.on('error', (err) => {
        console.error('[DomainRouter] Proxy connection failed:', err.message);
        if (!res.headersSent) {
          res.status(502).send('Bad Gateway');
        }
      });

      req.pipe(proxyReq);
      return;
    }

    // Fallback: Serve requested file directly from the deployment's artifact archive (without requiring JWT auth)
    const isSpaFallback = ['React', 'Vue', 'Angular', 'Svelte'].includes(deployment.buildSettings?.framework);
    let requestedPath = req.path;
    if (requestedPath.startsWith('/')) {
      requestedPath = requestedPath.substring(1);
    }

    return ArtifactService.serveFileFromArtifact(deployment.artifact.storageKey, requestedPath, isSpaFallback, res);

  } catch (error) {
    console.error(`[DomainRouter] Routing failed for hostname ${hostname}:`, error.message);
    if (!res.headersSent) {
      return res.status(500).send('Internal Server Error');
    }
  }
};

module.exports = domainRouter;
