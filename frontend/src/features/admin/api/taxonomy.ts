import { apiClient, useMockData } from '@/lib/apiClient';
import { fetchTaxonomy } from '@/lib/taxonomyApi';

export const fetchAdminTaxonomy = async () => {
  if (useMockData) {
    return fetchTaxonomy();
  }
  const response = await apiClient.get('/admin/taxonomy');
  return response.data as { categories: { id: string; name: string }[]; tags: { id: string; name: string; color?: string | null }[] };
};

export const createCategory = async (name: string) => {
  const response = await apiClient.post('/admin/taxonomy/categories', { name });
  return response.data as { id: string; name: string };
};

export const removeCategory = async (id: string) => {
  await apiClient.delete(`/admin/taxonomy/categories/${id}`);
};

export const createTag = async (input: { name: string; color?: string }) => {
  const response = await apiClient.post('/admin/taxonomy/tags', input);
  return response.data as { id: string; name: string; color?: string | null };
};

export const removeTag = async (id: string) => {
  await apiClient.delete(`/admin/taxonomy/tags/${id}`);
};
