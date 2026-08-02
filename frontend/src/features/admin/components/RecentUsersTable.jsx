import React, { useState } from "react";
import { Eye, Edit2, Calendar } from "lucide-react";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";

export default function RecentUsersTable({ users = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedData = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (!users.length) return null;

  return (
    <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-lg">
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <h3 className="text-lg font-bold text-theme-heading tracking-tight">
          Recent Users
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50/90 dark:bg-slate-900/90 text-theme-muted border-b border-slate-200 dark:border-slate-800/80 sticky top-0">
            <tr>
              <th className="px-4 py-3 font-medium whitespace-nowrap">User</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Role</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Joined Date</th>
              <th className="px-4 py-3 font-medium text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
            {paginatedData.map((usr) => (
              <tr
                key={usr.id}
                className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                      {usr.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-theme-heading group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                        {usr.name}
                      </div>
                      <div className="text-xs text-theme-muted">{usr.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-theme-secondary border border-slate-200 dark:border-slate-700 capitalize">
                    {usr.role}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <Badge status={usr.status} type="user" />
                </td>
                <td className="px-5 py-4 text-theme-muted text-xs">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-theme-muted" />
                    {usr.joinedAt}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-theme-muted hover:text-theme-heading px-2"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-theme-muted hover:text-indigo-600 dark:hover:text-indigo-400 px-2"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-sm">
          <span className="text-theme-muted">
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




