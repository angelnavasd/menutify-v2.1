import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { MENU_STYLES } from '../constants/layout';
import { MENU_COLORS } from '../constants/colors';
import { Category } from './types';
import MenuHeader from './MenuHeader';
import CategoryNavigation from './CategoryNavigation';
import FeaturedProducts from './FeaturedProducts';
import CategorySection from './CategorySection';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useScrollBehavior } from '../hooks/useScrollBehavior';
import { useFilteredCategories } from '../hooks/useFilteredCategories';

interface MenuProps {
  isDarkMode?: boolean;
  showHeader?: boolean;
  categories: Category[];
  isPreview?: boolean;
}

export default function Menu({ 
  isDarkMode = false, 
  showHeader = true, 
  categories, 
  isPreview = false 
}: MenuProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const colors = isDarkMode ? MENU_COLORS.dark : MENU_COLORS.light;
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { visibleCategories, featuredProducts } = useFilteredCategories(categories);
  const { isScrolled, scrollToElement } = useScrollBehavior(contentRef, { isPreview });

  const headerHeight = useMemo(() => {
    const heights = MENU_STYLES.container.header.heights;
    return isScrolled 
      ? (isPreview ? heights.preview.collapsed : heights.normal.collapsed)
      : (isPreview ? heights.preview.expanded : heights.normal.expanded);
  }, [isScrolled, isPreview]);

  const handleCategoryClick = useCallback((categoryId: string) => {
    scrollToElement(categoryId, headerHeight);
    setActiveCategory(categoryId);
  }, [headerHeight, scrollToElement]);

  const handleIntersection = useCallback((categoryId: string) => {
    if (!navRef.current) return;
    setActiveCategory(categoryId);
    
    const button = navRef.current.querySelector(`[data-category-id="${categoryId}"]`) as HTMLElement;
    if (!button) return;

    const nav = navRef.current;
    const buttonRect = button.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    
    const scrollLeft = button.offsetLeft - (navRect.width / 2) + (buttonRect.width / 2);
    
    nav.scrollTo({
      left: scrollLeft,
      behavior: 'smooth'
    });
  }, []);

  useScrollSpy(
    visibleCategories.map(c => c.id),
    {
      root: contentRef.current,
      isPreview,
      onIntersect: handleIntersection
    }
  );

  useEffect(() => {
    if (visibleCategories.length > 0 && !activeCategory) {
      setActiveCategory(visibleCategories[0].id);
    }
  }, [visibleCategories, activeCategory]);

  // Memoize components
  const headerComponent = useMemo(() => (
    showHeader && (
      <MenuHeader 
        isScrolled={isScrolled}
        isDarkMode={isDarkMode}
      />
    )
  ), [showHeader, isScrolled, isDarkMode]);

  const navigationComponent = useMemo(() => (
    visibleCategories.length > 0 && (
      <CategoryNavigation
        ref={navRef}
        categories={visibleCategories}
        activeCategory={activeCategory}
        isDarkMode={isDarkMode}
        onCategoryClick={handleCategoryClick}
      />
    )
  ), [visibleCategories, activeCategory, isDarkMode, handleCategoryClick]);

  const featuredComponent = useMemo(() => (
    <FeaturedProducts
      products={featuredProducts}
      isDarkMode={isDarkMode}
    />
  ), [featuredProducts, isDarkMode]);

  const categorySectionsComponent = useMemo(() => (
    visibleCategories.map((category) => (
      <CategorySection
        key={category.id}
        category={category}
        isDarkMode={isDarkMode}
      />
    ))
  ), [visibleCategories, isDarkMode]);

  return (
    <div 
      ref={contentRef}
      className={`${MENU_STYLES.container.base} bg-gradient-to-b ${colors.background.gradient} ${
        isPreview ? 'preview-mode' : ''
      } font-menu`}
    >
      {/* Header Section */}
      <div className={`${MENU_STYLES.container.header.wrapper} ${colors.background.primary}`}>
        {headerComponent}
        {navigationComponent}
      </div>

      {/* Content Sections */}
      <div className={MENU_STYLES.sections.wrapper}>
        {featuredComponent}
        {categorySectionsComponent}
      </div>
    </div>
  );
} 