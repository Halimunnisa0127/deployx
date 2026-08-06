export function getNextSortDirection(currentDirection) {
  return currentDirection === "asc" ? "desc" : "asc";
}

export function compareValues(a, b, direction) {
  if (a < b) return direction === "asc" ? -1 : 1;
  if (a > b) return direction === "asc" ? 1 : -1;
  return 0;
}
