import api from './client';
import { type Source } from '../types/models';

export async function updateSource(formData: Source) {
  const res = await api.put(`/sources/${formData.id}`, formData);
  return res.data;
}

export async function createSource(formData: Source) {
  const res = await api.post(`/sources`, formData);

  return res.data;
}
