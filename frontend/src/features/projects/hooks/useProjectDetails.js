import { useState, useEffect, useCallback } from 'react';
import { projectsService } from '../services/projects.service';

export function useProjectDetails(id) {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProject = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectsService.getProject(id);
      setProject(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch project');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return { project, isLoading, error, refetch: fetchProject };
}
