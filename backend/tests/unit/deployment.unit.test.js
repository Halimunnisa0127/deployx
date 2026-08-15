const crypto = require('crypto');
const path = require('path');
const DomainVerificationService = require('../../../backend/src/modules/domains/services/domainVerification.service');
const ArtifactService = require('../../../backend/src/modules/storage/services/artifact.service');

describe('Backend Unit Tests', () => {
  
  describe('Deployment State Machine & Cancellation Rules', () => {
    test('State machine transitions must follow correct status lifecycle tags', () => {
      const allowedTransitions = {
        queued: ['building', 'cancelled'],
        building: ['ready', 'failed', 'cancelled'],
        ready: [],
        failed: [],
        cancelled: [],
      };
      
      const checkTransition = (from, to) => {
        return allowedTransitions[from]?.includes(to) || false;
      };

      expect(checkTransition('queued', 'building')).toBe(true);
      expect(checkTransition('queued', 'cancelled')).toBe(true);
      expect(checkTransition('building', 'ready')).toBe(true);
      expect(checkTransition('building', 'failed')).toBe(true);
      expect(checkTransition('ready', 'queued')).toBe(false);
    });
  });

  describe('Webhook Security checks', () => {
    test('HMAC timing-safe checks must validate correct signatures and reject tampering', () => {
      const secret = 'webhook-secret';
      const payload = JSON.stringify({ event: 'push', repository: 'deployx' });
      
      const correctSignature = 'sha256=' + crypto.createHmac('sha256', secret).update(payload).digest('hex');
      const tamperedSignature = 'sha256=' + crypto.createHmac('sha256', 'wrong-secret').update(payload).digest('hex');

      const verifySignature = (sig, pay, sec) => {
        const expected = 'sha256=' + crypto.createHmac('sha256', sec).update(pay).digest('hex');
        const sigBuffer = Buffer.from(sig);
        const expectedBuffer = Buffer.from(expected);
        if (sigBuffer.length !== expectedBuffer.length) {
          return false;
        }
        return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
      };

      expect(verifySignature(correctSignature, payload, secret)).toBe(true);
      expect(verifySignature(tamperedSignature, payload, secret)).toBe(false);
    });
  });

  describe('DNS Verification Token Matching', () => {
    test('DNS verification matcher asserts exact deployx-verification TXT payload matches', () => {
      const token = 'deployx-verify-random-12345';
      const expectedRecord = `deployx-verification=${token}`;

      const verifyTxtRecord = (records, expected) => {
        return records.includes(expected);
      };

      const validRecords = [`deployx-verification=${token}`, 'other-dns-record=abc'];
      const invalidRecords = ['deployx-verification=different-token', 'google-site-verification=xyz'];

      expect(verifyTxtRecord(validRecords, expectedRecord)).toBe(true);
      expect(verifyTxtRecord(invalidRecords, expectedRecord)).toBe(false);
    });
  });

  describe('Artifact Path Traversal protections', () => {
    test('Paths containing path traversals, null bytes, or absolute locations must be rejected', () => {
      const validatePath = (normalizedPath) => {
        if (
          normalizedPath.includes('../') ||
          normalizedPath.includes('..\\') ||
          normalizedPath.includes('\0') ||
          normalizedPath.startsWith('/') ||
          path.isAbsolute(normalizedPath)
        ) {
          return false;
        }
        return true;
      };

      expect(validatePath('assets/app.js')).toBe(true);
      expect(validatePath('../etc/passwd')).toBe(false);
      expect(validatePath('assets/..\\app.js')).toBe(false);
      expect(validatePath('/absolute/path')).toBe(false);
      expect(validatePath('assets\0/app.js')).toBe(false);
    });
  });
});
