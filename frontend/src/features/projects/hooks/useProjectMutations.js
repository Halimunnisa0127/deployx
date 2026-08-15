import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsService } from '../services/projects.service';

export function useProjectMutations() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const updateProject = async (id, data, onSuccess) => {
    setIsUpdating(true);
    setError(null);
    try {
      const updatedProject = await projectsService.updateProject(id, data);
      if (onSuccess) {
        onSuccess(updatedProject);
      }
      return updatedProject;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update project';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteProject = async (id, onSuccess) => {
    setIsDeleting(true);
    setError(null);
    try {
      await projectsService.deleteProject(id);
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard/projects');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete project';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    updateProject,
    deleteProject,
    isUpdating,
    isDeleting,
    error,
  };
}
