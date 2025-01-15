import CategoryItem from './CategoryItem';
import DragAndDropWrapper from './DragAndDropWrapper';
import { arrayMove } from '@dnd-kit/sortable';
import { Category, MenuListProps, Product } from './types';  // ✅ Importar Product
import { useState } from 'react';
import { DragEndEvent } from '@dnd-kit/core';

const MenuList = ({ categories, setCategories, isEditMode }: MenuListProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // ✅ Expandir o colapsar categorías
  const handleToggleExpand = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // ✅ Drag & Drop para Categorías
  const handleDragEndCategories = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setCategories((prevCategories) => {
        const oldIndex = prevCategories.findIndex((cat) => cat.id === active.id);
        const newIndex = prevCategories.findIndex((cat) => cat.id === over.id);
        return arrayMove(prevCategories, oldIndex, newIndex);
      });
    }
  };

  // ✅ Drag & Drop para Productos dentro de una categoría
  const handleDragEndProducts = (categoryId: string, event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setCategories((prevCategories) =>
        prevCategories.map((category) => {
          if (category.id !== categoryId) return category;

          const oldIndex = category.products.findIndex((prod) => prod.id === active.id);
          const newIndex = category.products.findIndex((prod) => prod.id === over.id);

          return {
            ...category,
            products: arrayMove(category.products, oldIndex, newIndex),
          };
        })
      );
    }
  };

  // ✅ Editar Producto (Corregido para aceptar 2 argumentos)
  const handleEditProduct = (productId: string, updatedProductData: Partial<Product>) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) => ({
        ...category,
        products: category.products.map((product) =>
          product.id === productId ? { ...product, ...updatedProductData } : product
        ),
      }))
    );
  };

  // ✅ Alternar Visibilidad de Producto
  const handleToggleVisibility = (productId: string) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) => ({
        ...category,
        products: category.products.map((product) =>
          product.id === productId ? { ...product, visible: !product.visible } : product
        ),
      }))
    );
  };

  // ✅ Eliminar Producto
  const handleDeleteProduct = (productId: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      setCategories((prevCategories) =>
        prevCategories.map((category) => ({
          ...category,
          products: category.products.filter((product) => product.id !== productId),
        }))
      );
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 max-h-[calc(100vh-180px)] overflow-y-auto">
      <DragAndDropWrapper
        items={categories}
        onDragEnd={handleDragEndCategories}
        isEditMode={isEditMode}
      >
        <div className="space-y-4">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              {...category}
              isExpanded={expandedCategories.includes(category.id)}
              isEditMode={isEditMode}
              onToggleExpand={handleToggleExpand}
              onEditName={(id, newName) => {
                setCategories((prevCategories) =>
                  prevCategories.map((cat) =>
                    cat.id === id ? { ...cat, name: newName } : cat
                  )
                );
              }}
              onDelete={(id) => {
                setCategories((prevCategories) =>
                  prevCategories.filter((cat) => cat.id !== id)
                );
              }}
              onEditProduct={handleEditProduct}  // ✅ Editar producto (2 parámetros)
              onToggleVisibility={handleToggleVisibility}  // ✅ Alternar visibilidad
              onDeleteProduct={handleDeleteProduct}  // ✅ Eliminar producto
              onDragEndProducts={(event) => handleDragEndProducts(category.id, event)}  // ✅ Drag & Drop productos
            />
          ))}
        </div>
      </DragAndDropWrapper>
    </div>
  );
};

export default MenuList;
