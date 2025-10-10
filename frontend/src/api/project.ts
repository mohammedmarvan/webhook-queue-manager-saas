import api from './client';
import { type Project } from '../types/models';

export async function getProjects(): Promise<Project[]> {
  const res = await api.get('/projects');
  return res.data;
}

export async function createProject(data: Partial<Project>) {
  const res = await api.post('/projects', data);
  return res.data;
}

export async function deleteProject(id: string | number) {
  const res = await api.delete(`/projects/${id}`);

  return res.data;
}

export async function getProject(projectId: string) {
  const res = await api.get(`/projects/${projectId}`);

  return res.data;
}

export async function updateProject(data: Project) {
  const res = await api.put(`/projects/${data.id}`, data);

  return res.data;
}
