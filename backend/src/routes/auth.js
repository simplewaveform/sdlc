import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { getDb } from '../db/db.js';

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль не менее 6 символов'),
  name: z.string().max(200).optional(),
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
    return res.status(201).json(row);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Ошибка при регистрации' });
  }
});
