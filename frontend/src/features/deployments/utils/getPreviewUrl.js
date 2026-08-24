import api from '../../../lib/axios';
import { env } from '../../../config/env';

export const getCleanPreviewUrl = (deploymentId) => {
  if (!deploymentId) return '';
  const baseUrl = (env.API_BASE_URL || import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
  return `${baseUrl}/deployments/${deploymentId}/site/`;
};

export const openPreview = async (deploymentId) => {
  if (!deploymentId) return;

  // 1. Open a blank tab synchronously to prevent popup blockers
  const newTab = window.open('about:blank', '_blank', 'noopener,noreferrer');
  
  try {
    // 2. Authenticate the session and get the HttpOnly cookie set securely
    await api.post(`/deployments/${deploymentId}/preview-auth`);
    
    // 3. Navigate the already-open tab to the clean preview URL
    const url = getCleanPreviewUrl(deploymentId);
    if (newTab) {
      newTab.location.href = url;
    }
  } catch (error) {
    console.error('Failed to authenticate preview session', error);
    if (newTab) {
      newTab.close();
    }
    // Optionally trigger a toast notification here
  }
};
