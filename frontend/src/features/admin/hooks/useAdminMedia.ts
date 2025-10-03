import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMediaAssets, uploadMediaAsset, type MediaAsset } from '@/features/admin/api/media';

export const useAdminMediaAssets = () =>
  useQuery({
    queryKey: ['admin', 'media'],
    queryFn: fetchMediaAssets,
  });

export const useUploadMediaAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadMediaAsset,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'media'] });
    },
  });
};

export type { MediaAsset };
