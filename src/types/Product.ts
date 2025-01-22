export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string | null;
  featured: boolean;
  currency: string;
  visible: boolean;
} 