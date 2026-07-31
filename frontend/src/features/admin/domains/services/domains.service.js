const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let mockDomains = [
  {
    id: "dom_101",
    name: "shop.deployx.dev",
    project: "ecommerce-frontend",
    owner: "Alice Smith",
    environment: "production",
    sslStatus: "active",
    verificationStatus: "verified",
    provider: "Cloudflare",
    createdAt: "2026-06-15T10:00:00Z",
    lastVerified: "2026-07-29T10:00:00Z",
  },
  {
    id: "dom_102",
    name: "auth-staging.deployx.dev",
    project: "auth-api",
    owner: "Alice Smith",
    environment: "staging",
    sslStatus: "expiring",
    verificationStatus: "verified",
    provider: "AWS Route53",
    createdAt: "2026-06-20T07:15:00Z",
    lastVerified: "2026-07-28T08:15:00Z",
  },
  {
    id: "dom_103",
    name: "admin.deployx.dev",
    project: "admin-dashboard",
    owner: "Diana Prince",
    environment: "production",
    sslStatus: "active",
    verificationStatus: "failed",
    provider: "Vercel",
    createdAt: "2026-07-25T14:30:00Z",
    lastVerified: "2026-07-30T09:00:00Z",
  },
  {
    id: "dom_104",
    name: "pr-12-legacy.deployx.dev",
    project: "legacy-app",
    owner: "Bob Jones",
    environment: "preview",
    sslStatus: "pending",
    verificationStatus: "pending",
    provider: "Netlify",
    createdAt: "2026-07-30T08:05:00Z",
    lastVerified: null,
  },
  {
    id: "dom_105",
    name: "marketing.deployx.dev",
    project: "marketing-site",
    owner: "Fiona Gallagher",
    environment: "production",
    sslStatus: "expired",
    verificationStatus: "verified",
    provider: "Cloudflare",
    createdAt: "2025-01-10T09:40:00Z",
    lastVerified: "2026-07-01T10:00:00Z",
  },
];

export const getDomains = async () => {
  await wait(600);
  return [...mockDomains];
};

export const getDomain = async (id) => {
  await wait(400);
  const domain = mockDomains.find((d) => d.id === id);
  if (!domain) throw new Error("Domain not found");
  return { ...domain };
};

export const getDNSRecords = async (id) => {
  await wait(300);
  return [
    { type: "A", name: "@", value: "76.76.21.21", status: "valid" },
    { type: "CNAME", name: "www", value: "cname.deployx.dev", status: "valid" },
    {
      type: "TXT",
      name: "_deployx-challenge",
      value: "dx-verify-abc123xyz",
      status: "pending",
    },
  ];
};

export const getSSLInfo = async (id) => {
  await wait(300);
  const domain = mockDomains.find((d) => d.id === id);
  const statusMap = {
    active: {
      status: "Active",
      issued: "2026-05-01",
      expiry: "2026-08-01",
      daysRemaining: 2,
    },
    expiring: {
      status: "Expiring Soon",
      issued: "2026-05-05",
      expiry: "2026-08-05",
      daysRemaining: 6,
    },
    expired: {
      status: "Expired",
      issued: "2026-03-01",
      expiry: "2026-06-01",
      daysRemaining: 0,
    },
    pending: {
      status: "Pending Issuance",
      issued: null,
      expiry: null,
      daysRemaining: null,
    },
  };
  return {
    provider: "Let's Encrypt",
    autoRenew: true,
    ...statusMap[domain?.sslStatus || "active"],
  };
};

export const getVerificationHistory = async (id) => {
  await wait(300);
  return [
    {
      time: "2026-07-29T10:00:00Z",
      status: "success",
      message: "DNS records verified successfully",
    },
    {
      time: "2026-07-29T09:55:00Z",
      status: "failed",
      message: "Missing TXT record _deployx-challenge",
    },
    {
      time: "2026-07-29T09:50:00Z",
      status: "pending",
      message: "Verification initiated",
    },
  ];
};

export const verifyDomain = async (id) => {
  await wait(800);
  mockDomains = mockDomains.map((d) =>
    d.id === id ? { ...d, verificationStatus: "verified" } : d,
  );
  return { success: true, message: "Domain verification queued" };
};

export const refreshDomain = async (id) => {
  await wait(600);
  return { success: true, message: "DNS records refreshed" };
};

export const removeDomain = async (id) => {
  await wait(800);
  mockDomains = mockDomains.filter((d) => d.id !== id);
  return { success: true };
};
