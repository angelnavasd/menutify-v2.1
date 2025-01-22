import { memo, forwardRef } from 'react';
import { Category } from './types';
import { MENU_STYLES } from '../constants/layout';
import { MENU_COLORS } from '../constants/colors';
import { motion } from 'framer-motion';

interface CategoryNavigationProps {
  categories: Category[];
  activeCategory: string | null;
  isDarkMode: boolean;
  onCategoryClick: (categoryId: string) => void;
}

const CategoryNavigation = memo(forwardRef<HTMLDivElement, CategoryNavigationProps>(
  ({ categories, activeCategory, isDarkMode, onCategoryClick }, ref) => {
    const colors = isDarkMode ? MENU_COLORS.dark : MENU_COLORS.light;

    return (
      <div className={`${MENU_STYLES.container.navigation.wrapper} ${colors.background.primary} ${colors.border.primary}`}>
        <div className={MENU_STYLES.container.navigation.content} ref={ref}>
          {/* Fade gradients */}
          <div className={MENU_STYLES.container.navigation.fade.left} />
          <div className={MENU_STYLES.container.navigation.fade.right} />
          
          <div className={MENU_STYLES.container.navigation.list}>
            {categories.map((category) => (
              <motion.button
                key={category.id}
                data-category-id={category.id}
                onClick={() => onCategoryClick(category.id)}
                className={`${MENU_STYLES.container.navigation.item.base} ${
                  activeCategory === category.id
                    ? colors.navigation.active
                    : colors.navigation.inactive
                }`}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                {category.name}
                {activeCategory === category.id && (
                  <motion.div
                    className={`${MENU_STYLES.container.navigation.item.indicator} ${colors.navigation.indicator}`}
                    layoutId="categoryIndicator"
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }
));

CategoryNavigation.displayName = 'CategoryNavigation';

export default CategoryNavigation; 