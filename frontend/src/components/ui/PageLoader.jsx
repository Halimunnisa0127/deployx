import React from "react";
import { Loader2 } from "lucide-react";

export default function PageLoader({
  message = "Loading...",
  fullScreen = false,
}) {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center"
    : "w-full h-[60vh] flex flex-col items-center justify-center";

  return (
    <div className={containerClasses}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 absolute inset-0"></div>
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin relative z-10" />
      </div>
      {message && (
        <p className="mt-4 text-sm font-medium text-slate-400 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
