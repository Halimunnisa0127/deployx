export const logsService = {
  filterLogs: (logs = [], { selectedProject = 'all', selectedLevel = 'all', searchQuery = '' } = {}) => {
    if (!Array.isArray(logs)) return [];
    const query = typeof searchQuery === 'string' ? searchQuery.trim().toLowerCase() : '';

    return logs.filter((log) => {
      if (!log || typeof log !== 'object') return false;

      const matchesProject =
        selectedProject === 'all' ||
        log.project === selectedProject;

      const normSelectedLevel = String(selectedLevel).toLowerCase();
      const normLogLevel = String(log.level || '').toLowerCase();
      const isLevelMatch =
        normSelectedLevel === 'all' ||
        normLogLevel === normSelectedLevel ||
        ((normSelectedLevel === 'warn' || normSelectedLevel === 'warning') &&
          (normLogLevel === 'warn' || normLogLevel === 'warning'));

      if (!matchesProject || !isLevelMatch) return false;

      if (!query) return true;

      const message = typeof log.message === 'string' ? log.message.toLowerCase() : '';
      const project = typeof log.project === 'string' ? log.project.toLowerCase() : '';
      const timestamp = typeof log.timestamp === 'string' ? log.timestamp.toLowerCase() : String(log.timestamp || '').toLowerCase();

      return (
        message.includes(query) ||
        project.includes(query) ||
        timestamp.includes(query)
      );
    });
  },

  getLogCounts: (logs = []) => {
    if (!Array.isArray(logs)) {
      return { errorCount: 0, warningCount: 0, successCount: 0 };
    }

    return {
      errorCount: logs.filter((l) => {
        const lvl = String(l?.level || '').toLowerCase();
        return lvl === 'error';
      }).length,
      warningCount: logs.filter((l) => {
        const lvl = String(l?.level || '').toLowerCase();
        return lvl === 'warning' || lvl === 'warn';
      }).length,
      successCount: logs.filter((l) => {
        const lvl = String(l?.level || '').toLowerCase();
        return lvl === 'success' || lvl === 'ready';
      }).length,
    };
  },

  formatLogsForExport: (logs = []) => {
    if (!Array.isArray(logs)) return '';

    return logs
      .filter((l) => l && typeof l === 'object')
      .map((l) => {
        const timestamp = l.timestamp || '';
        const project = l.project || 'unknown';
        const level = typeof l.level === 'string' ? l.level.toUpperCase() : 'INFO';
        const message = l.message || '';
        return `[${timestamp}] [${project}] [${level}] ${message}`;
      })
      .join('\n');
  }
};
