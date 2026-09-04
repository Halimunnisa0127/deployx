import { describe, test, expect, vi, beforeEach } from 'vitest';
import {
  fetchDomains,
  fetchDomain,
  fetchDNSRecords,
  fetchDomainInstructions,
  fetchSSLInfo,
  fetchVerificationHistory,
  verifyDomainApi,
  removeDomainApi,
} from '../src/features/admin/domains/api/domainsApi';
import api from '../src/lib/axios';

vi.mock('../src/lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Admin Domains API Client Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('fetchDomains calls /admin/domains and resolves domains array', async () => {
    const mockDomains = [
      { id: 'dom-1', hostname: 'app.example.com', project: 'App 1', owner: 'Alice' }
    ];

    api.get.mockResolvedValue({
      data: {
        data: {
          domains: mockDomains
        }
      }
    });

    const result = await fetchDomains();
    expect(api.get).toHaveBeenCalledWith('/admin/domains', { params: {} });
    expect(result).toEqual(mockDomains);
  });

  test('fetchDomain calls /admin/domains/:id and returns domain details', async () => {
    const mockDomain = {
      id: 'dom-1',
      hostname: 'app.example.com',
      verificationStatus: 'verified',
      sslStatus: 'active'
    };

    api.get.mockResolvedValue({
      data: {
        data: {
          domain: mockDomain
        }
      }
    });

    const result = await fetchDomain('dom-1');
    expect(api.get).toHaveBeenCalledWith('/admin/domains/dom-1');
    expect(result).toEqual(mockDomain);
  });

  test('fetchDNSRecords calls /admin/domains/:id/dns and returns real DNS routing records', async () => {
    const mockRecords = [
      { type: 'CNAME', name: 'app', value: 'cname.custom-cluster.net', status: 'valid' }
    ];

    api.get.mockResolvedValue({
      data: {
        data: {
          records: mockRecords
        }
      }
    });

    const records = await fetchDNSRecords('dom-1');
    expect(api.get).toHaveBeenCalledWith('/admin/domains/dom-1/dns');
    expect(records).toEqual(mockRecords);
  });

  test('fetchDomainInstructions calls /admin/domains/:id/instructions and returns challenge token', async () => {
    const mockInstructions = {
      hostname: 'app.example.com',
      type: 'TXT',
      name: 'app.example.com',
      value: 'deployx-verification=secret-challenge-token',
      token: 'secret-challenge-token'
    };

    api.get.mockResolvedValue({
      data: {
        data: {
          instructions: mockInstructions
        }
      }
    });

    const instructions = await fetchDomainInstructions('dom-1');
    expect(api.get).toHaveBeenCalledWith('/admin/domains/dom-1/instructions');
    expect(instructions).toEqual(mockInstructions);
  });

  test('fetchSSLInfo computes honest configuration status from domain data', async () => {
    const mockDomain = {
      id: 'dom-1',
      name: 'app.example.com',
      sslStatus: 'active',
      lastVerified: '2026-08-01T10:00:00Z'
    };

    api.get.mockResolvedValue({
      data: {
        data: {
          domain: mockDomain
        }
      }
    });

    const sslInfo = await fetchSSLInfo('dom-1');
    expect(sslInfo.status).toBe('Configured');
    expect(sslInfo.rawStatus).toBe('active');
    expect(sslInfo.autoRenew).toBe(true);
    expect(sslInfo.issued).toBe('2026-08-01T10:00:00Z');
  });

  test('fetchVerificationHistory builds history from verification timestamp and status', async () => {
    const mockDomain = {
      id: 'dom-1',
      lastVerified: '2026-08-01T10:00:00Z',
      createdAt: '2026-07-25T10:00:00Z',
      verificationStatus: 'verified'
    };

    api.get.mockResolvedValue({
      data: {
        data: {
          domain: mockDomain
        }
      }
    });

    const history = await fetchVerificationHistory('dom-1');
    expect(history.length).toBe(2);
    expect(history[0].status).toBe('success');
    expect(history[1].status).toBe('pending');
  });

  test('verifyDomainApi issues POST /admin/domains/:id/verify', async () => {
    api.post.mockResolvedValue({
      data: { success: true, message: 'Domain verification check completed' }
    });

    const res = await verifyDomainApi('dom-1');
    expect(api.post).toHaveBeenCalledWith('/admin/domains/dom-1/verify');
    expect(res.success).toBe(true);
  });

  test('removeDomainApi issues DELETE /admin/domains/:id', async () => {
    api.delete.mockResolvedValue({
      data: { success: true, message: 'Domain deleted successfully' }
    });

    const res = await removeDomainApi('dom-1');
    expect(api.delete).toHaveBeenCalledWith('/admin/domains/dom-1');
    expect(res.success).toBe(true);
  });
});
