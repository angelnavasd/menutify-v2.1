import CategoryItem from './CategoryItem';
import DragAndDropWrapper from './DragAndDropWrapper';
import { arrayMove } from '@dnd-kit/sortable';
import { Category, MenuListProps } from './types';
import { useState } from 'react';

const MenuList = ({ categories, setCategories, isEditMode }: MenuListProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // ✅ Definimos los parámetros con el tipo Category
  const handleToggleExpand = (categoryId: string) => {
    setExpandedCategories((prev: string[]) =>
      prev.includes(categoryId)
        ? prev.filter((id: string) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // ✅ Definimos el tipo en setCategories
  const handleDragEndCategories = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setCategories((prevCategories: Category[]) => {
        const oldIndex = prevCategories.findIndex((cat) => cat.id === active.id);
        const newIndex = prevCategories.findIndex((cat) => cat.id === over.id);
        return arrayMove(prevCategories, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 md:p-6 max-h-[calc(100vh-180px)] overflow-y-auto">
      <DragAndDropWrapper
        items={categories}
        onDragEnd={handleDragEndCategories}
        isEditMode={isEditMode}
      >
        <div className="space-y-4">
          {categories.map((category: Category) => (
            <CategoryItem
              key={category.id}
              {...category}
              isExpanded={expandedCategories.includes(category.id)}
              isEditMode={isEditMode}
              onToggleExpand={handleToggleExpand}
              onEditName={(id, newName) => {
                setCategories((prevCategories: Category[]) =>
                  prevCategories.map((cat) =>
                    cat.id === id ? { ...cat, name: newName } : cat
                  )
                );
              }}
              onDelete={(id) => {
                setCategories((prevCategories: Category[]) =>
                  prevCategories.filter((cat) => cat.id !== id)
                );
              }}
              onEditProduct={(productId) => {
                console.log('Editar producto:', productId);
              }}
            />
          ))}
        </div>
      </DragAndDropWrapper>
    </div>
  );
};

export default MenuList;
