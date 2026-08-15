const express = require('express');
const { authenticate } = require('../../../middleware/auth.middleware');
const { ROLES } = require('../../../shared/constants/constants');
const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const adminUserController = require('../controllers/adminUser.controller');
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

router.get('/', asyncHandler(adminUserController.listUsers));
router.get('/:id', asyncHandler(adminUserController.getUser));
router.post('/', asyncHandler(adminUserController.createUser));
router.patch('/:id', asyncHandler(adminUserController.updateUser));
router.delete('/:id', asyncHandler(adminUserController.deleteUser));
router.post('/:id/reset-password', asyncHandler(adminUserController.resetPassword));

module.exports = router;
