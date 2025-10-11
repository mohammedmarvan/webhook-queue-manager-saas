import api from './client';

export async function replayEvent(eventId: string) {
  const res = await api.get(`/events/replay/${eventId}`);
  return res.data;
}
