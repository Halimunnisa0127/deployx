const Domain = require('../models/Domain');
const Deployment = require('../../deployments/models/Deployment');
const Project = require('../../projects/models/Project');

class DomainRoutingService {
  /**
   * Resolves the target deployment for a verified active custom domain hostname.
   */
  static async resolveDeploymentForHost(hostname) {
    let targetDeploymentId = null;
    let projectIdToMatch = null;

    // 1. Check verified + active custom domain record
    const domain = await Domain.findOne({
      hostname,
      verificationStatus: 'verified',
      status: 'active'
    });

    if (domain) {
      projectIdToMatch = domain.project;
      if (domain.targetType === 'deployment') {
        targetDeploymentId = domain.targetDeployment;
      } else {
        // Default / production: Resolve the project's production deployment pointer
        const project = await Project.findById(domain.project);
        if (project && project.productionDeployment) {
          targetDeploymentId = project.productionDeployment;
        }
      }
    } else {
    // 2. Fallback: check if it's an automatic project subdomain
    const project = await Project.findOne({ domainUrl: `https://${hostname}` });
    if (project) {
      projectIdToMatch = project._id;
      targetDeploymentId = project.productionDeployment;
      
      // Minimal fix: Fallback to the latest ready deployment if production is not explicitly set
      if (!targetDeploymentId) {
        const latestReady = await Deployment.findOne({ project: project._id, status: 'ready' }).sort({ createdAt: -1 });
        if (latestReady) {
          targetDeploymentId = latestReady._id;
        }
      }
    }
  }

  if (!targetDeploymentId || !projectIdToMatch) {
    console.log(`[DomainRoutingService] No targetDeploymentId or projectIdToMatch found for host: ${hostname}`);
    return null;
  }

  // 3. Fetch and validate the target deployment
  const deployment = await Deployment.findById(targetDeploymentId).populate('artifact');
  if (!deployment) {
    console.log(`[DomainRoutingService] Deployment ${targetDeploymentId} not found`);
    return null;
  }

  // Verify it belongs to the matched project, is ready, and has an artifact
  if (
    deployment.project.toString() !== projectIdToMatch.toString() ||
    deployment.status !== 'ready' ||
    !deployment.artifact
  ) {
    console.log(`[DomainRoutingService] Validation failed for deployment ${deployment._id}. status=${deployment.status}`);
    return null;
  }

  // Inject projectIdToMatch for diagnostic logging upstream
  deployment._projectIdToMatch = projectIdToMatch;

  return deployment;
}
}

module.exports = DomainRoutingService;
