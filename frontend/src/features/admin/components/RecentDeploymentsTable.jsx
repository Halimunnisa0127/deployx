import React, { useState } from "react";
import { Eye, Clock, Calendar } from "lucide-react";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";

export default function RecentDeploymentsTable({ deployments = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(deployments.length / itemsPerPage);
  const paginatedData = deployments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (!deployments.length) {
    return null; // Will show empty state in parent
  }

  return (
    <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-lg">
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <h3 className="text-lg font-bold text-theme-heading tracking-tight">
          Recent Deployments
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50/90 dark:bg-slate-900/90 text-theme-muted border-b border-slate-200 dark:border-slate-800/80 sticky top-0">
            <tr>
              <th className="px-5 py-3 font-medium">Project</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Region</th>
              <th className="px-5 py-3 font-medium">Duration</th>
              <th className="px-5 py-3 font-medium">Created Time</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
            {paginatedData.map((dep) => (
                <tr
                  key={dep.id}
                  className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-theme-heading group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                      {dep.project}
                    </span>
                    <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {dep.id}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Badge status={dep.status} type="deployment" />
                </td>
                <td className="px-5 py-4">
                  <span className="text-theme-secondary">{dep.region}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 text-theme-secondary bg-slate-100 dark:bg-slate-800/60 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700/40 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                    {dep.duration}
                  </span>
                </td>
                <td className="px-5 py-4 text-theme-muted text-xs">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-theme-muted" />
                    {new Date(dep.createdAt).toLocaleString()}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconLeft={<Eye className="w-4 h-4 text-indigo-400" />}
                    className="text-slate-300 hover:text-white"
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-sm">
          <span className="text-theme-muted">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, deployments.length)} of{" "}
            {deployments.length}
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
