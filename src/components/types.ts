import { DragEndEvent } from '@dnd-kit/core';
import { Variants } from 'framer-motion';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  visible: boolean;
  featured: boolean;
  categoryId: string;
  currency: string;
  order?: number;
}

export interface Category {
  id: string;
  name: string;
  products: Product[];
  order?: number;
}

export interface CategoryItemProps extends Category {
  isExpanded: boolean;
  isEditMode: boolean;
  isDarkMode?: boolean;
  onToggleExpand: (id: string) => void;
  onEditName: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onEditProduct: (productId: string, product: Product) => void;
  onToggleVisibility: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onDragEndProducts: (event: DragEndEvent, categoryId: string) => void;
  showExpandIcon?: boolean;
}

export interface ProductCardProps extends Product {
  onEdit: (productId: string, product: Product) => void;
  onToggleVisibility: (productId: string) => void;
  onDelete: (productId: string) => void;
}

export interface MenuListProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  isEditMode: boolean;
  onEditProduct: (productId: string, product: Product) => void;
  onToggleProductVisibility: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onEditCategory: (categoryId: string, newName: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  expandedCategories: string[];
  setExpandedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface DragAndDropWrapperProps {
  items: any[];
  onDragEnd: (event: DragEndEvent) => void;
  isEditMode: boolean;
  children: React.ReactNode;
  dragVariants?: Variants;
}
