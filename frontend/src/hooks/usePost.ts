import { useQuery } from '@tanstack/react-query';
import { fetchPost } from '@/lib/postsApi';

export const usePost = (idOrSlug: string | undefined) =>
  useQuery({
    queryKey: ['post', idOrSlug],
    enabled: Boolean(idOrSlug),
    queryFn: () => {
      if (!idOrSlug) {
        throw new Error('Missing post identifier');
      }
      return fetchPost(idOrSlug);
    },
  });
