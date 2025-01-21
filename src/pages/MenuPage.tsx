import { useLocation } from 'react-router-dom';
import Menu from '../components/Menu';
import { Category } from '../components/types';
import { useState, useEffect } from 'react';

const MenuPage = () => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('menuDarkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    if (location.state?.categories) {
      return location.state.categories;
    }
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : [];
  });

  // Sincronizar y aplicar modo oscuro
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'menuDarkMode' && e.newValue !== null) {
        const newDarkMode = JSON.parse(e.newValue);
        setIsDarkMode(newDarkMode);
        document.documentElement.classList.toggle('dark', newDarkMode);
      }
    };

    // Aplicar el modo oscuro al cargar
    const savedMode = localStorage.getItem('menuDarkMode');
    if (savedMode !== null) {
      const darkMode = JSON.parse(savedMode);
      setIsDarkMode(darkMode);
      document.documentElement.classList.toggle('dark', darkMode);
    }

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sincronizar categorías
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'categories' && e.newValue) {
        setCategories(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Actualizar cuando cambie el estado de navegación
  useEffect(() => {
    if (location.state?.categories) {
      setCategories(location.state.categories);
    }
  }, [location.state]);

  return (
    <div className="fixed inset-0 flex flex-col">
      <Menu 
        categories={categories} 
        isDarkMode={isDarkMode}
        showHeader={true}
      />
    </div>
  );
};

export default MenuPage; 