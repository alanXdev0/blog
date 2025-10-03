import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchAdminTaxonomy,
  createCategory,
  removeCategory,
  createTag,
  removeTag,
} from '@/features/admin/api/taxonomy';

export const useAdminTaxonomy = () =>
  useQuery({
    queryKey: ['admin', 'taxonomy'],
    queryFn: fetchAdminTaxonomy,
  });

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'taxonomy'] });
      void queryClient.invalidateQueries({ queryKey: ['taxonomy'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeCategory,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'taxonomy'] });
      void queryClient.invalidateQueries({ queryKey: ['taxonomy'] });
    },
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'taxonomy'] });
      void queryClient.invalidateQueries({ queryKey: ['taxonomy'] });
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeTag,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'taxonomy'] });
      void queryClient.invalidateQueries({ queryKey: ['taxonomy'] });
    },
  });
};
