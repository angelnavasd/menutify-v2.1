// components/types.ts

// ✅ Interface para Productos
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
  
  // ✅ Interface para Categorías
  export interface Category {
    id: string;
    name: string;
    products: Product[];
  }
  
  // ✅ Props para el componente MenuList
  export interface MenuListProps {
    categories: Category[];
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    isEditMode: boolean;
  }
  
  // ✅ Props para el componente CategoryItem
  export interface CategoryItemProps {
    id: string;
    name: string;
    products: Product[];
    isExpanded: boolean;
    isEditMode: boolean;
    onToggleExpand: (categoryId: string) => void;
    onEditName: (categoryId: string, newName: string) => void;
    onDelete: (categoryId: string) => void;
    onEditProduct: (productId: string) => void;
  }
  
  // ✅ Props para el componente ProductCard
  export interface ProductCardProps {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    currency: string;
    visible: boolean;
    onEdit: (productId: string) => void;
    onToggleVisibility: (productId: string) => void;
    onDelete: (productId: string) => void;
  }
  
  // ✅ Props para el componente ProductList
  export interface ProductListProps {
    products: Product[];
    onEditProduct: (productId: string) => void;
    onToggleVisibility: (productId: string) => void;
    onDeleteProduct: (productId: string) => void;
  }
  