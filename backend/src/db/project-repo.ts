import prisma from '../config/db';

export const getProject = async (projectName: string) => {
  const project = await prisma.project.findFirst({
    where: { name: projectName },
    include: { sources: true },
  });
  return project;
};
