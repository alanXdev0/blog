import { apiClient, useMockData } from '@/lib/apiClient';
import { addMediaAsset, listMediaAssets } from '@/lib/mockMedia';

export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  size: number;
  createdAt: string;
}

export const fetchMediaAssets = async (): Promise<MediaAsset[]> => {
  if (useMockData) {
    return listMediaAssets();
  }
  const response = await apiClient.get<MediaAsset[]>('/admin/media');
  return response.data;
};

export const uploadMediaAsset = async (file: File): Promise<MediaAsset> => {
  if (useMockData) {
    return addMediaAsset(file);
  }
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post<MediaAsset>('/admin/media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
