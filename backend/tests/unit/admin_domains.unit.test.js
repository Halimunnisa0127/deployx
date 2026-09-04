const mongoose = require('mongoose');
const AdminDomainService = require('../../src/modules/admin/services/adminDomain.service');
const Domain = require('../../src/modules/domains/models/Domain');
const Project = require('../../src/modules/projects/models/Project');
const Deployment = require('../../src/modules/deployments/models/Deployment');
const DomainVerificationService = require('../../src/modules/domains/services/domainVerification.service');
const config = require('../../src/config/env/env');

jest.mock('../../src/modules/domains/models/Domain');
jest.mock('../../src/modules/projects/models/Project');
jest.mock('../../src/modules/deployments/models/Deployment');
jest.mock('../../src/modules/domains/services/domainVerification.service');

describe('Admin Domains Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Domain Listing & Security Redaction', () => {
    test('listDomains returns mapped domains and excludes verificationToken', async () => {
      const mockDomains = [
        {
          _id: 'dom-1',
          hostname: 'app.example.com',
          project: { _id: 'proj-1', name: 'My Project', slug: 'my-project', framework: 'react' },
          owner: { fullName: 'Alice Developer', email: 'alice@test.com' },
          targetType: 'production',
          verificationStatus: 'verified',
          sslStatus: 'active',
          status: 'active',
          createdAt: new Date('2026-08-01T10:00:00Z'),
          updatedAt: new Date('2026-08-01T10:00:00Z'),
          verifiedAt: new Date('2026-08-01T10:05:00Z')
        }
      ];

      Domain.countDocuments = jest.fn().mockResolvedValue(1);
      Domain.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockDomains)
      });

      const result = await AdminDomainService.listDomains({ page: 1, limit: 10 });

      expect(result.domains.length).toBe(1);
      const d = result.domains[0];
      expect(d.hostname).toBe('app.example.com');
      expect(d.project).toBe('My Project');
      expect(d.owner).toBe('Alice Developer');
      expect(d.verificationStatus).toBe('verified');
      expect(d.sslStatus).toBe('active');
      expect(d.environment).toBe('production');
      expect(d).not.toHaveProperty('verificationToken');
    });

    test('listDomains applies filters and search parameters', async () => {
      Domain.countDocuments = jest.fn().mockResolvedValue(0);
      Domain.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([])
      });

      await AdminDomainService.listDomains({
        verificationStatus: 'pending',
        sslStatus: 'active',
        search: 'example'
      });

      expect(Domain.countDocuments).toHaveBeenCalledWith(expect.objectContaining({
        verificationStatus: 'pending',
        sslStatus: 'active',
        hostname: { $regex: 'example', $options: 'i' }
      }));
    });
  });

  describe('2. Domain Detail & Public DNS Routing Records', () => {
    test('getDomain returns domain details without token leak', async () => {
      const mockDomain = {
        _id: 'dom-1',
        hostname: 'app.example.com',
        project: { _id: 'proj-1', name: 'My Project' },
        owner: { fullName: 'Alice' },
        verificationStatus: 'verified',
        sslStatus: 'active',
        targetType: 'production'
      };

      Domain.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(mockDomain)
      });

      const result = await AdminDomainService.getDomain('dom-1');
      expect(result.hostname).toBe('app.example.com');
      expect(result).not.toHaveProperty('verificationToken');
    });

    test('getDomainDNSRecords returns only public routing records from centralized config without verification secrets', async () => {
      const mockDomain = {
        _id: 'dom-1',
        hostname: 'blog.example.com',
        verificationToken: 'secret-token-12345',
        verificationStatus: 'verified'
      };

      Domain.findById = jest.fn().mockResolvedValue(mockDomain);

      const records = await AdminDomainService.getDomainDNSRecords('dom-1');
      expect(records.length).toBe(1);
      expect(records[0]).toEqual({
        type: 'CNAME',
        name: 'blog',
        value: config.domains.cnameTarget,
        status: 'valid'
      });

      // Crucial security verification: verificationToken and TXT challenges must not be in /dns
      const txtRecord = records.find(r => r.type === 'TXT');
      expect(txtRecord).toBeUndefined();
      records.forEach(r => {
        expect(r.value).not.toContain('secret-token-12345');
        expect(r.value).not.toContain('deployx-verification=');
      });
    });

    test('getDomainDNSRecords returns A and CNAME records for apex domain', async () => {
      const mockDomain = {
        _id: 'dom-2',
        hostname: 'example.com',
        verificationToken: 'apex-secret-token',
        verificationStatus: 'pending'
      };

      Domain.findById = jest.fn().mockResolvedValue(mockDomain);

      const records = await AdminDomainService.getDomainDNSRecords('dom-2');
      expect(records.length).toBe(2);
      expect(records[0]).toEqual({
        type: 'A',
        name: '@',
        value: config.domains.routerIp,
        status: 'pending'
      });
      expect(records[1]).toEqual({
        type: 'CNAME',
        name: 'www',
        value: config.domains.cnameTarget,
        status: 'pending'
      });

      // Crucial security check: no verification secrets
      const hasSecrets = records.some(r => JSON.stringify(r).includes('apex-secret-token'));
      expect(hasSecrets).toBe(false);
    });

    test('getDomainInstructions explicitly returns verification token on dedicated endpoint', async () => {
      const mockDomain = {
        _id: 'dom-1',
        hostname: 'blog.example.com',
        verificationToken: 'token-secret-123'
      };

      Domain.findById = jest.fn().mockResolvedValue(mockDomain);

      const instructions = await AdminDomainService.getDomainInstructions('dom-1');
      expect(instructions.hostname).toBe('blog.example.com');
      expect(instructions.token).toBe('token-secret-123');
      expect(instructions.value).toBe('deployx-verification=token-secret-123');
      expect(instructions.cnameTarget).toBe(config.domains.cnameTarget);
      expect(instructions.routerIp).toBe(config.domains.routerIp);
    });
  });

  describe('3. Domain Actions (Verify, Target, Delete)', () => {
    test('verifyDomain triggers verification service', async () => {
      const mockDomain = {
        _id: 'dom-1',
        owner: 'user-1'
      };

      Domain.findById = jest.fn().mockResolvedValue(mockDomain);
      DomainVerificationService.verifyDomain = jest.fn().mockResolvedValue({
        verified: true,
        verificationStatus: 'verified',
        message: 'DNS verification completed successfully.'
      });

      const result = await AdminDomainService.verifyDomain('dom-1');
      expect(result.verified).toBe(true);
      expect(DomainVerificationService.verifyDomain).toHaveBeenCalledWith('dom-1', 'user-1');
    });

    test('deleteDomain removes domain document', async () => {
      Domain.findById = jest.fn().mockResolvedValue({ _id: 'dom-1' });
      Domain.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });

      const result = await AdminDomainService.deleteDomain('dom-1');
      expect(result.success).toBe(true);
      expect(Domain.deleteOne).toHaveBeenCalledWith({ _id: 'dom-1' });
    });

    test('deleteDomain throws 404 if domain not found', async () => {
      Domain.findById = jest.fn().mockResolvedValue(null);

      await expect(AdminDomainService.deleteDomain('dom-invalid')).rejects.toThrow('Domain not found');
    });
  });
});
