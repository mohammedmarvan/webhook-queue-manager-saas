import axios from 'axios';
import { Destination, Event } from '@prisma/client';

export async function sendToDestination(destination: Destination, event: Event) {
  const payload = {
    id: event.eventUid,
    data: event.payload,
    headers: event.headers,
  };

  // Temporary endpoint — in real cases use destination.url
  const url = destination.url || 'http://localhost:5040/webhook';

  return axios.post(url, payload, {
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Secret': destination.secret,
    },
    timeout: destination.timeoutMs || 5000,
  });
}
