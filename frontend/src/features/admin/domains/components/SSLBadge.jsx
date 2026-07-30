import React from "react";
import Badge from "../../../../components/ui/Badge";

export default function SSLBadge({ status }) {
  const STATUS_MAP = {
    active: { variant: "success", label: "Active" },
    expiring: { variant: "warning", label: "Expiring Soon" },
    expired: { variant: "danger", label: "Expired" },
    pending: { variant: "neutral", label: "Pending" },
  };
  const { variant, label } = STATUS_MAP[status?.toLowerCase()] || {
    variant: "neutral",
    label: status,
  };

  return <Badge variant={variant}>{label}</Badge>;
}
