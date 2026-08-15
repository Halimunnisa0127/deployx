import { useState, useEffect, useCallback } from 'react';
import { domainsApi } from '../api/domainsApi';

export function useDomainDetails(id) {
  const [domain, setDomain] = useState(null);
  const [instructions, setInstructions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDomainAndInstructions = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const domainResponse = await domainsApi.getDomain(id);
      const d = domainResponse.data?.domain;
      if (d) {
        const mappedDomain = {
          id: d._id,
          name: d.hostname,
          projectName: 'DeployX Project',
          projectId: d.project,
          environment: d.targetType === 'production' ? 'Production' : 'Preview',
          status: d.verificationStatus, // 'verified', 'pending', 'failed'
          sslStatus: d.sslStatus === 'active' ? 'active' : 'pending',
          dnsStatus: d.verificationStatus === 'verified' ? 'verified' : 'pending',
          createdAt: new Date(d.createdAt).toLocaleDateString(),
          url: `https://${d.hostname}`,
          isLive: d.status === 'active',
        };
        setDomain(mappedDomain);

        // Fetch instructions
        const instructionsResponse = await domainsApi.getDomainInstructions(id);
        setInstructions(instructionsResponse.data?.instructions || null);
      }
    } catch (err) {
      console.error("Failed to fetch domain details", err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDomainAndInstructions();
  }, [fetchDomainAndInstructions]);

  const handleRefresh = useCallback(async () => {
    if (!domain) return;
    try {
      setIsVerifying(true);
      setNotification({
        type: 'success',
        message: `Refreshing DNS and verification status for ${domain.name}...`,
      });
      const verifyResult = await domainsApi.verifyDomain(id);
      const resData = verifyResult.data;
      if (resData?.verified) {
        setNotification({
          type: 'success',
          message: 'DNS verification completed successfully!',
        });
      } else {
        setNotification({
          type: 'warning',
          message: resData?.message || 'DNS verification record was not found yet. Please check your setup and try again.',
        });
      }
      fetchDomainAndInstructions();
    } catch (err) {
      console.error("Verification failed", err);
      setNotification({
        type: 'warning',
        message: err.response?.data?.message || 'DNS verification could not be completed. Please try again.',
      });
    } finally {
      setIsVerifying(false);
    }
  }, [id, domain, fetchDomainAndInstructions]);

  const handleCopy = useCallback((text) => {
    if (text) navigator.clipboard.writeText(text);
    setNotification({
      type: 'success',
      message: 'Copied to clipboard!',
    });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleOpenDomain = useCallback(() => {
    if (domain && domain.url) window.open(domain.url, '_blank', 'noopener,noreferrer');
  }, [domain]);

  const handleRemove = useCallback(async (onSuccess) => {
    if (!domain) return;
    try {
      setIsDeleting(true);
      setNotification({
        type: 'warning',
        message: `Removing custom domain ${domain.name}...`,
      });
      await domainsApi.deleteDomain(id);
      setNotification({
        type: 'success',
        message: 'Domain removed successfully.',
      });
      if (onSuccess) {
        setTimeout(onSuccess, 1000);
      }
    } catch (err) {
      console.error("Removal failed", err);
      setNotification({
        type: 'warning',
        message: 'Failed to remove domain. Please try again.',
      });
    } finally {
      setIsDeleting(false);
    }
  }, [id, domain]);

  return {
    domain,
    instructions,
    isLoading,
    isVerifying,
    isDeleting,
    notification,
    setNotification,
    handleRefresh,
    handleCopy,
    handleOpenDomain,
    handleRemove,
    refetch: fetchDomainAndInstructions
  };
}
