import { describe, it, expect } from 'vitest';
import { logsService } from '../src/features/logs/services/logsService';

describe('logsService Unit Tests', () => {
  const sampleLogs = [
    { id: 1, project: 'deployx-frontend', level: 'info', timestamp: '11:08:01', message: 'Initializing build environment' },
    { id: 2, project: 'api-gateway', level: 'error', timestamp: '11:08:30', message: 'IP exceeded burst limit' },
    { id: 3, project: 'payment-processor', level: 'warning', timestamp: '11:08:40', message: 'Rate limit warning' },
    { id: 4, project: 'analytics-worker', level: 'success', timestamp: '11:08:48', message: 'Cluster connection re-established' },
  ];

  describe('filterLogs', () => {
    it('returns all logs when no filters or search query are provided', () => {
      const result = logsService.filterLogs(sampleLogs);
      expect(result).toHaveLength(4);
    });

    it('filters correctly by project', () => {
      const result = logsService.filterLogs(sampleLogs, {
        selectedProject: 'api-gateway',
        selectedLevel: 'all',
        searchQuery: '',
      });
      expect(result).toHaveLength(1);
      expect(result[0].project).toBe('api-gateway');
    });

    it('filters correctly by log level', () => {
      const result = logsService.filterLogs(sampleLogs, {
        selectedProject: 'all',
        selectedLevel: 'error',
        searchQuery: '',
      });
      expect(result).toHaveLength(1);
      expect(result[0].level).toBe('error');
    });

    it('filters correctly by search query (case-insensitive on message)', () => {
      const result = logsService.filterLogs(sampleLogs, {
        selectedProject: 'all',
        selectedLevel: 'all',
        searchQuery: 'INITIALIZING',
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('filters correctly by search query on project or timestamp', () => {
      const resultByProject = logsService.filterLogs(sampleLogs, {
        selectedProject: 'all',
        selectedLevel: 'all',
        searchQuery: 'gateway',
      });
      expect(resultByProject).toHaveLength(1);

      const resultByTimestamp = logsService.filterLogs(sampleLogs, {
        selectedProject: 'all',
        selectedLevel: 'all',
        searchQuery: '11:08:40',
      });
      expect(resultByTimestamp).toHaveLength(1);
      expect(resultByTimestamp[0].id).toBe(3);
    });

    it('gracefully handles logs with undefined or null properties without throwing TypeError', () => {
      const corruptedLogs = [
        undefined,
        null,
        {},
        { id: 10, project: undefined, level: undefined, timestamp: undefined, message: undefined },
        { id: 11, project: 'deployx-frontend', level: null, timestamp: null, message: null },
        { id: 12, project: 'deployx-frontend', level: 'info', timestamp: '12:00:00', message: 'Valid log entry' },
      ];

      expect(() => {
        const result = logsService.filterLogs(corruptedLogs, {
          selectedProject: 'all',
          selectedLevel: 'all',
          searchQuery: 'valid',
        });
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(12);
      }).not.toThrow();
    });

    it('handles empty, null, or undefined logs input', () => {
      expect(logsService.filterLogs(null)).toEqual([]);
      expect(logsService.filterLogs(undefined)).toEqual([]);
      expect(logsService.filterLogs([])).toEqual([]);
    });

    it('handles empty, null, or non-string search query', () => {
      expect(() => {
        logsService.filterLogs(sampleLogs, {
          selectedProject: 'all',
          selectedLevel: 'all',
          searchQuery: null,
        });
      }).not.toThrow();

      expect(() => {
        logsService.filterLogs(sampleLogs, {
          selectedProject: 'all',
          selectedLevel: 'all',
          searchQuery: undefined,
        });
      }).not.toThrow();
    });
  });

  describe('getLogCounts', () => {
    it('correctly counts errors, warnings, and success levels', () => {
      const counts = logsService.getLogCounts(sampleLogs);
      expect(counts).toEqual({
        errorCount: 1,
        warningCount: 1,
        successCount: 1,
      });
    });

    it('handles corrupted logs array without crashing', () => {
      const counts = logsService.getLogCounts([null, undefined, {}, { level: 'error' }]);
      expect(counts).toEqual({
        errorCount: 1,
        warningCount: 0,
        successCount: 0,
      });
    });

    it('handles null and undefined input', () => {
      expect(logsService.getLogCounts(null)).toEqual({ errorCount: 0, warningCount: 0, successCount: 0 });
      expect(logsService.getLogCounts(undefined)).toEqual({ errorCount: 0, warningCount: 0, successCount: 0 });
    });
  });

  describe('formatLogsForExport', () => {
    it('formats logs as text lines correctly', () => {
      const formatted = logsService.formatLogsForExport([sampleLogs[0]]);
      expect(formatted).toBe('[11:08:01] [deployx-frontend] [INFO] Initializing build environment');
    });

    it('safely handles missing fields in export formatting', () => {
      const corrupted = [{ id: 99 }];
      expect(() => {
        const formatted = logsService.formatLogsForExport(corrupted);
        expect(formatted).toBe('[] [unknown] [INFO] ');
      }).not.toThrow();
    });

    it('handles null and undefined input', () => {
      expect(logsService.formatLogsForExport(null)).toBe('');
      expect(logsService.formatLogsForExport(undefined)).toBe('');
    });
  });
});

describe('useLogs Hook Tests', () => {
  it('initializes and computes filteredLogs and counts without crashing', async () => {
    const { renderHook, waitFor } = await import('@testing-library/react');
    const { useLogs } = await import('../src/features/logs/hooks/useLogs');

    const { result } = renderHook(() => useLogs());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(Array.isArray(result.current.logs)).toBe(true);
    expect(Array.isArray(result.current.filteredLogs)).toBe(true);
    expect(typeof result.current.errorCount).toBe('number');
    expect(typeof result.current.warningCount).toBe('number');
    expect(typeof result.current.successCount).toBe('number');
  });
});

