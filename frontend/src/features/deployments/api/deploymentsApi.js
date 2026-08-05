import { mockDeployments } from '../data/mockDeployments';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const deploymentsApi = {
  getDeployments: async () => {
    await wait(400); // Simulate network latency
    return [...mockDeployments];
  },

  getDeploymentDetails: async (id) => {
    await wait(300);
    const deployment = mockDeployments.find(d => String(d.id) === String(id));
    if (!deployment) throw new Error("Deployment not found");
    return { ...deployment };
  }
};
