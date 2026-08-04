import { useState, useMemo } from "react";

export function useSearch(data = [], searchKeys = []) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const lowerQuery = searchQuery.toLowerCase();
    return data.filter((item) => {
      return searchKeys.some((key) => {
        const val = item[key];
        return val && String(val).toLowerCase().includes(lowerQuery);
      });
    });
  }, [data, searchQuery, searchKeys]);

  return {
    searchQuery,
    setSearchQuery,
    searchedData: filteredData,
  };
}
