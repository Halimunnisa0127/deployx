import { useState, useEffect, useMemo, useCallback } from "react";
import * as projectsService from "../services/projectsService";
import { useAdminTable } from "../../shared/hooks/useAdminTable";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectsService.getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.message || "Failed to load projects");
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const counts = useMemo(() => {
    const res = {
      all: projects.length,
      active: 0,
      archived: 0,
      failed: 0,
      React: 0,
      "Next.js": 0,
      "Node.js": 0,
    };
    projects.forEach((p) => {
      if (res[p.status] !== undefined) res[p.status]++;
      if (res[p.framework] !== undefined) res[p.framework]++;
    });
    return res;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (activeFilter === "active" && p.status !== "active") return false;
      if (activeFilter === "archived" && p.status !== "archived") return false;
      if (activeFilter === "failed" && p.status !== "failed") return false;
      if (activeFilter === "React" && p.framework !== "React") return false;
      if (activeFilter === "Next.js" && p.framework !== "Next.js") return false;
      if (activeFilter === "Node.js" && p.framework !== "Node.js") return false;
      return true;
    });
  }, [projects, activeFilter]);

  const tableParams = useAdminTable({
    data: filteredProjects,
    searchKeys: ["name", "owner"],
    itemsPerPage: 10,
    idKey: "id",
  });

  const handleExport = async () => {
    try {
      await projectsService.exportProjects();
      alert("Projects exported successfully!");
    } catch (error) {
      console.error("Failed to export projects", error);
    }
  };

  const handleRowClick = (project) => {
    setSelectedProject(project);
    setIsDrawerOpen(true);
  };

  const handleOpenDeployments = (project) => {
    console.log("Open Deployments for", project.name);
  };

  const handleOpenDomains = (project) => {
    console.log("Open Domains for", project.name);
  };

  const handleArchiveProject = async (project) => {
    await projectsService.archiveProject(project.id);
    fetchData(); 
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (projectToDelete) {
      await projectsService.deleteProject(projectToDelete.id);
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
      if (selectedProject?.id === projectToDelete.id) {
        setIsDrawerOpen(false);
      }
      fetchData();
    }
  };

  const actionHandlers = {
    onView: handleRowClick,
    onOpenDeployments: handleOpenDeployments,
    onOpenDomains: handleOpenDomains,
    onArchive: handleArchiveProject,
    onDelete: handleDeleteClick,
  };

  return {
    projects,
    loading,
    error,
    activeFilter,
    setActiveFilter,
    counts,
    handleExport,
    tableParams,
    selectedProject,
    isDrawerOpen,
    setIsDrawerOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    projectToDelete,
    handleConfirmDelete,
    actionHandlers,
  };
}
