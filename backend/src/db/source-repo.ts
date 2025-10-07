import prisma from '../config/db';

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
      ...(projectId !== undefined ? { projectId } : {}),
    },
  });

  return source;
};
