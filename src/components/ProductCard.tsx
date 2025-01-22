import { PencilSquareIcon, TrashIcon, EyeIcon, EyeSlashIcon, Bars4Icon } from '@heroicons/react/24/outline';
import { Product } from './types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PRODUCT_CARD_STYLES } from '../constants/layout';

interface ProductCardProps {
  product: Product;
  onEdit: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
  isEditMode: boolean;
}

const ProductCard = ({ product, onEdit, onToggleVisibility, onDelete, isEditMode }: ProductCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: product.id,
    disabled: !isEditMode,
    data: {
      type: 'product'
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors rounded-lg border-b border-gray-200/30 last:border-b-0 ${!product.visible ? 'opacity-50' : ''}`}
    >
      {isEditMode && (
        <div
          className="flex-shrink-0 cursor-grab active:cursor-grabbing touch-none"
          {...attributes}
          {...listeners}
        >
          <Bars4Icon className="w-4 h-4 text-gray-400" />
        </div>
      )}

      <div className="relative flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
      </div>

      <div className="flex-grow min-w-0 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div className="min-w-0">
            <h3 className="font-medium text-gray-900 truncate">
              {product.name}
            </h3>
            {product.featured && (
              <span className="px-2 py-0.5 text-xs text-amber-600 bg-amber-50 rounded-md inline-flex items-center">
                Destacado
              </span>
            )}
          </div>
          <span className="px-2 py-0.5 text-sm font-medium text-green-700 bg-green-50 rounded-md">
            ${product.price.toLocaleString('es-AR')}
          </span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 flex-grow">
          {product.description}
        </p>
      </div>

      {isEditMode && (
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={onEdit}
            className="p-1 text-gray-500 hover:text-orange-400 hover:bg-orange-50 rounded transition-colors"
          >
            <PencilSquareIcon className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleVisibility}
            className={`p-1 rounded transition-colors ${
              !product.visible
                ? 'text-orange-400 hover:text-orange-500 hover:bg-orange-50'
                : 'text-gray-500 hover:text-orange-400 hover:bg-orange-50'
            }`}
          >
            {product.visible ? (
              <EyeIcon className="w-4 h-4" />
            ) : (
              <EyeSlashIcon className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => {
              if (confirm('¿Estás seguro de eliminar este producto?')) {
                onDelete();
              }
            }}
            className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-50 rounded transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
