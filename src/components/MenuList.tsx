import CategoryItem from './CategoryItem';
import DragAndDropWrapper from './DragAndDropWrapper';
import { arrayMove } from '@dnd-kit/sortable';
import { Category, Product } from './types';
import { DragEndEvent } from '@dnd-kit/core';

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

const MenuList = ({
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
    const newExpandedCategories = expandedCategories.includes(categoryId)
      ? expandedCategories.filter(id => id !== categoryId)
      : [...expandedCategories, categoryId];
    setExpandedCategories(newExpandedCategories);
  };

  const handleDragEndCategories = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex(item => item.id === active.id);
      const newIndex = categories.findIndex(item => item.id === over.id);
      
      const newCategories = arrayMove(categories, oldIndex, newIndex).map(
        (category, index) => ({
          ...category,
          order: index
        })
      );
      setCategories(newCategories);
    }
  };

  const handleDragEndProducts = (event: DragEndEvent, categoryId: string) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const categoryToUpdate = categories.find(c => c.id === categoryId);
      if (!categoryToUpdate) return;

      const oldIndex = categoryToUpdate.products.findIndex(product => product.id === active.id);
      const newIndex = categoryToUpdate.products.findIndex(product => product.id === over.id);
      
      const updatedProducts = arrayMove(categoryToUpdate.products, oldIndex, newIndex);

      const newCategories = categories.map(category => 
        category.id === categoryId 
          ? { ...category, products: updatedProducts }
          : category
      );
      
      setCategories(newCategories);
    }
  };

  const handleEditCategoryName = (categoryId: string, newName: string) => {
    const newCategories = categories.map(category =>
      category.id === categoryId
        ? { ...category, name: newName }
        : category
    );
    setCategories(newCategories);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const newCategories = categories.filter(category => category.id !== categoryId);
    setCategories(newCategories);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 max-h-[calc(100vh-180px)] overflow-y-auto [scrollbar-gutter:stable] [&::-webkit-scrollbar]:w-[10px] [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
      <DragAndDropWrapper
        items={categories}
        onDragEnd={handleDragEndCategories}
        isEditMode={isEditMode}
      >
        <div className="space-y-4">
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
            />
          ))}
        </div>
      </DragAndDropWrapper>
    </div>
  );
};

export default MenuList;
