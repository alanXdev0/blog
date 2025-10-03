import { db } from './client';

export const runMigrations = () => {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      hero_image TEXT NOT NULL,
      is_published INTEGER NOT NULL DEFAULT 0,
      featured INTEGER NOT NULL DEFAULT 0,
      published_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      reading_time TEXT DEFAULT '5 min',
      views INTEGER NOT NULL DEFAULT 0
    );
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      color TEXT
    );
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS post_tags (
      post_id TEXT NOT NULL,
      tag_id TEXT NOT NULL,
      PRIMARY KEY (post_id, tag_id),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      link TEXT NOT NULL,
      image TEXT NOT NULL,
      tags TEXT
    );
  `).run();

  ensureProjectColumns();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS media_assets (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      url TEXT NOT NULL,
      size INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `).run();
};

const ensureProjectColumns = () => {
  const columns = db.prepare('PRAGMA table_info(projects)').all() as { name: string }[];

  const addColumn = (name: string, definition: string) => {
    if (!columns.some((column) => column.name === name)) {
      db.prepare(`ALTER TABLE projects ADD COLUMN ${name} ${definition}`).run();
    }
  };

  addColumn('tech_stack', 'TEXT');
  addColumn("status", "TEXT NOT NULL DEFAULT 'active'");
  addColumn('sort_order', 'INTEGER NOT NULL DEFAULT 0');
};
