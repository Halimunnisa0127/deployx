const express = require('express');
const domainController = require('../controllers/domain.controller');
const {
  createDomainSchema,
  getProjectDomainsSchema,
  domainIdParamSchema,
  updateDomainTargetSchema,
} = require('../validators/domain.validator');
const validate = require('../../../shared/validators/validate');
const { authenticate } = require('../../../middleware/auth.middleware');
const { asyncHandler } = require('../../../utils');

const router = express.Router();

/**
 * Register a custom domain
 * POST /domains
 */
router.post(
  '/',
  authenticate,
  validate(createDomainSchema),
  asyncHandler(domainController.createDomain)
);

/**
 * Get project custom domains
 * GET /domains/project/:projectId
 */
router.get(
  '/project/:projectId',
  authenticate,
  validate(getProjectDomainsSchema),
  asyncHandler(domainController.getProjectDomains)
);

/**
 * Get specific domain details (excludes token for security)
 * GET /domains/:id
 */
router.get(
  '/:id',
  authenticate,
  validate(domainIdParamSchema),
  asyncHandler(domainController.getDomain)
);

/**
 * Get DNS verification instructions for domain (explicitly returns token to owner)
 * GET /domains/:id/instructions
 */
router.get(
  '/:id/instructions',
  authenticate,
  validate(domainIdParamSchema),
  asyncHandler(domainController.getDomainInstructions)
);

/**
 * Trigger domain verification foundation
 * POST /domains/:id/verify
 */
router.post(
  '/:id/verify',
  authenticate,
  validate(domainIdParamSchema),
  asyncHandler(domainController.verifyDomain)
);

/**
 * Update custom domain routing target
 * PATCH /domains/:id/target
 */
router.patch(
  '/:id/target',
  authenticate,
  validate(updateDomainTargetSchema),
  asyncHandler(domainController.updateDomainTarget)
);

/**
 * Remove a custom domain
 * DELETE /domains/:id
 */
router.delete(
  '/:id',
  authenticate,
  validate(domainIdParamSchema),
  asyncHandler(domainController.deleteDomain)
);

module.exports = router;
