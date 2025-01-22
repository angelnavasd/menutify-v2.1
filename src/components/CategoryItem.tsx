import { useState } from 'react';
import { ChevronDownIcon, PencilSquareIcon, TrashIcon, Bars4Icon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { CategoryItemProps } from './types';
import DragAndDropWrapper from './DragAndDropWrapper';
import ProductCard from './ProductCard';
import { DragEndEvent } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TRANSITION_EASE, CATEGORY_ITEM_ANIMATION_VARIANTS } from '../constants/animations';
import { MENU_LIST_STYLES, CATEGORY_ITEM_STYLES } from '../constants/layout';

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
  showExpandIcon = true
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
      className={`${CATEGORY_ITEM_STYLES.container.base} hover:bg-gray-50 transition-colors border-b border-gray-100/70 last:border-b-0`}
    >
      <div className="relative">
        <div
          className={`${CATEGORY_ITEM_STYLES.header.base} ${MENU_LIST_STYLES.spacing.categoryPadding} ${
            !isEditMode && 'cursor-pointer'
          }`}
          onClick={!isEditMode ? handleCategoryClick : undefined}
        >
          {isEditMode && (
            <div 
              className={CATEGORY_ITEM_STYLES.header.dragHandle}
              {...attributes}
              {...listeners}
            >
              <Bars4Icon className={CATEGORY_ITEM_STYLES.icons.base} />
            </div>
          )}
          
          <div className={`flex-1 ${isEditMode ? CATEGORY_ITEM_STYLES.header.editMode : ''}`}>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="flex items-center" onClick={e => e.stopPropagation()}>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className={`${CATEGORY_ITEM_STYLES.input.base} ${CATEGORY_ITEM_STYLES.input.focus}`}
                  autoFocus
                  onBlur={handleSubmit}
                />
              </form>
            ) : (
              <div className={`flex flex-col ${MENU_LIST_STYLES.spacing.contentGap}`}>
                <h3 className={CATEGORY_ITEM_STYLES.title.base}>
                  {name}
                </h3>
                <p className={CATEGORY_ITEM_STYLES.title.count}>
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
                  className={`${MENU_LIST_STYLES.spacing.buttonPadding} text-gray-500 hover:text-gray-600 transition-colors`}
                >
                  <PencilSquareIcon className={CATEGORY_ITEM_STYLES.icons.base} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
                      onDelete(id);
                    }
                  }}
                  className={`${MENU_LIST_STYLES.spacing.buttonPadding} text-gray-500 hover:text-red-500 transition-colors`}
                >
                  <TrashIcon className={CATEGORY_ITEM_STYLES.icons.base} />
                </button>
              </>
            )}
            {showExpandIcon && (
              <motion.div
                animate={isExpanded ? "expanded" : "collapsed"}
                variants={CATEGORY_ITEM_ANIMATION_VARIANTS.chevron}
                transition={TRANSITION_EASE}
              >
                <ChevronDownIcon className={CATEGORY_ITEM_STYLES.icons.base} />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido expandible */}
      <motion.div 
        variants={CATEGORY_ITEM_ANIMATION_VARIANTS.content}
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        className="overflow-hidden"
      >
        <div className={`${MENU_LIST_STYLES.spacing.contentPadding} ${MENU_LIST_STYLES.spacing.sectionGap}`}>
          <div className="border-t border-gray-100" />
          {products.length === 0 ? (
            <p className="text-gray-500">0 platillos</p>
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

