import Sidebar from '../components/Sidebar';
import MenuList from '../components/MenuList';
import PreviewPanel from '../components/PreviewPanel';
import { useState } from 'react';
import ModalForm from '../components/ModalForm';
import ModalCategoryForm from '../components/ModalCategoryForm';
import { Bars3Icon } from '@heroicons/react/24/outline';

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
  const [categories, setCategories] = useState<Category[]>([]);  // 🔥 Inicia vacío

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

  return (
    <div className="flex h-screen">
      {/* ✅ Sidebar */}
      <Sidebar />

      {/* ✅ Contenido principal */}
      <main className="flex flex-1">
        <section className="w-2/3 flex flex-col bg-gray-100 p-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Empieza a crear tu nuevo menú</h1>

          <div className="flex gap-4 mb-4">
            <div className="relative">
              <button
                onClick={() => setIsCategoryFormOpen(!isCategoryFormOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
              >
                <Bars3Icon className="h-5 w-5" /> Crear Nueva Categoría
              </button>

              {isCategoryFormOpen && (
                <div className="absolute mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10">
                  <ModalCategoryForm
                    onSubmit={handleCreateCategory}
                    onCancel={() => setIsCategoryFormOpen(false)}
                    existingCategories={categories.map((category) => category.name)}  // ✅ Solo nombres
                  />
                </div>
              )}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
            >
              ➕ Crear Nuevo Plato
            </button>
          </div>

          {/* ✅ Empty State o Lista de Categorías */}
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-white">
              <p className="text-gray-500 text-lg mb-4">No tienes categorías creadas aún.</p>
              <button
                onClick={() => setIsCategoryFormOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
              >
                ➕ Crear tu primera categoría
              </button>
            </div>
          ) : (
            <MenuList categories={categories} setCategories={setCategories} />
          )}
        </section>

        <aside className="w-1/3 border-l border-gray-300 bg-gray-50">
          <PreviewPanel />
        </aside>
      </main>

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
