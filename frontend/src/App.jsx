import { Routes, Route } from 'react-router-dom';
import { Catalog } from './pages/Catalog';
import { Layout } from './components/Layout';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Catalog />} />
      </Route>
    </Routes>
  );
}
