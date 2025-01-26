import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  QrCodeIcon, 
  MoonIcon, 
  SunIcon, 
  Square2StackIcon,
  ClipboardDocumentIcon,
  ArrowsUpDownIcon,
  Squares2X2Icon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import Swal from 'sweetalert2';

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
import { getCurrentUser } from '../firebase/authService';

// Interfaces
interface UIState {
  isModalOpen: boolean;
  isCategoryFormOpen: boolean;
  isEditMode: boolean;
}

const AddMenuButton = ({ onAddCategory, onAddProduct }: { 
  onAddCategory: () => void;
  onAddProduct: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full md:w-auto" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:w-auto px-5 py-2.5 bg-orange-400 text-white rounded-md hover:bg-orange-500 transition-all flex items-center gap-3 text-sm font-semibold whitespace-nowrap"
      >
        <PlusIcon className="h-4 w-4" />
        <span>Agregar</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-1 w-64 z-[9999]"
          >
            <button 
              type="button"
              onClick={() => {
                onAddCategory();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
            >
              <Square2StackIcon className="h-4 w-4" />
              <span>Nueva sección del menú</span>
            </button>
            <button 
              type="button"
              onClick={() => {
                onAddProduct();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
            >
              <ClipboardDocumentIcon className="h-4 w-4" />
              <span>Nuevo Producto</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const currentUser = getCurrentUser()

if(currentUser?.emailVerified || localStorage.getItem('emailVerified') === 'true'){
  localStorage.removeItem('emailVerified');
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
  });

  // Estado del tema
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('menuDarkMode');
    const initialMode = savedMode ? JSON.parse(savedMode) : false;
    document.documentElement.classList.toggle('dark', initialMode);
    return initialMode;
  });

  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(true);
  const [isExportPanelOpen, setIsExportPanelOpen] = useState(true);

  // Funciones de utilidad
  const showSuccessMessage = useCallback((message: string) => {
    Swal.fire({
      title: '¡Éxito!',
      text: message,
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#fff',
      color: '#000',
      iconColor: '#10B981'
    });
  }, []);

  const showErrorMessage = useCallback((message: string) => {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      background: '#fff',
      color: '#000',
      iconColor: '#EF4444'
    });
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    if (isLoading) {
      Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    } else {
      Swal.close();
    }
  }, []);

  // Funciones de utilidad
  const sortCategoriesAndProducts = useCallback((categories: Category[]) => {
    return categories
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(category => ({
        ...category,
        products: category.products.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      }));
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
  }, [showSuccessMessage, showErrorMessage, setLoading, sortCategoriesAndProducts]);

  useEffect(() => {
    const loadThemeConfig = async () => {
      try {
        const savedTheme = await getThemeConfig();
        setIsDarkMode(savedTheme);
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };

    loadThemeConfig();
  }, [setIsDarkMode]);

  // Persistir categorías en localStorage
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  // Manejadores de eventos
  const handleCreateCategory = useCallback(async (name: string) => {
    setLoading(true);
    try {
      const newCategory: Category = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        products: [],
        order: categories.length
      };

      await addCategory(newCategory);
      setCategories(prev => sortCategoriesAndProducts([...prev, newCategory]));
      setLoading(false);
      showSuccessMessage('Sección creada exitosamente');
      setUiState(prev => ({ ...prev, isCategoryFormOpen: false }));
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      showErrorMessage('Error al crear la sección');
    }
  }, [categories, showSuccessMessage, showErrorMessage, setLoading, sortCategoriesAndProducts]);

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
        order: categories[categoryIndex].products.length,
        image: product.image || null
      };

      const updatedCategory = {
        ...categories[categoryIndex],
        products: [...categories[categoryIndex].products, newProduct]
      };

      // Primero actualizar el estado local
      setCategories(prev => {
        const newCategories = [...prev];
        newCategories[categoryIndex] = updatedCategory;
        return newCategories;
      });

      // Luego actualizar Firebase
      await updateCategory(updatedCategory.id, updatedCategory);
      showSuccessMessage('Producto creado exitosamente');
      setUiState(prev => ({ ...prev, isModalOpen: false }));

      if (!expandedCategories.includes(categoryId)) {
        setExpandedCategories(prev => [...prev, categoryId]);
      }
    } catch (error) {
      console.error('Error detallado al crear producto:', error);
      showErrorMessage('Error al crear el producto');
      // Recargar categorías en caso de error
      const reloadedCategories = await getCategories();
      setCategories(reloadedCategories);
      throw error;
    }
  }, [categories, expandedCategories, showSuccessMessage, showErrorMessage]);

  const handleUpdateProduct = useCallback(async (productId: string, updatedProduct: Product) => {
    setLoading(true);
    try {
      const categoryToUpdate = categories.find(category => 
        category.products.some(product => product.id === productId)
      );

      if (!categoryToUpdate) throw new Error('No se encontró la categoría del producto');

      // Asegurarnos de que la imagen sea null si no hay imagen
      const sanitizedProduct = {
        ...updatedProduct,
        id: productId,
        categoryId: categoryToUpdate.id,
        image: updatedProduct.image || null
      };

      const updatedProducts = categoryToUpdate.products.map(product =>
        product.id === productId ? sanitizedProduct : product
      );

      const updatedCategory = {
        ...categoryToUpdate,
        products: updatedProducts
      };

      // Primero actualizar el estado local
      setCategories(prev =>
        prev.map(category =>
          category.id === categoryToUpdate.id ? updatedCategory : category
        )
      );

      // Luego actualizar Firebase
      await updateCategory(categoryToUpdate.id, updatedCategory);
      showSuccessMessage('Producto actualizado correctamente');
      setUiState(prev => ({ ...prev, isModalOpen: false }));
    } catch (error) {
      console.error('Error detallado al actualizar producto:', error);
      showErrorMessage('Error al actualizar el producto. Por favor, intenta de nuevo.');
      // Recargar categorías en caso de error
      const reloadedCategories = await getCategories();
      setCategories(reloadedCategories);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [categories, showSuccessMessage, showErrorMessage, setLoading]);

  const handleSubmitProduct = useCallback(async (product: Product, categoryId: string) => {
    setLoading(true);
    try {
      if (productToEdit) {
        await handleUpdateProduct(productToEdit.id, { ...product, id: productToEdit.id });
      } else {
        await handleCreateProduct(product, categoryId);
      }
      setLoading(false);
      showSuccessMessage(productToEdit ? 'Producto actualizado correctamente' : 'Producto creado exitosamente');
      setUiState(prev => ({ ...prev, isModalOpen: false }));
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
      showErrorMessage('Error al guardar el producto. Por favor, intenta de nuevo.');
    }
  }, [productToEdit, handleCreateProduct, handleUpdateProduct, showSuccessMessage, showErrorMessage, setLoading]);

  const handleDeleteProduct = useCallback(async (productId: string) => {
    try {
      const confirmed = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas eliminar este producto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280'
      });

      if (!confirmed.isConfirmed) return;

      setLoading(true);
      const categoryToUpdate = categories.find(category => 
        category.products.some(product => product.id === productId)
      );

      if (!categoryToUpdate) return;

      const updatedProducts = categoryToUpdate.products.filter(product => product.id !== productId);
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

      setLoading(false);
      showSuccessMessage('Producto eliminado correctamente');
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
      showErrorMessage('Error al eliminar el producto');
      // Recargar categorías en caso de error
      const reloadedCategories = await getCategories();
      setCategories(sortCategoriesAndProducts(reloadedCategories));
    }
  }, [categories, showSuccessMessage, showErrorMessage, setLoading, sortCategoriesAndProducts]);

  const handleDeleteCategory = useCallback(async (categoryId: string) => {
    try {
      const confirmed = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas eliminar esta categoría y todos sus productos?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280'
      });

      if (!confirmed.isConfirmed) return;

      setLoading(true);
      await deleteCategory(categoryId);
      setCategories(prev => prev.filter(category => category.id !== categoryId));
      
      setLoading(false);
      showSuccessMessage('Categoría eliminada correctamente');
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
      showErrorMessage('Error al eliminar la categoría');
    }
  }, [showSuccessMessage, showErrorMessage, setLoading]);

  const handleEditCategory = useCallback(async (categoryId: string, newName: string) => {
    try {
      setLoading(true);
      const categoryToUpdate = categories.find(c => c.id === categoryId);
      if (!categoryToUpdate) return;

      const updatedCategory = { ...categoryToUpdate, name: newName };
      await updateCategory(categoryId, updatedCategory);
      
      setCategories(prev =>
        prev.map(category =>
          category.id === categoryId ? updatedCategory : category
        )
      );
      
      setLoading(false);
      showSuccessMessage('Categoría actualizada correctamente');
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
      showErrorMessage('Error al actualizar la categoría');
    }
  }, [categories, showSuccessMessage, showErrorMessage, setLoading]);

  const handleToggleProductVisibility = useCallback(async (productId: string) => {
    try {
      setLoading(true);
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

      await updateCategory(categoryToUpdate.id, updatedCategory);
      
      setCategories(prev =>
        prev.map(category =>
          category.id === categoryToUpdate.id ? updatedCategory : category
        )
      );

      const product = categoryToUpdate.products.find(p => p.id === productId);
      showSuccessMessage(`Producto ${product?.visible ? 'ocultado' : 'visible'} correctamente`);
    } catch (error) {
      console.error('Error:', error);
      showErrorMessage('Error al actualizar la visibilidad del producto');
      // Recargar categorías en caso de error
      const reloadedCategories = await getCategories();
      setCategories(sortCategoriesAndProducts(reloadedCategories));
    } finally {
      setLoading(false);
    }
  }, [categories, showSuccessMessage, showErrorMessage, setLoading, sortCategoriesAndProducts]);

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
      
      // Revertir al modo anterior en caso de error
      const savedMode = localStorage.getItem('menuDarkMode');
      if (savedMode !== null) {
        const previousMode = JSON.parse(savedMode);
        setIsDarkMode(previousMode);
        document.documentElement.classList.toggle('dark', previousMode);
      }
    }
  }, [isDarkMode, showSuccessMessage, showErrorMessage]);

  // Componentes memorizados
  const configPanel = useMemo(() => (
    <div className="bg-white rounded-lg p-6 mt-6 mb-2 md:mb-4 border border-gray-100 [background-image:radial-gradient(#EDF2F7_0.75px,transparent_0.75px)] [background-size:8px_8px]">
      <button 
        onClick={() => setIsConfigPanelOpen(!isConfigPanelOpen)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-gray-900">Edita tu menú</h2>
        </div>
        <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isConfigPanelOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isConfigPanelOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-visible"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-600 text-sm md:text-base mt-4 mb-6">Desde aquí puedes crear secciones, añadir productos y ajustar el orden del menú.</p>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <AddMenuButton 
                  onAddCategory={() => setUiState(prev => ({ ...prev, isCategoryFormOpen: true }))}
                  onAddProduct={() => {
                    setProductToEdit(null);
                    setUiState(prev => ({ ...prev, isModalOpen: true }));
                  }}
                />

                <button
                  onClick={() => setUiState(prev => ({ ...prev, isEditMode: !prev.isEditMode }))}
                  className={`w-full md:w-auto px-5 py-2.5 ${
                    uiState.isEditMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'
                  } text-white rounded-md transition-all text-sm flex items-center gap-3 font-semibold whitespace-nowrap`}
                >
                  <ArrowsUpDownIcon className="h-4 w-4" />
                  <span>{uiState.isEditMode ? 'Terminar Edición' : 'Reordenar Secciones'}</span>
                </button>

                <button
                  onClick={handleDarkModeToggle}
                  className={`w-full md:w-auto px-5 py-2.5 transition-all text-sm flex items-center gap-3 font-semibold whitespace-nowrap rounded-md ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                  title={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
                >
                  {isDarkMode ? (
                    <>
                      <MoonIcon className="h-4 w-4" />
                      <span>Modo oscuro</span>
                    </>
                  ) : (
                    <>
                      <SunIcon className="h-4 w-4" />
                      <span>Modo claro</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ), [isConfigPanelOpen, uiState.isEditMode, isDarkMode, handleDarkModeToggle]);

  const exportPanel = useMemo(() => (
    <div className="bg-white rounded-lg p-6 mb-2 md:mb-4 border border-gray-100 [background-image:radial-gradient(#EDF2F7_0.75px,transparent_0.75px)] [background-size:8px_8px]">
      <button 
        onClick={() => setIsExportPanelOpen(!isExportPanelOpen)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-gray-900">Exporta tu menú</h2>
        </div>
        <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isExportPanelOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isExportPanelOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-600 text-sm md:text-base mt-4 mb-6">Genera un código QR para compartir tu menú fácilmente.</p>
              <button
                onClick={() => window.open('/preview', '_blank')}
                className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-md transition-all flex items-center gap-2 justify-center"
              >
                <QrCodeIcon className="h-4 w-4" />
                <span>Generar código QR</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ), [isExportPanelOpen]);

  return (
    <div className="h-screen w-screen flex">
      <Sidebar />
      <main className="flex-1 flex min-w-0">
        <section className="flex-1 flex flex-col min-w-0 pt-14 md:pt-0">
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto overflow-x-visible scrollbar-none">
            <div className="flex-1 p-4">
              <div className="max-w-5xl mx-auto space-y-4">
                {configPanel}
                {exportPanel}

                <div className="bg-white rounded-lg p-6">
                  <div className="space-y-1 mb-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">Secciones del menú</h2>
                      <Squares2X2Icon className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-sm md:text-base">Aquí se muestran las secciones y productos de tu menú, puedes editar, reorganizar y eliminar lo que quieras.</p>
                  </div>
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
                    onEditCategory={handleEditCategory}
                    onDeleteCategory={handleDeleteCategory}
                    expandedCategories={expandedCategories}
                    setExpandedCategories={setExpandedCategories}
                  />
                </div>
              </div>
            </div>
          </div>
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

          {uiState.isCategoryFormOpen && (
            <ModalCategoryForm
              isOpen={uiState.isCategoryFormOpen}
              onClose={() => setUiState(prev => ({ ...prev, isCategoryFormOpen: false }))}
              onSubmit={handleCreateCategory}
              existingCategories={categories.map(c => c.name)}
            />
          )}
        </section>

        <PreviewPanel 
          categories={categories} 
          isDarkMode={isDarkMode}
        />
      </main>
    </div>
  );
  
};

export default Dashboard;
