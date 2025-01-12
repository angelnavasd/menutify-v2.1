import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
}

const ProductCard = ({ id, name }: ProductCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const [visible, setVisible] = useState(true);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab', // 🔥 Cursor sutil, sin sombreado
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
        <button onClick={() => alert(`Editar ${name}`)}>
          <PencilIcon className="h-5 w-5 text-blue-500" />
        </button>

        <button onClick={() => setVisible(!visible)}>
          {visible ? (
            <EyeIcon className="h-5 w-5 text-green-500" />
          ) : (
            <EyeSlashIcon className="h-5 w-5 text-yellow-500" />
          )}
        </button>

        <button onClick={() => alert(`Eliminar ${name}`)}>
          <TrashIcon className="h-5 w-5 text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
