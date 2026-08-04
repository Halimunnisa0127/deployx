import { mockDomains, mockDNSRecords, mockVerificationHistory, sslStatusMap } from "../data/domainsData";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let currentDomains = [...mockDomains];

export const fetchDomains = async () => {
  await wait(600);
  return [...currentDomains];
};

export const fetchDomain = async (id) => {
  await wait(400);
  const domain = currentDomains.find((d) => d.id === id);
  if (!domain) throw new Error("Domain not found");
  return { ...domain };
};

export const fetchDNSRecords = async (id) => {
  await wait(300);
  return [...mockDNSRecords];
};

export const fetchSSLInfo = async (id) => {
  await wait(300);
  const domain = currentDomains.find((d) => d.id === id);
  return {
    provider: "Let's Encrypt",
    autoRenew: true,
    ...sslStatusMap[domain?.sslStatus || "active"],
  };
};

export const fetchVerificationHistory = async (id) => {
  await wait(300);
  return [...mockVerificationHistory];
};

export const verifyDomainApi = async (id) => {
  await wait(800);
  currentDomains = currentDomains.map((d) =>
    d.id === id ? { ...d, verificationStatus: "verified" } : d
  );
  return { success: true, message: "Domain verification queued" };
};

export const refreshDomainApi = async (id) => {
  await wait(600);
  return { success: true, message: "DNS records refreshed" };
};

export const removeDomainApi = async (id) => {
  await wait(800);
  currentDomains = currentDomains.filter((d) => d.id !== id);
  return { success: true };
};
