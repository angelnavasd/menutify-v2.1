import { useState } from 'react';
import { PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon, Bars4Icon, PhotoIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Product } from './types';
import { PRODUCT_CARD_STYLES } from '../constants/layout';
import { PRODUCT_CARD_ANIMATION_VARIANTS } from '../constants/animations';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onEdit: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
  isEditMode: boolean;
}

const formatPrice = (price: number) => {
  const priceString = Math.round(price * 100).toString().padStart(3, '0');
  const integerPart = priceString.slice(0, -2);
  const decimalPart = priceString.slice(-2);
  
  return `${integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decimalPart}`;
};

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
    transition
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      variants={PRODUCT_CARD_ANIMATION_VARIANTS.drag}
      animate={isDragging ? 'dragging' : 'initial'}
      className={`${PRODUCT_CARD_STYLES.container} ${!product.visible ? 'opacity-50' : ''}`}
    >
      {isEditMode && (
        <div
          className={PRODUCT_CARD_STYLES.dragHandle}
          {...attributes}
          {...listeners}
        >
          <Bars4Icon className="h-4 w-4 text-gray-400" />
        </div>
      )}

      <div className={PRODUCT_CARD_STYLES.imageContainer}>
        {product.image && imageLoading && (
          <motion.div 
            className={PRODUCT_CARD_STYLES.imagePlaceholder}
            variants={PRODUCT_CARD_ANIMATION_VARIANTS.image}
            initial="loading"
            animate="loaded"
          />
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

      <div className={PRODUCT_CARD_STYLES.contentContainer}>
        <div className={PRODUCT_CARD_STYLES.headerContainer}>
          <h3 className={`${PRODUCT_CARD_STYLES.title} ${!product.visible ? 'line-through' : ''}`}>
            {product.name}
          </h3>
          <div className={PRODUCT_CARD_STYLES.actionsContainer}>
            {product.featured && (
              <span className={PRODUCT_CARD_STYLES.featuredBadge}>
                <StarIconSolid className="h-3.5 w-3.5 text-amber-400" />
              </span>
            )}
            <span className={PRODUCT_CARD_STYLES.priceBadge}>
              ${formatPrice(product.price)}
            </span>
          </div>
        </div>

        <div className={PRODUCT_CARD_STYLES.headerContainer}>
          {product.description && (
            <p className={`${PRODUCT_CARD_STYLES.description} ${!product.visible ? 'line-through' : ''}`}>
              {product.description}
            </p>
          )}
          <div className={PRODUCT_CARD_STYLES.actionsContainer}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className={`${PRODUCT_CARD_STYLES.actionButton.base} ${PRODUCT_CARD_STYLES.actionButton.edit}`}
            >
              <PencilIcon className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility();
              }}
              className={`${PRODUCT_CARD_STYLES.actionButton.base} ${
                product.visible 
                  ? PRODUCT_CARD_STYLES.actionButton.visibility.visible
                  : PRODUCT_CARD_STYLES.actionButton.visibility.hidden
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
              className={`${PRODUCT_CARD_STYLES.actionButton.base} ${PRODUCT_CARD_STYLES.actionButton.delete}`}
            >
              <TrashIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
