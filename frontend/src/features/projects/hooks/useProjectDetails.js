import { useState, useEffect, useCallback } from 'react';
import { projectsService } from '../services/projects.service';

export function useProjectDetails(id) {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
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
    let ignore = false;
    if (!id) {
      return;
    }
    projectsService.getProject(id)
      .then((data) => {
        if (!ignore) {
          setProject(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.response?.data?.message || err.message || 'Failed to fetch project');
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });
    return () => { ignore = true; };
  }, [id]);

  return { project, isLoading, error, refetch: fetchProject };
}
