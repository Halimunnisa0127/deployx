import { usePagination } from "../../../../hooks/usePagination";
import { useSorting } from "../../../../hooks/useSorting";
import { useBulkSelection } from "./useBulkSelection";
import { useSearch } from "./useSearch";
import { useFilters } from "./useFilters";

export function useAdminTable({
  data = [],
  searchKeys = [],
  initialFilters = {},
  initialSort = { key: "id", direction: "asc" },
  itemsPerPage = 10,
  idKey = "id",
}) {
  const { searchQuery, setSearchQuery, searchedData } = useSearch(data, searchKeys);

  const { filters, updateFilter, clearFilters, filteredData } = useFilters(
    searchedData,
    initialFilters
  );

  const { sortConfig, requestSort, sortedData } = useSorting(
    filteredData,
    initialSort
  );

  const pagination = usePagination(sortedData, itemsPerPage);

  const selection = useBulkSelection(pagination.currentData, idKey);

  return {
    search: {
      query: searchQuery,
      setQuery: setSearchQuery,
    },
    filters: {
      state: filters,
      update: updateFilter,
      clear: clearFilters,
    },
    sorting: {
      config: sortConfig,
      requestSort,
    },
    pagination,
    selection,
    tableData: pagination.currentData,
    totalItems: sortedData.length,
  };
}
