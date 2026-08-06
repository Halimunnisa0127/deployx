import { useState, useEffect, useMemo, useCallback } from 'react';
import { githubApi } from '../api/githubApi';
import { githubService } from '../services/githubService';

export function useGithub() {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchRepositories = async () => {
      try {
        setIsLoading(true);
        const data = await githubApi.getRepositories();
        if (mounted) setRepositories(data);
      } catch (err) {
        console.error("Failed to fetch repositories", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchRepositories();
    return () => { mounted = false; };
  }, []);

  const filteredRepos = useMemo(() => {
    return githubService.filterRepositories(repositories, searchQuery);
  }, [repositories, searchQuery]);

  const handleAction = useCallback((action, repo) => {
    if (action === 'open') {
      window.open(repo.url, '_blank', 'noopener,noreferrer');
    } else if (action === 'sync') {
      setNotification({
        type: 'success',
        message: `Syncing repository ${repo.owner}/${repo.name}...`,
      });
      setTimeout(() => setNotification(null), 4000);
    } else {
      setNotification({
        type: 'info',
        message: `Opened options for ${repo.name}`,
      });
      setTimeout(() => setNotification(null), 3000);
    }
  }, []);

  return {
    repositories: filteredRepos,
    totalRepositories: repositories.length,
    searchQuery,
    setSearchQuery,
    isLoading,
    notification,
    setNotification,
    handleAction
  };
}
