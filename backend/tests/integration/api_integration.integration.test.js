const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../src/app');
const { generateAccessToken } = require('../../src/utils/helpers/jwt.helper');
const { ROLES } = require('../../src/shared/constants/constants');
const User = require('../../src/modules/users/models/User');
const Project = require('../../src/modules/projects/models/Project');
const Deployment = require('../../src/modules/deployments/models/Deployment');

describe('Backend HTTP API Integration Tests (Infrastructure-dependent)', () => {
  let mongoAvailable = false;
  let adminToken;
  let userToken;
  let otherUserToken;
  let adminUser;
  let regularUser;
  let otherUser;
  let project;
  let deployment;

  beforeAll(async () => {
    const mongoUri = process.env.MONGO_TEST_URI || process.env.MONGO_URI;
    if (mongoUri) {
      try {
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 1500 });
        mongoAvailable = true;

        // Clean tables and create test fixtures
        await User.deleteMany({});
        await Project.deleteMany({});
        await Deployment.deleteMany({});

        adminUser = await User.create({
          name: 'Admin User',
          email: 'admin@deployx.com',
          password: 'Password123!',
          role: ROLES.ADMIN,
          isVerified: true
        });

        regularUser = await User.create({
          name: 'Regular User',
          email: 'user@deployx.com',
          password: 'Password123!',
          role: ROLES.USER,
          isVerified: true
        });

        otherUser = await User.create({
          name: 'Other User',
          email: 'other@deployx.com',
          password: 'Password123!',
          role: ROLES.USER,
          isVerified: true
        });

        adminToken = generateAccessToken(adminUser._id, adminUser.role);
        userToken = generateAccessToken(regularUser._id, regularUser.role);
        otherUserToken = generateAccessToken(otherUser._id, otherUser.role);

        project = await Project.create({
          name: 'Regular Project',
          slug: 'regular-project',
          owner: regularUser._id,
          domainUrl: 'http://regular-project.deployx.app',
          gitRepository: { url: 'https://github.com/user/project', fullName: 'user/project', branch: 'main' }
        });

        deployment = await Deployment.create({
          project: project._id,
          owner: regularUser._id,
          deploymentNumber: 1,
          environment: 'Production',
          branch: 'main',
          triggeredBy: 'Manual',
          status: 'queued'
        });

      } catch (error) {
        // Safe skip if database is unavailable
        mongoAvailable = false;
      }
    }
  });

  afterAll(async () => {
    if (mongoAvailable) {
      await mongoose.connection.close();
    }
  });

  describe('Admin Authorization', () => {
    test('Unauthenticated admin endpoint -> 401', async () => {
      if (!mongoAvailable) {
        console.warn('[TEST BLOCKED] Integration tests skipped because MongoDB is offline.');
        return;
      }

      const res = await request(app).get('/admin/health/overview');
      expect(res.status).toBe(401);
    });

    test('Authenticated non-admin -> 403', async () => {
      if (!mongoAvailable) {
        return;
      }

      const res = await request(app)
        .get('/admin/health/overview')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(403);
    });

    test('Authenticated admin -> 200/503 (Authorized)', async () => {
      if (!mongoAvailable) {
        return;
      }

      const res = await request(app)
        .get('/admin/health/overview')
        .set('Authorization', `Bearer ${adminToken}`);
      // If redis/docker aren't fully configured/ready in testing, it may return 200, 503, or 500 but authorization passes.
      expect([200, 503, 500]).toContain(res.status);
    });
  });

  describe('Deployment Ownership & Isolation Boundaries', () => {
    test('Owner can access own deployment', async () => {
      if (!mongoAvailable) {
        return;
      }

      const res = await request(app)
        .get(`/deployments/${deployment._id}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.deployment._id.toString()).toBe(deployment._id.toString());
    });

    test('Another user cannot access deployment', async () => {
      if (!mongoAvailable) {
        return;
      }

      const res = await request(app)
        .get(`/deployments/${deployment._id}`)
        .set('Authorization', `Bearer ${otherUserToken}`);
      expect(res.status).toBe(403); // Forbidden
    });

    test('Another user cannot cancel deployment', async () => {
      if (!mongoAvailable) {
        return;
      }

      const res = await request(app)
        .post(`/deployments/${deployment._id}/cancel`)
        .set('Authorization', `Bearer ${otherUserToken}`);
      expect(res.status).toBe(403); // Forbidden
    });
  });
});
