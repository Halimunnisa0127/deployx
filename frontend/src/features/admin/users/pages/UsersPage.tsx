import React, { useState, useEffect, useMemo } from 'react';
import UsersHeader from '../components/UsersHeader';
import UsersStatisticsCards from '../components/UsersStatisticsCards';
import UsersFilters from '../components/UsersFilters';
import UsersTable from '../components/UsersTable';
import UserDetailsDrawer from '../components/UserDetailsDrawer';
import ConfirmationModal from '../components/ConfirmationModal';
import { UsersTableSkeleton, UsersStatisticsSkeleton } from '../components/UsersSkeleton';
import { 
  NoUsersEmptyState, 
  NoSearchResultsEmptyState, 
  NoActiveUsersEmptyState, 
  NoSuspendedUsersEmptyState 
} from '../components/UsersEmptyState';
import SearchBar from '../../../../components/common/SearchBar';
import { 
  getUsers, 
  deleteUser, 
  suspendUser, 
  activateUser, 
  resetPassword,
  changeRole
} from '../services/users.service';

export default function UsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const counts = useMemo(() => {
    const res = { all: users.length, active: 0, suspended: 0, admin: 0, developer: 0, viewer: 0 };
    users.forEach(u => {
      if (res[u.status] !== undefined) res[u.status]++;
      if (res[u.role] !== undefined) res[u.role]++;
    });
    return res;
  }, [users]);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return users.filter(u => {
      if (activeFilter === 'active' && u.status !== 'active') return false;
      if (activeFilter === 'suspended' && u.status !== 'suspended') return false;
      if (activeFilter === 'admin' && u.role !== 'admin') return false;
      if (activeFilter === 'developer' && u.role !== 'developer') return false;
      if (activeFilter === 'viewer' && u.role !== 'viewer') return false;
      
      if (query) {
        return u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query);
      }
      return true;
    });
  }, [users, activeFilter, searchQuery]);

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
    const newRole = user.role === 'admin' ? 'developer' : 'admin';
    await changeRole(user.id, newRole);
    fetchData(); // Simplistic re-fetch
  };

  const handleToggleStatus = async (user) => {
    if (user.status === 'suspended') {
      await activateUser(user.id);
    } else {
      await suspendUser(user.id);
    }
    fetchData();
  };

  const handleResetPassword = async (user) => {
    await resetPassword(user.id);
    alert(`Password reset link sent to ${user.email}`);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete.id);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      if (selectedUser?.id === userToDelete.id) {
        setIsDrawerOpen(false);
      }
      fetchData();
    }
  };

  const hasActiveFilter = searchQuery.trim().length > 0 || activeFilter !== 'all';

  const actionHandlers = {
    onView: handleRowClick,
    onEdit: handleEditUser,
    onChangeRole: handleChangeRole,
    onToggleStatus: handleToggleStatus,
    onResetPassword: handleResetPassword,
    onDelete: handleDeleteClick
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
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
      ) : filteredUsers.length === 0 ? (
        activeFilter === 'active' ? <NoActiveUsersEmptyState onClear={() => setActiveFilter('all')} /> :
        activeFilter === 'suspended' ? <NoSuspendedUsersEmptyState onClear={() => setActiveFilter('all')} /> :
        <NoSearchResultsEmptyState onClear={() => { setSearchQuery(''); setActiveFilter('all'); }} />
      ) : (
        <UsersTable 
          users={filteredUsers} 
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
      <ConfirmationModal 
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
