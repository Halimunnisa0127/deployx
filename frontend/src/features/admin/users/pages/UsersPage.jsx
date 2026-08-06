import { useState, useMemo } from "react";
import UsersHeader from "../components/UsersHeader";
import UsersStatisticsCards from "../components/UsersStatisticsCards";
import UsersFilters from "../components/UsersFilters";
import UsersTable from "../components/UsersTable";
import UserDetailsDrawer from "../components/UserDetailsDrawer";
import ConfirmationDialog from "../../../../components/ui/ConfirmationDialog";
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

  const activeFilter = table.filters.state.status || "all";
  const setActiveFilter = (val) => table.filters.update("status", val === "all" ? "" : val);

  const counts = useMemo(() => {
    const res = {
      all: users.length,
      active: 0,
      suspended: 0,
      admin: 0,
      developer: 0,
      viewer: 0,
    };
    users.forEach((u) => {
      if (res[u.status] !== undefined) res[u.status]++;
      if (res[u.role] !== undefined) res[u.role]++;
    });
    return res;
  }, [users]);

  const handleAddUser = () => {
    console.log("Add User Triggered");
  };

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleEditUser = (user) => {
    console.log("Edit User Triggered", user.id);
  };

  const handleChangeRole = async (user) => {
    const newRole = user.role === "admin" ? "developer" : "admin";
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
    alert(`Password reset link sent to ${user.email}`);
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
          onFilterChange={setActiveFilter}
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
          <NoActiveUsersEmptyState onClear={() => setActiveFilter("all")} />
        ) : activeFilter === "suspended" ? (
          <NoSuspendedUsersEmptyState onClear={() => setActiveFilter("all")} />
        ) : (
          <NoSearchResultsEmptyState
            onClear={() => {
              table.search.setQuery("");
              setActiveFilter("all");
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
