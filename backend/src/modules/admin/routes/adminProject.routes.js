const express = require('express');
const { authenticate } = require('../../../middleware/auth.middleware');
const { ROLES } = require('../../../shared/constants/constants');
const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const adminProjectController = require('../controllers/adminProject.controller');
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

router.get('/', asyncHandler(adminProjectController.listProjects));
router.get('/:id', asyncHandler(adminProjectController.getProject));
router.post('/:id/archive', asyncHandler(adminProjectController.archiveProject));
router.delete('/:id', asyncHandler(adminProjectController.deleteProject));
router.post('/export', asyncHandler(adminProjectController.exportProjects));

module.exports = router;
