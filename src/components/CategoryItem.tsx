import { useState } from 'react';
import { ChevronDownIcon, PencilSquareIcon, TrashIcon, Bars4Icon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { CategoryItemProps } from './types';
import DragAndDropWrapper from './DragAndDropWrapper';
import ProductCard from './ProductCard';
import { DragEndEvent } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TRANSITION_EASE, EXPAND_VARIANTS } from '../constants/animations';
import { MENU_LIST_STYLES } from '../constants/layout';

const CategoryItem = ({
  id,
  name,
  products,
  isExpanded,
  isEditMode,
  onToggleExpand,
  onEditName,
  onDelete,
  onEditProduct,
  onToggleVisibility,
  onDeleteProduct,
  onDragEndProducts,
}: CategoryItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id,
    disabled: !isEditMode,
    data: {
      type: 'category'
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDragEndProducts = (event: DragEndEvent) => {
    onDragEndProducts(event, id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedName.trim()) {
      onEditName(id, editedName.trim());
      setIsEditing(false);
    }
  };

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isEditMode) {
      onToggleExpand(id);
    }
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`bg-white ${MENU_LIST_STYLES.borders.container} rounded-lg overflow-hidden`}
    >
      <div className="relative">
        <div
          className={`relative w-full ${MENU_LIST_STYLES.spacing.categoryPadding} flex items-center justify-between text-left ${MENU_LIST_STYLES.hover.item} ${MENU_LIST_STYLES.transitions.colors} ${
            !isEditMode && 'cursor-pointer'
          }`}
          onClick={!isEditMode ? handleCategoryClick : undefined}
        >
          {isEditMode && (
            <div 
              className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <Bars4Icon className="h-4 w-4 text-gray-400" />
            </div>
          )}
          
          <div className={`flex-1 ${isEditMode ? 'ml-6' : ''}`}>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="flex items-center" onClick={e => e.stopPropagation()}>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="px-2 py-0.5 border border-gray-200 rounded text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                  autoFocus
                  onBlur={handleSubmit}
                />
              </form>
            ) : (
              <div className={`flex flex-col ${MENU_LIST_STYLES.spacing.contentGap}`}>
                <h3 className="text-base font-medium text-gray-900">
                  {name}
                </h3>
                <p className="text-xs text-gray-500">
                  {products.length} {products.length === 1 ? 'platillo' : 'platillos'}
                </p>
              </div>
            )}
          </div>

          <div className={`flex items-center ${MENU_LIST_STYLES.spacing.iconGap}`}>
            {isEditMode && !isEditing && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className={`${MENU_LIST_STYLES.spacing.buttonPadding} text-gray-400 ${MENU_LIST_STYLES.hover.editButton} ${MENU_LIST_STYLES.transitions.colors}`}
                >
                  <PencilSquareIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
                      onDelete(id);
                    }
                  }}
                  className={`${MENU_LIST_STYLES.spacing.buttonPadding} text-gray-400 ${MENU_LIST_STYLES.hover.deleteButton} ${MENU_LIST_STYLES.transitions.colors}`}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </>
            )}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={TRANSITION_EASE}
            >
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contenido expandible */}
      <motion.div 
        variants={EXPAND_VARIANTS}
        initial="initial"
        animate={isExpanded ? "animate" : "initial"}
        className="overflow-hidden"
      >
        <div className={`${MENU_LIST_STYLES.spacing.contentPadding} ${MENU_LIST_STYLES.spacing.sectionGap}`}>
          <div className={`pt-1 ${MENU_LIST_STYLES.borders.divider}`} />
          {products.length === 0 ? (
            <p className="text-sm text-gray-500">0 platillos</p>
          ) : (
            <DragAndDropWrapper
              items={products}
              onDragEnd={handleDragEndProducts}
              isEditMode={isExpanded}
            >
              <div className={MENU_LIST_STYLES.spacing.sectionGap}>
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={() => onEditProduct(product.id, product)}
                    onToggleVisibility={() => onToggleVisibility(product.id)}
                    onDelete={() => onDeleteProduct(product.id)}
                    isEditMode={isExpanded}
                  />
                ))}
              </div>
            </DragAndDropWrapper>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CategoryItem;

