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
import { ChevronDownIcon, ChevronRightIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import ProductCard from './ProductCard';
import ModalForm from './ModalForm';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  featured: boolean;
  visible: boolean;
  currency: string;
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
    <div ref={setNodeRef} style={style} className="mb-4">
      {children({ listeners, attributes })}
    </div>
  );
};

const MenuList = ({ categories, setCategories }: MenuListProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleEditCategory = (category: Category) => {
    const newName = prompt('Editar nombre de la categoría:', category.name);
    if (newName && newName.trim() !== '') {
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.id === category.id ? { ...cat, name: newName } : cat
        )
      );
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId)
      );
    }
  };

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

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

  const handleDeleteProduct = (productId: string) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) => ({
        ...category,
        products: category.products.filter((product) => product.id !== productId),
      }))
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

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
    <div className="h-full overflow-hidden px-0 md:px-0">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext items={categories} strategy={verticalListSortingStrategy}>
          <div className="space-y-4 bg-white w-full max-h-[calc(100vh-180px)] overflow-y-auto rounded-xl border border-gray-200 shadow-md p-4 md:p-6">
            {categories.map((category) => (
              <SortableCategoryItem key={category.id} category={category}>
                {({ listeners, attributes }) => (
                  <div {...attributes} className="border border-gray-300 bg-white rounded-lg hover:shadow-sm transition-all">
                    <div className="flex items-center justify-between px-4 py-2 md:px-6 md:py-3">
                      <div {...listeners} className="flex items-center gap-2 cursor-grab active:cursor-grabbing">
                        <h3 className="text-md font-medium text-gray-800">{category.name}</h3>
                      </div>
                      <button onClick={() => toggleCategory(category.id)} className="p-1 hover:bg-gray-200 rounded-md">
                        {expandedCategories.includes(category.id) ? (
                          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                    {expandedCategories.includes(category.id) && (
                      category.products.length === 0 ? (
                        <p className="px-6 py-4 text-gray-500 text-sm">Aún no hay productos en esta categoría.</p>
                      ) : (
                        <div className="space-y-2 px-4 py-2 md:px-6 md:py-2">
                          {category.products.map((product) => (
                            <ProductCard
                              key={product.id}
                              {...product}
                              onEdit={() => handleEditProduct(product)}
                              onToggleVisibility={() => handleToggleVisibility(product.id)}
                              onDelete={() => handleDeleteProduct(product.id)}
                            />
                          ))}
                        </div>
                      )
                    )}
                  </div>
                )}
              </SortableCategoryItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {isModalOpen && (
        <ModalForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={() => setIsModalOpen(false)}
          categories={categories}
          productToEdit={productToEdit}
        />
      )}
    </div>
  );
};

export default MenuList;
