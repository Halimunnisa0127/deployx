const express = require('express');
const githubController = require('../controllers/github.controller');
const { getRepositoriesSchema, getBranchesSchema, callbackSchema, analyzeRepositorySchema } = require('../validators/github.validator');
const validate = require('../../../../shared/validators/validate');
const { authenticate, optionalAuth } = require('../../../../middleware/auth.middleware');
const { asyncHandler } = require('../../../../utils');

const router = express.Router();

// Webhook route (No JWT, uses HMAC)
router.post('/webhook', githubController.webhook);

// Authentication Routes
router.get('/oauth/connect', optionalAuth, asyncHandler(githubController.connect));
router.get('/oauth/callback', optionalAuth, validate(callbackSchema), asyncHandler(githubController.callback));

router.use(authenticate);

router.get('/status', githubController.getStatus);
router.get('/repositories', validate(getRepositoriesSchema), githubController.getRepositories);
router.post('/repositories/sync', githubController.syncRepositories);
router.get('/repositories/:owner/:repo/branches', validate(getBranchesSchema), githubController.getBranches);
router.get('/repositories/:owner/:repo/analyze', validate(analyzeRepositorySchema), asyncHandler(githubController.analyzeRepository));
router.delete('/disconnect', githubController.disconnect);

module.exports = router;
