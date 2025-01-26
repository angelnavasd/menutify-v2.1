import { memo } from 'react';
import CategoryItem from './CategoryItem';
import DragAndDropWrapper from './DragAndDropWrapper';
import { arrayMove } from '@dnd-kit/sortable';
import { MenuListProps } from './types';
import { DragEndEvent } from '@dnd-kit/core';
import { updateCategory } from '../firebase/services';

const MenuList = memo(({
  categories,
  setCategories,
  isEditMode,
  onEditProduct,
  onToggleProductVisibility,
  onDeleteProduct,
  onEditCategory,
  onDeleteCategory,
  expandedCategories,
  setExpandedCategories
}: MenuListProps) => {
  const handleToggleExpand = (categoryId: string) => {
    if (isEditMode) return; // Prevent expanding when in edit mode
    
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleDragEndCategories = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex(cat => cat.id === active.id);
    const newIndex = categories.findIndex(cat => cat.id === over.id);

    const reorderedCategories = arrayMove(categories, oldIndex, newIndex).map(
      (category, index) => ({ ...category, order: index })
    );

    setCategories(reorderedCategories);

    // Actualizar el orden en Firebase
    try {
      await Promise.all(
        reorderedCategories.map(category =>
          updateCategory(category.id, category)
        )
      );
    } catch (error) {
      console.error('Error al actualizar el orden:', error);
    }
  };

  const handleDragEndProducts = async (event: DragEndEvent, categoryId: string) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const categoryToUpdate = categories.find(cat => cat.id === categoryId);
    if (!categoryToUpdate) return;

    const oldIndex = categoryToUpdate.products.findIndex(prod => prod.id === active.id);
    const newIndex = categoryToUpdate.products.findIndex(prod => prod.id === over.id);

    const reorderedProducts = arrayMove(categoryToUpdate.products, oldIndex, newIndex).map(
      (product, index) => ({ ...product, order: index })
    );

    const updatedCategory = {
      ...categoryToUpdate,
      products: reorderedProducts
    };

    setCategories(prev =>
      prev.map(category =>
        category.id === categoryId ? updatedCategory : category
      )
    );

    // Actualizar el orden en Firebase
    try {
      await updateCategory(categoryId, updatedCategory);
    } catch (error) {
      console.error('Error al actualizar el orden:', error);
    }
  };

  return (
    <div>
      <DragAndDropWrapper
        items={categories}
        onDragEnd={handleDragEndCategories}
        isEditMode={isEditMode}
        type="category"
      >
        <div>
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              {...category}
              isExpanded={expandedCategories.includes(category.id)}
              isEditMode={isEditMode}
              onToggleExpand={handleToggleExpand}
              onEditName={onEditCategory}
              onDelete={onDeleteCategory}
              onEditProduct={onEditProduct}
              onToggleVisibility={onToggleProductVisibility}
              onDeleteProduct={onDeleteProduct}
              onDragEndProducts={handleDragEndProducts}
              showExpandIcon={!isEditMode}
            />
          ))}
        </div>
      </DragAndDropWrapper>
    </div>
  );
});

MenuList.displayName = 'MenuList';

export default MenuList;
