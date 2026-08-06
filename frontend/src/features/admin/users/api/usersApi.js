import { mockUsers, setMockUsers } from "../data/usersData";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchUsers = async () => {
  await wait(600);
  return [...mockUsers];
};

export const fetchUser = async (id) => {
  await wait(400);
  const user = mockUsers.find((u) => u.id === id);
  if (!user) throw new Error("User not found");
  return { ...user };
};

export const postUser = async (data) => {
  await wait(800);
  const newUser = {
    id: `usr_${Date.now()}`,
    ...data,
    status: data.status || "pending",
    projectsCount: 0,
    joinedAt: new Date().toISOString(),
    recentProjects: [],
    recentDeployments: [],
  };
  setMockUsers([newUser, ...mockUsers]);
  return newUser;
};

export const putUser = async (id, data) => {
  await wait(600);
  const newUsers = mockUsers.map((user) =>
    user.id === id ? { ...user, ...data } : user,
  );
  setMockUsers(newUsers);
  return newUsers.find((u) => u.id === id);
};

export const removeUser = async (id) => {
  await wait(700);
  setMockUsers(mockUsers.filter((user) => user.id !== id));
  return { success: true };
};

export const postResetPassword = async (id) => {
  await wait(800);
  return { success: true, message: "Password reset email sent" };
};
