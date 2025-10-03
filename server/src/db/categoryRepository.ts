import { db } from './client';

export interface Category {
  id: string;
  name: string;
}

export const listCategories = (): Category[] => {
  const rows = db.prepare('SELECT * FROM categories ORDER BY name ASC').all() as any[];
  return rows.map((row) => ({ id: row.id, name: row.name }));
};

export const createCategory = (name: string): Category => {
  const id = name.toLowerCase().replace(/\s+/g, '-');
  db.prepare('INSERT INTO categories (id, name) VALUES (@id, @name)').run({ id, name });
  return { id, name };
};

export const deleteCategory = (id: string) => {
  db.prepare('DELETE FROM categories WHERE id = @id').run({ id });
};
