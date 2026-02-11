import { pool } from './pool.js';

const cars = [
  {
    model: 'Geely Coolray',
    year: 2023,
    price_per_day_byn: 95,
    image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
    description: 'Компактный кроссовер с современным оснащением. Подходит для города и поездок за город.',
    transmission: 'Автомат',
    fuel: 'Бензин',
    engine_volume: '1.5 л',
  },
  {
    model: 'Volkswagen Polo',
    year: 2022,
    price_per_day_byn: 75,
    image_url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800',
    description: 'Надёжный седан для повседневных поездок. Экономичный и комфортный.',
    transmission: 'Механика',
    fuel: 'Бензин',
    engine_volume: '1.6 л',
  },
  {
    model: 'Kia Sportage',
    year: 2023,
    price_per_day_byn: 120,
    image_url: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
    description: 'Просторный кроссовер для семьи. Удобный салон и большой багажник.',
    transmission: 'Автомат',
    fuel: 'Бензин',
    engine_volume: '2.0 л',
  },
  {
    model: 'Toyota Camry',
    year: 2022,
    price_per_day_byn: 110,
    image_url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
    description: 'Бизнес-седан с отличной шумоизоляцией и плавным ходом.',
    transmission: 'Автомат',
    fuel: 'Бензин',
    engine_volume: '2.5 л',
  },
  {
    model: 'Hyundai Solaris',
    year: 2021,
    price_per_day_byn: 65,
    image_url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800',
    description: 'Доступный седан для города. Низкий расход и простота в управлении.',
    transmission: 'Механика',
    fuel: 'Бензин',
    engine_volume: '1.6 л',
  },
  {
    model: 'Skoda Octavia',
    year: 2023,
    price_per_day_byn: 100,
    image_url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    description: 'Универсальный седан с большим багажником. Идеален для путешествий.',
    transmission: 'Автомат',
    fuel: 'Бензин',
    engine_volume: '1.4 л',
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM cars');
    for (const c of cars) {
      await client.query(
        `INSERT INTO cars (model, year, price_per_day_byn, image_url, description, transmission, fuel, engine_volume)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          c.model,
          c.year,
          c.price_per_day_byn,
          c.image_url,
          c.description,
          c.transmission,
          c.fuel,
          c.engine_volume,
        ]
      );
    }
    console.log(`Seeded ${cars.length} cars.`);
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
