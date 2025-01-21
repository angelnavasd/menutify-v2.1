import { useState } from 'react';
import { PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon, Bars4Icon, PhotoIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Product } from './types';

interface ProductCardProps {
  product: Product;
  onEdit: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
  isEditMode: boolean;
}

const ProductCard = ({
  product,
  onEdit,
  onToggleVisibility,
  onDelete,
  isEditMode
}: ProductCardProps) => {
  const [imageLoading, setImageLoading] = useState(true);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: product.id,
    disabled: !isEditMode
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const formatPrice = (price: number) => {
    const priceString = Math.round(price * 100).toString().padStart(3, '0');
    const integerPart = priceString.slice(0, -2);
    const decimalPart = priceString.slice(-2);
    
    // Format integer part with thousands separator
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    return `${formattedInteger},${decimalPart}`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 ${
        !product.visible ? 'opacity-50' : ''
      }`}
    >
      {isEditMode && (
        <div
          className="flex-shrink-0 cursor-grab active:cursor-grabbing touch-none"
          {...attributes}
          {...listeners}
        >
          <Bars4Icon className="h-4 w-4 text-gray-400" />
        </div>
      )}
      <div className="relative flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
        {product.image && imageLoading && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onLoad={() => setImageLoading(false)}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <PhotoIcon className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>

      <div className="flex-grow min-w-0 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h3 className={`font-medium text-gray-900 truncate ${!product.visible ? 'line-through' : ''}`}>
            {product.name}
          </h3>
          <div className="flex items-center gap-1 ml-2">
            {product.featured && (
              <span className="px-2 py-0.5 flex items-center bg-amber-50 rounded-md">
                <StarIconSolid className="h-3.5 w-3.5 text-amber-400" />
              </span>
            )}
            <span className="px-2 py-0.5 text-sm font-medium text-green-700 bg-green-50 rounded-md">
              ${formatPrice(product.price)}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-start">
          {product.description && (
            <p className={`text-sm text-gray-500 line-clamp-2 flex-grow ${!product.visible ? 'line-through' : ''}`}>
              {product.description}
            </p>
          )}
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1 text-gray-500 hover:text-orange-400 hover:bg-orange-50 rounded transition-colors"
            >
              <PencilIcon className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility();
              }}
              className={`p-1 rounded transition-colors ${
                product.visible 
                  ? 'text-gray-500 hover:text-orange-400 hover:bg-orange-50'
                  : 'text-orange-400 hover:text-orange-500 hover:bg-orange-50'
              }`}
            >
              {product.visible ? (
                <EyeIcon className="h-3.5 w-3.5" />
              ) : (
                <EyeSlashIcon className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('¿Estás seguro de eliminar este producto?')) {
                  onDelete();
                }
              }}
              className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-50 rounded transition-colors"
            >
              <TrashIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
