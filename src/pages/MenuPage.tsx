import { useLocation } from 'react-router-dom';
import Menu from '../components/Menu';
import { Category } from '../components/types';
import { useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const MenuPage = () => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useLocalStorage('menuDarkMode', false);
  const [categories, setCategories] = useLocalStorage<Category[]>('categories', []);

  // Actualizar cuando cambie el estado de navegación
  useEffect(() => {
    if (location.state?.categories) {
      setCategories(location.state.categories);
    }
  }, [location.state, setCategories]);

  // Aplicar el modo oscuro al DOM
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  if (!categories.length) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <p className="text-gray-500">No hay categorías disponibles</p>
      </div>
    );
  }

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