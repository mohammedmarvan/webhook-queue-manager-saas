import { prisma } from '../config/db';
import { type tableSearchParam } from '../types/api-types';

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

export const getDestinations = async (params: tableSearchParam) => {
  const take = Number(params.limit);
  const skip = (Number(params.page) - 1) * take;
  const [destinations, total] = await Promise.all([
    prisma.destination.findMany({
      where: { name: { contains: String(params.search), mode: 'insensitive' } },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { project: true }, // Include project details
    }),
    prisma.destination.count({
      where: { name: { contains: String(params.search), mode: 'insensitive' } },
    }),
  ]);

  return {
    data: destinations,
    total,
  };
};

export const createDestination = async (params: {
  projectId: bigint;
  name: string;
  url: string;
  secret: string;
  retryPolicy: any;
  timeoutMs?: number;
  status?: 'active' | 'disabled';
}) => {
  return await prisma.destination.create({
    data: {
      ...params,
      timeoutMs: params.timeoutMs || 5000,
      status: params.status || 'active',
    },
  });
};

export const updateDestination = async (
  destinationId: bigint,
  param: {
    name?: string;
    url?: string;
    secret?: string;
    retryPolicy?: any;
    timeoutMs?: number;
    status?: 'active' | 'disabled';
  },
) => {
  return await prisma.destination.update({
    where: {
      id: destinationId,
    },
    data: param,
  });
};

export const deleteDestination = async (destinationId: bigint) => {
  return await prisma.destination.delete({
    where: {
      id: destinationId,
    },
  });
};
