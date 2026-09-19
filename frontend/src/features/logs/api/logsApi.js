import { INITIAL_LOGS, STREAMING_POOL } from '../data/logsData';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const logsApi = {
  getInitialLogs: async () => {
    await wait(400); // Simulate network
    return Array.isArray(INITIAL_LOGS) ? [...INITIAL_LOGS] : [];
  },

  getStreamEvent: async () => {
    // API only simulates the network request, the interval is managed by the hook
    await wait(100);
    if (!Array.isArray(STREAMING_POOL) || STREAMING_POOL.length === 0) {
      return null;
    }
    const randomLog = STREAMING_POOL[Math.floor(Math.random() * STREAMING_POOL.length)];
    return randomLog ? { ...randomLog } : null;
  }
};
