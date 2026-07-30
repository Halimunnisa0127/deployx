import React, { useState, useEffect, useMemo } from "react";
import ProjectsHeader from "../components/ProjectsHeader";
import ProjectsStatisticsCards from "../components/ProjectsStatisticsCards";
import ProjectsFilters from "../components/ProjectsFilters";
import ProjectsTable from "../components/ProjectsTable";
import ProjectDetailsDrawer from "../components/ProjectDetailsDrawer";
import ConfirmationDialog from "../../../../components/ui/ConfirmationDialog";
import {
  ProjectsTableSkeleton,
  ProjectsStatisticsSkeleton,
} from "../components/ProjectsSkeleton";
import {
  NoProjectsEmptyState,
  NoSearchResultsEmptyState,
  NoActiveProjectsEmptyState,
  NoArchivedProjectsEmptyState,
} from "../components/ProjectsEmptyState";
import SearchBar from "../../../../components/common/SearchBar";
import {
  getProjects,
  archiveProject,
  deleteProject,
  exportProjects,
} from "../services/projects.service";

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setLoading(false);
    }
  };

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
    const query = searchQuery.trim().toLowerCase();
    return projects.filter((p) => {
      if (activeFilter === "active" && p.status !== "active") return false;
      if (activeFilter === "archived" && p.status !== "archived") return false;
      if (activeFilter === "failed" && p.status !== "failed") return false;
      if (activeFilter === "React" && p.framework !== "React") return false;
      if (activeFilter === "Next.js" && p.framework !== "Next.js") return false;
      if (activeFilter === "Node.js" && p.framework !== "Node.js") return false;
      if (query) {
        return (
          p.name.toLowerCase().includes(query) ||
          p.owner.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [projects, activeFilter, searchQuery]);

  const handleExport = async () => {
    try {
      await exportProjects();
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
    await archiveProject(project.id);
    fetchData(); // Simplistic re-fetch
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (projectToDelete) {
      await deleteProject(projectToDelete.id);
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

  return (
    <div className="space-y-6 md:space-y-8 pb-10 text-left animate-in fade-in duration-300">
      <ProjectsHeader onExport={handleExport} />

      {/* Top Statistics */}
      {loading ? (
        <ProjectsStatisticsSkeleton />
      ) : (
        <ProjectsStatisticsCards projects={projects} />
      )}

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <ProjectsFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />

        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
          placeholder="Search projects or owners..."
          shortcut="⌘K"
          size="md"
          className="w-full sm:w-72 shrink-0"
        />
      </div>

      {/* Table / Empty States */}
      {loading ? (
        <ProjectsTableSkeleton />
      ) : projects.length === 0 ? (
        <NoProjectsEmptyState />
      ) : filteredProjects.length === 0 ? (
        activeFilter === "active" ? (
          <NoActiveProjectsEmptyState onClear={() => setActiveFilter("all")} />
        ) : activeFilter === "archived" ? (
          <NoArchivedProjectsEmptyState
            onClear={() => setActiveFilter("all")}
          />
        ) : (
          <NoSearchResultsEmptyState
            onClear={() => {
              setSearchQuery("");
              setActiveFilter("all");
            }}
          />
        )
      ) : (
        <ProjectsTable
          projects={filteredProjects}
          onRowClick={handleRowClick}
          actionHandlers={actionHandlers}
        />
      )}

      {/* Deep Dive Drawer */}
      <ProjectDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        project={selectedProject}
        {...actionHandlers}
      />

      {/* Destructive Action Modal */}
      <ConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        message={`Are you sure you want to completely delete ${projectToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete Project"
      />
    </div>
  );
}
