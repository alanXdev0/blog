import { apiClient, resolveAssetUrl, useMockData } from '@/lib/apiClient';
import type { Project } from '@/types/content';
import { mockProjects } from '@/lib/mockData';

const mapProject = (project: Project): Project => ({
  ...project,
  image: resolveAssetUrl(project.image),
});

export const fetchProjects = async () => {
  if (useMockData) {
    return mockProjects.map(mapProject);
  }

  const response = await apiClient.get<Project[]>('/projects');
  return response.data.map(mapProject);
};
