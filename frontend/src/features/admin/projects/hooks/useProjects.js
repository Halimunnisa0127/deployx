import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as projectsService from "../services/projectsService";
import { useAdminTable } from "../../shared/hooks/useAdminTable";

export function useProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const fetchData = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectsService.getProjects(params);
      setProjects(Array.isArray(data) ? data : (data?.projects || []));
    } catch (err) {
      setError(err.message || "Failed to load projects");
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    projectsService.getProjects()
      .then((data) => {
        if (!ignore) {
          setProjects(Array.isArray(data) ? data : (data?.projects || []));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message || "Failed to load projects");
          console.error("Failed to load projects:", err);
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const normalizeFramework = (fw) => {
    if (!fw) return '';
    const s = String(fw).toLowerCase().replace(/[^a-z0-9]/g, '');
    if (s.includes('react')) return 'React';
    if (s.includes('next')) return 'Next.js';
    if (s.includes('node')) return 'Node.js';
    return fw;
  };

  const isProjectActive = (p) => p && (p.status === 'live' || p.status === 'active' || p.status === 'building' || p.status === 'draft');

  const counts = useMemo(() => {
    const list = Array.isArray(projects) ? projects : [];
    const res = {
      all: list.length,
      active: 0,
      archived: 0,
      failed: 0,
      React: 0,
      "Next.js": 0,
      "Node.js": 0,
    };
    list.forEach((p) => {
      if (isProjectActive(p)) res.active++;
      if (p.status === "archived") res.archived++;
      if (p.status === "failed") res.failed++;
      const normFw = normalizeFramework(p.framework);
      if (res[normFw] !== undefined) res[normFw]++;
    });
    return res;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const list = Array.isArray(projects) ? projects : [];
    return list.filter((p) => {
      if (!p) return false;
      if (activeFilter === "active" && !isProjectActive(p)) return false;
      if (activeFilter === "archived" && p.status !== "archived") return false;
      if (activeFilter === "failed" && p.status !== "failed") return false;
      if (activeFilter === "React" && normalizeFramework(p.framework) !== "React") return false;
      if (activeFilter === "Next.js" && normalizeFramework(p.framework) !== "Next.js") return false;
      if (activeFilter === "Node.js" && normalizeFramework(p.framework) !== "Node.js") return false;
      return true;
    });
  }, [projects, activeFilter]);

  const tableParams = useAdminTable({
    data: filteredProjects,
    searchKeys: ["name", "slug", "owner", "owner.fullName", "owner.email", "framework", "domainUrl"],
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
    navigate("/admin/deployments");
  };

  const handleOpenDomains = (project) => {
    navigate("/admin/domains");
  };

  const handleOpenProject = (project) => {
    if (!project) return;
    const domain = project.connectedDomain || project.domainUrl;
    if (domain) {
      const url = domain.startsWith("http://") || domain.startsWith("https://") ? domain : `https://${domain}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      navigate(`/dashboard/projects/${project.id || project._id}`);
    }
  };

  const handleArchiveProject = async (project) => {
    const id = project?.id || project?._id;
    if (!id) return;
    await projectsService.archiveProject(id);
    fetchData(); 
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const id = projectToDelete?.id || projectToDelete?._id;
    if (id) {
      await projectsService.deleteProject(id);
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
      if (selectedProject?.id === id || selectedProject?._id === id) {
        setIsDrawerOpen(false);
      }
      fetchData();
    }
  };

  const actionHandlers = {
    onView: handleRowClick,
    onOpenDeployments: handleOpenDeployments,
    onOpenDomains: handleOpenDomains,
    onOpenProject: handleOpenProject,
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
    fetchData,
    refresh: () => fetchData(),
  };
}
