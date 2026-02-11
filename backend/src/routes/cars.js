import { Router } from 'express';
import { pool } from '../db/pool.js';

export const carsRouter = Router();

carsRouter.get('/', async (req, res) => {
  try {
    const { model, maxPrice } = req.query;
    let query = 'SELECT * FROM cars ORDER BY model';
    const params = [];
    const conditions = [];

    if (model && String(model).trim()) {
      params.push(`%${String(model).trim()}%`);
      conditions.push(`model ILIKE $${params.length}`);
    }
    if (maxPrice != null && maxPrice !== '') {
      const num = Number(maxPrice);
      if (!Number.isNaN(num) && num >= 0) {
        params.push(num);
        conditions.push(`price_per_day_byn <= $${params.length}`);
      }
    }
    if (conditions.length) {
      query = `SELECT * FROM cars WHERE ${conditions.join(' AND ')} ORDER BY model`;
    }

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

carsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM cars WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch car' });
  }
});
