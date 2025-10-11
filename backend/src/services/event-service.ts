import { eventQueue } from '../queues/event-queue';
import { createEvent, createEventParam } from '../db/event-repo';
import logger from '../config/logger';

export async function addEvent(param: createEventParam) {
  // Insert into the Event table
  const event = await createEvent(param);

  logger.info(`✅ Event inserted: ${event.id}`);

  // Push to Bull Queue
  await eventQueue.addJob({
    eventUid: event.eventUid,
  });

  return event;
}

export async function replayEvent(eventUid: string) {
  logger.info(`✅ Event inserted for replay: ${eventUid}`);

  await eventQueue.addJob({
    eventUid,
  });
}
