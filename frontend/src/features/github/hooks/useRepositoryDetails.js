import { useState, useEffect, useCallback } from 'react';
import { githubApi } from '../api/githubApi';

export function useRepositoryDetails(id) {
  const [repository, setRepository] = useState(null);
  const [branches, setBranches] = useState([]);
  const [commits, setCommits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const [repoData, branchesData, commitsData] = await Promise.all([
          githubApi.getRepositoryDetails(id),
          githubApi.getBranches(id),
          githubApi.getCommits(id)
        ]);
        if (mounted) {
          setRepository(repoData);
          setBranches(branchesData);
          setCommits(commitsData);
        }
      } catch (err) {
        console.error("Failed to fetch repository details", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    if (id) fetchAll();
    return () => { mounted = false; };
  }, [id]);

  const handleSync = useCallback(() => {
    if (!repository) return;
    setNotification({
      type: 'success',
      message: `Triggered manual sync for ${repository.owner}/${repository.name}`,
    });
    setTimeout(() => setNotification(null), 4000);
  }, [repository]);

  const handleOpenGithub = useCallback(() => {
    if (repository?.url) window.open(repository.url, '_blank', 'noopener,noreferrer');
  }, [repository]);

  return {
    repository,
    branches,
    commits,
    isLoading,
    notification,
    setNotification,
    handleSync,
    handleOpenGithub
  };
}
