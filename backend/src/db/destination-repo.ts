import { prisma } from '../config/db';

export async function getDestinationsByProjectId(projectId: bigint) {
  return prisma.destination.findMany({
    where: {
      projectId,
      status: 'active',
    },
  });
}
