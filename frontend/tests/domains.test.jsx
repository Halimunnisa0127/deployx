import { describe, test, expect, vi, beforeEach } from 'vitest';
import { domainsApi } from '../src/features/domains/api/domainsApi';
import api from '../src/lib/axios';

vi.mock('../src/lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Domains API Client Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('createDomain POSTs correct payload', async () => {
    api.post.mockResolvedValue({ data: { success: true } });
    await domainsApi.createDomain('proj-1', 'example.com');
    expect(api.post).toHaveBeenCalledWith('/domains', { projectId: 'proj-1', hostname: 'example.com' });
  });

  test('getProjectDomains resolves list without verificationToken requirement', async () => {
    // Normal list returns domains. Token is omitted in response for security.
    const mockDomains = [{ _id: 'dom-1', hostname: 'domain.com' }];
    api.get.mockResolvedValue({ data: { data: mockDomains } });

    const result = await domainsApi.getProjectDomains('proj-1');
    expect(api.get).toHaveBeenCalledWith('/domains/project/proj-1');
    expect(result.data[0]).not.toHaveProperty('verificationToken');
  });

  test('getDomainDetails does not expect token in default response', async () => {
    const mockDomain = { _id: 'dom-1', hostname: 'domain.com' };
    api.get.mockResolvedValue({ data: { data: mockDomain } });

    const result = await domainsApi.getDomain('dom-1');
    expect(api.get).toHaveBeenCalledWith('/domains/dom-1');
    expect(result.data).not.toHaveProperty('verificationToken');
  });

  test('verifyDomain requests verification endpoint', async () => {
    api.post.mockResolvedValue({ data: { verified: true } });
    await domainsApi.verifyDomain('dom-1');
    expect(api.post).toHaveBeenCalledWith('/domains/dom-1/verify');
  });

  test('getDomainInstructions requests dedicated instructions endpoint', async () => {
    // Instructions endpoint explicitly returns the token
    const mockInstructions = { hostname: 'domain.com', token: 'deployx-token-xyz' };
    api.get.mockResolvedValue({ data: mockInstructions });

    const instructions = await domainsApi.getDomainInstructions('dom-1');
    expect(api.get).toHaveBeenCalledWith('/domains/dom-1/instructions');
    expect(instructions.token).toBe('deployx-token-xyz');
  });

  test('updateDomainTarget patches target settings', async () => {
    api.patch.mockResolvedValue({ data: { success: true } });
    await domainsApi.updateDomainTarget('dom-1', 'deployment', 'dep-123');
    expect(api.patch).toHaveBeenCalledWith('/domains/dom-1/target', {
      targetType: 'deployment',
      targetDeployment: 'dep-123'
    });
  });

  test('deleteDomain issues DELETE request', async () => {
    api.delete.mockResolvedValue({ data: { success: true } });
    await domainsApi.deleteDomain('dom-1');
    expect(api.delete).toHaveBeenCalledWith('/domains/dom-1');
  });
});
