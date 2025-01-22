import { memo } from 'react';
import CategoryItem from './CategoryItem';
import DragAndDropWrapper from './DragAndDropWrapper';
import { arrayMove } from '@dnd-kit/sortable';
import { Category, Product } from './types';
import { DragEndEvent } from '@dnd-kit/core';
import { MENU_LIST_DRAG_VARIANTS } from '../constants/animations';
import { MENU_LIST_STYLES } from '../constants/layout';
import { updateCategory, getCategories, deleteCategory } from '../firebase/services';

interface MenuListProps {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  isEditMode: boolean;
  onEditProduct: (productId: string, product: Product) => void;
  onToggleProductVisibility: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  expandedCategories: string[];
  setExpandedCategories: (categories: string[]) => void;
}

const MenuList = memo(({
  categories,
  setCategories,
  isEditMode,
  onEditProduct,
  onToggleProductVisibility,
  onDeleteProduct,
  expandedCategories,
  setExpandedCategories
}: MenuListProps) => {
  const handleToggleExpand = (categoryId: string) => {
    if (isEditMode) return; // Prevent expanding when in edit mode
    
    setExpandedCategories(
      expandedCategories.includes(categoryId)
        ? expandedCategories.filter(id => id !== categoryId)
        : [...expandedCategories, categoryId]
    );
  };

  const handleDragEndCategories = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex(item => item.id === active.id);
      const newIndex = categories.findIndex(item => item.id === over.id);
      
      const updatedCategories = arrayMove(categories, oldIndex, newIndex).map((category, index) => ({
        ...category,
        order: index
      }));

      setCategories(updatedCategories);

      // Persistir los cambios en Firebase
      try {
        await Promise.all(
          updatedCategories.map(category => updateCategory(category.id, category))
        );
      } catch (error) {
        console.error('Error updating categories order:', error);
        // Si hay un error, recargar las categorías para mantener la consistencia
        const reloadedCategories = await getCategories();
        setCategories(reloadedCategories);
      }
    }
  };

  const handleDragEndProducts = async (event: DragEndEvent, categoryId: string) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const categoryToUpdate = categories.find(c => c.id === categoryId);
      if (!categoryToUpdate) return;

      const oldIndex = categoryToUpdate.products.findIndex(product => product.id === active.id);
      const newIndex = categoryToUpdate.products.findIndex(product => product.id === over.id);
      
      const updatedProducts = arrayMove(categoryToUpdate.products, oldIndex, newIndex).map((product, index) => ({
        ...product,
        order: index
      }));

      const updatedCategory = {
        ...categoryToUpdate,
        products: updatedProducts
      };

      setCategories(
        categories.map(category => 
          category.id === categoryId 
            ? updatedCategory
            : category
        )
      );

      // Persistir los cambios en Firebase
      try {
        await updateCategory(categoryId, updatedCategory);
      } catch (error) {
        console.error('Error updating products order:', error);
        // Si hay un error, recargar las categorías para mantener la consistencia
        const reloadedCategories = await getCategories();
        setCategories(reloadedCategories);
      }
    }
  };

  const handleEditCategoryName = (categoryId: string, newName: string) => {
    setCategories(
      categories.map(category =>
        category.id === categoryId
          ? { ...category, name: newName }
          : category
      )
    );
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
      setCategories(categories.filter(category => category.id !== categoryId));
    } catch (error) {
      console.error('Error deleting category:', error);
      // Si hay un error, recargar las categorías para mantener la consistencia
      const reloadedCategories = await getCategories();
      setCategories(reloadedCategories);
    }
  };

  return (
    <div className={`${MENU_LIST_STYLES.container.base} ${MENU_LIST_STYLES.borders.container}`}>
      <DragAndDropWrapper
        items={categories}
        onDragEnd={handleDragEndCategories}
        isEditMode={isEditMode}
        dragVariants={MENU_LIST_DRAG_VARIANTS}
      >
        <div className={MENU_LIST_STYLES.container.wrapper}>
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              id={category.id}
              name={category.name}
              products={category.products}
              isExpanded={expandedCategories.includes(category.id)}
              isEditMode={isEditMode}
              onToggleExpand={handleToggleExpand}
              onEditName={handleEditCategoryName}
              onDelete={handleDeleteCategory}
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
