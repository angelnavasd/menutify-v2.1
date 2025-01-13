import Sidebar from '../components/Sidebar';
import MenuList from '../components/MenuList';
import PreviewPanel from '../components/PreviewPanel';
import { useState } from 'react';
import ModalForm from '../components/ModalForm';
import { Bars3Icon } from '@heroicons/react/24/outline';  // 🔥 Ícono para el botón de categoría

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  featured: boolean;
  currency: string;   // 🔥 Agregado
  visible: boolean;   // 🔥 Agregado
}

interface Category {
  id: string;
  name: string;
  products: Product[];
}


const Dashboard = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Entradas', products: [] },
    { id: '2', name: 'Platos Principales', products: [] },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);  // 🔥 Nuevo estado para el modal de categorías

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
  };

  return (
    <div className="flex h-screen">
      {/* ✅ Sidebar */}
      <Sidebar />

      {/* ✅ Contenido principal */}
      <main className="flex flex-1">
        {/* ✅ Editor de menú */}
        <section className="w-2/3 flex flex-col bg-gray-100 p-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Empieza a crear tu nuevo menú</h1>

          {/* 🔥 Botones de acción */}
          <div className="flex gap-4 mb-4">
            {/* ✅ Botón para crear categoría */}
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
            >
              <Bars3Icon className="h-5 w-5" /> Crear Nueva Categoría
            </button>

            {/* ✅ Botón para crear plato */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
            >
              ➕ Crear Nuevo Plato
            </button>
          </div>

          {/* ✅ Lista de categorías */}
          <MenuList categories={categories} setCategories={setCategories} />
        </section>

        {/* ✅ Previsualizador */}
        <aside className="w-1/3 border-l border-gray-300 bg-gray-50">
          <PreviewPanel />
        </aside>
      </main>

      {/* ✅ Modal para crear productos */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProduct}
        categories={categories}
      />

      {/* 🔥 Modal para crear categorías (Próximo a implementar) */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Nueva Categoría</h2>
            <input
              type="text"
              placeholder="Nombre de la categoría"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
              id="newCategoryName"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const input = document.getElementById('newCategoryName') as HTMLInputElement;
                  if (input.value) {
                    handleCreateCategory(input.value);
                    setIsCategoryModalOpen(false);
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Crear
              </button>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
