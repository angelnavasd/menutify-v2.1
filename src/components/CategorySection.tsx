import { memo } from 'react';
import { Category } from './types';
import { MENU_STYLES } from '../constants/layout';
import { MENU_COLORS } from '../constants/colors';

interface CategorySectionProps {
  category: Category;
  isDarkMode: boolean;
}

const CategorySection = memo(({ category, isDarkMode }: CategorySectionProps) => {
  const colors = isDarkMode ? MENU_COLORS.dark : MENU_COLORS.light;
  const gridProducts = category.products.slice(0, 2);
  const listProducts = category.products.slice(2);

  return (
    <div
      id={category.id}
      className={MENU_STYLES.sections.category.container}
    >
      <h2 className={`${MENU_STYLES.sections.header} ${colors.text.primary}`}>
        {category.name}
      </h2>
      
      {/* Grid Layout - First 2 products */}
      {gridProducts.length > 0 && (
        <div className={MENU_STYLES.sections.category.grid.wrapper}>
          {gridProducts.map((product) => (
            <div 
              key={product.id}
              className={`${MENU_STYLES.sections.category.grid.item.container} ${colors.background.item} ${colors.border.primary}`}
            >
              <div className={MENU_STYLES.sections.category.grid.item.image.wrapper}>
                <img
                  src={product.image || 'https://via.placeholder.com/300'} 
                  alt={product.name}
                  className={MENU_STYLES.sections.category.grid.item.image.img}
                />
              </div>
              <h3 className={`${MENU_STYLES.sections.category.grid.item.title} ${colors.text.primary}`}>
                {product.name}
              </h3>
              <p className={`${MENU_STYLES.sections.category.grid.item.description} ${colors.text.secondary}`}>
                {product.description}
              </p>
              <span className={`${MENU_STYLES.sections.category.grid.item.price} ${colors.price.background} ${colors.price.text}`}>
                ${product.price.toLocaleString('es-AR')}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* List Layout - Remaining products */}
      {listProducts.length > 0 && (
        <div className={MENU_STYLES.sections.category.list.wrapper}>
          {listProducts.map((product) => (
            <div 
              key={product.id}
              className={`${MENU_STYLES.sections.category.list.item.container} ${colors.background.item} ${colors.border.primary}`}
            >
              <div className={MENU_STYLES.sections.category.list.item.image.wrapper}>
                <img 
                  src={product.image || 'https://via.placeholder.com/300'} 
                  alt={product.name} 
                  className={MENU_STYLES.sections.category.list.item.image.img}
                />
              </div>
              <div className={MENU_STYLES.sections.category.list.item.content.wrapper}>
                <div className={MENU_STYLES.sections.category.list.item.content.header}>
                  <h3 className={`${MENU_STYLES.sections.category.list.item.content.title} ${colors.text.primary}`}>
                    {product.name}
                  </h3>
                  <span className={`${MENU_STYLES.sections.category.list.item.content.price} ${colors.price.background} ${colors.price.text}`}>
                    ${product.price.toLocaleString('es-AR')}
                  </span>
                </div>
                <p className={`${MENU_STYLES.sections.category.list.item.content.description} ${colors.text.secondary}`}>
                  {product.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

CategorySection.displayName = 'CategorySection';

export default CategorySection; 