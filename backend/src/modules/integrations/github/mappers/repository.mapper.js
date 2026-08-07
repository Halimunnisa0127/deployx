/**
 * Maps a raw GitHub repository response to the DeployX standard format.
 * @param {Object} rawRepo - The raw repository object from GitHub API.
 * @returns {Object} Normalized repository object.
 */
exports.mapRepository = (rawRepo) => {
  if (!rawRepo) return null;

  return {
    id: String(rawRepo.id),
    name: rawRepo.name,
    fullName: rawRepo.full_name,
    owner: rawRepo.owner?.login || '',
    visibility: rawRepo.visibility || (rawRepo.private ? 'private' : 'public'),
    defaultBranch: rawRepo.default_branch || 'main',
    language: rawRepo.language || 'Unknown',
    description: rawRepo.description || '',
    cloneUrl: rawRepo.clone_url,
    sshUrl: rawRepo.ssh_url,
    isPrivate: Boolean(rawRepo.private),
    isArchived: Boolean(rawRepo.archived),
    isFork: Boolean(rawRepo.fork),
    pushedAt: rawRepo.pushed_at,
    updatedAt: rawRepo.updated_at,
  };
};

/**
 * Maps an array of raw GitHub repository responses.
 */
exports.mapRepositories = (rawRepos) => {
  if (!Array.isArray(rawRepos)) return [];
  return rawRepos.map(this.mapRepository);
};
