import { customAlphabet } from 'nanoid';
import { db } from './client';
import type { MediaAsset } from '../types';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12);

export const addMediaAsset = (input: { filename: string; url: string; size: number }): MediaAsset => {
  const id = nanoid();
  db.prepare(
    'INSERT INTO media_assets (id, filename, url, size) VALUES (@id, @filename, @url, @size)',
  ).run({
    id,
    filename: input.filename,
    url: input.url,
    size: input.size,
  });
  return getMediaAsset(id)!;
};

export const getMediaAsset = (id: string): MediaAsset | null => {
  const row = db.prepare('SELECT * FROM media_assets WHERE id = @id').get({ id }) as any | undefined;
  if (!row) return null;
  return {
    id: row.id,
    filename: row.filename,
    url: row.url,
    size: row.size,
    createdAt: row.created_at,
  };
};

export const listMediaAssets = (): MediaAsset[] => {
  const rows = db.prepare('SELECT * FROM media_assets ORDER BY created_at DESC').all() as any[];
  return rows.map((row: any) => ({
    id: row.id,
    filename: row.filename,
    url: row.url,
    size: row.size,
    createdAt: row.created_at,
  }));
};
