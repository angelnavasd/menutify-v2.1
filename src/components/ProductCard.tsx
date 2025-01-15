import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon, Bars4Icon, PhotoIcon } from '@heroicons/react/24/outline';
import { ProductCardProps } from './types';

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
      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all w-full"
    >
      {/* 📦 Información del Producto */}
      <div className="flex items-center gap-3">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-12 h-12 object-cover rounded-md border border-gray-300"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center">
            <PhotoIcon className="h-6 w-6 text-gray-400" />
          </div>
        )}

        <div>
          <h4 className={`text-sm font-semibold ${visible ? 'text-gray-800' : 'line-through text-gray-400'}`}>
            {name}
          </h4>
          <p className="text-xs text-gray-500 line-clamp-1">{description}</p>
          <p className="text-sm font-semibold text-green-600">{currency} {price.toFixed(2)}</p>
        </div>
      </div>

      {/* 🛠️ Botones de Acción */}
      <div className="flex gap-1">
        {/* ✅ Editar */}
        <button
          onClick={() => onEdit(id, {})}  // 🔥 Se agregaron los dos argumentos requeridos
          title="Editar producto"
          className="p-1.5 rounded-md bg-gray-100 hover:bg-blue-100 transition-all"
        >
          <PencilIcon className="h-4 w-4 text-blue-500" />
        </button>

        {/* ✅ Mostrar/Ocultar */}
        <button
          onClick={() => onToggleVisibility(id)}
          title={visible ? "Ocultar producto" : "Mostrar producto"}
          className="p-1.5 rounded-md bg-gray-100 hover:bg-yellow-100 transition-all"
        >
          {visible ? (
            <EyeIcon className="h-4 w-4 text-yellow-500" />
          ) : (
            <EyeSlashIcon className="h-4 w-4 text-gray-400" />
          )}
        </button>

        {/* ✅ Eliminar */}
        <button
          onClick={() => {
            if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
              onDelete(id);
            }
          }}
          title="Eliminar producto"
          className="p-1.5 rounded-md bg-gray-100 hover:bg-red-100 transition-all"
        >
          <TrashIcon className="h-4 w-4 text-red-500" />
        </button>

        {/* ✅ Ícono de arrastre */}
        <div
          {...listeners}
          {...attributes}
          title="Arrastrar para mover"
          className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 cursor-grab active:cursor-grabbing transition"
        >
          <Bars4Icon className="h-4 w-4 text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
