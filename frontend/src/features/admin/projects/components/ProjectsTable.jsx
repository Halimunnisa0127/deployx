import React, { useState } from "react";
import ProjectRow from "./ProjectRow";
import Button from "../../../../components/ui/Button";

export default function ProjectsTable({
  projects = [],
  onRowClick,
  actionHandlers,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const paginatedData = projects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (!projects.length) return null;

  return (
    <div className="bg-white dark:bg-slate-900/60 rounded-[18px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50/90 dark:bg-slate-900/90 text-theme-muted border-b border-slate-200 dark:border-slate-800/80 sticky top-0 z-10 backdrop-blur-xl">
            <tr>
              <th className="px-5 py-3 font-medium">Project</th>
              <th className="px-5 py-3 font-medium">Owner</th>
              <th className="px-5 py-3 font-medium">Framework</th>
              <th className="px-5 py-3 font-medium">Environment</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Region</th>
              <th className="px-5 py-3 font-medium">Created Date</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
            {paginatedData.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                onRowClick={onRowClick}
                {...actionHandlers}
              />
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-5 py-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-sm bg-slate-50 dark:bg-slate-900/40">
          <span className="text-theme-muted">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, projects.length)} of{" "}
            {projects.length}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
