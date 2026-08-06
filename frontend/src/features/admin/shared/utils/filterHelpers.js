export function extractUniqueFilterValues(data, key) {
  const values = data.map((item) => item[key]).filter(Boolean);
  return [...new Set(values)];
}
