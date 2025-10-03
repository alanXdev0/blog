import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchAdminProjects,
  createProject,
  updateProject,
  deleteProject,
  type ProjectPayload,
} from '@/features/admin/api/projects';

export const useAdminProjects = () =>
  useQuery({
    queryKey: ['admin', 'projects'],
    queryFn: fetchAdminProjects,
  });

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] });
      void queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ProjectPayload> }) =>
      updateProject(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] });
      void queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] });
      void queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export type { ProjectPayload };
