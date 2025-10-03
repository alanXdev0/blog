import { apiClient, useMockData } from '@/lib/apiClient';
import { DEFAULT_POST_CATEGORIES } from '@/constants/categories';
import { mockPosts } from '@/lib/mockData';

export interface TaxonomyResponse {
  categories: { id: string; name: string }[];
  tags: { id: string; name: string; color?: string | null }[];
}

export const fetchTaxonomy = async (): Promise<TaxonomyResponse> => {
  if (useMockData) {
    const categories = DEFAULT_POST_CATEGORIES.map((name) => ({ id: name.toLowerCase(), name }));
    const tagMap = new Map<string, { id: string; name: string; color?: string | null }>();
    mockPosts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagMap.set(tag.id, { id: tag.id, name: tag.name, color: tag.color });
      });
    });
    return { categories, tags: Array.from(tagMap.values()) };
  }

  const response = await apiClient.get<TaxonomyResponse>('/taxonomy');
  return response.data;
};
