const Domain = require('../models/Domain');
const Deployment = require('../../deployments/models/Deployment');
const Project = require('../../projects/models/Project');

class DomainRoutingService {
  /**
   * Resolves the target deployment for a verified active custom domain hostname.
   */
  static async resolveDeploymentForHost(hostname) {
    // 1. Find verified + active domain record
    const domain = await Domain.findOne({
      hostname,
      verificationStatus: 'verified',
      status: 'active'
    });

    if (!domain) {
      return null;
    }

    let targetDeploymentId = null;

    if (domain.targetType === 'deployment') {
      targetDeploymentId = domain.targetDeployment;
    } else {
      // Default / production: Resolve the project's production deployment pointer
      const project = await Project.findById(domain.project);
      if (project && project.productionDeployment) {
        targetDeploymentId = project.productionDeployment;
      }
    }

    if (!targetDeploymentId) {
      return null;
    }

    // 2. Fetch and validate the target deployment
    const deployment = await Deployment.findById(targetDeploymentId).populate('artifact');
    if (!deployment) {
      return null;
    }

    // Verify it belongs to the domain's project, is ready, and has an artifact
    if (
      deployment.project.toString() !== domain.project.toString() ||
      deployment.status !== 'ready' ||
      !deployment.artifact
    ) {
      return null;
    }

    return deployment;
  }
}

module.exports = DomainRoutingService;
