import { apiClient, resolveAssetUrl, useMockData } from '@/lib/apiClient';
import type { Post, PostCategory } from '@/types/content';
import { mockPosts } from '@/lib/mockData';

export interface PostFilterOptions {
  category?: PostCategory;
  featured?: boolean;
  search?: string;
}

const mapPost = (post: Post): Post => ({
  ...post,
  heroImage: resolveAssetUrl(post.heroImage),
});

export const fetchPosts = async (filters?: PostFilterOptions) => {
  if (useMockData) {
    let posts = [...mockPosts];
    if (filters?.category) {
      posts = posts.filter((post) => post.category === filters.category);
    }
    if (filters?.featured) {
      posts = posts.filter((post) => post.featured);
    }
    if (filters?.search) {
      const query = filters.search.toLowerCase();
      posts = posts.filter((post) => post.title.toLowerCase().includes(query));
    }
    return posts.map(mapPost);
  }

  const response = await apiClient.get<Post[]>('/posts', { params: filters });
  return response.data.map(mapPost);
};

export const fetchPost = async (idOrSlug: string) => {
  if (useMockData) {
    const post = mockPosts.find((entry) => entry.id === idOrSlug || entry.slug === idOrSlug);
    if (!post) {
      throw new Error('Post not found');
    }
    return mapPost(post);
  }

  const response = await apiClient.get<Post>(`/posts/${idOrSlug}`);
  return mapPost(response.data);
};
