import { customAlphabet } from 'nanoid';
import { db } from './client';
import type { Post, Tag } from '../types';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12);

const mapPost = (row: any, tags: Tag[]): Post => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  excerpt: row.excerpt,
  content: row.content,
  category: row.category,
  heroImage: row.hero_image,
  isPublished: Boolean(row.is_published),
  featured: Boolean(row.featured),
  publishedAt: row.published_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  readingTime: row.reading_time,
  views: row.views,
  tags,
});

const mapTagRow = (row: any): Tag => ({ id: row.id, name: row.name, color: row.color });

export interface PostFilters {
  category?: string;
  featured?: boolean;
  search?: string;
}

export const listPosts = (filters: PostFilters = {}): Post[] => {
  const conditions: string[] = [];
  const params: Record<string, unknown> = {};

  if (filters.category) {
    conditions.push('category = @category');
    params.category = filters.category;
  }
  if (typeof filters.featured === 'boolean') {
    conditions.push('featured = @featured');
    params.featured = filters.featured ? 1 : 0;
  }
  if (filters.search) {
    conditions.push('(title LIKE @search OR excerpt LIKE @search)');
    params.search = `%${filters.search}%`;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const rows = db
    .prepare(`SELECT * FROM posts ${whereClause} ORDER BY CASE WHEN published_at IS NULL THEN 1 ELSE 0 END, datetime(published_at) DESC, datetime(created_at) DESC`)
    .all(params) as any[];

  const getTags = db.prepare(
    `SELECT t.* FROM tags t INNER JOIN post_tags pt ON pt.tag_id = t.id WHERE pt.post_id = @postId ORDER BY t.name ASC`,
  );

  return rows.map((row: any) => {
    const tagRows = getTags.all({ postId: row.id }) as any[];
    return mapPost(row, tagRows.map(mapTagRow));
  });
};

export const getPostByIdOrSlug = (idOrSlug: string): Post | null => {
  const row = db
    .prepare('SELECT * FROM posts WHERE id = @idOrSlug OR slug = @idOrSlug LIMIT 1')
    .get({ idOrSlug }) as any | undefined;
  if (!row) return null;
  const tags = (db
    .prepare(
      'SELECT t.* FROM tags t INNER JOIN post_tags pt ON pt.tag_id = t.id WHERE pt.post_id = @postId ORDER BY t.name ASC',
    )
    .all({ postId: row.id }) as any[]).map(mapTagRow);
  return mapPost(row, tags);
};

export interface PostPayload {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  heroImage: string;
  tags: string[];
  isPublished: boolean;
  featured?: boolean;
  publishedAt?: string | null;
  readingTime?: string;
}

export const createPost = (payload: PostPayload): Post => {
  const postId = nanoid();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO posts (id, title, slug, excerpt, content, category, hero_image, is_published, featured, published_at, created_at, updated_at, reading_time)
     VALUES (@id, @title, @slug, @excerpt, @content, @category, @hero_image, @is_published, @featured, @published_at, @created_at, @updated_at, @reading_time)`,
  ).run({
    id: postId,
    title: payload.title,
    slug: payload.slug,
    excerpt: payload.excerpt,
    content: payload.content,
    category: payload.category,
    hero_image: payload.heroImage,
    is_published: payload.isPublished ? 1 : 0,
    featured: payload.featured ? 1 : 0,
    published_at: payload.isPublished ? payload.publishedAt ?? now : null,
    created_at: now,
    updated_at: now,
    reading_time: payload.readingTime ?? '5 min read',
  });

  syncTagsForPost(postId, payload.tags);
  return getPostByIdOrSlug(postId)!;
};

export const updatePost = (postId: string, payload: Partial<PostPayload>): Post => {
  const fields: string[] = [];
  const params: Record<string, unknown> = { id: postId };

  const mapping: Record<keyof Partial<PostPayload>, string> = {
    title: 'title',
    slug: 'slug',
    excerpt: 'excerpt',
    content: 'content',
    category: 'category',
    heroImage: 'hero_image',
    isPublished: 'is_published',
    featured: 'featured',
    publishedAt: 'published_at',
    tags: 'tags',
    readingTime: 'reading_time',
  } as const;

  (Object.keys(payload) as (keyof PostPayload)[]).forEach((key) => {
    if (key === 'tags') {
      return;
    }
    const column = mapping[key];
    if (!column) {
      return;
    }
    if (key === 'isPublished') {
      fields.push(`${column} = @${key}`);
      params[key] = payload[key] ? 1 : 0;
      if (payload[key] && !payload.publishedAt) {
        fields.push("published_at = COALESCE(published_at, datetime('now'))");
      }
    } else if (key === 'featured') {
      fields.push(`${column} = @${key}`);
      params[key] = payload[key] ? 1 : 0;
    } else {
      fields.push(`${column} = @${key}`);
      params[key] = payload[key];
    }
  });

  if (fields.length > 0) {
    fields.push("updated_at = datetime('now')");
    db.prepare(`UPDATE posts SET ${fields.join(', ')} WHERE id = @id`).run(params);
  }

  if (payload.tags) {
    syncTagsForPost(postId, payload.tags);
  }

  return getPostByIdOrSlug(postId)!;
};

export const deletePost = (postId: string) => {
  db.prepare('DELETE FROM posts WHERE id = @id').run({ id: postId });
};

export const setPublishState = (postId: string, shouldPublish: boolean): Post | null => {
  db.prepare(
    `UPDATE posts SET is_published = @is_published, published_at = CASE WHEN @is_published = 1 THEN COALESCE(published_at, datetime('now')) ELSE published_at END, updated_at = datetime('now') WHERE id = @id`,
  ).run({ id: postId, is_published: shouldPublish ? 1 : 0 });
  return getPostByIdOrSlug(postId);
};

const syncTagsForPost = (postId: string, tagNames: string[]) => {
  const insertTag = db.prepare('INSERT OR IGNORE INTO tags (id, name) VALUES (@id, @name)');
  const linkTag = db.prepare('INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (@post_id, @tag_id)');
  const deleteLinks = db.prepare('DELETE FROM post_tags WHERE post_id = @post_id');

  deleteLinks.run({ post_id: postId });

  tagNames.forEach((tagName) => {
    const id = tagName.toLowerCase().replace(/\s+/g, '-');
    insertTag.run({ id, name: tagName });
    linkTag.run({ post_id: postId, tag_id: id });
  });
};
