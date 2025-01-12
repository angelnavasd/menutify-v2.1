import Sidebar from '../components/Sidebar';
import MenuList from '../components/MenuList';
import PreviewPanel from '../components/PreviewPanel';
import { useState } from 'react';
import ModalForm from '../components/ModalForm';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  featured: boolean;
}

interface Category {
  id: string;
  name: string;
  products: Product[];
}

const Dashboard = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Entradas',
      products: [],
    },
    {
      id: '2',
      name: 'Platos Principales',
      products: [],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <div className="flex h-screen">
      {/* ✅ Sidebar */}
      <Sidebar />

      {/* ✅ Contenido principal */}
      <main className="flex flex-1">
        {/* ✅ Editor de menú */}
        <section className="w-2/3 flex flex-col bg-gray-100 p-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Empieza a crear tu nuevo menú</h1>

          {/* ✅ Botón para crear plato */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
          >
            Crear Nuevo Plato
          </button>

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
    </div>
  );
};

export default Dashboard;
