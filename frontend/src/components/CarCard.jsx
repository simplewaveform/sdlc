import { Link } from 'react-router-dom';
import styles from './CarCard.module.css';

export function CarCard({ car }) {
  return (
    <Link to={`/cars/${car.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={car.image_url || 'https://via.placeholder.com/400x250?text=Нет+фото'}
          alt={car.model}
          className={styles.image}
        />
      </div>
      <div className={styles.body}>
        <h3 className={styles.model}>{car.model}</h3>
        <p className={styles.year}>Год: {car.year}</p>
        <p className={styles.price}>
          <strong>{Number(car.price_per_day_byn)} BYN</strong> / сутки
        </p>
      </div>
    </Link>
  );
}
