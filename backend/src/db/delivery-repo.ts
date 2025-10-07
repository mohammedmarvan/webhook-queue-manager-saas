import { prisma } from '../config/db';

interface CreateDeliveryParams {
  eventId: bigint;
  destinationId: bigint;
  attemptNo: number;
}

export async function createDelivery(params: CreateDeliveryParams) {
  return prisma.delivery.create({ data: params });
}

export async function updateDelivery(id: bigint, data: Record<string, any>) {
  return prisma.delivery.update({
    where: { id },
    data,
  });
}
