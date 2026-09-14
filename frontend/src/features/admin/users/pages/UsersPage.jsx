import { useState, useMemo } from "react";
import UsersHeader from "../components/UsersHeader";
import UsersStatisticsCards from "../components/UsersStatisticsCards";
import UsersFilters from "../components/UsersFilters";
import UsersTable from "../components/UsersTable";
import UserDetailsDrawer from "../components/UserDetailsDrawer";
import ConfirmationDialog from "../../../../components/ui/ConfirmationDialog";
import Modal from "../../../../components/ui/Modal";
import {
  UsersTableSkeleton,
  UsersStatisticsSkeleton,
} from "../components/UsersSkeleton";
import {
  NoUsersEmptyState,
  NoSearchResultsEmptyState,
  NoActiveUsersEmptyState,
  NoSuspendedUsersEmptyState,
} from "../components/UsersEmptyState";
import SearchBar from "../../../../components/common/SearchBar";
import { useUsers } from "../hooks/useUsers";

export default function UsersPage() {
  const { users, loading, actions, table } = useUsers();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [activeFilter, setActiveFilter] = useState("all");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({ fullName: "", email: "", password: "", role: "user" });
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [addUserError, setAddUserError] = useState(null);

  const handleFilterChange = (val) => {
    setActiveFilter(val);
    if (val === "all") {
      table.filters.update("status", "");
      table.filters.update("role", "");
    } else if (val === "active" || val === "suspended") {
      table.filters.update("status", val);
      table.filters.update("role", "");
    } else if (val === "admin" || val === "user") {
      table.filters.update("status", "");
      table.filters.update("role", val);
    }
  };

  const counts = useMemo(() => {
    const res = {
      all: users.length,
      active: 0,
      suspended: 0,
      admin: 0,
      user: 0,
    };
    users.forEach((u) => {
      if (u.status === "active") res.active++;
      if (u.status === "suspended") res.suspended++;
      if (u.role === "admin") res.admin++;
      if (u.role === "user") res.user++;
    });
    return res;
  }, [users]);

  const handleAddUser = () => {
    setNewUserData({ fullName: "", email: "", password: "", role: "user" });
    setAddUserError(null);
    setIsAddUserModalOpen(true);
  };

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsAddingUser(true);
      setAddUserError(null);
      await actions.createUser(newUserData);
      setIsAddUserModalOpen(false);
    } catch (err) {
      setAddUserError(err.response?.data?.message || err.message || "Failed to create user");
    } finally {
      setIsAddingUser(false);
    }
  };

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleChangeRole = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    await actions.changeRole(user.id, newRole);
  };

  const handleToggleStatus = async (user) => {
    if (user.status === "suspended") {
      await actions.activateUser(user.id);
    } else {
      await actions.suspendUser(user.id);
    }
  };

  const handleResetPassword = async (user) => {
    await actions.resetPassword(user.id);
    alert(`Password reset triggered for ${user.email}`);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      await actions.deleteUser(userToDelete.id);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      if (selectedUser?.id === userToDelete.id) {
        setIsDrawerOpen(false);
      }
    }
  };

  const actionHandlers = {
    onView: handleRowClick,
    onEdit: handleEditUser,
    onChangeRole: handleChangeRole,
    onToggleStatus: handleToggleStatus,
    onResetPassword: handleResetPassword,
    onDelete: handleDeleteClick,
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-10 text-left animate-in fade-in duration-300">
      <UsersHeader onAddUser={handleAddUser} />

      {/* Top Statistics */}
      {loading ? (
        <UsersStatisticsSkeleton />
      ) : (
        <UsersStatisticsCards users={users} />
      )}

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <UsersFilters
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          counts={counts}
        />

        <SearchBar
          value={table.search.query}
          onChange={(e) => table.search.setQuery(e.target.value)}
          onClear={() => table.search.setQuery("")}
          placeholder="Search by name or email..."
          shortcut="⌘K"
          size="md"
          className="w-full sm:w-72 shrink-0"
        />
      </div>

      {/* Table / Empty States */}
      {loading ? (
        <UsersTableSkeleton />
      ) : users.length === 0 ? (
        <NoUsersEmptyState onAddUser={handleAddUser} />
      ) : table.tableData.length === 0 ? (
        activeFilter === "active" ? (
          <NoActiveUsersEmptyState onClear={() => handleFilterChange("all")} />
        ) : activeFilter === "suspended" ? (
          <NoSuspendedUsersEmptyState onClear={() => handleFilterChange("all")} />
        ) : (
          <NoSearchResultsEmptyState
            onClear={() => {
              table.search.setQuery("");
              handleFilterChange("all");
            }}
          />
        )
      ) : (
        <UsersTable
          users={table.tableData}
          onRowClick={handleRowClick}
          actionHandlers={actionHandlers}
        />
      )}

      {/* Deep Dive Drawer */}
      <UserDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        user={selectedUser}
        {...actionHandlers}
      />

      {/* Add User Modal */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Add New User"
      >
        <form onSubmit={handleCreateUserSubmit} className="space-y-4 pt-2">
          {addUserError && (
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {addUserError}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={newUserData.fullName}
              onChange={(e) => setNewUserData({ ...newUserData, fullName: e.target.value })}
              placeholder="e.g. Jane Developer"
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={newUserData.email}
              onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
              placeholder="e.g. jane@example.com"
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={newUserData.password}
              onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
              placeholder="Minimum 8 characters"
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Account Role</label>
            <select
              value={newUserData.role}
              onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="user">Standard User</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddUserModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAddingUser}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isAddingUser ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Destructive Action Modal */}
      <ConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to completely delete ${userToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete User"
      />
    </div>
  );
}
