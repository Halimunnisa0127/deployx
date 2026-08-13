const mongoose = require('mongoose');
const dns = require('dns').promises;
const DomainVerificationService = require('../../src/modules/domains/services/domainVerification.service');
const DomainService = require('../../src/modules/domains/services/domain.service');
const Domain = require('../../src/modules/domains/models/Domain');
const Project = require('../../src/modules/projects/models/Project');

jest.mock('../../src/modules/domains/models/Domain');
jest.mock('../../src/modules/projects/models/Project');
jest.mock('dns', () => ({
  promises: {
    resolveTxt: jest.fn()
  }
}));

describe('Domain DNS Verification & Token Isolation Unit Tests', () => {
  const userId = new mongoose.Types.ObjectId();
  const domainId = new mongoose.Types.ObjectId();
  const projectId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('DNS Verification Logic', () => {
    test('Exact TXT token matches expected record value and verifies domain', async () => {
      const mockDomain = {
        _id: domainId,
        owner: userId,
        hostname: 'example.com',
        verificationToken: 'token-123',
        verificationStatus: 'pending',
        status: 'pending',
        save: jest.fn().mockResolvedValue(true)
      };

      Domain.findById = jest.fn().mockResolvedValue(mockDomain);
      dns.resolveTxt.mockResolvedValue([['deployx-verification=token-123']]);

      const result = await DomainVerificationService.verifyDomain(domainId, userId);
      expect(result.verified).toBe(true);
      expect(mockDomain.verificationStatus).toBe('verified');
      expect(mockDomain.status).toBe('active');
    });

    test('Wrong TXT token fails verification', async () => {
      const mockDomain = {
        _id: domainId,
        owner: userId,
        hostname: 'example.com',
        verificationToken: 'token-123',
        verificationStatus: 'pending',
        status: 'pending',
        save: jest.fn().mockResolvedValue(true)
      };

      Domain.findById = jest.fn().mockResolvedValue(mockDomain);
      dns.resolveTxt.mockResolvedValue([['deployx-verification=wrong-token']]);

      const result = await DomainVerificationService.verifyDomain(domainId, userId);
      expect(result.verified).toBe(false);
      expect(mockDomain.verificationStatus).toBe('failed');
    });

    test('Missing record fails verification', async () => {
      const mockDomain = {
        _id: domainId,
        owner: userId,
        hostname: 'example.com',
        verificationToken: 'token-123',
        verificationStatus: 'pending',
        save: jest.fn().mockResolvedValue(true)
      };

      Domain.findById = jest.fn().mockResolvedValue(mockDomain);
      dns.resolveTxt.mockResolvedValue([['other-record=abc']]);

      const result = await DomainVerificationService.verifyDomain(domainId, userId);
      expect(result.verified).toBe(false);
      expect(mockDomain.verificationStatus).toBe('failed');
    });

    test('NXDOMAIN resolver error fails safely', async () => {
      const mockDomain = {
        _id: domainId,
        owner: userId,
        hostname: 'example.com',
        verificationToken: 'token-123',
        verificationStatus: 'pending',
        save: jest.fn().mockResolvedValue(true)
      };

      Domain.findById = jest.fn().mockResolvedValue(mockDomain);
      const nxError = new Error('queryTxt ENOTFOUND example.com');
      nxError.code = 'ENOTFOUND';
      dns.resolveTxt.mockRejectedValue(nxError);

      const result = await DomainVerificationService.verifyDomain(domainId, userId);
      expect(result.verified).toBe(false);
      expect(result.message).toBe('DNS verification record was not found.');
      expect(mockDomain.verificationStatus).toBe('failed');
    });

    test('Generic resolver error fails safely', async () => {
      const mockDomain = {
        _id: domainId,
        owner: userId,
        hostname: 'example.com',
        verificationToken: 'token-123',
        verificationStatus: 'pending',
        save: jest.fn().mockResolvedValue(true)
      };

      Domain.findById = jest.fn().mockResolvedValue(mockDomain);
      dns.resolveTxt.mockRejectedValue(new Error('Timeout'));

      const result = await DomainVerificationService.verifyDomain(domainId, userId);
      expect(result.verified).toBe(false);
      expect(result.message).toBe('DNS verification could not be completed. Please try again.');
    });
  });

  describe('Token Isolation in API Responses', () => {
    test('getProjectDomains excludes verificationToken', async () => {
      const selectMock = jest.fn().mockResolvedValue([
        { _id: 'dom1', hostname: 'dom1.com' }
      ]);
      Domain.find = jest.fn().mockReturnValue({ select: selectMock });
      Project.findById = jest.fn().mockResolvedValue({ _id: projectId, owner: userId });

      const domains = await DomainService.getProjectDomains(userId, projectId);
      expect(Domain.find).toHaveBeenCalledWith({ project: projectId });
      expect(selectMock).toHaveBeenCalledWith('-verificationToken');
      expect(domains[0]).not.toHaveProperty('verificationToken');
    });

    test('getDomain details excludes verificationToken', async () => {
      const selectMock = jest.fn().mockResolvedValue(
        { _id: domainId, owner: userId, hostname: 'example.com' }
      );
      Domain.findById = jest.fn().mockReturnValue({ select: selectMock });

      const domain = await DomainService.getDomain(userId, domainId);
      expect(Domain.findById).toHaveBeenCalledWith(domainId);
      expect(selectMock).toHaveBeenCalledWith('-verificationToken');
      expect(domain).not.toHaveProperty('verificationToken');
    });

    test('getDomainInstructions returns the verification token explicitly', async () => {
      const mockDomain = {
        _id: domainId,
        owner: userId,
        hostname: 'example.com',
        verificationToken: 'token-abc'
      };
      Domain.findById = jest.fn().mockResolvedValue(mockDomain);

      const instructions = await DomainService.getDomainInstructions(userId, domainId);
      expect(instructions.token).toBe('token-abc');
      expect(instructions.value).toBe('deployx-verification=token-abc');
    });
  });
});
