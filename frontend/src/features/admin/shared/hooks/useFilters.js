import { useState, useMemo } from "react";

function getNestedValue(obj, path) {
  if (!obj) return undefined;
  if (typeof path === "string" && path.includes(".")) {
    return path.split(".").reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
  }
  return obj[path];
}

export function useFilters(data = [], initialFilters = {}) {
  const [filters, setFilters] = useState(initialFilters);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || value === "all" || value === "ALL" || key === "customFilterId") {
          return true; // ignore empty or 'all' filters
        }
        const itemVal = getNestedValue(item, key);
        if (itemVal === undefined || itemVal === null) return false;
        if (Array.isArray(value)) {
          return value.some((v) => String(v).toLowerCase() === String(itemVal).toLowerCase());
        }
        return String(itemVal).toLowerCase() === String(value).toLowerCase();
      });
    });
  }, [data, filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  return {
    filters,
    updateFilter,
    clearFilters,
    filteredData,
  };
}

