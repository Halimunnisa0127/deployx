const express = require('express');

const authRoutes = require('../modules/auth/routes/auth.routes');
const userRoutes = require('../modules/users/routes/user.routes');
const projectRoutes = require('../modules/projects/routes/project.routes');
const deploymentRoutes = require('../modules/deployments/routes/deployment.routes');
const domainRoutes = require('../modules/domains/routes/domain.routes');

const githubIntegration = require('../modules/integrations/github');
const googleIntegration = require('../modules/integrations/google');

const adminHealthRoutes = require('../modules/admin/routes/adminHealth.routes');
const adminUserRoutes = require('../modules/admin/routes/adminUser.routes');
const adminProjectRoutes = require('../modules/admin/routes/adminProject.routes');
const adminDeploymentRoutes = require('../modules/admin/routes/adminDeployment.routes');

const router = express.Router();

// Authentication
router.use('/auth', authRoutes);

// Users
router.use('/users', userRoutes);

// Projects
router.use('/projects', projectRoutes);

// Deployments
router.use('/deployments', deploymentRoutes);

// Domains
router.use('/domains', domainRoutes);

// GitHub Integration
router.use(
  '/integrations/github',
  githubIntegration.routes
);

// Google Integration
router.use(
  '/integrations/google',
  googleIntegration.routes
);

// Admin
router.use(
  '/admin/health',
  adminHealthRoutes
);

router.use(
  '/admin/users',
  adminUserRoutes
);

router.use(
  '/admin/projects',
  adminProjectRoutes
);

router.use(
  '/admin/deployments',
  adminDeploymentRoutes
);

module.exports = router;