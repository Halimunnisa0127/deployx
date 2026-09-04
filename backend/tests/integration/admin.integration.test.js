const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../src/app');
const { generateAccessToken } = require('../../src/utils/helpers/jwt.helper');
const { ROLES } = require('../../src/shared/constants/constants');
const User = require('../../src/modules/users/models/User');
const Project = require('../../src/modules/projects/models/Project');
const Domain = require('../../src/modules/domains/models/Domain');
const Deployment = require('../../src/modules/deployments/models/Deployment');

describe('Backend Integration Tests (Infrastructure-dependent)', () => {
  let mongoAvailable = false;
  let adminToken;
  let userToken;
  let adminUser;
  let regularUser;

  beforeAll(async () => {
    const mongoUri = process.env.MONGO_TEST_URI || process.env.MONGO_URI;
    if (mongoUri) {
      try {
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 1500 });
        mongoAvailable = true;

        await User.deleteMany({});
        await Project.deleteMany({});
        await Domain.deleteMany({});
        await Deployment.deleteMany({});

        adminUser = await User.create({
          name: 'Admin User',
          email: 'admin_test@deployx.com',
          password: 'Password123!',
          role: ROLES.ADMIN,
          isVerified: true
        });

        regularUser = await User.create({
          name: 'Regular User',
          email: 'user_test@deployx.com',
          password: 'Password123!',
          role: ROLES.USER,
          isVerified: true
        });

        adminToken = generateAccessToken(adminUser._id, adminUser.role);
        userToken = generateAccessToken(regularUser._id, regularUser.role);
      } catch (error) {
        mongoAvailable = false;
      }
    }
  });

  afterAll(async () => {
    if (mongoAvailable) {
      await mongoose.connection.close();
    }
  });

  describe('Admin Projects Deletion & Safety Verification Pass', () => {
    test('delete nonexistent project → 404', async () => {
      if (!mongoAvailable) {
        console.warn('[TEST BLOCKED] Integration tests skipped because MongoDB is offline.');
        return;
      }

      const randomId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .delete(`/admin/projects/${randomId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/not found/i);
    });

    test('delete project with domains → domains cleaned', async () => {
      if (!mongoAvailable) {
        return;
      }

      const testProject = await Project.create({
        name: 'Domain Test Project',
        slug: 'domain-test-project',
        owner: regularUser._id,
        domainUrl: 'https://domain-test-project.deployx.app'
      });

      const testDomain = await Domain.create({
        project: testProject._id,
        owner: regularUser._id,
        hostname: 'custom.domain-test.com',
        verificationToken: 'token123'
      });

      const res = await request(app)
        .delete(`/admin/projects/${testProject._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify project is deleted
      const foundProject = await Project.findById(testProject._id);
      expect(foundProject).toBeNull();

      // Verify domain is cleaned up
      const foundDomain = await Domain.findById(testDomain._id);
      expect(foundDomain).toBeNull();
    });

    test('delete project with historical deployments → expected retention behavior', async () => {
      if (!mongoAvailable) {
        return;
      }

      const testProject = await Project.create({
        name: 'Historical Deployment Project',
        slug: 'hist-dep-project',
        owner: regularUser._id,
        domainUrl: 'https://hist-dep-project.deployx.app'
      });

      const historicalDeployment = await Deployment.create({
        project: testProject._id,
        owner: regularUser._id,
        deploymentNumber: 1,
        environment: 'Production',
        branch: 'main',
        triggeredBy: 'Manual',
        status: 'ready'
      });

      const res = await request(app)
        .delete(`/admin/projects/${testProject._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);

      // Verify historical deployment is retained in DB
      const foundDep = await Deployment.findById(historicalDeployment._id);
      expect(foundDep).not.toBeNull();
      expect(foundDep.status).toBe('ready');

      // Populating the deleted project resolves safely to null without crashing
      const populatedDep = await Deployment.findById(historicalDeployment._id).populate('project', 'name slug');
      expect(populatedDep.project).toBeNull();
    });

    test('delete project with active deployment → expected safe behavior', async () => {
      if (!mongoAvailable) {
        return;
      }

      const testProject = await Project.create({
        name: 'Active Deployment Project',
        slug: 'active-dep-project',
        owner: regularUser._id,
        domainUrl: 'https://active-dep-project.deployx.app'
      });

      const queuedDeployment = await Deployment.create({
        project: testProject._id,
        owner: regularUser._id,
        deploymentNumber: 1,
        environment: 'Production',
        branch: 'main',
        triggeredBy: 'Manual',
        status: 'queued'
      });

      const buildingDeployment = await Deployment.create({
        project: testProject._id,
        owner: regularUser._id,
        deploymentNumber: 2,
        environment: 'Production',
        branch: 'main',
        triggeredBy: 'Manual',
        status: 'building'
      });

      const res = await request(app)
        .delete(`/admin/projects/${testProject._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);

      // Active deployments are safely transitioned to cancelled
      const foundQueued = await Deployment.findById(queuedDeployment._id);
      expect(foundQueued.status).toBe('cancelled');

      const foundBuilding = await Deployment.findById(buildingDeployment._id);
      expect(foundBuilding.status).toBe('cancelled');
    });

    test('non-admin → 403', async () => {
      if (!mongoAvailable) {
        return;
      }

      const randomId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .delete(`/admin/projects/${randomId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    test('unauthenticated → 401', async () => {
      if (!mongoAvailable) {
        return;
      }

      const randomId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .delete(`/admin/projects/${randomId}`);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Admin Projects Archive State Semantics & Filters', () => {
    test('Admin archive → project status becomes archived (not failed)', async () => {
      if (!mongoAvailable) {
        return;
      }

      const project = await Project.create({
        name: 'Project To Archive',
        slug: 'project-to-archive',
        owner: regularUser._id,
        domainUrl: 'https://project-to-archive.deployx.app',
        status: 'live'
      });

      const res = await request(app)
        .post(`/admin/projects/${project._id}/archive`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('archived');

      const updatedProject = await Project.findById(project._id);
      expect(updatedProject.status).toBe('archived');
      expect(updatedProject.status).not.toBe('failed');
    });

    test('Archived project appears in archived filter, not in failed or active', async () => {
      if (!mongoAvailable) {
        return;
      }

      const archivedProj = await Project.create({
        name: 'Archived Filter Proj',
        slug: 'archived-filter-proj',
        owner: regularUser._id,
        domainUrl: 'https://archived-filter-proj.deployx.app',
        status: 'archived'
      });

      const failedProj = await Project.create({
        name: 'Failed Filter Proj',
        slug: 'failed-filter-proj',
        owner: regularUser._id,
        domainUrl: 'https://failed-filter-proj.deployx.app',
        status: 'failed'
      });

      const liveProj = await Project.create({
        name: 'Live Filter Proj',
        slug: 'live-filter-proj',
        owner: regularUser._id,
        domainUrl: 'https://live-filter-proj.deployx.app',
        status: 'live'
      });

      // 1. Query archived filter
      const archRes = await request(app)
        .get('/admin/projects?status=archived')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(archRes.status).toBe(200);
      const archSlugs = archRes.body.data.projects.map(p => p.slug);
      expect(archSlugs).toContain(archivedProj.slug);
      expect(archSlugs).not.toContain(failedProj.slug);
      expect(archSlugs).not.toContain(liveProj.slug);

      // 2. Query failed filter
      const failRes = await request(app)
        .get('/admin/projects?status=failed')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(failRes.status).toBe(200);
      const failSlugs = failRes.body.data.projects.map(p => p.slug);
      expect(failSlugs).toContain(failedProj.slug);
      expect(failSlugs).not.toContain(archivedProj.slug);
      expect(failSlugs).not.toContain(liveProj.slug);

      // 3. Query active filter
      const activeRes = await request(app)
        .get('/admin/projects?status=active')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(activeRes.status).toBe(200);
      const activeSlugs = activeRes.body.data.projects.map(p => p.slug);
      expect(activeSlugs).toContain(liveProj.slug);
      expect(activeSlugs).not.toContain(archivedProj.slug);
      expect(activeSlugs).not.toContain(failedProj.slug);
    });
  });

  describe('Admin Deployments Management Integration Tests', () => {
    let testProject;

    beforeAll(async () => {
      if (mongoAvailable) {
        testProject = await Project.create({
          name: 'Admin Dep Test Project',
          slug: 'admin-dep-test-project',
          owner: regularUser._id,
          domainUrl: 'https://admin-dep-test-project.deployx.app',
          status: 'live'
        });
      }
    });

    test('GET /admin/deployments returns paginated list with real status mapping', async () => {
      if (!mongoAvailable) return;

      const dep = await Deployment.create({
        project: testProject._id,
        owner: regularUser._id,
        deploymentNumber: 101,
        environment: 'Production',
        branch: 'main',
        triggeredBy: 'Manual',
        status: 'ready',
        startedAt: new Date(Date.now() - 25000),
        completedAt: new Date(),
        commitMessage: 'feat: add admin tests'
      });

      const res = await request(app)
        .get('/admin/deployments')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.deployments)).toBe(true);
      const found = res.body.data.deployments.find(d => d.id === dep._id.toString());
      expect(found).toBeDefined();
      expect(found.status).toBe('success');
      expect(found.project).toBe('Admin Dep Test Project');
    });

    test('GET /admin/deployments/:id returns full deployment with timeline and artifact metadata', async () => {
      if (!mongoAvailable) return;

      const dep = await Deployment.create({
        project: testProject._id,
        owner: regularUser._id,
        deploymentNumber: 102,
        environment: 'Production',
        branch: 'main',
        triggeredBy: 'GitHub Hook',
        status: 'ready',
        startedAt: new Date(Date.now() - 30000),
        completedAt: new Date(),
        commitMessage: 'fix: timeline check'
      });

      const res = await request(app)
        .get(`/admin/deployments/${dep._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const d = res.body.data.deployment;
      expect(d.id).toBe(dep._id.toString());
      expect(d.timeline).toBeDefined();
      expect(Array.isArray(d.timeline)).toBe(true);
    });

    test('POST /admin/deployments/:id/cancel cancels queued or building deployment', async () => {
      if (!mongoAvailable) return;

      const queuedDep = await Deployment.create({
        project: testProject._id,
        owner: regularUser._id,
        deploymentNumber: 103,
        environment: 'Production',
        branch: 'main',
        triggeredBy: 'Manual',
        status: 'queued'
      });

      const res = await request(app)
        .post(`/admin/deployments/${queuedDep._id}/cancel`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const updated = await Deployment.findById(queuedDep._id);
      expect(updated.status).toBe('cancelled');
    });

    test('POST /admin/deployments/:id/cancel rejects completed deployment with 400', async () => {
      if (!mongoAvailable) return;

      const completedDep = await Deployment.create({
        project: testProject._id,
        owner: regularUser._id,
        deploymentNumber: 104,
        environment: 'Production',
        branch: 'main',
        triggeredBy: 'Manual',
        status: 'ready'
      });

      const res = await request(app)
        .post(`/admin/deployments/${completedDep._id}/cancel`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
    });

    test('DELETE /admin/deployments/:id deletes deployment record', async () => {
      if (!mongoAvailable) return;

      const depToDelete = await Deployment.create({
        project: testProject._id,
        owner: regularUser._id,
        deploymentNumber: 105,
        environment: 'Production',
        branch: 'main',
        triggeredBy: 'Manual',
        status: 'failed'
      });

      const res = await request(app)
        .delete(`/admin/deployments/${depToDelete._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const found = await Deployment.findById(depToDelete._id);
      expect(found).toBeNull();
    });

    test('Admin deployments authorization: non-admin → 403, unauthenticated → 401', async () => {
      if (!mongoAvailable) return;

      const nonAdminRes = await request(app)
        .get('/admin/deployments')
        .set('Authorization', `Bearer ${userToken}`);
      expect(nonAdminRes.status).toBe(403);

      const unauthRes = await request(app)
        .get('/admin/deployments');
      expect(unauthRes.status).toBe(401);
    });
  });

  describe('Admin Domains Management Integration Tests', () => {
    let adminDomainTestProject;

    beforeAll(async () => {
      if (mongoAvailable) {
        adminDomainTestProject = await Project.create({
          name: 'Admin Domain Test Project',
          slug: 'admin-domain-test-project',
          owner: regularUser._id,
          domainUrl: 'https://admin-domain-test-project.deployx.app',
          status: 'live'
        });
      }
    });

    test('GET /admin/domains returns list without leaking verification tokens', async () => {
      if (!mongoAvailable) return;

      const domain = await Domain.create({
        project: adminDomainTestProject._id,
        owner: regularUser._id,
        hostname: 'secret-token-test.example.com',
        verificationToken: 'secret-token-1234567890',
        verificationStatus: 'verified',
        status: 'active'
      });

      const res = await request(app)
        .get('/admin/domains')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.domains)).toBe(true);

      const found = res.body.data.domains.find(d => d.hostname === domain.hostname);
      expect(found).toBeDefined();
      expect(found).not.toHaveProperty('verificationToken');
    });

    test('GET /admin/domains/:id returns domain detail without token leak', async () => {
      if (!mongoAvailable) return;

      const domain = await Domain.create({
        project: adminDomainTestProject._id,
        owner: regularUser._id,
        hostname: 'detail-test.example.com',
        verificationToken: 'token-xyz-secret',
        verificationStatus: 'pending',
        status: 'pending'
      });

      const res = await request(app)
        .get(`/admin/domains/${domain._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.domain.hostname).toBe('detail-test.example.com');
      expect(res.body.data.domain).not.toHaveProperty('verificationToken');
    });

    test('GET /admin/domains/:id/dns returns DNS routing records without verification secrets', async () => {
      if (!mongoAvailable) return;

      const domain = await Domain.create({
        project: adminDomainTestProject._id,
        owner: regularUser._id,
        hostname: 'dns-records-test.example.com',
        verificationToken: 'secret-dns-token-12345',
        verificationStatus: 'pending'
      });

      const res = await request(app)
        .get(`/admin/domains/${domain._id}/dns`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.records)).toBe(true);
      expect(res.body.data.records.length).toBeGreaterThan(0);

      // Verify no verificationToken is leaked in /dns
      const leaked = res.body.data.records.some(r => JSON.stringify(r).includes('secret-dns-token-12345'));
      expect(leaked).toBe(false);
    });

    test('GET /admin/domains/:id/instructions explicitly returns challenge token', async () => {
      if (!mongoAvailable) return;

      const domain = await Domain.create({
        project: adminDomainTestProject._id,
        owner: regularUser._id,
        hostname: 'instructions-test.example.com',
        verificationToken: 'secret-instr-token-999',
        verificationStatus: 'pending'
      });

      const res = await request(app)
        .get(`/admin/domains/${domain._id}/instructions`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.instructions.token).toBe('secret-instr-token-999');
      expect(res.body.data.instructions.value).toContain('secret-instr-token-999');
    });

    test('DELETE /admin/domains/:id deletes domain mapping', async () => {
      if (!mongoAvailable) return;

      const domainToDelete = await Domain.create({
        project: adminDomainTestProject._id,
        owner: regularUser._id,
        hostname: 'domain-to-delete.example.com',
        verificationToken: 'token-del',
        verificationStatus: 'pending'
      });

      const res = await request(app)
        .delete(`/admin/domains/${domainToDelete._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const found = await Domain.findById(domainToDelete._id);
      expect(found).toBeNull();
    });

    test('Admin domains authorization: non-admin → 403, unauthenticated → 401', async () => {
      if (!mongoAvailable) return;

      const nonAdminRes = await request(app)
        .get('/admin/domains')
        .set('Authorization', `Bearer ${userToken}`);
      expect(nonAdminRes.status).toBe(403);

      const unauthRes = await request(app)
        .get('/admin/domains');
      expect(unauthRes.status).toBe(401);
    });
  });

  describe('Admin Platform Settings Management Integration Tests', () => {
    test('GET /admin/settings returns non-secret settings and safe email info', async () => {
      if (!mongoAvailable) return;

      const res = await request(app)
        .get('/admin/settings')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const settings = res.body.data.settings;
      expect(settings.general).toBeDefined();
      expect(settings.branding).toBeDefined();
      expect(settings.maintenance).toBeDefined();
      expect(settings.features).toBeDefined();
      expect(settings.security).toBeDefined();
      expect(settings.email).toBeDefined();

      // Ensure secrets are never leaked
      expect(settings.email).not.toHaveProperty('smtpUser');
      expect(settings.email).not.toHaveProperty('smtpPass');
      expect(settings.email).not.toHaveProperty('password');
      expect(settings.email).not.toHaveProperty('username');
    });

    test('PATCH /admin/settings updates allowed runtime settings', async () => {
      if (!mongoAvailable) return;

      const updatePayload = {
        general: { platformName: 'DeployX Integration Test' },
        branding: { accentColor: '#4338ca' },
        maintenance: { enabled: true, message: 'Maintenance test' },
        features: { userRegistration: false },
        security: { require2fa: true }
      };

      const res = await request(app)
        .patch('/admin/settings')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatePayload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.settings.general.platformName).toBe('DeployX Integration Test');
      expect(res.body.data.settings.branding.accentColor).toBe('#4338ca');
      expect(res.body.data.settings.maintenance.enabled).toBe(true);
      expect(res.body.data.settings.features.userRegistration).toBe(false);
      expect(res.body.data.settings.security.require2fa).toBe(true);
    });

    test('PATCH /admin/settings rejects unsupported sections', async () => {
      if (!mongoAvailable) return;

      const invalidPayload = {
        unsupportedCredentialsSection: { secret: '123' }
      };

      const res = await request(app)
        .patch('/admin/settings')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidPayload);

      expect(res.status).toBe(400);
    });

    test('POST /admin/settings/reset resets runtime settings to defaults', async () => {
      if (!mongoAvailable) return;

      const res = await request(app)
        .post('/admin/settings/reset')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.settings.general.platformName).toBe('DeployX');
      expect(res.body.data.settings.branding.accentColor).toBe('#6366f1');
    });

    test('Admin settings authorization: non-admin → 403, unauthenticated → 401', async () => {
      if (!mongoAvailable) return;

      const nonAdminRes = await request(app)
        .get('/admin/settings')
        .set('Authorization', `Bearer ${userToken}`);
      expect(nonAdminRes.status).toBe(403);

      const unauthRes = await request(app)
        .get('/admin/settings');
      expect(unauthRes.status).toBe(401);
    });
  });

  describe('Admin System Health Historical Metrics Integration Tests', () => {
    test('POST /admin/health/sample records real telemetry sample', async () => {
      if (!mongoAvailable) return;

      const res = await request(app)
        .post('/admin/health/sample')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.samplesCount).toBeGreaterThanOrEqual(7);
    });

    test('GET /admin/health/history returns aggregated metric series', async () => {
      if (!mongoAvailable) return;

      const res = await request(app)
        .get('/admin/health/history?metric=cpu&range=24h')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.metric).toBe('cpu');
      expect(res.body.data.data).toBeInstanceOf(Array);
    });

    test('GET /admin/health/performance returns live metrics and historical trends', async () => {
      if (!mongoAvailable) return;

      const res = await request(app)
        .get('/admin/health/performance')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('cpu');
      expect(res.body.data).toHaveProperty('memory');
      expect(res.body.data.cpu).toHaveProperty('current');
      expect(res.body.data.cpu).toHaveProperty('data');
    });

    test('GET /admin/health/history rejects invalid metric with 400', async () => {
      if (!mongoAvailable) return;

      const res = await request(app)
        .get('/admin/health/history?metric=invalid_fake_metric')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
    });

    test('Admin health history authorization: non-admin → 403, unauthenticated → 401', async () => {
      if (!mongoAvailable) return;

      const nonAdminRes = await request(app)
        .get('/admin/health/history?metric=cpu')
        .set('Authorization', `Bearer ${userToken}`);
      expect(nonAdminRes.status).toBe(403);

      const unauthRes = await request(app)
        .get('/admin/health/history?metric=cpu');
      expect(unauthRes.status).toBe(401);
    });
  });
});





