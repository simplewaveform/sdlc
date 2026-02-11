import styles from './CatalogFilters.module.css';

export function CatalogFilters({ model, maxPrice, onModelChange, onMaxPriceChange, onReset }) {
  const hasFilters = model !== '' || maxPrice !== '';

  return (
    <div className={styles.filters}>
      <div className={styles.row}>
        <label className={styles.label}>
          Модель
          <input
            type="text"
            value={model}
            onChange={(e) => onModelChange(e.target.value)}
            placeholder="Например: Geely Coolray"
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Макс. цена за сутки (BYN)
          <input
            type="number"
            min="0"
            step="1"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            placeholder="Любая"
            className={styles.input}
          />
        </label>
      </div>
      {hasFilters && (
        <button type="button" onClick={onReset} className={styles.reset}>
          Сбросить фильтры
        </button>
      )}
    </div>
  );
}
