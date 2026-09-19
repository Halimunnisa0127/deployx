import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit2, Calendar, Users, ArrowUpRight } from "lucide-react";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";

const formatJoinedDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return String(dateStr);
  }
};

export default function RecentUsersTable({ users = [] }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedData = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (!users.length) {
    return (
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-theme-heading">No users registered in this period</h3>
          <p className="text-xs text-theme-muted max-w-sm">
            No new user registrations were found in the database for the selected time window.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h3 className="text-base font-bold text-theme-heading tracking-tight">
          Recent Users
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/users")}
          iconRight={<ArrowUpRight className="w-3.5 h-3.5" />}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          View All Users
        </Button>
      </div>

      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-muted-foreground border-b border-border text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined Date</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.map((usr) => (
              <tr
                key={usr.id || usr._id}
                onClick={() => navigate("/admin/users")}
                className="group hover:bg-muted/40 transition-colors cursor-pointer"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {(usr.name || usr.fullName || usr.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-theme-heading group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors truncate text-xs sm:text-sm">
                        {usr.name || usr.fullName || "User"}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-xs">{usr.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border capitalize">
                    {usr.role || "user"}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <Badge status={usr.status || (usr.isActive ? "active" : "suspended")} type="user" />
                </td>
                <td className="px-4 py-3.5 text-muted-foreground text-xs whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {formatJoinedDate(usr.joinedAt || usr.createdAt)}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate("/admin/users")}
                      title="View user details"
                      className="text-muted-foreground hover:text-foreground p-1.5 h-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate("/admin/users")}
                      title="Edit user"
                      className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 p-1.5 h-auto"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-5 py-3.5 border-t border-border flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, users.length)} of{" "}
            {users.length}
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




