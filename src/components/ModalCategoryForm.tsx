import { useState } from 'react';

interface ModalCategoryFormProps {
  onSubmit: (categoryName: string) => void;
  onCancel: () => void;
  existingCategories: string[];  // 🔥 Agregado para pasar las categorías
}

const ModalCategoryForm = ({ onSubmit, onCancel, existingCategories }: ModalCategoryFormProps) => {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validar campo vacío
    if (!categoryName.trim()) {
      setError('El nombre de la categoría no puede estar vacío.');
      return;
    }

    // ✅ Validar duplicados (ignorar mayúsculas/minúsculas)
    if (existingCategories.some((name) => name.toLowerCase() === categoryName.toLowerCase())) {
      setError('Ya existe una categoría con ese nombre.');
      return;
    }

    // ✅ Validar longitud
    if (categoryName.length > 30) {
      setError('El nombre debe tener máximo 30 caracteres.');
      return;
    }

    // ✅ Si todo está bien, crear categoría
    onSubmit(categoryName.trim());
    setCategoryName('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        placeholder="Nombre de la categoría"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
      />
      
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Crear
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ModalCategoryForm;
