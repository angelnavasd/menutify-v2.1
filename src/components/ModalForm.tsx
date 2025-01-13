import { useState, useEffect } from 'react';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  featured: boolean;
  currency: string;
  visible: boolean;  // ✅ Control de visibilidad
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
  productToEdit?: Product | null;
}

const ModalForm = ({ isOpen, onClose, onSubmit, categories, productToEdit }: ModalFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('ARS');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [highlight, setHighlight] = useState(false);
  const [visible, setVisible] = useState(true);  // ✅ Estado para visibilidad

  // ✅ Cargar datos al editar producto
  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.name);
      setDescription(productToEdit.description);
      setPrice(productToEdit.price.toString());
      setCurrency(productToEdit.currency);
      setCategoryId(productToEdit.categoryId);
      setImagePreview(productToEdit.image);
      setHighlight(productToEdit.featured);
      setVisible(productToEdit.visible);  // ✅ Cargar visibilidad
    } else {
      // 🔥 Limpiar formulario al crear nuevo producto
      setTitle('');
      setDescription('');
      setPrice('');
      setCurrency('ARS');
      setCategoryId('');
      setImage(null);
      setImagePreview(null);
      setHighlight(false);
      setVisible(true);  // ✅ Visible por defecto
    }
  }, [productToEdit, isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !price || !categoryId) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const newProduct: Product = {
      id: productToEdit ? productToEdit.id : Date.now().toString(),
      name: title,
      description,
      price: parseFloat(price),
      categoryId,
      image: image ? URL.createObjectURL(image) : (productToEdit?.image || ''),
      featured: highlight,
      currency,
      visible,  // ✅ Guardar visibilidad
    };

    onSubmit(newProduct);
    onClose();
  };

  return (
    <>
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />}

      <div className={`fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {productToEdit ? 'Editar platillo' : 'Crear nuevo platillo'}
            </h2>
            <p className="text-sm text-gray-500">
              {productToEdit ? 'Edita los detalles del platillo.' : 'Agrega un nuevo platillo a tu menú.'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título del plato</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ejemplo: Pizza Muzzarella" className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Selecciona una categoría</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-32 bg-gray-100">
              <label className="cursor-pointer text-center text-gray-500">
                Sube tu imagen
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            {imagePreview && (
              <div className="w-1/2 relative">
                <img src={imagePreview} alt="Vista previa" className="w-full h-32 object-cover rounded-lg" />
                <button onClick={handleImageRemove} type="button" className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción del platillo" className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
          </div>

          <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
          <div className="flex">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-l-lg"
            >
              <option value="ARS">ARS</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Precio"
              className="w-full px-3 py-2 border border-gray-300 rounded-r-lg"
              required
            />
          </div>
        </div>


          <div className="flex items-center gap-2">
            <input type="checkbox" checked={highlight} onChange={(e) => setHighlight(e.target.checked)} className="h-4 w-4" />
            <label className="text-sm">Destacar platillo</label>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="h-4 w-4" />
            <label className="text-sm">Hacer visible</label>
          </div>

          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg">
            {productToEdit ? 'Guardar cambios' : 'Agregar nuevo platillo'}
          </button>
        </form>
      </div>
    </>
  );
};

export default ModalForm;
