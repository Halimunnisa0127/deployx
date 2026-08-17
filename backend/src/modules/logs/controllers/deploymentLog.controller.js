const deploymentLogService = require('../services/deploymentLog.service');
const Deployment = require('../../deployments/models/Deployment');
const ApiError = require('../../../shared/errors/ApiError');
const ApiResponse = require('../../../shared/responses/ApiResponse');

exports.getDeploymentLogs = async (req, res) => {
  const { id: deploymentId } = req.params;
  const { page = 1, limit = 100 } = req.query;

  // 1. Load deployment and verify existence
  const deployment = await Deployment.findById(deploymentId);
  if (!deployment) {
    throw new ApiError(404, 'Deployment not found');
  }

  // 2. Authorize user (Ownership check)
  const requestUserId = req.user ? (req.user.id || req.user._id) : null;
  if (!requestUserId || deployment.owner.toString() !== requestUserId.toString()) {
    throw new ApiError(403, 'You do not have permission to view logs for this deployment');
  }

  // 3. Fetch logs
  const result = await deploymentLogService.getDeploymentLogs(deploymentId, parseInt(page), parseInt(limit));

  res.status(200).json(ApiResponse.success('Deployment logs retrieved successfully', result));
};
