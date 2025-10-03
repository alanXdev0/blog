import { apiClient, resolveAssetUrl, useMockData } from '@/lib/apiClient';
import type { Post } from '@/types/content';
import { mockPosts } from '@/lib/mockData';

export interface PostPayload {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: Post['category'];
  tags: string[];
  heroImage: string;
  publishedAt: string | null;
  isPublished: boolean;
  featured?: boolean;
}

const mapPost = (post: Post): Post => ({
  ...post,
  heroImage: resolveAssetUrl(post.heroImage),
});

export const fetchAdminPosts = async () => {
  if (useMockData) {
    return mockPosts.map(mapPost);
  }

  const response = await apiClient.get<Post[]>('/admin/posts');
  return response.data.map(mapPost);
};

export const fetchAdminPost = async (postId: string) => {
  if (useMockData) {
    const post = mockPosts.find((entry) => entry.id === postId || entry.slug === postId);
    if (!post) {
      throw new Error('Post not found');
    }
    return mapPost(post);
  }

  const response = await apiClient.get<Post>(`/admin/posts/${postId}`);
  return mapPost(response.data);
};

export const createPost = async (payload: PostPayload) => {
  if (useMockData) {
    const post: Post = {
      id: crypto.randomUUID(),
      title: payload.title,
      slug: payload.slug,
      excerpt: payload.excerpt,
      content: payload.content,
      category: payload.category,
      tags: payload.tags.map((tag) => ({ id: tag, name: tag })),
      heroImage: payload.heroImage,
      featured: Boolean(payload.featured),
      publishedAt: payload.publishedAt ?? new Date().toISOString(),
      isPublished: payload.isPublished,
      meta: {
        readingTime: '5 min',
        views: 0,
      },
    };
    mockPosts.unshift(post);
    return mapPost(post);
  }

  const response = await apiClient.post<Post>('/admin/posts', payload);
  return mapPost(response.data);
};

export const updatePost = async (postId: string, payload: Partial<PostPayload>) => {
  if (useMockData) {
    const index = mockPosts.findIndex((post) => post.id === postId);
    if (index === -1) {
      throw new Error('Post not found');
    }
    const current = mockPosts[index];
    const updated: Post = {
      ...current,
      ...payload,
      tags: payload.tags ? payload.tags.map((tag) => ({ id: tag, name: tag })) : current.tags,
      featured: payload.featured ?? current.featured,
      isPublished: payload.isPublished ?? current.isPublished,
      publishedAt: payload.publishedAt ?? current.publishedAt,
    };
    mockPosts[index] = updated;
    return mapPost(updated);
  }

  const response = await apiClient.put<Post>(`/admin/posts/${postId}`, payload);
  return mapPost(response.data);
};

export const deletePost = async (postId: string) => {
  if (useMockData) {
    const index = mockPosts.findIndex((post) => post.id === postId);
    if (index >= 0) {
      mockPosts.splice(index, 1);
    }
    return;
  }

  await apiClient.delete(`/admin/posts/${postId}`);
};

export const togglePublish = async (postId: string, shouldPublish: boolean) => {
  if (useMockData) {
    const post = mockPosts.find((entry) => entry.id === postId);
    if (!post) {
      throw new Error('Post not found');
    }
    post.isPublished = shouldPublish;
    post.publishedAt = shouldPublish ? new Date().toISOString() : post.publishedAt;
    return mapPost(post);
  }

  const response = await apiClient.patch<Post>(`/admin/posts/${postId}/publish`, {
    isPublished: shouldPublish,
  });
  return mapPost(response.data);
};
