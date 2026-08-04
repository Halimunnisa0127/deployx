import React from "react";
import { Layers, Users, Activity } from "lucide-react";
import Button from "../../../components/ui/Button";

export function NoDeploymentsEmptyState() {
  return (
    <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-white/5 p-10 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
        <Layers className="w-8 h-8 text-indigo-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        No Deployments Found
      </h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
        There are no recent deployments to display on the platform.
      </p>
      <Button variant="primary">Trigger Deployment</Button>
    </div>
  );
}

export function NoUsersEmptyState() {
  return (
    <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-white/5 p-10 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-sky-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Users Found</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
        There are no recent users to display on the platform.
      </p>
      <Button variant="primary">Invite User</Button>
    </div>
  );
}

export function NoActivityEmptyState() {
  return (
    <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-white/5 p-10 flex flex-col items-center justify-center text-center h-full">
      <div className="w-16 h-16 rounded-2xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center mb-4">
        <Activity className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Activity</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm">
        There has been no recent activity recorded on the platform.
      </p>
    </div>
  );
}

