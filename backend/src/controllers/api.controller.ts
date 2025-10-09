import { getDashboardData } from '../db/dashboard-repo';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../db/project-repo';
import {
  getSources,
  getSourceById,
  createSource,
  updateSource,
  deleteSource,
} from '../db/source-repo';
import {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../db/destination-repo';
import {
  type tableSearchParam,
  type projectCreateParam,
  type projectUpdateParam,
  type sourceCreateParam,
  type sourceUpdateParam,
  type destinationCreateParam,
  type destinationUpdateParam,
} from '../types/api-types';

export const getDashboardInfo = async () => {
  return await getDashboardData();
};

export const getProjectsData = async (params: tableSearchParam) => {
  return await getProjects(params);
};

export const getProjectByIdData = async (projectId: bigint) => {
  return await getProjectById(projectId);
};

export const createProjectData = async (params: projectCreateParam) => {
  return await createProject(params);
};

export const updateProjectData = async (projectId: bigint, params: projectUpdateParam) => {
  return await updateProject(projectId, params);
};

export const deleteProjectData = async (projectId: bigint) => {
  return await deleteProject(projectId);
};

export const getSourcesData = async (params: tableSearchParam) => {
  return await getSources(params);
};

export const getSourceByIdData = async (sourceId: bigint) => {
  return await getSourceById(sourceId);
};

export const createSourceData = async (params: sourceCreateParam) => {
  return await createSource(params);
};

export const updateSourceData = async (sourceId: bigint, params: sourceUpdateParam) => {
  return await updateSource(sourceId, params);
};

export const deleteSourceData = async (sourceId: bigint) => {
  return await deleteSource(sourceId);
};

export const getDestinationsData = async (params: tableSearchParam) => {
  return await getDestinations(params);
};

export const getDestinationByIdData = async (destinationId: bigint) => {
  return await getDestinationById(destinationId);
};

export const createDestinationData = async (params: destinationCreateParam) => {
  return await createDestination(params);
};

export const updateDestinationData = async (
  destinationId: bigint,
  params: destinationUpdateParam,
) => {
  return await updateDestination(destinationId, params);
};

export const deleteDestinationData = async (destinationId: bigint) => {
  return await deleteDestination(destinationId);
};
