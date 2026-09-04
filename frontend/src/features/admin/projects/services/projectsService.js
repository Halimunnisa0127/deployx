import {
  fetchProjects,
  fetchProjectById,
  archiveProjectApi,
  deleteProjectApi,
  exportProjectsApi,
} from "../api/projectsApi";

export const getProjects = async (params = {}) => {
  return await fetchProjects(params);
};

export const getProject = async (id) => {
  return await fetchProjectById(id);
};

export const archiveProject = async (id) => {
  return await archiveProjectApi(id);
};

export const deleteProject = async (id) => {
  return await deleteProjectApi(id);
};

export const exportProjects = async () => {
  return await exportProjectsApi();
};
