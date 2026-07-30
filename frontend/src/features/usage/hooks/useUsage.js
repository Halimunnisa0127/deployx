import { useState, useEffect, useCallback } from 'react';
import { fetchUsageData, exportUsageReport } from '../api/usageApi';

export function useUsage() {
  const [dateRange, setDateRangeState] = useState(() => {
    try {
      return localStorage.getItem('deployx_usage_date_filter') || 'this_month';
    } catch {
      return 'this_month';
    }
  });

  const setDateRange = (newRange) => {
    setDateRangeState(newRange);
    try {
      localStorage.setItem('deployx_usage_date_filter', newRange);
    } catch (e) {
      console.warn('Failed to save date filter to localStorage:', e);
    }
  };

  const [activeTab, setActiveTab] = useState('bandwidth');
  const [chartPeriod, setChartPeriod] = useState('daily');
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchUsageData(dateRange);
      setData(res);
    } catch (err) {
      console.error('Failed to load usage metrics:', err);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleExport = async (format = 'csv') => {
    setIsExporting(true);
    try {
      const res = await exportUsageReport(format, data?.history || []);
      return res;
    } catch (err) {
      console.error('Failed to export report:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    dateRange,
    setDateRange,
    activeTab,
    setActiveTab,
    chartPeriod,
    setChartPeriod,
    isLoading,
    isExporting,
    data,
    searchQuery,
    setSearchQuery,
    handleExport,
    refetch: loadData,
  };
}

