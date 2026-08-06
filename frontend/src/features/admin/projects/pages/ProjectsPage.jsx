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
import { useProjects } from "../hooks/useProjects";

export default function ProjectsPage() {
  const {
    projects,
    loading,
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
  } = useProjects();

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
          value={tableParams.search.query}
          onChange={(e) => tableParams.search.setQuery(e.target.value)}
          onClear={() => tableParams.search.setQuery("")}
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
      ) : tableParams.tableData.length === 0 ? (
        activeFilter === "active" ? (
          <NoActiveProjectsEmptyState onClear={() => setActiveFilter("all")} />
        ) : activeFilter === "archived" ? (
          <NoArchivedProjectsEmptyState
            onClear={() => setActiveFilter("all")}
          />
        ) : (
          <NoSearchResultsEmptyState
            onClear={() => {
              tableParams.search.setQuery("");
              setActiveFilter("all");
            }}
          />
        )
      ) : (
        <ProjectsTable
          projects={tableParams.search.searchedData}
          onRowClick={actionHandlers.onView}
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
