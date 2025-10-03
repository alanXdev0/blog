import { apiClient, resolveAssetUrl, useMockData } from '@/lib/apiClient';
import type { Project } from '@/types/content';
import { mockProjects } from '@/lib/mockData';

type ProjectPayload = {
  name: string;
  description: string;
  link: string;
  image: string;
  status: string;
  sortOrder: number;
  techStack: string[];
};

const mapProject = (project: Project): Project => ({
  ...project,
  image: resolveAssetUrl(project.image),
});

export const fetchAdminProjects = async () => {
  if (useMockData) {
    return mockProjects.map(mapProject);
  }
  const response = await apiClient.get<Project[]>('/admin/projects');
  return response.data.map(mapProject);
};

export const createProject = async (payload: ProjectPayload) => {
  if (useMockData) {
    const project: Project = {
      id: crypto.randomUUID(),
      ...payload,
      tags: payload.techStack,
      techStack: payload.techStack,
      status: payload.status,
      sortOrder: payload.sortOrder,
    };
    mockProjects.push(project);
    return mapProject(project);
  }
  const response = await apiClient.post<Project>('/admin/projects', payload);
  return mapProject(response.data);
};

export const updateProject = async (id: string, payload: Partial<ProjectPayload>) => {
  if (useMockData) {
    const index = mockProjects.findIndex((project) => project.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    const existing = mockProjects[index];
    const updated: Project = {
      ...existing,
      ...payload,
      techStack: payload.techStack ?? existing.techStack,
      tags: payload.techStack ?? existing.tags,
      status: payload.status ?? existing.status,
      sortOrder: payload.sortOrder ?? existing.sortOrder,
    };
    mockProjects[index] = updated;
    return mapProject(updated);
  }
  const response = await apiClient.put<Project>(`/admin/projects/${id}`, payload);
  return mapProject(response.data);
};

export const deleteProject = async (id: string) => {
  if (useMockData) {
    const index = mockProjects.findIndex((project) => project.id === id);
    if (index >= 0) {
      mockProjects.splice(index, 1);
    }
    return;
  }
  await apiClient.delete(`/admin/projects/${id}`);
};

export type { ProjectPayload };
