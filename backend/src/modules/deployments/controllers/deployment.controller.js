const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const deploymentService = require('../services/deployment.service');
const Artifact = require('../../storage/models/Artifact');
const ArtifactService = require('../../storage/services/artifact.service');
const Deployment = require('../models/Deployment');

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
   * Redeploy a deployment
   */
  async redeployDeployment(req, res) {
    const userId = req.user.id;
    const deploymentId = req.params.id;

    const deployment = await deploymentService.redeployDeployment(userId, deploymentId);

    res
      .status(StatusCodes.CREATED)
      .json(ApiResponse.success('Redeployment queued successfully', { deployment }));
  }

  /**
   * Authenticate a preview session and set a short-lived secure cookie
   */
  async authenticatePreviewSession(req, res) {
    const userId = req.user.id;
    const deploymentId = req.params.id;

    // Verify ownership and existence
    await deploymentService.getDeploymentById(userId, deploymentId);

    const config = require('../../../config/env/env');
    const { generatePreviewToken } = require('../../../utils/helpers/jwt.helper');
    
    // Generate a 5-minute restricted preview token
    const previewToken = generatePreviewToken(deploymentId);

    // Set HttpOnly cookie strictly scoped to the site path
    res.cookie('deployx_preview_token', previewToken, {
      path: `/api/deployments/${deploymentId}/site`,
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'lax',
      maxAge: 5 * 60 * 1000 // 5 minutes in milliseconds
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Preview session authenticated',
    });
  }

  /**
   * Serve a static site from the deployment's artifact
   */
  async serveDeploymentSite(req, res) {
    const deploymentId = req.params.id;

    // 1 & 2 & 3. Validate deployment & ownership
    // We already verified ownership when issuing the preview token in POST.
    const deployment = await Deployment.findById(deploymentId);
    if (!deployment) {
      return res.status(StatusCodes.NOT_FOUND).send('Deployment not found.');
    }

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

    // Determine SPA fallback
    const isSpaFallback = ['React', 'Vue', 'Angular', 'Svelte'].includes(deployment.buildSettings?.framework); 

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
