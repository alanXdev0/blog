import { customAlphabet } from 'nanoid';
import { db } from './client';
import type { Project } from '../types';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12);

const mapRowToProject = (row: any): Project => ({
  id: row.id,
  name: row.name,
  description: row.description,
  link: row.link,
  image: row.image,
  tags: row.tags ? JSON.parse(row.tags) : [],
  techStack: row.tech_stack ? JSON.parse(row.tech_stack) : [],
  status: row.status ?? 'active',
  sortOrder: row.sort_order ?? 0,
});

export interface ProjectInput {
  name: string;
  description: string;
  link: string;
  image: string;
  status?: string;
  sortOrder?: number;
  techStack?: string[];
  tags?: string[];
}

export const listProjects = (): Project[] => {
  const rows = db
    .prepare("SELECT * FROM projects WHERE status = 'active' ORDER BY sort_order ASC, name ASC")
    .all();
  return rows.map(mapRowToProject);
};

export const listAllProjects = (): Project[] => {
  const rows = db.prepare('SELECT * FROM projects ORDER BY sort_order ASC, name ASC').all();
  return rows.map(mapRowToProject);
};

export const createProject = (input: ProjectInput): Project => {
  const id = nanoid();
  const techStack = input.techStack ?? input.tags ?? [];
  const tags = input.tags ?? techStack;
  db.prepare(
    `INSERT INTO projects (id, name, description, link, image, tags, tech_stack, status, sort_order)
     VALUES (@id, @name, @description, @link, @image, @tags, @tech_stack, @status, @sort_order)`,
  ).run({
    id,
    name: input.name,
    description: input.description,
    link: input.link,
    image: input.image,
    tags: JSON.stringify(tags),
    tech_stack: JSON.stringify(techStack),
    status: input.status ?? 'active',
    sort_order: input.sortOrder ?? 0,
  });
  return mapRowToProject(
    db.prepare('SELECT * FROM projects WHERE id = @id').get({ id }),
  );
};

export const updateProject = (id: string, input: Partial<ProjectInput>): Project => {
  const existing = db.prepare('SELECT * FROM projects WHERE id = @id').get({ id }) as any;
  if (!existing) {
    throw new Error('Project not found');
  }

  const techStack =
    input.techStack ?? (existing.tech_stack ? JSON.parse(existing.tech_stack) : []);
  const tags = input.tags ?? (existing.tags ? JSON.parse(existing.tags) : techStack);
  const shouldUpdateTags = typeof input.tags !== 'undefined' || typeof input.techStack !== 'undefined';

  db.prepare(
    `UPDATE projects SET
      name = COALESCE(@name, name),
      description = COALESCE(@description, description),
      link = COALESCE(@link, link),
      image = COALESCE(@image, image),
      tags = COALESCE(@tags, tags),
      tech_stack = COALESCE(@tech_stack, tech_stack),
      status = COALESCE(@status, status),
      sort_order = COALESCE(@sort_order, sort_order)
    WHERE id = @id`,
  ).run({
    id,
    name: input.name,
    description: input.description,
    link: input.link,
    image: input.image,
    tags: shouldUpdateTags ? JSON.stringify(tags) : undefined,
    tech_stack: typeof input.techStack !== 'undefined' ? JSON.stringify(techStack) : undefined,
    status: input.status,
    sort_order: input.sortOrder,
  });

  return mapRowToProject(
    db.prepare('SELECT * FROM projects WHERE id = @id').get({ id }),
  );
};

export const deleteProject = (id: string) => {
  db.prepare('DELETE FROM projects WHERE id = @id').run({ id });
};
