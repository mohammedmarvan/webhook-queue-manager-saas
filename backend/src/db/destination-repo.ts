import { prisma } from '../config/db';

export async function getDestinationsByProjectId(
  projectId: bigint,
  destinationId?: bigint | null | undefined,
) {
  return prisma.destination.findMany({
    where: {
      projectId,
      status: 'active',
      ...(destinationId ? { id: BigInt(destinationId) } : {}),
    },
  });
}

export async function getDestinationById(destinationId: bigint) {
  return prisma.destination.findUnique({
    where: {
      id: destinationId,
    },
  });
}
