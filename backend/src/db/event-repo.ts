import prisma from '../config/db';
import { tableSearchParam } from '../types/api-types';
import { format } from 'date-fns';

export type createEventParam = {
  projectId: bigint | number;
  sourceId: bigint | number;
  payload: any;
  headers: any;
};

export type eventUid = string;

export const createEvent = async (param: createEventParam) => {
  const event = await prisma.event.create({
    data: {
      projectId: param.projectId,
      sourceId: param.sourceId,
      payload: param.payload,
      headers: param.headers,
      status: 'received',
    },
  });

  return event;
};

export const getEventData = async (eventUid: eventUid) => {
  const event = await prisma.event.findUnique({ where: { eventUid: eventUid } });

  return event;
};

export const updateEvent = async (eventUid: eventUid, data: Record<string, any>) => {
  return prisma.event.update({ where: { eventUid: eventUid }, data });
};

export const getEvents = async (params: tableSearchParam) => {
  const take = Number(params.limit);
  const skip = (Number(params.page) - 1) * take;

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where: {
        OR: [
          params.search
            ? { eventUid: String(params.search) } // exact match only
            : {},
          { project: { name: { contains: String(params.search), mode: 'insensitive' } } },
          { source: { name: { contains: String(params.search), mode: 'insensitive' } } },
        ],
      },
      skip,
      take,
      orderBy: { receivedAt: 'desc' },
      include: {
        project: { select: { name: true } },
        source: { select: { name: true } },
        deliveries: {
          include: {
            destination: { select: { name: true } },
          },
        },
      },
    }),
    prisma.event.count({
      where: {
        OR: [
          params.search ? { eventUid: String(params.search) } : {},
          { project: { name: { contains: String(params.search), mode: 'insensitive' } } },
          { source: { name: { contains: String(params.search), mode: 'insensitive' } } },
        ],
      },
    }),
  ]);

  const formatted = events.map((e) => ({
    ...e,
    receivedAt: format(e.receivedAt, 'yyyy-MM-dd HH:mm:ss'),
    completedAt: e.completedAt ? format(e.completedAt, 'yyyy-MM-dd HH:mm:ss') : null,
    projectName: e.project?.name ?? '',
    sourceName: e.source?.name ?? '',
    deliveries: e.deliveries.map((d) => ({
      ...d,
      destinationName: d.destination?.name ?? '',
    })),
  }));

  return {
    data: formatted,
    total,
  };
};
