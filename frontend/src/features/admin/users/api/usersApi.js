import api from "../../../../lib/axios";

export const fetchUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data.data.users;
};

export const fetchUser = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data.data.user;
};

export const postUser = async (data) => {
  const response = await api.post("/admin/users", data);
  return response.data.data.user;
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
