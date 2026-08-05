import React from "react";
import { Check, Loader2, Circle, Clock } from "lucide-react";

export default function DeploymentTimeline({ timeline = [] }) {
  if (!timeline.length) return null;

  return (
    <div className="relative pl-6 border-l-2 border-border ml-4 space-y-6 my-4">
      {timeline.map((item, idx) => {
        const isCompleted = item.status === "completed";
        const isRunning = item.status === "running";
        const isPending = item.status === "pending";

        return (
          <div key={idx} className="relative">
            <div
              className={`absolute -left-[35px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white dark:bg-slate-950
                ${isCompleted ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" : ""}
                ${isRunning ? "border-blue-500 text-blue-600 dark:text-blue-400" : ""}
                ${isPending ? "border-border text-slate-400 dark:text-slate-600" : ""}
              `}
            >
              {isCompleted && <Check className="w-3.5 h-3.5" />}
              {isRunning && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isPending && <Circle className="w-2 h-2 fill-current" />}
            </div>

            <div className="flex justify-between items-start">
              <div>
                <p
                  className={`text-sm font-semibold ${isCompleted || isRunning ? "text-slate-900 dark:text-slate-200" : "text-slate-500"}`}
                >
                  {item.step}
                </p>
                {item.time && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" /> {item.time}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
