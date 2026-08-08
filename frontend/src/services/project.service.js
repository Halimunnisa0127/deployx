import { checkProjectNameApi, createProjectApi, fetchProjectsApi } from '../features/project-creation/api/projectCreation.api';

export const projectService = {
  checkNameAvailability: checkProjectNameApi,
  createProject: createProjectApi,
  getProjects: fetchProjectsApi,
};

export default projectService;
