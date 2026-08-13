import { useState } from 'react';
import { deploymentsApi } from '../api/deploymentsApi';

export function useDeploymentMutations() {
  const [isCreating, setIsCreating] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const createDeployment = async (deploymentData) => {
    try {
      setIsCreating(true);
      const response = await deploymentsApi.createDeployment(deploymentData);
      return response.data.deployment;
    } catch (err) {
      console.error("Failed to create deployment", err);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const cancelDeployment = async (id) => {
    try {
      setIsCancelling(true);
      const response = await deploymentsApi.cancelDeployment(id);
      return response.data.deployment;
    } catch (err) {
      console.error("Failed to cancel deployment", err);
      throw err;
    } finally {
      setIsCancelling(false);
    }
  };

  const promoteDeployment = async (id) => {
    try {
      const response = await deploymentsApi.promoteDeployment(id);
      return response.data?.deployment || response.deployment;
    } catch (err) {
      console.error("Failed to promote deployment", err);
      throw err;
    }
  };

  const rollbackDeployment = async (id) => {
    try {
      const response = await deploymentsApi.rollbackDeployment(id);
      return response.data?.deployment || response.deployment;
    } catch (err) {
      console.error("Failed to rollback deployment", err);
      throw err;
    }
  };

  return {
    createDeployment,
    cancelDeployment,
    promoteDeployment,
    rollbackDeployment,
    isCreating,
    isCancelling,
  };
}
