import React from "react";

export default function FrameworkBadge({ framework }) {
  const normalized = (framework || "").toLowerCase();
  const styles = {
    react: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "next.js":
      "bg-slate-100 text-slate-900 border-slate-300 shadow-sm font-bold",
    "node.js": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  const badgeStyle =
    styles[normalized] || "bg-slate-500/10 text-slate-400 border-slate-500/20";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${badgeStyle}`}
    >
      {framework}
    </span>
  );
}
