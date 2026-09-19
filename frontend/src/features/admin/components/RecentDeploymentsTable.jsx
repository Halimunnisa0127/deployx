import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Clock, Calendar, Rocket, ArrowUpRight } from "lucide-react";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";

const formatCreatedAt = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return (
      d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      ", " +
      d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    );
  } catch {
    return String(dateStr);
  }
};

export default function RecentDeploymentsTable({ deployments = [] }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(deployments.length / itemsPerPage);
  const paginatedData = deployments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (!deployments.length) {
    return (
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <Rocket className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-theme-heading">No deployments in this period</h3>
          <p className="text-xs text-theme-muted max-w-sm">
            No deployments were created or triggered during the selected time window in the database.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h3 className="text-base font-bold text-theme-heading tracking-tight">
          Recent Deployments
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/deployments")}
          iconRight={<ArrowUpRight className="w-3.5 h-3.5" />}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          View All Deployments
        </Button>
      </div>

      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-muted-foreground border-b border-border text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3">Project</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Region</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Created Time</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.map((dep) => (
              <tr
                key={dep.id}
                onClick={() => navigate("/admin/deployments")}
                className="group hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-theme-heading group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors truncate text-xs sm:text-sm">
                      {dep.project}
                    </span>
                    <span className="font-mono text-[10px] text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                      {String(dep.id).slice(-6)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <Badge status={dep.status} type="deployment" />
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-theme-secondary text-xs">{dep.region}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center gap-1.5 text-theme-secondary bg-muted px-2 py-0.5 rounded border border-border font-mono text-[11px]">
                    <Clock className="w-3 h-3 text-amber-500 dark:text-amber-400 shrink-0" />
                    {dep.duration}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-muted-foreground text-xs whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {formatCreatedAt(dep.createdAt)}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/admin/deployments")}
                    iconLeft={<Eye className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />}
                    className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 text-xs py-1 px-2.5 h-auto"
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
        <div className="px-5 py-3.5 border-t border-border flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
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




