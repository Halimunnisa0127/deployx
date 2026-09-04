const mongoose = require('mongoose');
const AdminHealthService = require('../../src/modules/admin/services/adminHealth.service');
const SystemMetric = require('../../src/modules/admin/models/SystemMetric');
const telemetry = require('../../src/shared/utils/telemetry');

jest.mock('../../src/modules/admin/models/SystemMetric');
jest.mock('../../src/shared/utils/telemetry');

describe('Admin System Health Historical Metrics Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Telemetry Sampling & Recording', () => {
    test('recordTelemetrySample captures real system metrics and persists them', async () => {
      telemetry.isMongoReady.mockReturnValue(true);
      telemetry.isRedisReady.mockReturnValue(true);
      telemetry.getQueueMetrics.mockResolvedValue({ waiting: 2, active: 1 });

      SystemMetric.insertMany.mockResolvedValue([]);

      const samples = await AdminHealthService.recordTelemetrySample();

      expect(samples.length).toBeGreaterThanOrEqual(7);
      expect(SystemMetric.insertMany).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ metric: 'cpu', value: expect.any(Number) }),
          expect.objectContaining({ metric: 'memory', value: expect.any(Number) }),
          expect.objectContaining({ metric: 'queue', value: 3 }),
          expect.objectContaining({ metric: 'redis', value: 1 }),
          expect.objectContaining({ metric: 'mongodb', value: 1 }),
        ])
      );
    });
  });

  describe('2. Historical Metrics Querying & Validation', () => {
    test('getHistoricalMetrics rejects invalid metric name', async () => {
      await expect(
        AdminHealthService.getHistoricalMetrics({ metric: 'invalid_metric', range: '24h' })
      ).rejects.toThrow('Invalid metric: invalid_metric');
    });

    test('getHistoricalMetrics rejects invalid time range', async () => {
      await expect(
        AdminHealthService.getHistoricalMetrics({ metric: 'cpu', range: '99d' })
      ).rejects.toThrow('Invalid range: 99d');
    });

    test('getHistoricalMetrics returns downsampled time-series buckets for valid metric', async () => {
      SystemMetric.findOne.mockResolvedValue({ timestamp: new Date() });

      const mockAggResult = [
        {
          _id: { metric: 'cpu', bucket: new Date('2026-08-30T10:00:00Z') },
          avgValue: 42.5,
          minValue: 30,
          maxValue: 55,
          count: 5,
        },
        {
          _id: { metric: 'cpu', bucket: new Date('2026-08-30T10:15:00Z') },
          avgValue: 48.2,
          minValue: 40,
          maxValue: 60,
          count: 5,
        },
      ];

      SystemMetric.aggregate.mockResolvedValue(mockAggResult);

      const result = await AdminHealthService.getHistoricalMetrics({ metric: 'cpu', range: '24h' });

      expect(result.metric).toBe('cpu');
      expect(result.range).toBe('24h');
      expect(result.data).toHaveLength(2);
      expect(result.data[0].value).toBe(42.5);
      expect(result.data[0].min).toBe(30);
      expect(result.data[0].max).toBe(55);
      expect(result.data[0].count).toBe(5);
    });

    test('getHistoricalMetrics returns empty array if no samples exist (no fake fallback)', async () => {
      SystemMetric.findOne.mockResolvedValue({ timestamp: new Date() });
      SystemMetric.aggregate.mockResolvedValue([]);

      const result = await AdminHealthService.getHistoricalMetrics({ metric: 'memory', range: '1h' });

      expect(result.metric).toBe('memory');
      expect(result.data).toEqual([]);
    });
  });

  describe('3. Performance Overview Dashboard', () => {
    test('getPerformanceOverview returns real snapshot and historical arrays', async () => {
      SystemMetric.findOne.mockResolvedValue({ timestamp: new Date() });

      SystemMetric.aggregate
        .mockResolvedValueOnce([
          {
            _id: { metric: 'cpu', bucket: new Date('2026-08-30T12:00:00Z') },
            avgValue: 40,
            minValue: 35,
            maxValue: 45,
            count: 3,
          },
        ]) // historical agg
        .mockResolvedValueOnce([
          { _id: 'cpu', value: 45, timestamp: new Date() },
          { _id: 'memory', value: 65, timestamp: new Date() },
        ]); // latest samples

      const perf = await AdminHealthService.getPerformanceOverview();

      expect(perf).toHaveProperty('cpu');
      expect(perf).toHaveProperty('memory');
      expect(perf).toHaveProperty('disk');
      expect(perf).toHaveProperty('network');
      expect(perf.cpu.current).toBe(45);
      expect(perf.cpu.data).toBeInstanceOf(Array);
    });
  });
});
