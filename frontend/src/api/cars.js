const API_BASE = '/api';

export async function fetchCars(params = {}) {
  const search = new URLSearchParams();
  if (params.model != null && params.model !== '') search.set('model', params.model);
  if (params.maxPrice != null && params.maxPrice !== '') search.set('maxPrice', params.maxPrice);
  const qs = search.toString();
  const url = `${API_BASE}/cars${qs ? `?${qs}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Не удалось загрузить список автомобилей');
  return res.json();
}

export async function fetchCarById(id) {
  const res = await fetch(`${API_BASE}/cars/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Автомобиль не найден');
    throw new Error('Не удалось загрузить данные автомобиля');
  }
  return res.json();
}
