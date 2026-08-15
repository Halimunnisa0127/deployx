const ArtifactService = require('../../src/modules/storage/services/artifact.service');
const LocalArtifactStorageProvider = require('../../src/modules/storage/providers/LocalArtifactStorageProvider');

jest.mock('../../src/modules/storage/providers/LocalArtifactStorageProvider');

describe('Artifact Path Security Unit Tests', () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
      headersSent: false
    };
    jest.clearAllMocks();
  });

  describe('Path Traversal protection checks', () => {
    const testCases = [
      { name: 'Simple traversal', path: '../etc/passwd' },
      { name: 'Multi-level traversal', path: '../../etc/passwd' },
      { name: 'Backslash traversal', path: '..\\etc\\passwd' },
      { name: 'Absolute path', path: '/etc/passwd' },
      { name: 'Null byte', path: 'index.html\0.js' },
      { name: 'Encoded traversal', path: '%2e%2e%2fetc%2fpasswd' },
      { name: 'Double-encoded traversal', path: '%252e%252e%252fetc%252fpasswd' },
      { name: 'Windows absolute path', path: 'C:\\Windows\\System32' }
    ];

    test.each(testCases)('Rejects $name traversal: $path', async ({ path }) => {
      await ArtifactService.serveFileFromArtifact('key.tar', path, false, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Invalid path traversal detected');
    });

    test('Accepts clean paths', async () => {
      // Mock storage provider getArtifactStream to prevent file access crash in unit test
      const mockStream = { pipe: jest.fn(), on: jest.fn() };
      LocalArtifactStorageProvider.prototype.getArtifactStream = jest.fn().mockResolvedValue(mockStream);

      await ArtifactService.serveFileFromArtifact('key.tar', 'assets/js/app.js', false, res);
      // It shouldn't trigger status 400
      expect(res.status).not.toHaveBeenCalledWith(400);
    });
  });
});
