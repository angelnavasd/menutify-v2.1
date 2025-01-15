import { DragEndEvent } from '@dnd-kit/core';

/////////////////////////////
// ✅ Interface para Productos
/////////////////////////////

export interface Product {
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

/////////////////////////////
// ✅ Interface para Categorías
/////////////////////////////

export interface Category {
  id: string;
  name: string;
  products: Product[];
}

///////////////////////////////////////////////
// ✅ Props para el componente ProductCard
///////////////////////////////////////////////

export interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  currency: string;
  visible: boolean;

  // ✅ Funciones para editar, alternar visibilidad y eliminar productos
  onEdit: (productId: string, updatedProductData: Partial<Product>) => void;
  onToggleVisibility: (productId: string) => void;
  onDelete: (productId: string) => void;
}

///////////////////////////////////////////
// ✅ Props para el componente MenuList
///////////////////////////////////////////

export interface MenuListProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  isEditMode: boolean;

  // ✅ Editar producto
  onEditProduct: (productId: string, updatedProductData: Partial<Product>) => void;

  // ✅ Alternar visibilidad de producto
  onToggleProductVisibility: (productId: string) => void;

  // ✅ Eliminar producto
  onDeleteProduct: (productId: string) => void;
}

//////////////////////////////////////////////////
// ✅ Props para el componente CategoryItem
//////////////////////////////////////////////////

export interface CategoryItemProps {
  id: string;
  name: string;
  products: Product[];
  isExpanded: boolean;
  isEditMode: boolean;
  onToggleExpand: (categoryId: string) => void;
  onEditName: (categoryId: string, newName: string) => void;
  onDelete: (categoryId: string) => void;

  // ✅ Editar producto
  onEditProduct: (productId: string, updatedProductData: Partial<Product>) => void;

  // ✅ Alternar visibilidad de producto
  onToggleVisibility: (productId: string) => void;

  // ✅ Eliminar producto
  onDeleteProduct: (productId: string) => void;

  // ✅ Drag & Drop de productos
  onDragEndProducts: (event: DragEndEvent, categoryId: string) => void;
}

////////////////////////////////////////////////
// ✅ Props para el componente ProductList
////////////////////////////////////////////////

export interface ProductListProps {
  products: Product[];
  onEditProduct: (productId: string, updatedProductData: Partial<Product>) => void;
  onToggleVisibility: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onDragEndProducts: (event: DragEndEvent, categoryId: string) => void;
}
