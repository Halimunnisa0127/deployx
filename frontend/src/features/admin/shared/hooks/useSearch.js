import { useState, useMemo } from "react";

function getNestedValue(obj, path) {
  if (!obj) return undefined;
  if (typeof path === "string" && path.includes(".")) {
    return path.split(".").reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
  }
  return obj[path];
}

export function useSearch(data = [], searchKeys = []) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const lowerQuery = searchQuery.toLowerCase().trim();
    return data.filter((item) => {
      return searchKeys.some((key) => {
        const val = getNestedValue(item, key);
        if (val === undefined || val === null) return false;
        if (typeof val === "object") {
          return Object.values(val).some(
            (v) => v && String(v).toLowerCase().includes(lowerQuery)
          );
        }
        return String(val).toLowerCase().includes(lowerQuery);
      });
    });
  }, [data, searchQuery, searchKeys]);

  return {
    searchQuery,
    setSearchQuery,
    searchedData: filteredData,
  };
}

