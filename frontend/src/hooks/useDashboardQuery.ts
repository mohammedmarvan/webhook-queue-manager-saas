import { useQuery } from '@tanstack/react-query';
import { getDashbaordData } from '@/api/dashboard';

export function useDashboardQuery() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashbaordData,
    staleTime: 1000 * 60 * 2, // 5 minutes
    retry: 1,
  });
}
