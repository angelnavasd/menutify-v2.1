import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ProductCardProps } from './types';  // ✅ Importar interfaz desde types.ts

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
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all w-full"
    >
      {/* 📦 Información del Producto */}
      <div className="flex items-center gap-3">
        <img src={image} alt={name} className="w-12 h-12 object-cover rounded-md" />
        <div>
          <h4 className={`text-sm font-semibold ${visible ? 'text-gray-800' : 'line-through text-gray-400'}`}>
            {name}
          </h4>
          <p className="text-xs text-gray-500">{description}</p>
          <p className="text-sm font-semibold text-green-600">{currency} {price.toFixed(2)}</p>
        </div>
      </div>

      {/* 🛠️ Botones de Acción */}
      <div className="flex gap-2">
        <button onClick={() => onEdit(id)} title="Editar">
          <PencilIcon className="h-5 w-5 text-blue-500 hover:text-blue-600 transition" />
        </button>

        <button onClick={() => onToggleVisibility(id)} title={visible ? "Ocultar" : "Mostrar"}>
          {visible ? (
            <EyeIcon className="h-5 w-5 text-yellow-500 hover:text-yellow-600 transition" />
          ) : (
            <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500 transition" />
          )}
        </button>

        <button onClick={() => onDelete(id)} title="Eliminar">
          <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-600 transition" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
