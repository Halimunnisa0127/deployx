import { mockRepositories, mockBranches, mockCommits } from '../data/mockGithub';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const githubApi = {
  getRepositories: async () => {
    await wait(400); // Simulate network latency
    return [...mockRepositories];
  },

  getRepositoryDetails: async (id) => {
    await wait(300);
    const repository = mockRepositories.find(r => String(r.id) === String(id));
    if (!repository) throw new Error("Repository not found");
    return { ...repository };
  },

  getBranches: async (repoId) => {
    await wait(300);
    return [...mockBranches];
  },

  getCommits: async (repoId) => {
    await wait(300);
    return [...mockCommits];
  }
};
