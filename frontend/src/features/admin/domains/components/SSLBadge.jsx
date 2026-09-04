import Badge from "../../../../components/ui/Badge";

export default function SSLBadge({ status }) {
  const STATUS_MAP = {
    active: { variant: "success", label: "Configured" },
    expiring: { variant: "warning", label: "Expiring Soon" },
    expired: { variant: "danger", label: "Expired" },
    pending: { variant: "neutral", label: "Pending" },
    not_configured: { variant: "neutral", label: "Not Configured" },
  };
  const { variant, label } = STATUS_MAP[status?.toLowerCase()] || {
    variant: "neutral",
    label: status || "Not Configured",
  };

  return <Badge variant={variant}>{label}</Badge>;
}
