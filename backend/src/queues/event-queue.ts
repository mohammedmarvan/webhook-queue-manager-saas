import { BullQueue } from '../config/bull-queue';
import { Job } from 'bull';
import { getEventData, updateEvent } from '../db/event-repo';
import logger from '../config/logger';
import { getDestinationsByProjectId, getDestinationById } from '../db/destination-repo';
import { createDelivery, updateDelivery } from '../db/delivery-repo';
import { sendToDestination } from '../services/webhook-service';
import { EVENT_STATUS } from '../config/constats';

interface EventJob {
  eventUid: string;
  attempt?: number;
  destinationId?: string;
}

interface RetryPolicy {
  maxRetries: number;
  retryDelay: number;
  backoff: boolean;
}

const defaultPolicy: RetryPolicy = { maxRetries: 3, retryDelay: 5000, backoff: true };
let retryPolicy: RetryPolicy;

class EventQueue extends BullQueue<EventJob> {
  constructor() {
    super('hook-event-processing-queue');

    this.queue.process(this.processWork.bind(this));
  }

  private async processWork(job: Job) {
    const { eventUid, destinationId, attempt } = job.data;

    if (!eventUid) {
      logger.error(`No event UID found`);
      return;
    }

    const eventData = await getEventData(eventUid);

    if (!eventData) {
      logger.error(
        `Error in processing the queue ${this.queue.name}. No data found for the event : ${job.data.eventUid}`,
      );
      throw Error(
        `Error in procesing the queue ${this.queue.name}. No data found for the event : ${job.data.eventUid}`,
      );
    }

    logger.info(`⚙️ Processing event ${eventData.eventUid}`);

    // 1️⃣ Get destinations for this project
    const destinations = await getDestinationsByProjectId(eventData.projectId, destinationId);
    if (!destinations.length) {
      logger.warn(`No active destinations for project ${eventData.projectId}`);
      return;
    }

    // 2️⃣ For each destination, send webhook
    for (const dest of destinations) {
      const delivery = await createDelivery({
        eventId: eventData.id,
        destinationId: dest.id,
        attemptNo: attempt || 1,
      });

      try {
        const start = Date.now();

        const response = await sendToDestination(dest, eventData);

        const duration = Date.now() - start;
        await updateDelivery(delivery.id, {
          responseStatus: response.status,
          responseBody: response.data,
          durationMs: duration,
          final: true,
        });

        logger.info(`✅ Delivered to ${dest.name} (${dest.url})`);

        await updateEvent(eventData.eventUid, {
          status: EVENT_STATUS.COMPLETE,
        });
      } catch (err: any) {
        await updateEvent(eventData.eventUid, {
          status: EVENT_STATUS.FAILED,
        });

        await updateDelivery(delivery.id, {
          errorMessage: err.message,
          final: true,
        });

        logger.error(`❌ Failed to deliver to ${dest.name}: ${err.message}`);

        // Retry logic
        retryPolicy = this.parsePolicy(dest.retryPolicy);
        const nextAttempt = (attempt || 1) + 1;

        if (nextAttempt <= retryPolicy.maxRetries) {
          const delay = retryPolicy.backoff
            ? retryPolicy.retryDelay * Math.pow(2, nextAttempt - 1)
            : retryPolicy.retryDelay;

          logger.info(`🔁 Retrying ${dest.name} in ${delay}ms (Attempt ${nextAttempt})`);

          await this.addJob(
            {
              eventUid: job.data.eventUid,
              destinationId: dest.id.toString(),
              attempt: nextAttempt,
            },
            { delay },
          );
        } else {
          logger.error(
            `❌ Delivery failed permanently for ${dest.name} after ${retryPolicy.maxRetries} retries`,
          );
        }
        logger.error(`❌ Failed to deliver to ${dest.name}: ${err.message}`);
      }
    }
  }

  private parsePolicy(policy: any) {
    try {
      const dbPolicy: Partial<RetryPolicy> =
        typeof policy === 'string' ? JSON.parse(policy) : (policy as Partial<RetryPolicy>);
      return { ...defaultPolicy, ...dbPolicy };
    } catch {
      return defaultPolicy;
    }
  }
}

export const eventQueue = new EventQueue();
