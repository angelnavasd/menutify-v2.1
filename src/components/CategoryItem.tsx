import ProductList from './ProductList';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
  Bars4Icon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { CategoryItemProps } from './types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import DragAndDropWrapper from './DragAndDropWrapper';

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
  onDragEndProducts
}: CategoryItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [categoryNameDraft, setCategoryNameDraft] = useState(name);
  const [isSaved, setIsSaved] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryNameDraft(e.target.value);
  };

  const handleNameSave = () => {
    if (categoryNameDraft.trim() !== '') {
      onEditName(id, categoryNameDraft);
      setIsEditing(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleDeleteConfirm = () => {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      onDelete(id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isEditMode ? listeners : {})}
      {...attributes}
      className="border border-gray-200 bg-white rounded-lg p-3 mb-2 transition-all duration-300 relative"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isEditMode && (
            <Bars4Icon
              className="h-4 w-4 text-gray-400 cursor-grab hover:text-gray-600 transition-transform hover:scale-110"
              title="Arrastrar"
            />
          )}

          {isEditing ? (
            <input
              value={categoryNameDraft}
              onChange={handleNameChange}
              onBlur={handleNameSave}
              autoFocus
              placeholder="Escribe el nombre..."
              className="border-b-2 border-gray-300 focus:border-blue-500 outline-none text-sm px-1 py-0.5 rounded-md"
            />
          ) : (
            <h3
              className="font-semibold text-gray-900 text-sm cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => onToggleExpand(id)}
            >
              {name}
            </h3>
          )}

          {isSaved && (
            <CheckIcon
              className="h-4 w-4 text-green-500 animate-fade-in"
              title="Guardado exitosamente"
            />
          )}
        </div>

        <div className="flex items-center gap-1">
          {!isEditMode && (
            <button
              onClick={() => onToggleExpand(id)}
              className="p-1 rounded-full hover:bg-gray-100 transition-transform hover:scale-110"
              title={isExpanded ? "Contraer" : "Expandir"}
            >
              {isExpanded ? (
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 text-gray-500" />
              )}
            </button>
          )}

          {isEditMode && (
            <div className="flex gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded-md bg-gray-100 hover:bg-blue-100 transition-all"
                title="Editar categoría"
              >
                <PencilIcon className="h-4 w-4 text-blue-500" />
              </button>

              <button
                onClick={handleDeleteConfirm}
                className="p-1.5 rounded-md bg-gray-100 hover:bg-red-100 transition-all"
                title="Eliminar categoría"
              >
                <TrashIcon className="h-4 w-4 text-red-500" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Drag & Drop de Productos */}
      {isExpanded && (
        <div className="mt-1 transition-all duration-300 ease-in-out">
          <DragAndDropWrapper
            items={products}
            onDragEnd={(event) => onDragEndProducts(event, id)}
            isEditMode={true}
          >
            <ProductList
              products={products}
              onEditProduct={onEditProduct}               // ✅ Editar producto
              onToggleVisibility={onToggleVisibility}     // ✅ Alternar visibilidad
              onDeleteProduct={onDeleteProduct}           // ✅ Eliminar producto
              onDragEndProducts={onDragEndProducts}
            />
          </DragAndDropWrapper>
        </div>
      )}
    </div>
  );
};

export default CategoryItem;

