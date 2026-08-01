import { useState, useMemo } from "react";

export function usePagination(data, itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  // Ensure current page is within bounds when data changes
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const currentData = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, safePage, itemsPerPage]);

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goToPage = (page) =>
    setCurrentPage(Math.min(Math.max(1, page), totalPages));

  return {
    currentPage: safePage,
    totalPages,
    currentData,
    nextPage,
    prevPage,
    goToPage,
    totalItems: data.length,
    startIndex: (safePage - 1) * itemsPerPage,
    endIndex: Math.min(safePage * itemsPerPage, data.length),
  };
}
