import { useState, useRef, useEffect } from 'react';

interface ModalCategoryFormProps {
  isOpen: boolean;
  onSubmit: (categoryName: string) => void;
  onClose: () => void;
  existingCategories: string[];
}

const ModalCategoryForm = ({ isOpen, onSubmit, onClose, existingCategories }: ModalCategoryFormProps) => {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setError('El nombre de la categoría no puede estar vacío.');
      return;
    }

    if (existingCategories.some((name) => name.toLowerCase() === categoryName.toLowerCase())) {
      setError('Ya existe una categoría con ese nombre.');
      return;
    }

    if (categoryName.length > 30) {
      setError('El nombre debe tener máximo 30 caracteres.');
      return;
    }

    onSubmit(categoryName.trim());
    setCategoryName('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={formRef}
      className="absolute mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
    >
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Nombre de la categoría"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              autoFocus
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-xs">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
            >
              Crear
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCategoryForm;
