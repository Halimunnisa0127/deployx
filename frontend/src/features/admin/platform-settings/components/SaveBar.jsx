import React from "react";
import Button from "../../../../components/ui/Button";
import { AlertCircle } from "lucide-react";

export default function SaveBar({ isDirty, onSave, onReset, isSaving }) {
  if (!isDirty) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xl rounded-2xl p-4 flex items-center gap-6">
        <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-medium">You have unsaved changes</span>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onReset} disabled={isSaving}>
            Discard
          </Button>
          <Button
            variant="primary"
            onClick={onSave}
            isLoading={isSaving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
