import { Link, Outlet } from 'react-router-dom';
import styles from './Layout.module.css';

export function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          Аренда авто
        </Link>
        <nav className={styles.nav}>
          <Link to="/register" className={styles.navLink}>Регистрация</Link>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
