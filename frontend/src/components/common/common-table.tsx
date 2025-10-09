import { useEffect, useState } from 'react';
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
import api from '@/api/client';
import { PageLoader } from '../layout/PageLoader';
import { AppToast } from '../layout/AppToast';
import { SearchX } from 'lucide-react';

interface Column<T> {
  key: keyof T;
  label: string;
}

interface CommonTableProps<T> {
  endpoint: string;
  columns: Column<T>[];
  searchPlaceholder?: string;
  renderActions?: (row: T) => React.ReactNode;
  pageSize?: number;
  refreshKey?: number;
}

export function CommonTable<T extends { id: string | number }>({
  endpoint,
  columns,
  searchPlaceholder = 'Search...',
  renderActions,
  pageSize = 10,
  refreshKey = 0,
}: CommonTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (search.length >= 3 || search.length === 0) {
        setDebouncedSearch(search);
      }
    }, 400); // wait 400ms after typing stops

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(endpoint, {
          params: { search: debouncedSearch, page, limit: pageSize },
        });
        setData(res.data.data.data || []);
        setTotal(res.data.data.total || 0);
      } catch (err) {
        const e = err as Error;
        console.error('Error fetching data', err);
        AppToast.error(e?.message ?? 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [endpoint, debouncedSearch, page, pageSize, refreshKey]);

  const totalPages = Math.ceil(total / pageSize);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex justify-between">
        <Input
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => {
            setPage(1); // reset to first page when searching
            setSearch(e.target.value);
          }}
          className="w-1/3"
        />
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
            {renderActions && (
              <TableHead className="font-semibold">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1}>Loading...</TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="h-40 text-center align-middle text-muted-foreground"
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <SearchX className="h-6 w-6 text-gray-400" />
                  <span>No results found</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id}>
                {columns.map((col) => (
                  <TableCell key={String(col.key)}>
                    {row[col.key] as React.ReactNode}
                  </TableCell>
                ))}
                {renderActions && <TableCell>{renderActions(row)}</TableCell>}
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
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
