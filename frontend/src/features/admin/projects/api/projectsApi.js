import api from "../../../../lib/axios";

export const fetchProjects = async (params = {}) => {
  const response = await api.get("/admin/projects", { params });
  return response.data?.data?.projects || response.data?.data || [];
};

export const fetchProjectById = async (id) => {
  const response = await api.get(`/admin/projects/${id}`);
  return response.data?.data?.project || response.data?.data;
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
