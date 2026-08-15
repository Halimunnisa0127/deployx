import api from "../../../../lib/axios";

export const fetchProjects = async () => {
  const response = await api.get("/admin/projects");
  return response.data.data.projects;
};

export const fetchProjectById = async (id) => {
  const response = await api.get(`/admin/projects/${id}`);
  return response.data.data.project;
};

export const archiveProjectApi = async (id) => {
  const response = await api.post(`/admin/projects/${id}/archive`);
  return response.data.data;
};

export const deleteProjectApi = async (id) => {
  const response = await api.delete(`/admin/projects/${id}`);
  return response.data;
};

export const exportProjectsApi = async () => {
  const response = await api.post("/admin/projects/export");
  return response.data;
};
