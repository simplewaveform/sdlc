import { useState, useEffect } from 'react';
import { fetchCars } from '../api/cars';
import { CarCard } from '../components/CarCard';
import styles from './Catalog.module.css';

export function Catalog() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchCars()
      .then((data) => {
        if (!cancelled) setCars(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className={styles.catalog}>
      <h1 className={styles.title}>Каталог автомобилей</h1>
      {loading && <p className={styles.message}>Загрузка...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && cars.length === 0 && (
        <p className={styles.message}>Нет автомобилей. Запустите бэкенд и выполните npm run db:seed.</p>
      )}
      {!loading && !error && cars.length > 0 && (
        <div className={styles.grid}>
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
