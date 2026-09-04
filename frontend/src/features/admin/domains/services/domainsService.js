import * as domainsApi from "../api/domainsApi";

export const getDomains = async (params) => {
  return await domainsApi.fetchDomains(params);
};

export const getDomain = async (id) => {
  return await domainsApi.fetchDomain(id);
};

export const getDNSRecords = async (id) => {
  return await domainsApi.fetchDNSRecords(id);
};

export const getDomainInstructions = async (id) => {
  return await domainsApi.fetchDomainInstructions(id);
};

export const getSSLInfo = async (id) => {
  return await domainsApi.fetchSSLInfo(id);
};

export const getVerificationHistory = async (id) => {
  return await domainsApi.fetchVerificationHistory(id);
};

export const verifyDomain = async (id) => {
  return await domainsApi.verifyDomainApi(id);
};

export const refreshDomain = async (id) => {
  return await domainsApi.refreshDomainApi(id);
};

export const removeDomain = async (id) => {
  return await domainsApi.removeDomainApi(id);
};
