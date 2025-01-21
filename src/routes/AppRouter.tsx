import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import MenuPage from '../pages/MenuPage';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </Router>
  );
}
