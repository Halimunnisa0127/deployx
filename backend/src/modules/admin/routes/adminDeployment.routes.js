const express = require('express');
const { authenticate } = require('../../../middleware/auth.middleware');
const { ROLES } = require('../../../shared/constants/constants');
const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const adminDeploymentController = require('../controllers/adminDeployment.controller');
const { asyncHandler } = require('../../../utils');

const router = express.Router();

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(ApiResponse.error('Authentication required', {}, StatusCodes.UNAUTHORIZED));
  }

  if (req.user.role !== ROLES.ADMIN) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json(ApiResponse.error('Admin access required', {}, StatusCodes.FORBIDDEN));
  }

  next();
};

router.use(authenticate);
router.use(requireAdmin);

router.get('/', asyncHandler(adminDeploymentController.listDeployments));
router.get('/:id', asyncHandler(adminDeploymentController.getDeployment));
router.post('/:id/cancel', asyncHandler(adminDeploymentController.cancelDeployment));
router.delete('/:id', asyncHandler(adminDeploymentController.deleteDeployment));
router.post('/export', asyncHandler(adminDeploymentController.exportDeployments));

module.exports = router;
