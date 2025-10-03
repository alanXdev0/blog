import { useQuery } from '@tanstack/react-query';
import { fetchPosts, type PostFilterOptions } from '@/lib/postsApi';

export const usePosts = (filters?: PostFilterOptions) =>
  useQuery({
    queryKey: ['posts', filters],
    queryFn: () => fetchPosts(filters),
  });
