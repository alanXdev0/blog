import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '@/lib/projectsApi';

export const useProjects = () =>
  useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });
