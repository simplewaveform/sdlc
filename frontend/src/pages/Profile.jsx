import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, getUser, getMe, updateProfile, setSession } from '../api/auth';
import styles from './Profile.module.css';

export function Profile() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getMe()
      .then((data) => {
        if (!cancelled) {
          setUser(data);
          setEmail(data.email || '');
          setName(data.name || '');
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const updated = await updateProfile({ email, name });
      setSession(getToken(), updated);
      setUser(updated);
      window.dispatchEvent(new Event('authChange'));
    } catch (err) {
      setError(err.message || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className={styles.message}>Загрузка...</p>;
  if (error && !user) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Редактирование профиля</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Имя
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className={styles.input}
          />
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.submit} disabled={saving}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </form>
    </div>
  );
}
