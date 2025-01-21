import Sidebar from '../components/Sidebar';
import MenuList from '../components/MenuList';
import PreviewPanel from '../components/PreviewPanel';
import { useState, useEffect } from 'react';
import ProductForm from '../components/ProductForm/ProductForm';
import ModalCategoryForm from '../components/ModalCategoryForm';
import { Bars3Icon, EyeIcon, PlusIcon, PencilSquareIcon, QrCodeIcon, MoonIcon, SunIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Product, Category } from '../components/types';
import { Link } from 'react-router-dom';
import { getCategories, addCategory, updateCategory, deleteCategory, getThemeConfig, updateThemeConfig } from '../firebase/services';
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('menuDarkMode');
    const initialMode = savedMode ? JSON.parse(savedMode) : false;
    document.documentElement.classList.toggle('dark', initialMode);
    return initialMode;
  });
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const darkMode = await getThemeConfig();
        setIsDarkMode(darkMode);
        localStorage.setItem('menuDarkMode', JSON.stringify(darkMode));
        document.documentElement.classList.toggle('dark', darkMode);

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

        // Si hay duplicados, eliminarlos
        if (duplicateIds.size > 0) {
          console.warn('Se encontraron categorías duplicadas:', duplicateIds);
          
          // Eliminar todas las categorías con IDs duplicados
          const deletePromises = loadedCategories
            .filter(category => duplicateIds.has(category.id))
            .map(category => deleteCategory(category.id));
          
          await Promise.all(deletePromises);
          
          // Recargar categorías después de eliminar duplicados
          const cleanCategories = await getCategories();
          
          // Ordenar categorías por el campo order
          const sortedCategories = cleanCategories
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map(category => ({
              ...category,
              // Ordenar productos dentro de cada categoría
              products: category.products
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            }));
          
          setCategories(sortedCategories);
          localStorage.setItem('categories', JSON.stringify(sortedCategories));
          showSuccessMessage('Se eliminaron categorías duplicadas');
        } else {
          // Si no hay duplicados, proceder normalmente
          const sortedCategories = loadedCategories
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map(category => ({
              ...category,
              products: category.products
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            }));
          
          setCategories(sortedCategories);
          localStorage.setItem('categories', JSON.stringify(sortedCategories));
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        showErrorMessage('Error al cargar los datos. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const showErrorMessage = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const loadCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const loadedCategories = await getCategories();
      // Ordenar categorías por el campo order
      const sortedCategories = loadedCategories.sort((a, b) => {
        const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
      });
      setCategories(sortedCategories);
      localStorage.setItem('categories', JSON.stringify(sortedCategories));
    } catch (error) {
      console.error('Error loading categories:', error);
      showErrorMessage('Error al cargar las categorías. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Nuevo manejador para actualizar el orden de las categorías
  const handleCategoriesChange = async (newCategories: Category[]) => {
    try {
      // Actualizar estado local
      setCategories(newCategories);
      
      // Actualizar cada categoría en Firebase
      const updatePromises = newCategories.map(category => 
        updateCategory(category.id, category)
      );
      
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error al actualizar las categorías:', error);
      showErrorMessage('Error al guardar los cambios');
      // Recargar las categorías en caso de error
      await loadCategories();
    }
  };

  // Crear categoría
  const handleCreateCategory = async (name: string) => {
    if (!name.trim()) {
      showErrorMessage('El nombre de la categoría no puede estar vacío');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Crear la nueva categoría con datos mínimos
      const newCategory: Category = {
        id: '', // Firebase asignará el ID
        name: name.trim(),
        products: [],
        order: categories.length // Usar la longitud actual como orden
      };

      // Crear en Firebase
      const categoryId = await addCategory(newCategory);
      console.log('Categoría creada con ID:', categoryId);

      // Crear el objeto final con el ID asignado
      const createdCategory: Category = {
        ...newCategory,
        id: categoryId
      };

      // Actualizar estado local
      setCategories(prev => [...prev, createdCategory]);
      
      showSuccessMessage('Categoría creada exitosamente');
      setIsCategoryFormOpen(false);
    } catch (error) {
      console.error('Error creating category:', error);
      showErrorMessage('Error al crear la categoría. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Crear/Editar producto
  const handleCreateProduct = async (product: Product, categoryId: string) => {
    try {
      const categoryIndex = categories.findIndex(c => c.id === categoryId);
      if (categoryIndex === -1) {
        throw new Error('Categoría no encontrada');
      }

      // Generar un ID único usando timestamp y random
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Crear el nuevo producto con un ID único
      const newProduct = {
        ...product,
        id: uniqueId,
        categoryId,
        visible: true,
        featured: product.featured || false,
        order: categories[categoryIndex].products.length
      };

      // Actualizar la categoría con el nuevo producto
      const updatedCategory = {
        ...categories[categoryIndex],
        products: [...categories[categoryIndex].products, newProduct]
      };

      // Actualizar en Firebase
      await updateCategory(updatedCategory.id, updatedCategory);

      // Actualizar estado local
      const newCategories = [...categories];
      newCategories[categoryIndex] = updatedCategory;
      setCategories(newCategories);

      showSuccessMessage('Producto creado exitosamente');
      setIsModalOpen(false);

      // Expandir la categoría
      if (!expandedCategories.includes(categoryId)) {
        setExpandedCategories(prev => [...prev, categoryId]);
      }
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw new Error('Error al crear el producto');
    }
  };

  const handleSubmitProduct = async (product: Product, categoryId: string) => {
    setIsLoading(true);
    setError(null);
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
      setIsLoading(false);
    }
  };

  // Abrir modal de edición
  const handleEditProduct = (productId: string, product: Product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  // Editar producto en la base de datos
  const handleUpdateProduct = async (productId: string, updatedProduct: Product) => {
    setIsLoading(true);
    setError(null);
    try {
      const categoryToUpdate = categories.find(category => 
        category.products.some(product => product.id === productId)
      );

      if (!categoryToUpdate) {
        throw new Error('No se encontró la categoría del producto');
      }

      const updatedProducts = categoryToUpdate.products.map(product =>
        product.id === productId 
          ? { ...updatedProduct, id: productId, categoryId: categoryToUpdate.id }
          : product
      );

      const updatedCategory = {
        ...categoryToUpdate,
        products: updatedProducts
      };

      // Primero actualizar en Firebase
      await updateCategory(categoryToUpdate.id, updatedCategory);

      // Luego actualizar el estado local
      setCategories(prevCategories =>
        prevCategories.map(category =>
          category.id === categoryToUpdate.id ? updatedCategory : category
        )
      );

      showSuccessMessage('Producto actualizado correctamente');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error:', error);
      showErrorMessage('Error al actualizar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  // Alternar visibilidad de producto
  const handleToggleProductVisibility = async (productId: string) => {
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

      // Optimistic update
      setCategories(prevCategories =>
        prevCategories.map(category =>
          category.id === categoryToUpdate.id ? updatedCategory : category
        )
      );

      await updateCategory(categoryToUpdate.id, updatedCategory);
      showSuccessMessage('Visibilidad actualizada correctamente');
    } catch (error) {
      console.error('Error:', error);
      showErrorMessage('Error al actualizar la visibilidad');
      // Recargar las categorías solo si hay un error
      await loadCategories();
    }
  };

  // Eliminar producto
  const handleDeleteProduct = async (productId: string) => {
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

      // Optimistic update
      setCategories(prevCategories =>
        prevCategories.map(category =>
          category.id === categoryToUpdate.id ? updatedCategory : category
        )
      );

      await updateCategory(categoryToUpdate.id, updatedCategory);
      showSuccessMessage('Producto eliminado correctamente');
    } catch (error) {
      console.error('Error:', error);
      showErrorMessage('Error al eliminar el producto');
      // Recargar las categorías solo si hay un error
      await loadCategories();
    }
  };

  // Vista previa del menú
  const handlePreviewMenu = () => {
    window.open('/preview', '_blank');
  };

  const handleProductSuccess = (categoryId: string) => {
    setExpandedCategories(prev => {
      if (!prev.includes(categoryId)) {
        return [...prev, categoryId];
      }
      return prev;
    });
  };

  const handleDarkModeToggle = async () => {
    try {
      const newMode = !isDarkMode;
      // Actualizar estado local y DOM
      setIsDarkMode(newMode);
      document.documentElement.classList.toggle('dark', newMode);
      
      // Persistir en localStorage y Firebase
      localStorage.setItem('menuDarkMode', JSON.stringify(newMode));
      await updateThemeConfig(newMode);
      
      showSuccessMessage(newMode ? 'Modo oscuro activado' : 'Modo claro activado');
    } catch (error) {
      console.error('Error al cambiar el modo:', error);
      showErrorMessage('Error al cambiar el modo de visualización');
      
      // Revertir cambios en caso de error
      const savedMode = localStorage.getItem('menuDarkMode');
      if (savedMode !== null) {
        const previousMode = JSON.parse(savedMode);
        setIsDarkMode(previousMode);
        document.documentElement.classList.toggle('dark', previousMode);
      }
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex bg-gray-50 min-w-0">
        {/* Lista de Categorías */}
        <section className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 px-2 md:p-6 pt-16 md:pt-6 overflow-y-auto">
            {/* Mensajes de estado */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
              {isLoading && (
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-700 border-t-transparent"></div>
                  Cargando...
                </div>
              )}
              {error && (
                <div className="bg-red-50 text-red-700 px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
                  <ExclamationCircleIcon className="h-5 w-5" />
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5" />
                  {successMessage}
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 mb-6">
              <div className="flex flex-col md:flex-row gap-3">
                {/* Grupo de Botones Principales */}
                <div className="flex-1 flex flex-col gap-2">
                  <button
                    onClick={() => setIsCategoryFormOpen(true)}
                    className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all flex items-center gap-2 text-sm justify-center whitespace-nowrap"
                    disabled={isLoading}
                  >
                    <PlusIcon className="h-4 w-4 text-white" /> 
                    <span>Nueva Categoría</span>
                  </button>
                  <ModalCategoryForm
                    isOpen={isCategoryFormOpen}
                    onSubmit={handleCreateCategory}
                    onClose={() => setIsCategoryFormOpen(false)}
                    existingCategories={categories.map(cat => cat.name)}
                  />

                  <button
                    onClick={() => {
                      setProductToEdit(null);
                      setIsModalOpen(true);
                    }}
                    className="w-full px-3 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500 transition-all text-sm flex items-center gap-2 justify-center whitespace-nowrap"
                    disabled={isLoading}
                  >
                    <PlusIcon className="h-4 w-4 text-white" />
                    <span>Nuevo Plato</span>
                  </button>

                  <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`w-full px-3 py-2 ${
                      isEditMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-600 hover:bg-gray-700'
                    } text-white rounded-md transition-all text-sm flex items-center gap-2 justify-center whitespace-nowrap`}
                    disabled={isLoading}
                  >
                    <PencilSquareIcon className="h-4 w-4 text-white" />
                    <span>{isEditMode ? 'Terminar Edición' : 'Editar Categorías'}</span>
                  </button>
                </div>

                {/* Grupo de Utilidades */}
                <div className="flex flex-row gap-2 md:w-auto w-full">
                  <button
                    onClick={handlePreviewMenu}
                    className="flex-1 md:flex-initial p-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-all flex items-center justify-center"
                    disabled={isLoading}
                    title="Ver QR"
                  >
                    <QrCodeIcon className="h-4 w-4 text-white" />
                  </button>

                  <button
                    onClick={handleDarkModeToggle}
                    className="flex-1 md:flex-initial p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-all flex items-center justify-center"
                    disabled={isLoading}
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

            {/* Lista de Menú */}
            <MenuList
              categories={categories}
              setCategories={handleCategoriesChange}
              isEditMode={isEditMode}
              onEditProduct={handleEditProduct}
              onToggleProductVisibility={handleToggleProductVisibility}
              onDeleteProduct={handleDeleteProduct}
              expandedCategories={expandedCategories}
              setExpandedCategories={setExpandedCategories}
            />

            {/* Modal de Producto */}
            {isModalOpen && (
              <ProductForm
                isOpen={isModalOpen}
                onClose={() => {
                  setIsModalOpen(false);
                  setProductToEdit(null);
                }}
                onSubmit={handleSubmitProduct}
                categories={categories}
                productToEdit={productToEdit}
                onSuccess={handleProductSuccess}
              />
            )}
          </div>
        </section>

        {/* Panel de Vista Previa */}
        <PreviewPanel 
          categories={categories} 
          isDarkMode={isDarkMode}
        />
      </main>

      {/* Botón flotante para móvil */}
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
