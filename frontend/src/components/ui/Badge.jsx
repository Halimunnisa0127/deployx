
export default function Badge({ status, className = "", children }) {
  const safeStatus = typeof status === "string" && status ? status : "unknown";
  let colorClass;
  let label = safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1);

  const normalizedStatus = safeStatus.toLowerCase();

  switch (normalizedStatus) {
    case "healthy":
    case "resolved":
    case "completed":
    case "active":
    case "success":
    case "verified":
      colorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      break;
    case "warning":
    case "pending":
    case "building":
      colorClass = "bg-amber-500/10 text-amber-400 border-amber-500/20";
      break;
    case "offline":
    case "critical":
    case "suspended":
    case "failed":
    case "unverified":
      colorClass = "bg-rose-500/10 text-rose-400 border-rose-500/20";
      break;
    case "maintenance":
    case "info":
    case "queued":
      colorClass = "bg-blue-500/10 text-blue-400 border-blue-500/20";
      break;
    default:
      colorClass = "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass} ${className}`}
    >
      {children || label}
    </span>
  );
}
