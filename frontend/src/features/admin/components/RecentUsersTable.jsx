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
    <div className="bg-black dark:bg-black rounded-2xl border border-slate-200 dark:border-slate-900 overflow-hidden shadow-lg">
      <div className="p-5 border-b border-slate-200 dark:border-slate-900 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white tracking-tight">
          Recent Users
        </h3>
      </div>

      <div className="overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700/50 hover:[&::-webkit-scrollbar-thumb]:bg-slate-600/50 [&::-webkit-scrollbar-thumb]:rounded-full pb-2">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-slate-400 border-b border-slate-200 dark:border-slate-900 sticky top-0">
            <tr>
              <th className="px-4 py-3 font-medium whitespace-nowrap">User</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Role</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Joined Date</th>
              <th className="px-4 py-3 font-medium text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {paginatedData.map((usr) => (
              <tr
                key={usr.id}
                className="group hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                      {usr.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {usr.name}
                      </div>
                      <div className="text-xs text-slate-400">{usr.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 capitalize">
                    {usr.role}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <Badge status={usr.status} type="user" />
                </td>
                <td className="px-4 py-4 text-slate-400 text-xs">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {usr.joinedAt}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-white px-2"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-indigo-400 px-2"
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
        <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-900 flex items-center justify-between text-sm">
          <span className="text-slate-400">
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




