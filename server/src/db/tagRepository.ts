import { db } from './client';
import type { Tag } from '../types';

export const listTags = (): Tag[] => {
  const rows = db.prepare('SELECT * FROM tags ORDER BY name ASC').all() as any[];
  return rows.map((row) => ({ id: row.id, name: row.name, color: row.color }));
};

export const createTag = (input: { id?: string; name: string; color?: string | null }): Tag => {
  const id = input.id ?? input.name.toLowerCase().replace(/\s+/g, '-');
  db.prepare('INSERT INTO tags (id, name, color) VALUES (@id, @name, @color)').run({
    id,
    name: input.name,
    color: input.color ?? null,
  });
  return { id, name: input.name, color: input.color ?? null };
};

export const deleteTag = (id: string) => {
  db.prepare('DELETE FROM tags WHERE id = @id').run({ id });
};
