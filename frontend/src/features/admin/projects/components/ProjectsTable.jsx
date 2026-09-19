import { useState, useEffect } from "react";
import ProjectRow from "./ProjectRow";
import Button from "../../../../components/ui/Button";

export default function ProjectsTable({
  projects = [],
  onRowClick,
  actionHandlers,
}) {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(safeProjects.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedData = safeProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (!safeProjects.length) return null;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm animate-in fade-in duration-300">
      <div className="overflow-x-auto min-h-[300px] scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-muted/40 text-muted-foreground border-b border-border sticky top-0 z-10 text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3">Project</th>
              <th className="px-5 py-3">Owner</th>
              <th className="px-5 py-3">Framework</th>
              <th className="px-5 py-3">Environment</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Region</th>
              <th className="px-5 py-3">Created Date</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.map((project) => (
              <ProjectRow
                key={project.id || project._id}
                project={project}
                onRowClick={onRowClick}
                {...actionHandlers}
              />
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-5 py-3.5 border-t border-border flex items-center justify-between text-xs bg-muted/20">
          <span className="text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, safeProjects.length)} of{" "}
            {safeProjects.length}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-xs py-1 px-2.5 h-auto"
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="text-xs py-1 px-2.5 h-auto"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
