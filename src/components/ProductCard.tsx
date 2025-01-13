import { useSortable } from '@dnd-kit/sortable';  // ✅ Importación correcta
import { CSS } from '@dnd-kit/utilities';         // ✅ Importación correcta
import { PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';  // ✅ Íconos
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  onEdit: (id: string) => void;  // ✅ Nueva prop para editar
}

const ProductCard = ({ id, name, onEdit }: ProductCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const [visible, setVisible] = useState(true);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md"
    >
      <span className={`${visible ? '' : 'line-through text-gray-400'}`}>{name}</span>

      <div className="flex gap-2">
        {/* 🔥 Botón para editar */}
        <button onClick={() => onEdit(id)}>
          <PencilIcon className="h-5 w-5 text-blue-500" />
        </button>

        {/* 🔥 Botón para ocultar/mostrar */}
        <button onClick={() => setVisible(!visible)}>
          {visible ? (
            <EyeIcon className="h-5 w-5 text-green-500" />
          ) : (
            <EyeSlashIcon className="h-5 w-5 text-yellow-500" />
          )}
        </button>

        {/* 🔥 Botón para eliminar */}
        <button onClick={() => alert(`Eliminar ${name}`)}>
          <TrashIcon className="h-5 w-5 text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
