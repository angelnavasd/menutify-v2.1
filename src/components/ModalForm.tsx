import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

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

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newProduct: Product) => void;
  categories: Category[];
}

const ModalForm = ({ isOpen, onClose, onSubmit, categories }: ModalFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [highlight, setHighlight] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !price || !categoryId || !image) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: title,
      description,
      price: parseFloat(price),
      categoryId,
      image: URL.createObjectURL(image),
      featured: highlight,
    };

    onSubmit(newProduct);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 z-40"
        />
      )}

      <div
        className={`fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* 🔥 Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">Crear nuevo plato</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* 🔥 Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto h-full">
          {/* 🔹 Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título del plato</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Ejemplo: Pizza Muzzarella"
              required
            />
          </div>

          {/* 🔹 Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* 🔹 Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sube una imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
            />
          </div>

          {/* 🔹 Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Ejemplo: Pizza con masa fina y orégano"
              required
            />
          </div>

          {/* 🔹 Destacar producto */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={highlight}
              onChange={(e) => setHighlight(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">Destacar platillo</label>
          </div>

          {/* 🔹 Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="0.00"
              required
            />
          </div>

          {/* 🔥 Botón */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            Agregar nuevo platillo
          </button>
        </form>
      </div>
    </>
  );
};

export default ModalForm;
