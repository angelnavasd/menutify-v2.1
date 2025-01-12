import { useState } from 'react';

interface ModalCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (categoryName: string) => void;
}

const ModalCategoryForm = ({ isOpen, onClose, onSubmit }: ModalCategoryFormProps) => {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName.trim() !== '') {
      onSubmit(categoryName);
      setCategoryName('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Crear Nueva Categoría</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Nombre de la categoría"
            className="w-full p-2 border rounded-md"
            required
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCategoryForm;
