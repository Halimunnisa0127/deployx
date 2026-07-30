import {
  MOCK_USAGE_SUMMARY,
  MOCK_DAILY_CONSUMPTION,
  MOCK_WEEKLY_CONSUMPTION,
  MOCK_MONTHLY_CONSUMPTION,
  MOCK_TOP_CONSUMERS,
  MOCK_MONTHLY_QUOTAS,
  MOCK_USAGE_HISTORY,
  MOCK_USAGE_ALERTS,
  MOCK_OPTIMIZATION_TIPS,
  MOCK_FORECAST_USAGE,
  MOCK_USAGE_SPIKES,
} from '../constants/usageConstants';

/**
 * Frontend-only mock API service layer for Usage statistics
 */

export const fetchUsageData = async (dateRange = 'this_month') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        summary: MOCK_USAGE_SUMMARY,
        dailyConsumption: MOCK_DAILY_CONSUMPTION,
        weeklyConsumption: MOCK_WEEKLY_CONSUMPTION,
        monthlyConsumption: MOCK_MONTHLY_CONSUMPTION,
        topConsumers: MOCK_TOP_CONSUMERS,
        monthlyQuotas: MOCK_MONTHLY_QUOTAS,
        history:          MOCK_USAGE_HISTORY,
        alerts:           MOCK_USAGE_ALERTS,
        optimizationTips: MOCK_OPTIMIZATION_TIPS,
        forecastUsage:    MOCK_FORECAST_USAGE,
        spikes:           MOCK_USAGE_SPIKES,
      });
    }, 400);
  });
};

export const exportUsageReport = async (format = 'csv', historyData = MOCK_USAGE_HISTORY) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let mimeType = 'text/csv;charset=utf-8;';
      let extension = 'csv';
      let content = 'Date,Resource,Used,Remaining,Limit,Percentage,Status\n';

      const dataToExport = historyData.length > 0 ? historyData : MOCK_USAGE_HISTORY;

      if (format === 'excel') {
        mimeType = 'application/vnd.ms-excel;charset=utf-8;';
        extension = 'xls';
        content = `<table><tr><th>Date</th><th>Resource</th><th>Used</th><th>Remaining</th><th>Limit</th><th>Percentage</th><th>Status</th></tr>`;
        dataToExport.forEach((row) => {
          content += `<tr><td>${row.date}</td><td>${row.resource}</td><td>${row.used}</td><td>${row.remaining}</td><td>${row.limit}</td><td>${row.percentage}%</td><td>${row.status}</td></tr>`;
        });
        content += `</table>`;
      } else if (format === 'pdf') {
        mimeType = 'text/plain;charset=utf-8;';
        extension = 'txt';
        content = `DeployX Infrastructure Usage Report\nGenerated: ${new Date().toLocaleString()}\n----------------------------------------------------\n\n`;
        dataToExport.forEach((row) => {
          content += `[${row.date}] Resource: ${row.resource} | Used: ${row.used} | Remaining: ${row.remaining} | Limit: ${row.limit} | Status: ${row.status}\n`;
        });
      } else {
        dataToExport.forEach((row) => {
          content += `"${row.date}","${row.resource}","${row.used}","${row.remaining}","${row.limit}","${row.percentage}%","${row.status}"\n`;
        });
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `deployx_usage_report_${new Date().toISOString().slice(0, 10)}.${extension}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      resolve({
        success: true,
        message: `Usage report exported successfully as ${extension.toUpperCase()}`,
      });
    }, 500);
  });
};
