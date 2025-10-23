import { useQuery } from '@tanstack/react-query';
import api from '@/api/client';

interface UsePaginatedQueryOptions {
  endpoint: string;
  page: number;
  pageSize: number;
  search: string;
  refreshKey?: number;
  enabled?: boolean;
}

export function usePaginatedQuery<T>({
  endpoint,
  page,
  pageSize,
  search,
  refreshKey = 0,
  enabled = true,
}: UsePaginatedQueryOptions) {
  return useQuery({
    queryKey: [endpoint, page, pageSize, search, refreshKey],
    queryFn: async () => {
      const res = await api.get(endpoint, {
        params: { page, limit: pageSize, search },
      });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 2,
    enabled,
  });
}
