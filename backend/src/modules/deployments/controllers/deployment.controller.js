const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const deploymentService = require('../services/deployment.service');
const Artifact = require('../../storage/models/Artifact');
const ArtifactService = require('../../storage/services/artifact.service');

class DeploymentController {
  /**
   * Create a new deployment
   */
  async createDeployment(req, res) {
    const userId = req.user.id;
    const deploymentData = req.body;

    const deployment = await deploymentService.createDeployment(userId, deploymentData);

    res
      .status(StatusCodes.CREATED)
      .json(ApiResponse.success('Deployment queued successfully', { deployment }));
  }

  /**
   * Get all deployments for the user
   */
  async getUserDeployments(req, res) {
    const userId = req.user.id;
    const deployments = await deploymentService.getUserDeployments(userId);
    res
      .status(StatusCodes.OK)
      .json(ApiResponse.success('Deployments retrieved successfully', { deployments }));
  }

  /**
   * Get deployments for a project
   */
  async getProjectDeployments(req, res) {
    const userId = req.user.id;
    const { projectId } = req.params;

    const deployments = await deploymentService.getProjectDeployments(userId, projectId);

    res
      .status(StatusCodes.OK)
      .json(ApiResponse.success('Deployments retrieved successfully', { deployments }));
  }

  /**
   * Get a specific deployment
   */
  async getDeploymentById(req, res) {
    const userId = req.user.id;
    const deploymentId = req.params.id;

    const deployment = await deploymentService.getDeploymentById(userId, deploymentId);

    res
      .status(StatusCodes.OK)
      .json(ApiResponse.success('Deployment retrieved successfully', { deployment }));
  }

  /**
   * Cancel a deployment
   */
  async cancelDeployment(req, res) {
    const userId = req.user.id;
    const deploymentId = req.params.id;

    const deployment = await deploymentService.cancelDeployment(userId, deploymentId);

    res
      .status(StatusCodes.OK)
      .json(ApiResponse.success('Deployment cancelled successfully', { deployment }));
  }

  /**
   * Serve a static site from the deployment's artifact
   */
  async serveDeploymentSite(req, res) {
    const userId = req.user.id;
    const deploymentId = req.params.id;

    // 1 & 2 & 3. Validate deployment & ownership
    // getDeploymentById automatically verifies ownership and throws 404/403
    const deployment = await deploymentService.getDeploymentById(userId, deploymentId);

    // 5. Require ready
    if (deployment.status !== 'ready') {
      return res.status(StatusCodes.FORBIDDEN).send('Deployment is not ready to be served.');
    }

    // 6. Require artifact exists
    if (!deployment.artifact) {
      return res.status(StatusCodes.NOT_FOUND).send('Deployment artifact not found.');
    }

    // 7. Fetch artifact metadata
    const artifact = await Artifact.findById(deployment.artifact);
    if (!artifact) {
      return res.status(StatusCodes.NOT_FOUND).send('Artifact metadata not found.');
    }

    // 8. Verify artifact belongs to this deployment
    if (artifact.deployment.toString() !== deployment._id.toString()) {
      return res.status(StatusCodes.FORBIDDEN).send('Artifact mismatch.');
    }

    // Determine SPA fallback (Phase 2I explicitly asks to inspect Project/Deployment routing config, 
    // but says "If there is already an explicit SPA/static routing config use it. If not DO NOT invent a new one... serve exact files, serve index.html for root, return 404 for missing").
    // We will assume SPA is true only if framework is a known SPA framework, but since we don't want to invent new rules, 
    // we'll just check if it's explicitly set. The prompt says: "Do NOT determine SPA behavior using: framework !== 'static'... Instead inspect the existing Project/Deployment data model... If no such configuration exists... serve exact files, serve index.html for root, return 404 for missing paths".
    // So we'll set isSpaFallback = false.
    const isSpaFallback = false; 

    // The wildcard param
    const requestedPath = req.params[0] || 'index.html';

    // 9. Access storage layer
    return ArtifactService.serveFileFromArtifact(artifact.storageKey, requestedPath, isSpaFallback, res);
  }

  /**
   * Promotes a deployment to production (also handles rollbacks)
   */
  async promoteDeployment(req, res) {
    const userId = req.user.id;
    const deploymentId = req.params.id;
    const isRollback = req.path.endsWith('/rollback');
    const action = isRollback ? 'rollback' : 'promote';

    const deployment = await deploymentService.promoteDeployment(userId, deploymentId, action);

    const message = action === 'rollback'
      ? 'Deployment rolled back successfully'
      : 'Deployment promoted successfully';

    res
      .status(StatusCodes.OK)
      .json(ApiResponse.success(message, { deployment }));
  }

  /**
   * Gets paginated promotion/rollback history for a project.
   */
  async getDeploymentHistory(req, res) {
    const userId = req.user.id;
    const { projectId } = req.params;
    const { action, page, limit } = req.query;

    const result = await deploymentService.getProjectPromotionHistory(
      userId,
      projectId,
      action,
      page,
      limit
    );

    res
      .status(StatusCodes.OK)
      .json(ApiResponse.success('Deployment history retrieved successfully', result));
  }
}

module.exports = new DeploymentController();
