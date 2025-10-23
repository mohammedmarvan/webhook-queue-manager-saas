import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PageLoader } from '../layout/PageLoader';
import { SearchX } from 'lucide-react';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import { AxiosError } from 'axios';

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface CommonTableProps<T> {
  endpoint: string;
  columns: Column<T>[];
  searchPlaceholder?: string;
  renderActions?: (row: T) => React.ReactNode;
  pageSize?: number;
  refreshKey?: number;
  headerActions?: React.ReactNode;
  enabled?: boolean;
}

interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export function CommonTable<T extends { id?: string | number }>({
  endpoint,
  columns,
  searchPlaceholder = 'Search...',
  renderActions,
  pageSize = 10,
  refreshKey = 0,
  headerActions,
  enabled = true,
}: CommonTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (search.length >= 3 || search.length === 0) {
        setDebouncedSearch(search);
        setPage(1); // Reset to first page when searching
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  // Use React Query for data fetching
  const {
    data: queryData,
    isLoading,
    error,
    isError,
  } = usePaginatedQuery<ApiResponse<T>>({
    endpoint,
    page,
    pageSize,
    search: debouncedSearch,
    refreshKey,
    enabled: enabled && refreshKey >= 0, // Enable query when refreshKey is valid
  });

  // Extract data and total from query response
  const data = queryData?.data || [];
  const total = queryData?.total || 0;

  // Optimized event handlers
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  const handlePreviousPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  // Memoized calculations
  const totalPages = useMemo(
    () => Math.ceil(total / pageSize),
    [total, pageSize]
  );
  const hasData = data.length > 0;
  const showActions = !!renderActions;

  const handleNextPage = useCallback(() => {
    setPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  // Show loading state
  if (isLoading) {
    return <PageLoader />;
  }

  // Show error state
  if (isError) {
    const errorMessage =
      error instanceof AxiosError
        ? error.response?.data?.message || 'Failed to load data'
        : 'An unexpected error occurred';

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={handleSearchChange}
            className="w-1/3"
            disabled
          />
          <div className="flex space-x-2">{headerActions}</div>
        </div>
        <div className="h-40 flex items-center justify-center text-center text-muted-foreground">
          <div className="flex flex-col items-center space-y-2">
            <SearchX className="h-6 w-6 text-red-400" />
            <span className="text-red-600">{errorMessage}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex justify-between items-center">
        <Input
          placeholder={searchPlaceholder}
          value={search}
          onChange={handleSearchChange}
          className="w-1/3"
        />
        <div className="flex space-x-2">{headerActions}</div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead className="font-semibold" key={String(col.key)}>
                {col.label}
              </TableHead>
            ))}
            {showActions && (
              <TableHead className="font-semibold">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {!hasData ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (showActions ? 1 : 0)}
                className="h-40 text-center align-middle text-muted-foreground"
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <SearchX className="h-6 w-6 text-gray-400" />
                  <span>No results found</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row: T) => (
              <TableRow key={row.id}>
                {columns.map((col) => (
                  <TableCell key={String(col.key)}>
                    {col.render
                      ? col.render(row)
                      : (row[col.key] as React.ReactNode)}
                  </TableCell>
                ))}
                {showActions && <TableCell>{renderActions!(row)}</TableCell>}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <span>
          Page {page} of {totalPages || 1}
        </span>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={handlePreviousPage}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages || totalPages === 0}
            onClick={handleNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
