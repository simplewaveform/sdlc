import { Outlet } from 'react-router-dom';
import styles from './Layout.module.css';

export function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <a href="/" className={styles.logo}>
          Аренда авто
        </a>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
