export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  heroImage: string;
  isPublished: boolean;
  featured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  readingTime: string;
  views: number;
  tags: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  color?: string | null;
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

export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  size: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}
