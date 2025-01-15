import Sidebar from '../components/Sidebar';
import MenuList from '../components/MenuList';
import PreviewPanel from '../components/PreviewPanel';
import { useState } from 'react';
import ModalForm from '../components/ModalForm';
import ModalCategoryForm from '../components/ModalCategoryForm';
import { Bars3Icon, EyeIcon, PlusIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { Product, Category } from '../components/types';

const Dashboard = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // ✅ Generador de ID único
  const generateId = () => {
    return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
  };

  // ✅ Crear o Actualizar Producto
  const handleCreateProduct = (product: Product) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === product.categoryId
          ? {
              ...category,
              products: productToEdit
                ? category.products.map((p) =>
                    p.id === productToEdit.id ? { ...product, id: productToEdit.id } : p
                  )
                : [...category.products, { ...product, id: generateId() }],
            }
          : category
      )
    );
    setProductToEdit(null);  // 🔄 Resetear producto editado
    setIsModalOpen(false);   // ✅ Cerrar el Modal al guardar
  };

  // ✅ Crear categorías con validación
  const handleCreateCategory = (categoryName: string) => {
    if (!categoryName.trim()) {
      alert("El nombre de la categoría no puede estar vacío.");
      return;
    }

    const alreadyExists = categories.some(
      (category) => category.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (alreadyExists) {
      alert("Ya existe una categoría con ese nombre.");
      return;
    }

    const newCategory: Category = {
      id: generateId(),
      name: categoryName,
      products: [],
    };

    setCategories((prevCategories) => [...prevCategories, newCategory]);
    setIsCategoryFormOpen(false);
  };

  // ✅ Editar producto (Abre el drawer con los datos del producto)
  const handleEditProduct = (productId: string) => {
    const productToEdit = categories
      .flatMap((category) => category.products)
      .find((product) => product.id === productId);

    if (productToEdit) {
      setProductToEdit(productToEdit);
      setIsModalOpen(true);  // ✅ Abrir el ModalForm al editar
    }
  };

  // ✅ Alternar visibilidad de producto
  const handleToggleProductVisibility = (productId: string) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) => ({
        ...category,
        products: category.products.map((product) =>
          product.id === productId
            ? { ...product, visible: !product.visible }
            : product
        ),
      }))
    );
  };

  // ✅ Eliminar producto
  const handleDeleteProduct = (productId: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      setCategories((prevCategories) =>
        prevCategories.map((category) => ({
          ...category,
          products: category.products.filter((product) => product.id !== productId),
        }))
      );
    }
  };

  // ✅ Vista previa del menú
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
            {/* ✅ Botón Crear Categoría */}
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

            {/* ✅ Botón Crear Nuevo Plato */}
            <button
              onClick={() => {
                setProductToEdit(null);
                setIsModalOpen(true);
              }}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all text-base flex items-center gap-2 justify-center"
            >
              <PlusIcon className="h-5 w-5 text-white" /> Crear Nuevo Plato
            </button>

            {/* ✅ Botón Activar/Desactivar Edición */}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`w-full md:w-auto px-6 py-3 ${
                isEditMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-600 hover:bg-gray-700'
              } text-white rounded-md transition-all text-base flex items-center gap-2 justify-center`}
            >
              <PencilSquareIcon className="h-5 w-5 text-white" />
              {isEditMode ? 'Terminar Edición de Categorías' : 'Editar Categorías'}
            </button>
          </div>

          {/* ✅ Lista de Categorías */}
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
            <MenuList
              categories={categories}
              setCategories={setCategories}
              isEditMode={isEditMode}
              onEditProduct={handleEditProduct}
              onToggleProductVisibility={handleToggleProductVisibility}
              onDeleteProduct={handleDeleteProduct}
            />
          )}
        </section>

        {/* ✅ Vista previa */}
        <aside className="hidden md:block w-1/3 border-l border-gray-300 bg-gray-50">
          <PreviewPanel />
        </aside>
      </main>

      {/* ✅ Modal para productos */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProduct}
        categories={categories}
        productToEdit={productToEdit}
      />
    </div>
  );
};

export default Dashboard;
