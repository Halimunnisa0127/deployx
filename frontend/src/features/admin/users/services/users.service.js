const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let mockUsers = [
  {
    id: "usr_1",
    name: "Alice Smith",
    email: "alice@deployx.dev",
    role: "admin",
    status: "active",
    projectsCount: 12,
    joinedAt: "2025-01-15T08:30:00Z",
    recentProjects: ["ecommerce-frontend", "auth-api", "admin-dashboard"],
    recentDeployments: ["dep_102", "dep_098", "dep_075"],
  },
  {
    id: "usr_2",
    name: "Bob Jones",
    email: "bob@deployx.dev",
    role: "developer",
    status: "active",
    projectsCount: 5,
    joinedAt: "2025-03-22T14:15:00Z",
    recentProjects: ["marketing-site", "blog-static"],
    recentDeployments: ["dep_115", "dep_101"],
  },
  {
    id: "usr_3",
    name: "Charlie Brown",
    email: "charlie@deployx.dev",
    role: "viewer",
    status: "suspended",
    projectsCount: 2,
    joinedAt: "2024-11-10T09:45:00Z",
    recentProjects: ["internal-docs"],
    recentDeployments: [],
  },
  {
    id: "usr_4",
    name: "Diana Prince",
    email: "diana@deployx.dev",
    role: "developer",
    status: "active",
    projectsCount: 8,
    joinedAt: "2026-02-05T11:20:00Z",
    recentProjects: ["payment-service", "user-service", "notification-worker"],
    recentDeployments: ["dep_120", "dep_118", "dep_112"],
  },
  {
    id: "usr_5",
    name: "Evan Wright",
    email: "evan@deployx.dev",
    role: "admin",
    status: "pending",
    projectsCount: 0,
    joinedAt: "2026-07-20T16:00:00Z",
    recentProjects: [],
    recentDeployments: [],
  },
  {
    id: "usr_6",
    name: "Fiona Gallagher",
    email: "fiona@deployx.dev",
    role: "developer",
    status: "active",
    projectsCount: 15,
    joinedAt: "2024-05-18T10:10:00Z",
    recentProjects: ["core-api", "mobile-app", "web-client"],
    recentDeployments: ["dep_125", "dep_122", "dep_119"],
  },
  {
    id: "usr_7",
    name: "George Miller",
    email: "george@deployx.dev",
    role: "viewer",
    status: "active",
    projectsCount: 1,
    joinedAt: "2026-01-12T13:30:00Z",
    recentProjects: ["metrics-dashboard"],
    recentDeployments: [],
  },
];

export const getUsers = async () => {
  await wait(600);
  return [...mockUsers];
};

export const getUser = async (id) => {
  await wait(400);
  const user = mockUsers.find((u) => u.id === id);
  if (!user) throw new Error("User not found");
  return { ...user };
};

export const createUser = async (data) => {
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
  mockUsers = [newUser, ...mockUsers];
  return newUser;
};

export const updateUser = async (id, data) => {
  await wait(600);
  mockUsers = mockUsers.map((user) =>
    user.id === id ? { ...user, ...data } : user,
  );
  return mockUsers.find((u) => u.id === id);
};

export const deleteUser = async (id) => {
  await wait(700);
  mockUsers = mockUsers.filter((user) => user.id !== id);
  return { success: true };
};

export const changeRole = async (id, role) => {
  return updateUser(id, { role });
};

export const suspendUser = async (id) => {
  return updateUser(id, { status: "suspended" });
};

export const activateUser = async (id) => {
  return updateUser(id, { status: "active" });
};

export const resetPassword = async (id) => {
  await wait(800);
  return { success: true, message: "Password reset email sent" };
};
