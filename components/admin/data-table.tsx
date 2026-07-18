"use client";

import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";

interface ColumnHeader<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: ColumnHeader<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKeys?: string[];
  filterKey?: string;
  filterOptions?: { label: string; value: string }[];
  pageSize?: number;
  emptyStateMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  searchPlaceholder = "Search records...",
  searchKeys = [],
  filterKey,
  filterOptions = [],
  pageSize = 8,
  emptyStateMessage = "No matching records found.",
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting Handler
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    let result = [...data];

    // Filter dropdown matching
    if (filterKey && filterValue !== "all") {
      result = result.filter(
        (item) => String((item as Record<string, unknown>)[filterKey]).toLowerCase() === filterValue.toLowerCase()
      );
    }

    // Search bar matching
    if (searchQuery.trim() !== "" && searchKeys.length > 0) {
      const q = searchQuery.toLowerCase();
      result = result.filter((item) =>
        searchKeys.some((k) => String((item as Record<string, unknown>)[k]).toLowerCase().includes(q))
      );
    }

    // Sorting Logic
    if (sortKey) {
      result.sort((a, b) => {
        const valA = (a as Record<string, unknown>)[sortKey];
        const valB = (b as Record<string, unknown>)[sortKey];

        if (typeof valA === "number" && typeof valB === "number") {
          return sortDirection === "asc" ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();

        if (strA < strB) return sortDirection === "asc" ? -1 : 1;
        if (strA > strB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, filterValue, sortKey, sortDirection, filterKey, searchKeys]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  return (
    <div className="flex flex-col gap-4 w-full text-left">
      {/* Filtering and Search Actions bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        {searchKeys.length > 0 && (
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-muted/10 border border-border/80 rounded-full h-11 pl-10 pr-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40 placeholder:text-muted-foreground/40"
              aria-label={searchPlaceholder}
            />
          </div>
        )}

        {/* Dropdown Filter */}
        {filterKey && filterOptions.length > 0 && (
          <div className="relative w-full sm:w-auto shrink-0">
            <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/80" />
            <select
              value={filterValue}
              onChange={(e) => {
                setFilterValue(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-muted/10 border border-border/80 rounded-full h-11 pl-9 pr-8 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40 appearance-none w-full sm:w-48 cursor-pointer"
              aria-label="Filter records"
            >
              <option value="all" className="bg-card text-foreground">All Records</option>
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-card text-foreground">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none opacity-50" />
          </div>
        )}
      </div>

      {/* Table grid */}
      <div className="glass-card border border-border/50 rounded-3xl bg-muted/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border/30 bg-muted/10">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`px-6 py-4.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground select-none ${
                      col.sortable ? "cursor-pointer hover:text-foreground transition-colors" : ""
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      {col.sortable && sortKey === col.key && (
                        sortDirection === "asc" ? <ChevronUp className="h-3.5 w-3.5 text-accent" /> : <ChevronDown className="h-3.5 w-3.5 text-accent" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-xs text-muted-foreground font-light">
                    {emptyStateMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-muted/10 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4.5 text-xs text-foreground font-medium">
                        {col.render ? col.render(item) : ((item as Record<string, unknown>)[col.key] as React.ReactNode)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border/20 flex items-center justify-between text-xs font-semibold text-muted-foreground bg-muted/5">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="h-8 w-8 border border-border/80 bg-muted/5 rounded-full flex items-center justify-center text-foreground hover:bg-muted/20 disabled:opacity-40 disabled:hover:bg-muted/5 transition"
                aria-label="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-foreground font-bold">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="h-8 w-8 border border-border/80 bg-muted/5 rounded-full flex items-center justify-center text-foreground hover:bg-muted/20 disabled:opacity-40 disabled:hover:bg-muted/5 transition"
                aria-label="Next Page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
