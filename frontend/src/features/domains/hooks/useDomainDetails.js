import { useState, useEffect, useCallback } from 'react';
import { domainsApi } from '../api/domainsApi';

export function useDomainDetails(id) {
  const [domain, setDomain] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchDomain = async () => {
      try {
        setIsLoading(true);
        const data = await domainsApi.getDomainDetails(id);
        if (mounted) setDomain(data);
      } catch (err) {
        console.error("Failed to fetch domain details", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    if (id) fetchDomain();
    return () => { mounted = false; };
  }, [id]);

  const handleRefresh = useCallback(() => {
    if (!domain) return;
    setNotification({
      type: 'success',
      message: `Refreshing DNS and SSL status for ${domain.name}`,
    });
    setTimeout(() => setNotification(null), 4000);
  }, [domain]);

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

  const handleRemove = useCallback(() => {
    if (!domain) return;
    setNotification({
      type: 'warning',
      message: `Initiated removal for domain ${domain.name}`,
    });
    setTimeout(() => setNotification(null), 4000);
  }, [domain]);

  return {
    domain,
    isLoading,
    notification,
    setNotification,
    handleRefresh,
    handleCopy,
    handleOpenDomain,
    handleRemove
  };
}
