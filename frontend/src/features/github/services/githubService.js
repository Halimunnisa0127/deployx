export const githubService = {
  filterRepositories: (repositories, searchQuery) => {
    const query = searchQuery.trim().toLowerCase();
    
    return repositories.filter((repo) => {
      if (query) {
        return repo.name.toLowerCase().includes(query) || repo.owner.toLowerCase().includes(query);
      }
      return true;
    });
  }
};
