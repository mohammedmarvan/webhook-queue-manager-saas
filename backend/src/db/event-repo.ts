import prisma from '../config/db';

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
