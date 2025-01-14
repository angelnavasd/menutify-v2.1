import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  currency: string;
  visible: boolean;
  onEdit: (productId: string) => void;
  onToggleVisibility: (productId: string) => void;
  onDelete: (productId: string) => void;
}

const ProductCard = ({
  id,
  name,
  description,
  price,
  image,
  currency,
  visible,
  onEdit,
  onToggleVisibility,
  onDelete
}: ProductCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  // 🛠️ Prevenir que los botones interfieran con el Drag & Drop
  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all w-full"
    >
      {/* 📸 Imagen e información */}
      <div className="flex items-center gap-3">
        {/* 🔥 Imagen del producto */}
        <img
          src={image}
          alt={name}
          className="w-12 h-12 object-cover rounded-md border border-gray-300"
        />

        {/* 📝 Detalles del producto */}
        <div>
          <h4 className={`text-sm font-semibold ${visible ? 'text-gray-800' : 'line-through text-gray-400'}`}>
            {name}
          </h4>
          <p className="text-xs text-gray-500 line-clamp-1">{description}</p>
          <p className="text-sm font-semibold text-green-600 mt-1">
            {currency} {price.toFixed(2)}
          </p>
        </div>
      </div>

      {/* 🛠️ Acciones */}
      <div className="flex gap-1">
        {/* ✏️ Botón Editar */}
        <button
          onClick={(e) => handleActionClick(e, () => onEdit(id))}
          className="p-1.5 bg-gray-100 rounded-md hover:bg-blue-100 transition"
          title="Editar"
        >
          <PencilIcon className="h-4 w-4 text-gray-600 hover:text-blue-600" />
        </button>

        {/* 👁️ Botón Visibilidad */}
        <button
          onClick={(e) => handleActionClick(e, () => onToggleVisibility(id))}
          className="p-1.5 bg-gray-100 rounded-md hover:bg-yellow-100 transition"
          title={visible ? 'Ocultar' : 'Mostrar'}
        >
          {visible ? (
            <EyeIcon className="h-4 w-4 text-yellow-500" />
          ) : (
            <EyeSlashIcon className="h-4 w-4 text-gray-400" />
          )}
        </button>

        {/* 🗑️ Botón Eliminar */}
        <button
          onClick={(e) => handleActionClick(e, () => onDelete(id))}
          className="p-1.5 bg-gray-100 rounded-md hover:bg-red-100 transition"
          title="Eliminar"
        >
          <TrashIcon className="h-4 w-4 text-red-500 hover:text-red-600" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
