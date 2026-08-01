import React from "react";
import { Check, X, Clock, History } from "lucide-react";

export default function VerificationTimeline({ history = [] }) {
  if (!history.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
        <History className="w-4 h-4 text-indigo-400" /> Verification History
      </h3>
      <div className="bg-slate-900/40 rounded-xl border border-slate-800/80 p-5">
        <div className="relative pl-6 border-l-2 border-slate-800/60 ml-2 space-y-6">
          {history.map((event, idx) => {
            const isSuccess = event.status === "success";
            const isFailed = event.status === "failed";
            const isPending = event.status === "pending";

            return (
              <div key={idx} className="relative">
                <div
                  className={`absolute -left-[35px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-slate-900
                    ${isSuccess ? "border-emerald-500 text-emerald-400" : ""}
                    ${isFailed ? "border-rose-500 text-rose-400" : ""}
                    ${isPending ? "border-amber-500 text-amber-400" : ""}
                  `}
                >
                  {isSuccess && <Check className="w-3.5 h-3.5" />}
                  {isFailed && <X className="w-3.5 h-3.5" />}
                  {isPending && <Clock className="w-3.5 h-3.5" />}
                </div>

                <div className="flex flex-col">
                  <p
                    className={`text-sm font-medium ${isSuccess ? "text-emerald-400" : isFailed ? "text-rose-400" : "text-amber-400"}`}
                  >
                    {event.message}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />{" "}
                    {new Date(event.time).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
