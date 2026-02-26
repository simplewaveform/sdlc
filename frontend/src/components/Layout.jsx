import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { getUser, logout as logoutApi } from '../api/auth';
import styles from './Layout.module.css';

export function Layout() {
  const [user, setUser] = useState(() => getUser());
  const navigate = useNavigate();

  useEffect(() => {
    const onAuthChange = () => setUser(getUser());
    window.addEventListener('authChange', onAuthChange);
    return () => window.removeEventListener('authChange', onAuthChange);
  }, []);

  const handleLogout = () => {
    logoutApi();
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          Аренда авто
        </Link>
        <nav className={styles.nav}>
          {user ? (
            <>
              <span className={styles.userName}>{user.name || user.email}</span>
              <button type="button" onClick={handleLogout} className={styles.navLink}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navLink}>Войти</Link>
              <Link to="/register" className={styles.navLink}>Регистрация</Link>
            </>
          )}
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
