import { mockDomains } from '../data/mockDomains';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const domainsApi = {
  getDomains: async () => {
    await wait(400); // Simulate network latency
    return [...mockDomains];
  },

  getDomainDetails: async (id) => {
    await wait(300);
    const domain = mockDomains.find(d => String(d.id) === String(id));
    if (!domain) throw new Error("Domain not found");
    return { ...domain };
  }
};
