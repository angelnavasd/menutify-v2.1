import { useState } from 'react';
import { ChevronDownIcon, PencilSquareIcon, TrashIcon, Bars4Icon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { CategoryItemProps } from './types';
import DragAndDropWrapper from './DragAndDropWrapper';
import ProductCard from './ProductCard';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    borderBottom: '1px solid #e5e7eb',
    padding: '16px 0'
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (editedName.trim() !== name) {
      onEditName(id, editedName.trim());
    }
    setIsEditing(false);
  };

  const handleCategoryClick = () => {
    if (!isEditMode) {
      onToggleExpand(id);
    }
  };

  return (
    <motion.div 
      ref={setNodeRef} 
      style={style}
      transition={{ duration: 0.2 }}
    >
      <div>
        <div 
          onClick={handleCategoryClick} 
          style={{ cursor: !isEditMode ? 'pointer' : 'default' }}
          className="transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              {isEditMode && !isEditing && (
                <button 
                  {...attributes}
                  {...listeners}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-grab touch-none"
                >
                  <Bars4Icon className="w-5 h-5 text-gray-500" />
                </button>
              )}
              <div className="flex-1 flex items-center gap-2">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="flex-1">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full text-base font-medium bg-transparent border-none focus:outline-none focus:ring-0"
                      autoFocus
                    />
                  </form>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-base font-medium">{name}</span>
                    {!isEditMode && <span className="text-gray-500">({products.length} productos)</span>}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isEditMode && !isEditing && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <PencilSquareIcon className="w-5 h-5 text-gray-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(id);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </>
              )}
              {!isEditMode && showExpandIcon && (
                <motion.div
                  animate={isExpanded ? { rotate: 180 } : { rotate: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="p-2"
                >
                  <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {!isEditMode && isExpanded && (
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <DragAndDropWrapper
            items={products}
            onDragEnd={(event) => onDragEndProducts(event, id)}
            isEditMode={isEditMode}
            type="product"
          >
            <div>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isEditMode={isEditMode}
                  onEdit={() => onEditProduct(product.id, product)}
                  onToggleVisibility={() => onToggleVisibility(product.id)}
                  onDelete={() => onDeleteProduct(product.id)}
                />
              ))}
            </div>
          </DragAndDropWrapper>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CategoryItem;

