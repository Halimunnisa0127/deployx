import api from "../../../../lib/axios";

export const fetchUsers = async (params = {}) => {
  const response = await api.get("/admin/users", { params });
  return response.data?.data?.users || response.data?.data || [];
};

export const fetchUser = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data?.data?.user || response.data?.data;
};

export const postUser = async (data) => {
  const response = await api.post("/admin/users", data);
  return response.data?.data?.user || response.data?.data;
};

export const putUser = async (id, data) => {
  const response = await api.patch(`/admin/users/${id}`, data);
  return response.data.data.user;
};

export const removeUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const postResetPassword = async (id) => {
  const response = await api.post(`/admin/users/${id}/reset-password`);
  return response.data;
};
