import { memo } from 'react';
import { PencilSquareIcon, EyeIcon, EyeSlashIcon, TrashIcon, Bars3Icon, PhotoIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { Product } from './types';
import { PRODUCT_CARD_STYLES } from '../constants/layout';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
    <div 
      ref={setNodeRef}
      style={style}
      className={PRODUCT_CARD_STYLES.container}
    >
      <div className={PRODUCT_CARD_STYLES.imageContainer.wrapper}>
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={PRODUCT_CARD_STYLES.imageContainer.placeholder.container}>
            <PhotoIcon className={PRODUCT_CARD_STYLES.imageContainer.placeholder.icon} />
          </div>
        )}
      </div>

      <div className={PRODUCT_CARD_STYLES.contentContainer}>
        <div className={PRODUCT_CARD_STYLES.headerContainer}>
          <h3 className={PRODUCT_CARD_STYLES.title}>
            {product.name}
          </h3>
          <p className={PRODUCT_CARD_STYLES.description}>
            {product.description}
          </p>
        </div>
      </div>

      {isEditMode && (
        <div className={PRODUCT_CARD_STYLES.actionsContainer}>
          <div className={PRODUCT_CARD_STYLES.priceContainer}>
            <span className={PRODUCT_CARD_STYLES.priceBadge}>
              ${product.price.toLocaleString('es-AR')}
            </span>
            {product.featured ? (
              <span className={PRODUCT_CARD_STYLES.featuredBadge}>
                <StarIcon className="w-4 h-4" />
              </span>
            ) : (
              <span className={PRODUCT_CARD_STYLES.featuredPlaceholder} />
            )}
          </div>

          <div className={PRODUCT_CARD_STYLES.buttonsContainer}>
            <button
              onClick={() => onEdit?.(product)}
              className={`${PRODUCT_CARD_STYLES.actionButton.base} ${PRODUCT_CARD_STYLES.actionButton.edit}`}
            >
              <PencilSquareIcon className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleVisibility}
              className={`${PRODUCT_CARD_STYLES.actionButton.base} ${
                product.visible 
                  ? PRODUCT_CARD_STYLES.actionButton.visibility.visible
                  : PRODUCT_CARD_STYLES.actionButton.visibility.hidden
              }`}
            >
              {product.visible ? (
                <EyeIcon className="w-4 h-4" />
              ) : (
                <EyeSlashIcon className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onDelete}
              className={`${PRODUCT_CARD_STYLES.actionButton.base} ${PRODUCT_CARD_STYLES.actionButton.delete}`}
            >
              <TrashIcon className="w-4 h-4" />
            </button>
            <div className={PRODUCT_CARD_STYLES.divider} />
            <div className={PRODUCT_CARD_STYLES.dragHandle} {...attributes} {...listeners}>
              <Bars3Icon className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
