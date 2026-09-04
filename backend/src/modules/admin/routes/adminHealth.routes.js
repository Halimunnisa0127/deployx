const express = require('express');
const { authenticate } = require('../../../middleware/auth.middleware');
const { ROLES } = require('../../../shared/constants/constants');
const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const adminHealthController = require('../controllers/adminHealth.controller');

const router = express.Router();

// Admin security guard middleware
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

router.get('/overview', adminHealthController.getOverview);
router.get('/infrastructure', adminHealthController.getInfrastructure);
router.get('/incidents', adminHealthController.getIncidents);
router.get('/history', adminHealthController.getHistoricalMetrics);
router.get('/performance', adminHealthController.getPerformance);
router.post('/sample', adminHealthController.recordSample);

// Admin Analytics Endpoints
router.get('/analytics', adminHealthController.getAnalyticsOverview);
router.get('/deployment-trends', adminHealthController.getDeploymentTrends);
router.get('/user-growth', adminHealthController.getUserGrowth);
router.get('/project-growth', adminHealthController.getProjectGrowth);
router.get('/frameworks', adminHealthController.getFrameworkDistribution);
router.get('/top-projects', adminHealthController.getTopProjects);
router.get('/top-users', adminHealthController.getTopUsers);
router.get('/regions', adminHealthController.getRegionDistribution);

module.exports = router;
