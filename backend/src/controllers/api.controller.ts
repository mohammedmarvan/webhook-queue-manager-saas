import { getDashboardData } from "../db/dashboard-repo"
import { getProjects, getProjectById, createProject, updateProject, deleteProject } from "../db/project-repo";
import { type tableSearchParam, type projectCreateParam, type projectUpdateParam } from "../types/api-types"

export const getDashboardInfo = async() => {
    return await getDashboardData();
}

export const getProjectsData = async(params: tableSearchParam) => {
    return await getProjects(params);
}

export const getProjectByIdData = async(projectId: bigint) => {
    return await getProjectById(projectId);
}

export const createProjectData = async(params: projectCreateParam) => {
    return await createProject(params);
}

export const updateProjectData = async(projectId: bigint, params: projectUpdateParam) => {
    return await updateProject(projectId, params);
}

export const deleteProjectData = async(projectId: bigint) => {
    return await deleteProject(projectId);
}