export const logsService = {
  filterLogs: (logs, { selectedProject, selectedLevel, searchQuery }) => {
    return logs.filter((log) => {
      const matchesProject = selectedProject === 'all' || log.project === selectedProject;
      const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel;
      const matchesSearch =
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.timestamp.includes(searchQuery);

      return matchesProject && matchesLevel && matchesSearch;
    });
  },

  getLogCounts: (logs) => {
    return {
      errorCount: logs.filter((l) => l.level === 'error').length,
      warningCount: logs.filter((l) => l.level === 'warning').length,
      successCount: logs.filter((l) => l.level === 'success').length,
    };
  },

  formatLogsForExport: (logs) => {
    return logs
      .map((l) => `[${l.timestamp}] [${l.project}] [${l.level.toUpperCase()}] ${l.message}`)
      .join('\n');
  }
};
