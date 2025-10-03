import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAdminPosts,
  fetchAdminPost,
  createPost,
  updatePost,
  deletePost,
  togglePublish,
  type PostPayload,
} from '@/features/admin/api/posts';

export const useAdminPosts = () => useQuery({ queryKey: ['admin', 'posts'], queryFn: fetchAdminPosts });

export const useAdminPost = (postId: string | undefined) =>
  useQuery({
    queryKey: ['admin', 'posts', postId],
    queryFn: () => {
      if (!postId) {
        throw new Error('postId is required');
      }
      return fetchAdminPost(postId);
    },
    enabled: Boolean(postId),
  });

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, payload }: { postId: string; payload: Partial<PostPayload> }) =>
      updatePost(postId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
    },
  });
};

export const useTogglePublish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, isPublished }: { postId: string; isPublished: boolean }) =>
      togglePublish(postId, isPublished),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
    },
  });
};
