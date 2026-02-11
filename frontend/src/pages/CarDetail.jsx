import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCarById } from '../api/cars';
import styles from './CarDetail.module.css';

export function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchCarById(id)
      .then((data) => {
        if (!cancelled) setCar(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <p className={styles.message}>Загрузка...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!car) return null;

  return (
    <div className={styles.detail}>
      <button type="button" onClick={() => navigate('/')} className={styles.back}>
        ← Назад в каталог
      </button>
      <div className={styles.media}>
        <img
          src={car.image_url || 'https://via.placeholder.com/800x500?text=Нет+фото'}
          alt={car.model}
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <h1 className={styles.model}>{car.model}</h1>
        <p className={styles.year}>Год выпуска: {car.year}</p>
        <p className={styles.price}>
          <strong>{Number(car.price_per_day_byn)} BYN</strong> / сутки
        </p>
        {car.description && (
          <section className={styles.section}>
            <h2>Описание</h2>
            <p>{car.description}</p>
          </section>
        )}
        <section className={styles.section}>
          <h2>Характеристики</h2>
          <ul className={styles.specs}>
            <li><strong>Трансмиссия:</strong> {car.transmission || '—'}</li>
            <li><strong>Топливо:</strong> {car.fuel || '—'}</li>
            <li><strong>Объём двигателя:</strong> {car.engine_volume || '—'}</li>
          </ul>
        </section>
        <button type="button" className={styles.book} disabled title="Скоро будет доступно">
          Забронировать
        </button>
      </div>
    </div>
  );
}
