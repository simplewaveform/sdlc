import { useState, useEffect } from 'react';
import { fetchCars } from '../api/cars';
import { CarCard } from '../components/CarCard';
import { CatalogFilters } from '../components/CatalogFilters';
import styles from './Catalog.module.css';

export function Catalog() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [model, setModel] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchCars({ model: model || undefined, maxPrice: maxPrice || undefined })
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
  }, [model, maxPrice]);

  const handleResetFilters = () => {
    setModel('');
    setMaxPrice('');
  };

  return (
    <div className={styles.catalog}>
      <h1 className={styles.title}>Каталог автомобилей</h1>
      <CatalogFilters
        model={model}
        maxPrice={maxPrice}
        onModelChange={setModel}
        onMaxPriceChange={setMaxPrice}
        onReset={handleResetFilters}
      />
      {loading && <p className={styles.message}>Загрузка...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && cars.length === 0 && (
        <p className={styles.message}>Нет автомобилей по заданным критериям. Попробуйте изменить фильтры или сбросить их.</p>
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
