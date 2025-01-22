import { memo } from 'react';
import { Product } from './types';
import { MENU_STYLES } from '../constants/layout';
import { MENU_COLORS } from '../constants/colors';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface FeaturedProductsProps {
  products: Product[];
  isDarkMode: boolean;
}

const FeaturedProducts = memo(({ products, isDarkMode }: FeaturedProductsProps) => {
  if (products.length === 0) return null;

  const colors = isDarkMode ? MENU_COLORS.dark : MENU_COLORS.light;

  return (
    <div className={MENU_STYLES.sections.featured.container}>
      <h2 className={`${MENU_STYLES.sections.header} ${colors.text.primary}`}>
        Destacados
      </h2>
      <div className={MENU_STYLES.sections.featured.grid.wrapper}>
        <div className={MENU_STYLES.sections.featured.grid.container}>
          {products.map((product) => (
            <div 
              key={product.id}
              className={`${MENU_STYLES.sections.featured.grid.item.container} ${colors.background.item} ${colors.border.primary}`}
            >
              <div className={MENU_STYLES.sections.featured.grid.item.image.wrapper}>
                {product.image ? (
                  <img
                    src={product.image} 
                    alt={product.name}
                    className={MENU_STYLES.sections.featured.grid.item.image.img}
                  />
                ) : (
                  <PhotoIcon className={MENU_STYLES.sections.featured.grid.item.image.placeholder} />
                )}
              </div>
              <h3 className={`${MENU_STYLES.sections.featured.grid.item.title} ${colors.text.primary}`}>
                {product.name}
              </h3>
              <p className={`${MENU_STYLES.sections.featured.grid.item.description} ${colors.text.secondary}`}>
                {product.description}
              </p>
              <span className={`${MENU_STYLES.sections.featured.grid.item.price} ${colors.price.background} ${colors.price.text}`}>
                ${product.price.toLocaleString('es-AR')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

FeaturedProducts.displayName = 'FeaturedProducts';

export default FeaturedProducts; 