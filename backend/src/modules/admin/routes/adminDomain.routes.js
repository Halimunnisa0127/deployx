const express = require('express');
const { authenticate } = require('../../../middleware/auth.middleware');
const { ROLES } = require('../../../shared/constants/constants');
const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const adminDomainController = require('../controllers/adminDomain.controller');
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

router.get('/', asyncHandler(adminDomainController.listDomains));
router.get('/:id', asyncHandler(adminDomainController.getDomain));
router.get('/:id/dns', asyncHandler(adminDomainController.getDomainDNSRecords));
router.get('/:id/instructions', asyncHandler(adminDomainController.getDomainInstructions));
router.post('/:id/verify', asyncHandler(adminDomainController.verifyDomain));
router.patch('/:id/target', asyncHandler(adminDomainController.updateDomainTarget));
router.delete('/:id', asyncHandler(adminDomainController.deleteDomain));

module.exports = router;
