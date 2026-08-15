import * as projectsApi from '../api/projects.api';

class ProjectsService {
  async fetchProjects() {
    const response = await projectsApi.fetchProjectsApi();
    return response.data?.projects || [];
  }

  async getProject(id) {
    const response = await projectsApi.getProjectApi(id);
    return response.data?.project || null;
  }

  async updateProject(id, data) {
    const response = await projectsApi.updateProjectApi(id, data);
    return response.data?.project || null;
  }

  async deleteProject(id) {
    const response = await projectsApi.deleteProjectApi(id);
    return response.data || true;
  }
}

export const projectsService = new ProjectsService();
