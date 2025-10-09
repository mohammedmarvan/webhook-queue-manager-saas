import prisma from '../config/db';
import {
  type tableSearchParam,
  type projectCreateParam,
  type projectUpdateParam,
} from '../types/api-types';
import { format } from 'date-fns';

export const getProject = async (projectName: string) => {
  const project = await prisma.project.findFirst({
    where: { name: projectName },
    include: { sources: true },
  });
  return project;
};

export const getProjects = async (params: tableSearchParam) => {
  const take = Number(params.limit);
  const skip = (Number(params.page) - 1) * take;
  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where: { name: { contains: String(params.search), mode: 'insensitive' } },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.project.count({
      where: { name: { contains: String(params.search), mode: 'insensitive' } },
    }),
  ]);

  // Format createdAt before returning
  const formatted = projects.map((p) => ({
    ...p,
    createdAt: format(p.createdAt, 'yyyy-MM-dd HH:mm:ss'), // e.g. 2025-10-09 15:42:08
  }));
  return {
    data: formatted,
    total,
  };
};

export const getProjectById = async (projectId: bigint) => {
  return await prisma.project.findUnique({ where: { id: projectId } });
};

export const createProject = async (params: projectCreateParam) => {
  return await prisma.project.create({ data: params });
};

export const updateProject = async (projectId: bigint, param: projectUpdateParam) => {
  return await prisma.project.update({
    where: {
      id: projectId,
    },
    data: param,
  });
};

export const deleteProject = async (projectId: bigint) => {
  return await prisma.project.delete({
    where: {
      id: projectId,
    },
  });
};
