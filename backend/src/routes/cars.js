import { Router } from 'express';
import { getDb } from '../db/db.js';

export const carsRouter = Router();

carsRouter.get('/', (req, res) => {
  try {
    const { model, maxPrice } = req.query;
    const db = getDb();
    let query = 'SELECT * FROM cars ORDER BY model';
    const params = [];
    const conditions = [];

    if (model && String(model).trim()) {
      params.push(`%${String(model).trim().toLowerCase()}%`);
      conditions.push('LOWER(model) LIKE LOWER(?)');
    }
    if (maxPrice != null && maxPrice !== '') {
      const num = Number(maxPrice);
      if (!Number.isNaN(num) && num >= 0) {
        params.push(num);
        conditions.push('price_per_day_byn <= ?');
      }
    }
    if (conditions.length) {
      query = `SELECT * FROM cars WHERE ${conditions.join(' AND ')} ORDER BY model`;
    }

    const rows = db.prepare(query).all(...params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

carsRouter.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const row = db.prepare('SELECT * FROM cars WHERE id = ?').get(id);
    if (!row) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch car' });
  }
});
