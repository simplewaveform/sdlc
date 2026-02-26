import { Routes, Route } from 'react-router-dom';
import { Catalog } from './pages/Catalog';
import { CarDetail } from './pages/CarDetail';
import { Register } from './pages/Register';
import { Layout } from './components/Layout';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Catalog />} />
        <Route path="/cars/:id" element={<CarDetail />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
}
