import * as usersApi from "../api/usersApi";

export const getUsers = async () => {
  return await usersApi.fetchUsers();
};

export const getUser = async (id) => {
  return await usersApi.fetchUser(id);
};

export const createUser = async (data) => {
  return await usersApi.postUser(data);
};

export const updateUser = async (id, data) => {
  return await usersApi.putUser(id, data);
};

export const deleteUser = async (id) => {
  return await usersApi.removeUser(id);
};

export const changeRole = async (id, role) => {
  return await usersApi.putUser(id, { role });
};

export const suspendUser = async (id) => {
  return await usersApi.putUser(id, { status: "suspended" });
};

export const activateUser = async (id) => {
  return await usersApi.putUser(id, { status: "active" });
};

export const resetPassword = async (id) => {
  return await usersApi.postResetPassword(id);
};
