const API_BASE = '/api/auth';
const TOKEN_KEY = 'car_rental_token';
const USER_KEY = 'car_rental_user';

export async function register({ email, password, name }) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name: name || undefined }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Ошибка регистрации');
  return data;
}

export async function login({ email, password }) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Ошибка входа');
  return data;
}

export function setSession(token, user) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function logout() {
  setSession(null);
}

function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getMe() {
  const res = await fetch(`${API_BASE}/me`, { headers: authHeaders() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Ошибка загрузки профиля');
  return data;
}

export async function updateProfile({ email, name }) {
  const res = await fetch(`${API_BASE}/me`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ email, name }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Ошибка обновления профиля');
  return data;
}

export async function deleteAccount() {
  const res = await fetch(`${API_BASE}/me`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (res.status === 204) return;
  const data = await res.json().catch(() => ({}));
  throw new Error(data.error || 'Ошибка удаления аккаунта');
}
