import { memo } from 'react';
import { PencilSquareIcon, EyeIcon, EyeSlashIcon, TrashIcon, Bars3Icon, PhotoIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { Product } from './types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PRODUCT_CARD_STYLES } from '../constants/layout';

interface ProductCardProps {
  product: Product;
  isEditMode?: boolean;
  onEdit?: (product: Product) => void;
  onToggleVisibility?: () => void;
  onDelete?: () => void;
}

const ProductCard = memo(({ 
  product, 
  isEditMode = false,
  onEdit,
  onToggleVisibility,
  onDelete
}: ProductCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <article 
      ref={setNodeRef}
      style={style}
      className="flex flex-col md:flex-row items-start gap-3 p-3 bg-white rounded-lg border border-gray-200/80 transition-colors relative"
    >
      {/* Imagen del producto */}
      <div className="w-full md:w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <PhotoIcon className="w-8 h-8 text-gray-300" />
          </div>
        )}
      </div>

      {/* Contenido del producto */}
      <div className="flex-grow min-w-0 flex flex-col h-20">
        <div className="md:max-w-[60%]">
          <h3 className={PRODUCT_CARD_STYLES.title}>{product.name}</h3>
          <p className={PRODUCT_CARD_STYLES.description}>{product.description}</p>
        </div>
      </div>

      {/* Precio y botones alineados horizontalmente */}
      <div className="flex items-center justify-between w-full md:w-auto mt-1 md:mt-0 md:absolute md:right-3 md:top-3">
        <div className="flex items-center gap-2">
          <span className={PRODUCT_CARD_STYLES.priceBadge}>
            ${product.price.toLocaleString('es-AR')}
          </span>
          {product.featured && (
            <div className={PRODUCT_CARD_STYLES.featuredBadge}>
              <StarIcon className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:absolute md:right-0 md:bottom-[-60px]">
          <button 
            onClick={() => onEdit?.(product)} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Editar"
          >
            <PencilSquareIcon className="w-5 h-5 text-gray-500" />
          </button>
          <button 
            onClick={onToggleVisibility} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={product.visible ? "Ocultar" : "Mostrar"}
          >
            {product.visible ? (
              <EyeIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <EyeSlashIcon className="w-5 h-5 text-gray-500" />
            )}
          </button>
          <button 
            onClick={onDelete} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Eliminar"
          >
            <TrashIcon className="w-5 h-5 text-gray-500" />
          </button>
          <button 
            {...attributes} 
            {...listeners} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-grab touch-none"
            title="Arrastrar"
          >
            <Bars3Icon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </article>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
