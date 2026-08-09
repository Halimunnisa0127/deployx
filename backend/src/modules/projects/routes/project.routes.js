const express = require('express');
const projectController = require('../controllers/project.controller');
const { checkProjectNameSchema, createProjectSchema, updateProjectSchema } = require('../validators/project.validator');
const validate = require('../../../shared/validators/validate');
const { authenticate } = require('../../../middleware/auth.middleware');
const { asyncHandler } = require('../../../utils');

const router = express.Router();

/**
 * Get Framework Presets
 * Endpoint: GET /projects/framework-presets
 */
router.get(
  '/framework-presets',
  asyncHandler(projectController.getFrameworkPresets)
);

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

/**
 * Update Project
 * Endpoint: PATCH /projects/:id
 */
router.patch('/:id', authenticate, validate(updateProjectSchema), asyncHandler(projectController.updateProject));

/**
 * Delete Project
 * Endpoint: DELETE /projects/:id
 */
router.delete('/:id', authenticate, asyncHandler(projectController.deleteProject));

module.exports = router;
