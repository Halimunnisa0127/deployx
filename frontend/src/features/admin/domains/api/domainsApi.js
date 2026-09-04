import api from "../../../../lib/axios";

export const fetchDomains = async (params = {}) => {
  const response = await api.get("/admin/domains", { params });
  return response.data?.data?.domains || response.data?.data || [];
};

export const fetchDomain = async (id) => {
  const response = await api.get(`/admin/domains/${id}`);
  return response.data?.data?.domain || response.data?.data;
};

export const fetchDNSRecords = async (id) => {
  try {
    const response = await api.get(`/admin/domains/${id}/dns`);
    return response.data?.data?.records || [];
  } catch (error) {
    console.error("Failed to fetch DNS records:", error);
    return [];
  }
};

export const fetchDomainInstructions = async (id) => {
  try {
    const response = await api.get(`/admin/domains/${id}/instructions`);
    return response.data?.data?.instructions || response.data?.data || null;
  } catch (error) {
    console.error("Failed to fetch domain instructions:", error);
    return null;
  }
};

export const fetchSSLInfo = async (id) => {
  try {
    const domain = await fetchDomain(id);
    const status = domain?.sslStatus || "not_configured";
    
    let statusLabel = "Not Configured";
    if (status === "active") statusLabel = "Configured";
    else if (status === "pending") statusLabel = "Pending Configuration";
    else if (status === "expiring") statusLabel = "Expiring Soon";
    else if (status === "failed") statusLabel = "Configuration Failed";

    return {
      provider: domain?.name?.endsWith(".deployx.app") ? "Let's Encrypt (DeployX Automated)" : "Custom SSL Certificate",
      status: statusLabel,
      rawStatus: status,
      autoRenew: status === "active",
      issued: domain?.lastVerified || domain?.createdAt || null,
      expiry: domain?.lastVerified ? new Date(new Date(domain.lastVerified).getTime() + 90 * 24 * 60 * 60 * 1000).toISOString() : null,
      daysRemaining: domain?.lastVerified ? Math.max(0, Math.floor((new Date(domain.lastVerified).getTime() + 90 * 24 * 60 * 60 * 1000 - Date.now()) / (1000 * 60 * 60 * 24))) : null,
    };
  } catch (error) {
    console.error("Failed to fetch SSL info:", error);
    return {
      provider: "Not available",
      status: "Not Configured",
      rawStatus: "not_configured",
      autoRenew: false,
      issued: null,
      expiry: null,
      daysRemaining: null,
    };
  }
};

export const fetchVerificationHistory = async (id) => {
  try {
    const domain = await fetchDomain(id);
    const history = [];

    if (domain?.lastVerified) {
      history.push({
        time: domain.lastVerified,
        status: "success",
        message: "DNS TXT records verified successfully",
      });
    }

    if (domain?.verificationStatus === "failed") {
      history.push({
        time: domain.updatedAt || domain.createdAt,
        status: "failed",
        message: "DNS verification record was not found or timed out",
      });
    }

    if (domain?.createdAt) {
      history.push({
        time: domain.createdAt,
        status: "pending",
        message: "Domain registered on platform. Verification challenge generated.",
      });
    }

    return history;
  } catch (error) {
    console.error("Failed to fetch verification history:", error);
    return [];
  }
};

export const verifyDomainApi = async (id) => {
  const response = await api.post(`/admin/domains/${id}/verify`);
  return response.data;
};

export const refreshDomainApi = async (id) => {
  const response = await api.post(`/admin/domains/${id}/verify`);
  return response.data;
};

export const removeDomainApi = async (id) => {
  const response = await api.delete(`/admin/domains/${id}`);
  return response.data;
};
