import { mockProjects } from "../data/projectsData";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let currentProjects = [...mockProjects];

export const fetchProjects = async () => {
  await wait(600);
  return [...currentProjects];
};

export const fetchProjectById = async (id) => {
  await wait(400);
  const project = currentProjects.find((p) => p.id === id);
  if (!project) throw new Error("Project not found");
  return { ...project };
};

export const archiveProjectApi = async (id) => {
  await wait(700);
  currentProjects = currentProjects.map((project) =>
    project.id === id ? { ...project, status: "archived" } : project
  );
  return currentProjects.find((p) => p.id === id);
};

export const deleteProjectApi = async (id) => {
  await wait(800);
  currentProjects = currentProjects.filter((project) => project.id !== id);
  return { success: true };
};

export const exportProjectsApi = async () => {
  await wait(1000);
  return { success: true, message: "Exported projects.csv successfully" };
};
