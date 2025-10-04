export type PostCategory = string;

export interface PostTag {
  id: string;
  name: string;
  color?: string;
}

export interface PostMeta {
  readingTime: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: PostCategory;
  tags: PostTag[];
  heroImage: string;
  featured?: boolean;
  publishedAt: string | null;
  isPublished: boolean;
  meta?: PostMeta;
  readingTime?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
  image: string;
  tags: string[];
  techStack: string[];
  status: string;
  sortOrder: number;
}
