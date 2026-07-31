import React from "react";
import { Users, Search, ShieldOff, CheckCircle } from "lucide-react";
import Button from "../../../../components/ui/Button";

export function NoUsersEmptyState({ onAddUser }) {
  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-10 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-indigo-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No Users Found</h3>
      <p className="text-slate-400 max-w-sm mb-6">
        You don't have any users in your platform yet. Start by inviting a new
        user.
      </p>
      <Button variant="primary" onClick={onAddUser}>
        Invite User
      </Button>
    </div>
  );
}

export function NoSearchResultsEmptyState({ onClear }) {
  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-10 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No Results Found</h3>
      <p className="text-slate-400 max-w-sm mb-6">
        No users matched your search or filter criteria. Try adjusting them.
      </p>
      <Button variant="secondary" onClick={onClear}>
        Clear Filters
      </Button>
    </div>
  );
}

export function NoActiveUsersEmptyState({ onClear }) {
  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-10 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
        <CheckCircle className="w-8 h-8 text-emerald-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No Active Users</h3>
      <p className="text-slate-400 max-w-sm mb-6">
        There are currently no active users on the platform.
      </p>
      <Button variant="secondary" onClick={onClear}>
        Clear Filters
      </Button>
    </div>
  );
}

export function NoSuspendedUsersEmptyState({ onClear }) {
  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-10 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
        <ShieldOff className="w-8 h-8 text-rose-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No Suspended Users</h3>
      <p className="text-slate-400 max-w-sm mb-6">
        There are currently no suspended users on the platform.
      </p>
      <Button variant="secondary" onClick={onClear}>
        Clear Filters
      </Button>
    </div>
  );
}
