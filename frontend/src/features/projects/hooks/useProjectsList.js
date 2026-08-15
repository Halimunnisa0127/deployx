import { useState, useEffect, useCallback } from 'react';
import { projectsService } from '../services/projects.service';

export function useProjectsList() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectsService.fetchProjects();
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, isLoading, error, refetch: fetchProjects };
}
