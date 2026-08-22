const express = require('express');
const request = require('supertest');
const securityMiddleware = require('../../src/config/security/security.middleware');

describe('Security Middleware CSP Unit Tests', () => {
  let app;

  beforeEach(() => {
    app = express();
    securityMiddleware(app);
    app.get('/test', (req, res) => {
      res.status(200).send('OK');
    });
  });

  test('Sets Content-Security-Policy header with img-src allowing https: external images', async () => {
    const response = await request(app).get('/test');
    expect(response.headers['content-security-policy']).toBeDefined();
    const csp = response.headers['content-security-policy'];
    expect(csp).toContain("img-src 'self' data: https:");
  });
});
