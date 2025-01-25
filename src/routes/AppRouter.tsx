import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import MenuPage from '../pages/MenuPage';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import Login from '../components/Auth/Login';
import Register from '@/components/Auth/Register';
import VerifyView from '@/pages/VerifyViewEmail';
import VerifySuccess from '@/pages/VerifySuccess';
export default function AppRouter() {
  return (
    <Router>
      <Routes>

      <Route path="/login" element={
        <Login/>
      } />

      <Route path="/register" element={
          <Register/>
        } />

      <Route path="/verify-email" element={<VerifyView />}>
        <Route path="success" element={<VerifySuccess />} />
      </Route>
      
      
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>}
      />
       
      <Route path="/menu" element={
        <ProtectedRoute>
          <MenuPage />
        </ProtectedRoute>} 
      />
      </Routes>
    </Router>
  );
}
