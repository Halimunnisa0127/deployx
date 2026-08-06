import Badge from "../../../../components/ui/Badge";

export default function VerificationBadge({ status }) {
  const STATUS_MAP = {
    verified: { variant: "success", label: "Verified" },
    pending: { variant: "warning", label: "Pending" },
    failed: { variant: "danger", label: "Failed" },
  };
  const { variant, label } = STATUS_MAP[status?.toLowerCase()] || {
    variant: "neutral",
    label: status,
  };

  return <Badge variant={variant}>{label}</Badge>;
}
