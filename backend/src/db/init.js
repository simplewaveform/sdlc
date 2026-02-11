import { pool } from './pool.js';

const schema = `
CREATE TABLE IF NOT EXISTS cars (
  id SERIAL PRIMARY KEY,
  model VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  price_per_day_byn DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  description TEXT,
  transmission VARCHAR(50),
  fuel VARCHAR(50),
  engine_volume VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
`;

async function init() {
  const client = await pool.connect();
  try {
    await client.query(schema);
    console.log('Schema created.');
  } finally {
    client.release();
    await pool.end();
  }
}

init().catch((e) => {
  console.error(e);
  process.exit(1);
});
