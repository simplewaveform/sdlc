import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { getDb } from '../db/db.js';

export const authRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль не менее 6 символов'),
  name: z.string().max(200).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль'),
});

const updateProfileSchema = z.object({
  email: z.string().email('Некорректный email').optional(),
  name: z.string().max(200).optional(),
});

function userRow(row) {
  return row
    ? {
        id: row.id,
        email: row.email,
        name: row.name,
        role: row.role,
        created_at: row.created_at,
      }
    : null;
}

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ error: 'Недействительный или истёкший токен' });
  }
}

authRouter.get('/me', requireAuth, (req, res) => {
  try {
    const db = getDb();
    const row = db
      .prepare('SELECT id, email, name, role, created_at FROM users WHERE id = ?')
      .get(req.user.id);
    if (!row) return res.status(404).json({ error: 'Пользователь не найден' });
    return res.json(userRow(row));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});

authRouter.patch('/me', requireAuth, (req, res) => {
  try {
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join('; ');
      return res.status(400).json({ error: msg });
    }
    const { email, name } = parsed.data;
    const db = getDb();
    if (email !== undefined) {
      const emailNorm = email.toLowerCase().trim();
      const other = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(emailNorm, req.user.id);
      if (other) return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
      db.prepare('UPDATE users SET email = ? WHERE id = ?').run(emailNorm, req.user.id);
    }
    if (name !== undefined) {
      db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name || null, req.user.id);
    }
    const row = db.prepare('SELECT id, email, name, role, created_at FROM users WHERE id = ?').get(req.user.id);
    return res.json(userRow(row));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка при обновлении профиля' });
  }
});

authRouter.delete('/me', requireAuth, (req, res) => {
  try {
    const db = getDb();
    const result = db.prepare('DELETE FROM users WHERE id = ?').run(req.user.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Пользователь не найден' });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка при удалении аккаунта' });
  }
});

authRouter.post('/login', (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join('; ');
      return res.status(400).json({ error: msg });
    }
    const { email, password } = parsed.data;
    const db = getDb();
    const row = db
      .prepare(
        'SELECT id, email, password_hash, name, role, created_at FROM users WHERE email = ?'
      )
      .get(email.toLowerCase().trim());
    if (!row || !bcrypt.compareSync(password, row.password_hash)) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }
    const user = userRow(row);
    const token = jwt.sign(
      { sub: row.id, role: row.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    return res.json({ token, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка входа' });
  }
});

authRouter.post('/register', (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join('; ');
      return res.status(400).json({ error: msg });
    }
    const { email, password, name } = parsed.data;
    const db = getDb();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'Пользователь с таким email уже зарегистрирован' });
    }
    const password_hash = bcrypt.hashSync(password, 10);
    const emailNorm = email.toLowerCase().trim();
    db.prepare(
      'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)'
    ).run(emailNorm, password_hash, name || null, 'client');
    const row = db.prepare('SELECT id, email, name, role, created_at FROM users WHERE email = ?').get(
      emailNorm
    );
    return res.status(201).json(userRow(row));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка при регистрации' });
  }
});
