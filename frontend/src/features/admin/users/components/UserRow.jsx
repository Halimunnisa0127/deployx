import { Calendar, FolderGit2 } from "lucide-react";
import Badge from "../../../../components/ui/Badge";
import RoleBadge from "./RoleBadge";
import UserAvatar from "./UserAvatar";
import ActionMenu from "./ActionMenu";

export default function UserRow({ user, onRowClick, ...actionProps }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onRowClick(user);
    }
  };

  return (
    <tr
      tabIndex={0}
      onClick={() => onRowClick(user)}
      onKeyDown={handleKeyDown}
      className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer outline-none focus-visible:bg-slate-100 dark:focus-visible:bg-slate-800/50"
    >
      <td className="px-5 py-4 min-w-[250px]">
        <div className="flex items-center gap-3">
          <UserAvatar name={user.name} />
          <div>
            <div className="font-bold text-theme-heading group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors truncate">
              {user.name}
            </div>
            <div className="text-xs text-theme-muted truncate">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <RoleBadge role={user.role} />
      </td>
      <td className="px-5 py-4">
        <Badge status={user.status} type="user" />
      </td>
      <td className="px-5 py-4">
        <div className="inline-flex items-center gap-1.5 text-theme-secondary bg-muted px-2.5 py-1 rounded border border-border font-mono text-[11px]">
          <FolderGit2 className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
          {user.projectsCount}{" "}
          {user.projectsCount === 1 ? "Project" : "Projects"}
        </div>
      </td>
      <td className="px-5 py-4 text-theme-muted text-xs whitespace-nowrap">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-theme-muted" />
          {new Date(user.joinedAt).toLocaleDateString()}
        </span>
      </td>
      <td className="px-5 py-4 text-right">
        <ActionMenu user={user} {...actionProps} />
      </td>
    </tr>
  );
}
