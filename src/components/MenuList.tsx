import { useState, ReactNode } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { ChevronDownIcon, ChevronRightIcon, Bars4Icon } from '@heroicons/react/24/outline';
import ProductCard from './ProductCard';

// ✅ Interfaces
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  featured: boolean;
}

interface Category {
  id: string;
  name: string;
  products: Product[];
}

interface MenuListProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

// ✅ Componente Drag & Drop
interface SortableCategoryItemProps {
  category: Category;
  children: (props: { listeners: any; attributes: any }) => ReactNode;
}

const SortableCategoryItem = ({ category, children }: SortableCategoryItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: category.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({ listeners, attributes })}
    </div>
  );
};

const MenuList = ({ categories, setCategories }: MenuListProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // ✅ Expandir/Colapsar categoría
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // ✅ Sensor con restricción vertical
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // ✅ Manejador de Drag & Drop
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setCategories((prevCategories) => {
        const oldIndex = prevCategories.findIndex((cat) => cat.id === active.id);
        const newIndex = prevCategories.findIndex((cat) => cat.id === over.id);
        return arrayMove(prevCategories, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="h-full overflow-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[
          restrictToVerticalAxis,
          restrictToParentElement
        ]}
      >
        <SortableContext items={categories} strategy={verticalListSortingStrategy}>
          {/* ✅ Contenedor de categorías */}
          <div className="p-4 space-y-4 bg-white max-h-[calc(100vh-180px)] overflow-y-auto rounded-lg border border-gray-200">
            {categories.map((category) => (
              <SortableCategoryItem key={category.id} category={category}>
                {({ listeners, attributes }) => (
                  <div className="border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition">
                    
                    {/* 🔥 Encabezado de la categoría */}
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* ✅ Ícono Drag & Drop */}
                        <button
                          {...listeners}
                          {...attributes}
                          className="cursor-grab active:cursor-grabbing p-1"
                        >
                          <Bars4Icon className="h-5 w-5 text-gray-500" />
                        </button>

                        {/* ✅ Nombre de la categoría */}
                        <h3 className="text-base font-semibold text-gray-800">
                          {category.name}
                        </h3>
                      </div>

                      {/* ✅ Botón para expandir/colapsar */}
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="p-1 rounded-md hover:bg-gray-200 transition"
                      >
                        {expandedCategories.includes(category.id) ? (
                          <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                        ) : (
                          <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                        )}
                      </button>
                    </div>

                    {/* 🔥 Productos desplegables */}
                    {expandedCategories.includes(category.id) && (
                      <SortableContext
                        items={category.products.map((product) => product.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="pl-8 pr-8 py-2 space-y-2">
                          {category.products.length > 0 ? (
                            category.products.map((product) => (
                              <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                              />
                            ))
                          ) : (
                            <p className="text-sm text-gray-400 italic">
                              No hay productos en esta categoría.
                            </p>
                          )}
                        </div>
                      </SortableContext>
                    )}
                  </div>
                )}
              </SortableCategoryItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default MenuList;
