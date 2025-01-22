import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  PencilSquareIcon, 
  QrCodeIcon, 
  MoonIcon, 
  SunIcon, 
  ArrowTopRightOnSquareIcon,
  ExclamationCircleIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

// Componentes
import Sidebar from '../components/Sidebar';
import MenuList from '../components/MenuList';
import PreviewPanel from '../components/PreviewPanel';
import ProductForm from '../components/ProductForm/ProductForm';
import ModalCategoryForm from '../components/ModalCategoryForm';

// Tipos
import { Product, Category } from '../components/types';

// Servicios
import { 
  getCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory, 
  getThemeConfig, 
  updateThemeConfig 
} from '../firebase/services';

// Interfaces
interface UIState {
  isModalOpen: boolean;
  isCategoryFormOpen: boolean;
  isEditMode: boolean;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const Dashboard = () => {
  // Estado principal
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Estado de UI
  const [uiState, setUiState] = useState<UIState>({
    isModalOpen: false,
    isCategoryFormOpen: false,
    isEditMode: false,
    isLoading: false,
    error: null,
    successMessage: null
  });

  // Estado del tema
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('menuDarkMode');
    const initialMode = savedMode ? JSON.parse(savedMode) : false;
    document.documentElement.classList.toggle('dark', initialMode);
    return initialMode;
  });

  // Funciones de utilidad
  const showSuccessMessage = useCallback((message: string) => {
    setUiState(prev => ({ ...prev, successMessage: message }));
    setTimeout(() => setUiState(prev => ({ ...prev, successMessage: null })), 3000);
  }, []);

  const showErrorMessage = useCallback((message: string) => {
    setUiState(prev => ({ ...prev, error: message }));
    setTimeout(() => setUiState(prev => ({ ...prev, error: null })), 5000);
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setUiState(prev => ({ ...prev, isLoading }));
  }, []);

  // Carga inicial de datos
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // Cargar tema
        const darkMode = await getThemeConfig();
        setIsDarkMode(darkMode);
        localStorage.setItem('menuDarkMode', JSON.stringify(darkMode));
        document.documentElement.classList.toggle('dark', darkMode);

        // Cargar categorías
        const loadedCategories = await getCategories();
        
        // Detectar y eliminar categorías duplicadas
        const seenIds = new Set();
        const duplicateIds = new Set();
        
        loadedCategories.forEach(category => {
          if (seenIds.has(category.id)) {
            duplicateIds.add(category.id);
          }
          seenIds.add(category.id);
        });

        if (duplicateIds.size > 0) {
          console.warn('Se encontraron categorías duplicadas:', duplicateIds);
          
          await Promise.all(
            loadedCategories
              .filter(category => duplicateIds.has(category.id))
              .map(category => deleteCategory(category.id))
          );
          
          const cleanCategories = await getCategories();
          const sortedCategories = sortCategoriesAndProducts(cleanCategories);
          
          setCategories(sortedCategories);
          showSuccessMessage('Se eliminaron categorías duplicadas');
        } else {
          const sortedCategories = sortCategoriesAndProducts(loadedCategories);
          setCategories(sortedCategories);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        showErrorMessage('Error al cargar los datos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [showSuccessMessage, showErrorMessage, setLoading]);

  // Persistir categorías en localStorage
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  // Funciones de utilidad
  const sortCategoriesAndProducts = useCallback((categories: Category[]) => {
    return categories
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(category => ({
        ...category,
        products: category.products.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      }));
  }, []);

  // Manejadores de eventos
  const handleCreateCategory = useCallback(async (name: string) => {
    if (!name.trim()) {
      showErrorMessage('El nombre de la categoría no puede estar vacío');
      return;
    }
    
    setLoading(true);
    
    try {
      const newCategory: Category = {
        id: '',
        name: name.trim(),
        products: [],
        order: categories.length
      };

      const categoryId = await addCategory(newCategory);
      const createdCategory: Category = { ...newCategory, id: categoryId };

      setCategories(prev => [...prev, createdCategory]);
      showSuccessMessage('Categoría creada exitosamente');
      setUiState(prev => ({ ...prev, isCategoryFormOpen: false }));
    } catch (error) {
      console.error('Error creating category:', error);
      showErrorMessage('Error al crear la categoría. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [categories.length, showSuccessMessage, showErrorMessage, setLoading]);

  const handleCreateProduct = useCallback(async (product: Product, categoryId: string) => {
    try {
      const categoryIndex = categories.findIndex(c => c.id === categoryId);
      if (categoryIndex === -1) throw new Error('Categoría no encontrada');

      const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newProduct = {
        ...product,
        id: uniqueId,
        categoryId,
        visible: true,
        featured: product.featured || false,
        order: categories[categoryIndex].products.length
      };

      const updatedCategory = {
        ...categories[categoryIndex],
        products: [...categories[categoryIndex].products, newProduct]
      };

      await updateCategory(updatedCategory.id, updatedCategory);

      setCategories(prev => {
        const newCategories = [...prev];
        newCategories[categoryIndex] = updatedCategory;
        return newCategories;
      });

      showSuccessMessage('Producto creado exitosamente');
      setUiState(prev => ({ ...prev, isModalOpen: false }));

      if (!expandedCategories.includes(categoryId)) {
        setExpandedCategories(prev => [...prev, categoryId]);
      }
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw new Error('Error al crear el producto');
    }
  }, [categories, expandedCategories, showSuccessMessage]);

  const handleSubmitProduct = useCallback(async (product: Product, categoryId: string) => {
    setLoading(true);
    try {
      if (productToEdit) {
        await handleUpdateProduct(productToEdit.id, { ...product, id: productToEdit.id });
      } else {
        await handleCreateProduct(product, categoryId);
      }
    } catch (error) {
      console.error('Error:', error);
      showErrorMessage('Error al guardar el producto. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [productToEdit, handleCreateProduct, showErrorMessage, setLoading]);

  const handleUpdateProduct = useCallback(async (productId: string, updatedProduct: Product) => {
    setLoading(true);
    try {
      const categoryToUpdate = categories.find(category => 
        category.products.some(product => product.id === productId)
      );

      if (!categoryToUpdate) throw new Error('No se encontró la categoría del producto');

      const updatedProducts = categoryToUpdate.products.map(product =>
        product.id === productId 
          ? { ...updatedProduct, id: productId, categoryId: categoryToUpdate.id }
          : product
      );

      const updatedCategory = {
        ...categoryToUpdate,
        products: updatedProducts
      };

      await updateCategory(categoryToUpdate.id, updatedCategory);

      setCategories(prev =>
        prev.map(category =>
          category.id === categoryToUpdate.id ? updatedCategory : category
        )
      );

      showSuccessMessage('Producto actualizado correctamente');
      setUiState(prev => ({ ...prev, isModalOpen: false }));
    } catch (error) {
      console.error('Error:', error);
      showErrorMessage('Error al actualizar el producto');
    } finally {
      setLoading(false);
    }
  }, [categories, showSuccessMessage, showErrorMessage, setLoading]);

  const handleToggleProductVisibility = useCallback(async (productId: string) => {
    try {
      const categoryToUpdate = categories.find(category => 
        category.products.some(product => product.id === productId)
      );

      if (!categoryToUpdate) return;

      const updatedProducts = categoryToUpdate.products.map(product =>
        product.id === productId ? { ...product, visible: !product.visible } : product
      );

      const updatedCategory = {
        ...categoryToUpdate,
        products: updatedProducts
      };

      setCategories(prev =>
        prev.map(category =>
          category.id === categoryToUpdate.id ? updatedCategory : category
        )
      );

      await updateCategory(categoryToUpdate.id, updatedCategory);
      showSuccessMessage('Visibilidad actualizada correctamente');
    } catch (error) {
      console.error('Error:', error);
      showErrorMessage('Error al actualizar la visibilidad');
      // Recargar categorías en caso de error
      const reloadedCategories = await getCategories();
      setCategories(sortCategoriesAndProducts(reloadedCategories));
    }
  }, [categories, showSuccessMessage, showErrorMessage, sortCategoriesAndProducts]);

  const handleDeleteProduct = useCallback(async (productId: string) => {
    try {
      if (!confirm('¿Estás seguro de eliminar este producto?')) return;

      const categoryToUpdate = categories.find(category => 
        category.products.some(product => product.id === productId)
      );

      if (!categoryToUpdate) return;

      const updatedProducts = categoryToUpdate.products.filter(product => product.id !== productId);
      const updatedCategory = {
        ...categoryToUpdate,
        products: updatedProducts
      };

      setCategories(prev =>
        prev.map(category =>
          category.id === categoryToUpdate.id ? updatedCategory : category
        )
      );

      await updateCategory(categoryToUpdate.id, updatedCategory);
      showSuccessMessage('Producto eliminado correctamente');
    } catch (error) {
      console.error('Error:', error);
      showErrorMessage('Error al eliminar el producto');
      // Recargar categorías en caso de error
      const reloadedCategories = await getCategories();
      setCategories(sortCategoriesAndProducts(reloadedCategories));
    }
  }, [categories, showSuccessMessage, showErrorMessage, sortCategoriesAndProducts]);

  const handleDarkModeToggle = useCallback(async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      document.documentElement.classList.toggle('dark', newMode);
      
      localStorage.setItem('menuDarkMode', JSON.stringify(newMode));
      await updateThemeConfig(newMode);
      
      showSuccessMessage(newMode ? 'Modo oscuro activado' : 'Modo claro activado');
    } catch (error) {
      console.error('Error al cambiar el modo:', error);
      showErrorMessage('Error al cambiar el modo de visualización');
      
      const savedMode = localStorage.getItem('menuDarkMode');
      if (savedMode !== null) {
        const previousMode = JSON.parse(savedMode);
        setIsDarkMode(previousMode);
        document.documentElement.classList.toggle('dark', previousMode);
      }
    }
  }, [isDarkMode, showSuccessMessage, showErrorMessage]);

  // Componentes memorizados
  const actionButtons = useMemo(() => (
    <div className="bg-white border border-gray-200 rounded-lg p-3 mb-6">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex flex-col gap-2">
          <div className="relative">
            <button
              onClick={() => setUiState(prev => ({ ...prev, isCategoryFormOpen: true }))}
              className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all flex items-center gap-2 text-sm justify-center whitespace-nowrap"
              disabled={uiState.isLoading}
            >
              <PlusIcon className="h-4 w-4 text-white" /> 
              <span>Nueva Categoría</span>
            </button>

            <ModalCategoryForm
              isOpen={uiState.isCategoryFormOpen}
              onSubmit={handleCreateCategory}
              onClose={() => setUiState(prev => ({ ...prev, isCategoryFormOpen: false }))}
              existingCategories={categories.map(cat => cat.name)}
            />
          </div>

          <button
            onClick={() => {
              setProductToEdit(null);
              setUiState(prev => ({ ...prev, isModalOpen: true }));
            }}
            className="w-full px-3 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500 transition-all text-sm flex items-center gap-2 justify-center whitespace-nowrap"
            disabled={uiState.isLoading}
          >
            <PlusIcon className="h-4 w-4 text-white" />
            <span>Nuevo Plato</span>
          </button>

          <button
            onClick={() => setUiState(prev => ({ ...prev, isEditMode: !prev.isEditMode }))}
            className={`w-full px-3 py-2 ${
              uiState.isEditMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-600 hover:bg-gray-700'
            } text-white rounded-md transition-all text-sm flex items-center gap-2 justify-center whitespace-nowrap`}
            disabled={uiState.isLoading}
          >
            <PencilSquareIcon className="h-4 w-4 text-white" />
            <span>{uiState.isEditMode ? 'Terminar Edición' : 'Editar Categorías'}</span>
          </button>
        </div>

        <div className="flex flex-row gap-2 md:w-auto w-full">
          <button
            onClick={() => window.open('/preview', '_blank')}
            className="flex-1 md:flex-initial p-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-all flex items-center justify-center"
            disabled={uiState.isLoading}
            title="Ver QR"
          >
            <QrCodeIcon className="h-4 w-4 text-white" />
          </button>

          <button
            onClick={handleDarkModeToggle}
            className="flex-1 md:flex-initial p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-all flex items-center justify-center"
            disabled={uiState.isLoading}
            title={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
          >
            {isDarkMode ? (
              <SunIcon className="h-4 w-4 text-white" />
            ) : (
              <MoonIcon className="h-4 w-4 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  ), [uiState.isEditMode, uiState.isLoading, isDarkMode, handleDarkModeToggle, uiState.isCategoryFormOpen, categories, handleCreateCategory]);

  const statusMessages = useMemo(() => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {uiState.isLoading && (
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-700 border-t-transparent"></div>
          Cargando...
        </div>
      )}
      {uiState.error && (
        <div className="bg-red-50 text-red-700 px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
          <ExclamationCircleIcon className="h-5 w-5" />
          {uiState.error}
        </div>
      )}
      {uiState.successMessage && (
        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
          <CheckCircleIcon className="h-5 w-5" />
          {uiState.successMessage}
        </div>
      )}
    </div>
  ), [uiState.isLoading, uiState.error, uiState.successMessage]);

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex bg-gray-50 min-w-0">
        <section className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 px-2 md:p-6 pt-16 md:pt-6 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
            {statusMessages}
            {actionButtons}

            <MenuList
              categories={categories}
              setCategories={setCategories}
              isEditMode={uiState.isEditMode}
              onEditProduct={(_, product) => {
                setProductToEdit(product);
                setUiState(prev => ({ ...prev, isModalOpen: true }));
              }}
              onToggleProductVisibility={handleToggleProductVisibility}
              onDeleteProduct={handleDeleteProduct}
              expandedCategories={expandedCategories}
              setExpandedCategories={setExpandedCategories}
            />

            {uiState.isModalOpen && (
              <ProductForm
                isOpen={uiState.isModalOpen}
                onClose={() => {
                  setUiState(prev => ({ ...prev, isModalOpen: false }));
                  setProductToEdit(null);
                }}
                onSubmit={handleSubmitProduct}
                categories={categories}
                productToEdit={productToEdit}
                onSuccess={(categoryId) => {
                  if (!expandedCategories.includes(categoryId)) {
                    setExpandedCategories(prev => [...prev, categoryId]);
                  }
                }}
              />
            )}
          </div>
        </section>

        <PreviewPanel 
          categories={categories} 
          isDarkMode={isDarkMode}
        />
      </main>

      <Link
        to="/menu"
        target="_blank"
        rel="noopener noreferrer"
        state={{ categories }}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
      >
        <ArrowTopRightOnSquareIcon className="w-6 h-6" />
      </Link>
    </div>
  );
};

export default Dashboard;
