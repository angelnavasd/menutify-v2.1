import Sidebar from '../components/Sidebar';
import MenuList from '../components/MenuList';
import PreviewPanel from '../components/PreviewPanel';
import { useState } from 'react';
import ModalForm from '../components/ModalForm';
import ModalCategoryForm from '../components/ModalCategoryForm';
import { Bars3Icon, EyeIcon, PlusIcon } from '@heroicons/react/24/outline';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  featured: boolean;
  currency: string;
  visible: boolean;
}

interface Category {
  id: string;
  name: string;
  products: Product[];
}

const Dashboard = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);

  // ✅ Manejar creación de productos
  const handleCreateProduct = (product: Product) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === product.categoryId
          ? { ...category, products: [...category.products, product] }
          : category
      )
    );
  };

  // ✅ Manejar creación de categorías
  const handleCreateCategory = (categoryName: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: categoryName,
      products: [],
    };

    setCategories((prevCategories) => [...prevCategories, newCategory]);
    setIsCategoryFormOpen(false);
  };

  const handlePreviewMenu = () => {
    window.open('/preview', '_blank');
  };

  return (
    <div className="flex h-screen">
      {/* ✅ Sidebar */}
      <Sidebar />

      {/* ✅ Contenido principal */}
      <main className="flex flex-1 flex-col md:flex-row">
        <section className="w-full md:w-2/3 flex flex-col bg-gray-100 pt-24 md:pt-8 px-6 md:px-8">
          <h1 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 text-left">
            Empieza a crear tu nuevo menú
          </h1>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full md:w-auto">
              <button
                onClick={() => setIsCategoryFormOpen(!isCategoryFormOpen)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all text-base"
              >
                <Bars3Icon className="h-5 w-5" /> Crear Nueva Categoría
              </button>

              {isCategoryFormOpen && (
                <div className="absolute mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10">
                  <ModalCategoryForm
                    onSubmit={handleCreateCategory}
                    onCancel={() => setIsCategoryFormOpen(false)}
                    existingCategories={categories.map((category) => category.name)}
                  />
                </div>
              )}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all text-base flex items-center gap-2 justify-center"
            >
              <PlusIcon className="h-5 w-5 text-white" /> Crear Nuevo Plato
            </button>
          </div>

          {/* ✅ Empty State o Lista de Categorías */}
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-white">
              <p className="text-gray-500 text-base mb-4">No tienes categorías creadas aún.</p>
              <button
                onClick={() => setIsCategoryFormOpen(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all flex items-center gap-2 text-base"
              >
                <PlusIcon className="h-5 w-5 text-white" /> Crear tu primera categoría
              </button>
            </div>
          ) : (
            <MenuList categories={categories} setCategories={setCategories} />
          )}
        </section>

        {/* ✅ Ocultar vista previa en Mobile */}
        <aside className="hidden md:block w-1/3 border-l border-gray-300 bg-gray-50">
          <PreviewPanel />
        </aside>
      </main>

      {/* ✅ Botón flotante para vista previa en Mobile */}
      <button
        onClick={handlePreviewMenu}
        className="fixed bottom-5 right-5 md:hidden bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
      >
        <EyeIcon className="h-6 w-6" />
      </button>

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProduct}
        categories={categories}
      />
    </div>
  );
};

export default Dashboard;
