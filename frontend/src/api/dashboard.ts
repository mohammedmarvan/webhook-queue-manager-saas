import api from './client';
import { type DashboardResponse } from '@/types/dashboard';

export async function getDashbaordData(): Promise<DashboardResponse> {
  const res = await api.get('/dashboard');
  return res.data;
}
