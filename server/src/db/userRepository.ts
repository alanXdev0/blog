import { db } from './client';
import type { User } from '../types';

const mapUser = (row: any): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  passwordHash: row.password_hash,
  createdAt: row.created_at,
});

export const findUserByEmail = (email: string): User | null => {
  const row = db
    .prepare('SELECT * FROM users WHERE lower(email) = lower(@email) LIMIT 1')
    .get({ email });
  return row ? mapUser(row) : null;
};

export const findUserById = (id: string): User | null => {
  const row = db.prepare('SELECT * FROM users WHERE id = @id LIMIT 1').get({ id });
  return row ? mapUser(row) : null;
};
