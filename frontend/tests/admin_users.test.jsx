import { describe, test, expect, vi, beforeEach } from 'vitest';
import { fetchUsers, fetchUser, putUser } from '../src/features/admin/users/api/usersApi';
import api from '../src/lib/axios';

vi.mock('../src/lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Admin Users API Client Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('fetchUsers calls /admin/users and maps response correctly', async () => {
    const mockUsers = [{ _id: 'usr-1', name: 'John Admin' }];
    api.get.mockResolvedValue({
      data: {
        data: {
          users: mockUsers
        }
      }
    });

    const users = await fetchUsers();
    expect(api.get).toHaveBeenCalledWith('/admin/users');
    expect(users).toEqual(mockUsers);
  });

  test('fetchUser calls /admin/users/:id and maps response correctly', async () => {
    const mockUser = { _id: 'usr-1', name: 'John Admin' };
    api.get.mockResolvedValue({
      data: {
        data: {
          user: mockUser
        }
      }
    });

    const user = await fetchUser('usr-1');
    expect(api.get).toHaveBeenCalledWith('/admin/users/usr-1');
    expect(user).toEqual(mockUser);
  });

  test('putUser handles patching safely', async () => {
    const mockUser = { _id: 'usr-1', name: 'John Updated' };
    api.patch.mockResolvedValue({
      data: {
        data: {
          user: mockUser
        }
      }
    });

    const updated = await putUser('usr-1', { name: 'John Updated' });
    expect(api.patch).toHaveBeenCalledWith('/admin/users/usr-1', { name: 'John Updated' });
    expect(updated).toEqual(mockUser);
  });
});
