import prisma from '../config/db';
import { type tableSearchParam } from '../types/api-types';

export const getSource = async (sourceName: string) => {
  const source = await prisma.source.findFirst({
    where: { name: sourceName },
    include: { project: true },
  });

  return source;
};

export const getActiveSource = async (sourceMap: string, projectId?: number | bigint) => {
  const source = await prisma.source.findFirst({
    where: {
      OR: [{ token: sourceMap }, { urlPath: sourceMap }],
      ...(projectId !== undefined ? { projectId, status: 'active' } : { status: 'active' }),
    },
  });

  return source;
};

export const getSources = async (params: tableSearchParam) => {
  const take = Number(params.limit);
  const skip = (Number(params.page) - 1) * take;
  const [sources, total] = await Promise.all([
    prisma.source.findMany({
      where: { name: { contains: String(params.search), mode: 'insensitive' } },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { project: true }, // Include project details
    }),
    prisma.source.count({
      where: { name: { contains: String(params.search), mode: 'insensitive' } },
    }),
  ]);

  return {
    data: sources,
    total,
  };
};

export const getSourceById = async (sourceId: bigint) => {
  return await prisma.source.findUnique({
    where: { id: sourceId },
    include: { project: true },
  });
};

export const createSource = async (params: {
  projectId: bigint;
  name: string;
  token: string;
  urlPath: string;
  status?: 'active' | 'disabled';
}) => {
  return await prisma.source.create({
    data: {
      ...params,
      status: params.status || 'active',
    },
  });
};

export const updateSource = async (
  sourceId: bigint,
  param: {
    name?: string;
    urlPath?: string;
    status?: 'active' | 'disabled';
  },
) => {
  return await prisma.source.update({
    where: {
      id: sourceId,
    },
    data: param,
  });
};

export const deleteSource = async (sourceId: bigint) => {
  return await prisma.source.delete({
    where: {
      id: sourceId,
    },
  });
};
