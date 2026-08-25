const express = require('express');
const deploymentController = require('../controllers/deployment.controller');
const deploymentLogController = require('../../logs/controllers/deploymentLog.controller');
const { createDeploymentSchema } = require('../validators/deployment.validator');
const validate = require('../../../shared/validators/validate');
const { authenticate } = require('../../../middleware/auth.middleware');
const { asyncHandler } = require('../../../utils');

const router = express.Router();

/**
 * Create a new deployment
 * Endpoint: POST /deployments
 */
router.post(
  '/',
  authenticate,
  validate(createDeploymentSchema),
  asyncHandler(deploymentController.createDeployment)
);

/**
 * Get all deployments for the user
 * Endpoint: GET /deployments
 */
router.get(
  '/',
  authenticate,
  asyncHandler(deploymentController.getUserDeployments)
);

/**
 * Get deployments for a specific project
 * Endpoint: GET /deployments/project/:projectId
 */
router.get(
  '/project/:projectId',
  authenticate,
  asyncHandler(deploymentController.getProjectDeployments)
);

/**
 * Get deployment by ID
 * Endpoint: GET /deployments/:id
 */
router.get(
  '/:id',
  authenticate,
  asyncHandler(deploymentController.getDeploymentById)
);

/**
 * Cancel deployment
 * Endpoint: POST /deployments/:id/cancel
 */
router.post(
  '/:id/cancel',
  authenticate,
  asyncHandler(deploymentController.cancelDeployment)
);

/**
 * Redeploy deployment
 * Endpoint: POST /deployments/:id/redeploy
 */
router.post(
  '/:id/redeploy',
  authenticate,
  asyncHandler(deploymentController.redeployDeployment)
);

/**
 * Get deployment logs
 * Endpoint: GET /deployments/:id/logs
 */
router.get(
  '/:id/logs',
  authenticate,
  asyncHandler(deploymentLogController.getDeploymentLogs)
);

/**
 * Promote deployment to production
 * Endpoint: POST /deployments/:id/promote
 */
router.post(
  '/:id/promote',
  authenticate,
  asyncHandler(deploymentController.promoteDeployment)
);

router.post(
  '/:id/rollback',
  authenticate,
  asyncHandler(deploymentController.promoteDeployment)
);

/**
 * Get promotion/rollback history for a project
 * Endpoint: GET /deployments/project/:projectId/history
 */
router.get(
  '/project/:projectId/history',
  authenticate,
  asyncHandler(deploymentController.getDeploymentHistory)
);

/**
 * Authenticate and initiate a preview session
 * Endpoint: POST /deployments/:id/preview-auth
 */
router.post(
  '/:id/preview-auth',
  authenticate,
  asyncHandler(deploymentController.authenticatePreviewSession)
);

const authenticatePreview = (req, res, next) => {
  const token = req.cookies && req.cookies.deployx_preview_token;

  if (!token) {
    return res.status(401).send('Preview session expired or invalid');
  }

  try {
    const { verifyPreviewToken } = require('../../../utils/helpers/jwt.helper');
    const decoded = verifyPreviewToken(token);

    if (decoded.scope !== 'preview' || decoded.sub !== req.params.id) {
      return res.status(403).send('Invalid preview scope');
    }

    req.preview = decoded; // pass preview payload if needed
    next();
  } catch (error) {
    return res.status(401).send('Preview session expired');
  }
};

/**
 * Serve deployment site artifacts
 * Endpoint: GET /deployments/:id/site/*
 */
router.get(
  '/:id/site/*',
  authenticatePreview,
  asyncHandler(deploymentController.serveDeploymentSite)
);

module.exports = router;
