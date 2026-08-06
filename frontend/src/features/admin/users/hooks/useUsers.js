import { useState, useEffect, useCallback } from "react";
import * as usersService from "../services/usersService";
import { useAdminTable } from "../../shared/hooks/useAdminTable";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsersData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usersService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);

  const handleDeleteUser = async (id) => {
    await usersService.deleteUser(id);
    await fetchUsersData();
  };

  const handleSuspendUser = async (id) => {
    await usersService.suspendUser(id);
    await fetchUsersData();
  };

  const handleActivateUser = async (id) => {
    await usersService.activateUser(id);
    await fetchUsersData();
  };

  const handleChangeRole = async (id, role) => {
    await usersService.changeRole(id, role);
    await fetchUsersData();
  };

  const handleResetPassword = async (id) => {
    await usersService.resetPassword(id);
  };

  // Setup table features
  const table = useAdminTable({
    data: users,
    searchKeys: ["name", "email"],
    initialSort: { key: "name", direction: "asc" },
  });

  return {
    users,
    loading,
    error,
    refresh: fetchUsersData,
    actions: {
      deleteUser: handleDeleteUser,
      suspendUser: handleSuspendUser,
      activateUser: handleActivateUser,
      changeRole: handleChangeRole,
      resetPassword: handleResetPassword,
    },
    table,
  };
}
