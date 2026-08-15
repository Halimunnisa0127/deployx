import { logsMockData } from '../data/logsData';

export const logsApi = {
  fetchLogs: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...logsMockData]);
      }, 500);
    });
  },
};
