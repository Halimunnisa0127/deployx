export function formatTableValue(value, type = "string") {
  if (value === null || value === undefined) return "-";
  switch (type) {
    case "date":
      return new Date(value).toLocaleDateString();
    case "number":
      return value.toLocaleString();
    case "boolean":
      return value ? "Yes" : "No";
    default:
      return String(value);
  }
}
