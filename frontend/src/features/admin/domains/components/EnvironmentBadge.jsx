
export default function EnvironmentBadge({ environment }) {
  const env = (environment || "").toLowerCase();
  const styles = {
    production: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    staging: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    preview: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    development: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };

  const badgeStyle =
    styles[env] || "bg-slate-500/10 text-slate-400 border-slate-500/20";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border capitalize ${badgeStyle}`}
    >
      {environment}
    </span>
  );
}
