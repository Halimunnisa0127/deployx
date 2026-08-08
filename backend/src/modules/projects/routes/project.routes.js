const express = require('express');
const projectController = require('../controllers/project.controller');
const { checkProjectNameSchema, createProjectSchema } = require('../validators/project.validator');
const validate = require('../../../shared/validators/validate');
const { authenticate } = require('../../../middleware/auth.middleware');
const { asyncHandler } = require('../../../utils');

const router = express.Router();

/**
 * Step 1: Project Name availability check & slug preview generator
 * Endpoint: POST /projects/check-name
 */
router.post(
  '/check-name',
  validate(checkProjectNameSchema),
  asyncHandler(projectController.checkNameAvailability)
);

/**
 * Full Project Creation
 * Endpoint: POST /projects
 */
router.post(
  '/',
  authenticate,
  validate(createProjectSchema),
  asyncHandler(projectController.createProject)
);

/**
 * List User Projects
 * Endpoint: GET /projects
 */
router.get('/', authenticate, asyncHandler(projectController.getProjects));

/**
 * Get Project by ID
 * Endpoint: GET /projects/:id
 */
router.get('/:id', authenticate, asyncHandler(projectController.getProject));

module.exports = router;
