/**
 * Maps a raw GitHub branch response to the DeployX standard format.
 * @param {Object} rawBranch - The raw branch object from GitHub API.
 * @param {string} defaultBranch - The repository's default branch name (to flag it).
 * @returns {Object} Normalized branch object.
 */
exports.mapBranch = (rawBranch, defaultBranch = '') => {
  if (!rawBranch) return null;

  return {
    name: rawBranch.name,
    isDefault: rawBranch.name === defaultBranch,
    commitSha: rawBranch.commit?.sha || '',
  };
};

/**
 * Maps an array of raw GitHub branch responses.
 */
exports.mapBranches = (rawBranches, defaultBranch = '') => {
  if (!Array.isArray(rawBranches)) return [];
  return rawBranches.map((branch) => this.mapBranch(branch, defaultBranch));
};
