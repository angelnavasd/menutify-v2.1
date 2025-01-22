import { useMemo } from 'react';
import { Category, Product } from '../components/types';

interface FilteredCategories {
  visibleCategories: Category[];
  featuredProducts: Product[];
}

export const useFilteredCategories = (categories: Category[]): FilteredCategories => {
  const visibleCategories = useMemo(() => 
    categories
      .map(category => ({
        ...category,
        products: category.products.filter(product => product.visible !== false)
      }))
      .filter(category => category.products.length > 0)
  , [categories]);

  const featuredProducts = useMemo(() => 
    categories
      .flatMap(category => category.products)
      .filter(product => product.visible !== false && product.featured)
  , [categories]);

  return {
    visibleCategories,
    featuredProducts
  };
}; 