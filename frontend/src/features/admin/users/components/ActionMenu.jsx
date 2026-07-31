import React from "react";
import {
  MoreVertical,
  UserCircle,
  Edit2,
  Shield,
  Lock,
  Trash2,
  ShieldOff,
  ShieldAlert,
} from "lucide-react";
import Dropdown from "../../../../components/ui/Dropdown";

export default function ActionMenu({
  user,
  onView,
  onEdit,
  onChangeRole,
  onToggleStatus,
  onResetPassword,
  onDelete,
}) {
  const isSuspended = user.status === "suspended";

  const menuItems = [
    {
      id: "view",
      label: "View Profile",
      icon: <UserCircle className="w-4 h-4" />,
      onClick: (e) => {
        e.stopPropagation();
        onView(user);
      },
    },
    {
      id: "edit",
      label: "Edit User",
      icon: <Edit2 className="w-4 h-4" />,
      onClick: (e) => {
        e.stopPropagation();
        onEdit(user);
      },
    },
    {
      id: "role",
      label: "Change Role",
      icon: <Shield className="w-4 h-4" />,
      onClick: (e) => {
        e.stopPropagation();
        onChangeRole(user);
      },
    },
    { divider: true },
    {
      id: "status",
      label: isSuspended ? "Activate User" : "Suspend User",
      icon: isSuspended ? (
        <ShieldAlert className="w-4 h-4 text-emerald-400" />
      ) : (
        <ShieldOff className="w-4 h-4 text-amber-400" />
      ),
      onClick: (e) => {
        e.stopPropagation();
        onToggleStatus(user);
      },
    },
    {
      id: "password",
      label: "Reset Password",
      icon: <Lock className="w-4 h-4" />,
      onClick: (e) => {
        e.stopPropagation();
        onResetPassword(user);
      },
    },
    { divider: true },
    {
      id: "delete",
      label: "Delete User",
      icon: <Trash2 className="w-4 h-4" />,
      danger: true,
      onClick: (e) => {
        e.stopPropagation();
        onDelete(user);
      },
    },
  ];

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dropdown
        trigger={
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        }
        items={menuItems}
        align="right"
        width="w-48"
      />
    </div>
  );
}
