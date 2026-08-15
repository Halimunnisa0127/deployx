import { logsApi } from '../api/logsApi';

export const logsService = {
  getLogs: async () => {
    return await logsApi.fetchLogs();
  },
};
