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
import { ChevronDownIcon, ChevronRightIcon, Bars4Icon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
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
    <div ref={setNodeRef} style={style}>
      {children({ listeners, attributes })}
    </div>
  );
};

const MenuList = ({ categories, setCategories }: MenuListProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState<string>('');

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
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

  const handleStartEditingCategory = (categoryId: string, currentName: string) => {
    setEditingCategoryId(categoryId);
    setEditedCategoryName(currentName);
  };

  const handleSaveCategoryName = (categoryId: string) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === categoryId ? { ...category, name: editedCategoryName } : category
      )
    );
    setEditingCategoryId(null);
    setEditedCategoryName('');
  };

  const handleCancelEditCategory = () => {
    setEditingCategoryId(null);
    setEditedCategoryName('');
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId)
      );
    }
  };

  return (
    <div className="h-full overflow-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext items={categories} strategy={verticalListSortingStrategy}>
          <div className="p-4 space-y-4 bg-white max-h-[calc(100vh-180px)] overflow-y-auto rounded-lg border border-gray-200">
            {categories.map((category) => (
              <SortableCategoryItem key={category.id} category={category}>
                {({ listeners, attributes }) => (
                  <div className="border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing p-1">
                          <Bars4Icon className="h-5 w-5 text-gray-500" />
                        </button>

                        <h3 className="text-base font-semibold text-gray-800">{category.name}</h3>

                        <button onClick={() => handleStartEditingCategory(category.id, category.name)}>
                          <PencilIcon className="h-4 w-4 text-blue-500" />
                        </button>

                        <button onClick={() => handleDeleteCategory(category.id)}>
                          <TrashIcon className="h-5 w-5 text-red-500" />
                        </button>
                      </div>

                      <button onClick={() => toggleCategory(category.id)}>
                        {expandedCategories.includes(category.id) ? (
                          <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                        ) : (
                          <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                        )}
                      </button>
                    </div>

                    {expandedCategories.includes(category.id) && (
                      <SortableContext items={category.products.map((product) => product.id)} strategy={verticalListSortingStrategy}>
                        <div className="pl-8 pr-8 py-2 space-y-2">
                          {category.products.length > 0 ? (
                            category.products.map((product) => (
                              <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                visible={product.visible}
                                onEdit={() => handleEditProduct(product)}
                                onToggleVisibility={() => handleToggleVisibility(product.id)}
                                onDelete={() => handleDeleteProduct(product.id)}
                              />
                            ))
                          ) : (
                            <p className="text-sm text-gray-400 italic">No hay productos en esta categoría.</p>
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
