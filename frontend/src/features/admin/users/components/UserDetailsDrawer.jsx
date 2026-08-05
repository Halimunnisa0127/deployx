import React from "react";
import Drawer from "../../../../components/ui/Drawer";
import {
  Mail,
  Calendar,
  Shield,
  Activity,
  FolderGit2,
  Rocket,
  Edit2,
  Key,
  Trash2,
} from "lucide-react";
import Badge from "../../../../components/ui/Badge";
import RoleBadge from "./RoleBadge";
import UserAvatar from "./UserAvatar";
import Button from "../../../../components/ui/Button";

export default function UserDetailsDrawer({
  isOpen,
  onClose,
  user,
  onEdit,
  onChangeRole,
  onToggleStatus,
  onResetPassword,
  onDelete,
}) {
  if (!user) return null;
  const isSuspended = user.status === "suspended";

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      width="w-full md:w-[450px]"
    >
      <div className="p-6 space-y-8">
        {/* Profile Info */}
        <div className="flex items-center gap-4">
          <UserAvatar name={user.name} className="w-16 h-16 text-2xl" />
          <div>
            <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
            <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-1">
              <Mail className="w-3.5 h-3.5" />
              {user.email}
            </p>
          </div>
        </div>

        {/* Status & Role Badges */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border flex flex-col gap-2">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Role
            </span>
            <div>
              <RoleBadge role={user.role} />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border flex flex-col gap-2">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Status
            </span>
            <div>
              <Badge status={user.status} type="user" />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> Member Since
          </span>
          <span className="text-sm font-medium text-slate-900 dark:text-slate-200">
            {new Date(user.joinedAt).toLocaleDateString()}
          </span>
        </div>

        {/* Recent Projects */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
            <FolderGit2 className="w-4 h-4 text-indigo-400" /> Recent Projects
          </h3>
          <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-border p-1">
            {user.recentProjects?.length > 0 ? (
              user.recentProjects.map((proj, idx) => (
                <div
                  key={idx}
                  className="px-4 py-3 border-b border-border last:border-0 text-sm text-foreground font-medium"
                >
                  {proj}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-slate-500 italic">
                No recent projects
              </div>
            )}
          </div>
        </div>

        {/* Recent Deployments */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
            <Rocket className="w-4 h-4 text-sky-400" /> Recent Deployments
          </h3>
          <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-border p-1">
            {user.recentDeployments?.length > 0 ? (
              user.recentDeployments.map((dep, idx) => (
                <div
                  key={idx}
                  className="px-4 py-3 border-b border-border last:border-0 text-sm text-foreground font-mono"
                >
                  {dep}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-slate-500 italic">
                No recent deployments
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-border grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            iconLeft={<Edit2 className="w-4 h-4" />}
            onClick={() => onEdit(user)}
            className="w-full"
          >
            Edit User
          </Button>
          <Button
            variant="secondary"
            iconLeft={<Key className="w-4 h-4" />}
            onClick={() => onResetPassword(user)}
            className="w-full"
          >
            Reset Password
          </Button>
          <Button
            variant={isSuspended ? "primary" : "secondary"}
            className={
              !isSuspended
                ? "text-amber-400 hover:text-amber-300 border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20"
                : ""
            }
            onClick={() => onToggleStatus(user)}
          >
            {isSuspended ? "Activate User" : "Suspend User"}
          </Button>
          <Button
            variant="secondary"
            iconLeft={<Trash2 className="w-4 h-4" />}
            onClick={() => onDelete(user)}
            className="text-rose-400 hover:text-rose-300 border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 w-full"
          >
            Delete User
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
