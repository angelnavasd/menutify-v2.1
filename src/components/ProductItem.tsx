import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface ProductItemProps {
  id: string;
  name: string;
  isVisible: boolean;
}

const ProductItem = ({ id, name, isVisible }: ProductItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const [visible, setVisible] = useState(isVisible);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between p-3 bg-gray-100 rounded-md shadow hover:bg-gray-200 transition"
    >
      <span className="text-sm font-medium">{name}</span>

      <div className="flex gap-2">
        <button onClick={() => setVisible(!visible)}>
          {visible ? (
            <EyeIcon className="w-5 h-5 text-green-500" />
          ) : (
            <EyeSlashIcon className="w-5 h-5 text-gray-400" />
          )}
        </button>

        <button onClick={() => alert(`Editar ${name}`)}>
          <PencilIcon className="w-5 h-5 text-blue-500" />
        </button>

        <button onClick={() => alert(`Eliminar ${name}`)}>
          <TrashIcon className="w-5 h-5 text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
