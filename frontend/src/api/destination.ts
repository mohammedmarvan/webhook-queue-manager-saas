import api from './client';
import { type Destination } from '@/types/models';

export async function createDestination(data: Partial<Destination>) {
  const res = await api.post('/destinations', data);
  return res.data;
}

export async function updateDestination(data: Destination) {
  const res = await api.put(`/destinations/${data.id}`, data);

  return res.data;
}
