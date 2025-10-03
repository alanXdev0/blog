import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import {
  listPosts,
  getPostByIdOrSlug,
  createPost,
  updatePost,
  deletePost,
  setPublishState,
  type PostPayload,
} from '../db/postRepository';

const sanitizePayload = (req: Request): PostPayload => ({
  title: req.body.title,
  slug: req.body.slug,
  excerpt: req.body.excerpt,
  content: req.body.content,
  category: req.body.category,
  heroImage: req.body.heroImage,
  tags: Array.isArray(req.body.tags)
    ? (req.body.tags as string[]).map((tag) => tag.trim()).filter(Boolean)
    : typeof req.body.tags === 'string'
    ? req.body.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
    : [],
  isPublished: Boolean(req.body.isPublished),
  featured: Boolean(req.body.featured),
  publishedAt: req.body.publishedAt ?? null,
  readingTime: req.body.readingTime ?? undefined,
});

export const postValidators = [
  body('title').isLength({ min: 4 }),
  body('slug').matches(/^[a-z0-9-]+$/),
  body('excerpt').isLength({ min: 20 }),
  body('content').isLength({ min: 20 }),
  body('category').isString(),
  body('heroImage').isString(),
];

export const listPublicPosts = (req: Request, res: Response) => {
  const posts = listPosts({
    category: typeof req.query.category === 'string' ? req.query.category : undefined,
    featured: typeof req.query.featured === 'string' ? req.query.featured === 'true' : undefined,
    search: typeof req.query.search === 'string' ? req.query.search : undefined,
  }).filter((post) => post.isPublished);
  res.json(posts);
};

export const getPublicPost = (req: Request, res: Response) => {
  const post = getPostByIdOrSlug(req.params.id);
  if (!post || !post.isPublished) {
    return res.status(404).json({ message: 'Post not found' });
  }
  res.json(post);
};

export const listAdminPosts = (req: Request, res: Response) => {
  res.json(listPosts());
};

export const getAdminPost = (req: Request, res: Response) => {
  const post = getPostByIdOrSlug(req.params.id);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  res.json(post);
};

export const createAdminPost = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const post = createPost(sanitizePayload(req));
  res.status(201).json(post);
};

export const updateAdminPost = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const post = updatePost(req.params.id, sanitizePayload(req));
  res.json(post);
};

export const publishAdminPost = (req: Request, res: Response) => {
  const post = setPublishState(req.params.id, Boolean(req.body.isPublished));
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  res.json(post);
};

export const deleteAdminPostHandler = (req: Request, res: Response) => {
  deletePost(req.params.id);
  res.status(204).end();
};
