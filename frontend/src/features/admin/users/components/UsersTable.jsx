import { useState } from "react";
import UserRow from "./UserRow";
import Button from "../../../../components/ui/Button";

export default function UsersTable({ users = [], onRowClick, actionHandlers }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedData = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (!users.length) return null;

  return (
    <div className="bg-card rounded-[18px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50/90 dark:bg-slate-900/90 text-theme-muted border-b border-border sticky top-0 z-10 backdrop-blur-xl">
            <tr>
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Projects Count</th>
              <th className="px-5 py-3 font-medium">Joined Date</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.map((user) => (
              <UserRow
                key={user.id}
                user={user}
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
