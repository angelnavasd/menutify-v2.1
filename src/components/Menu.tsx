import { useState, useRef, useEffect } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { Category } from './types';
import { MENU_STYLES } from '../constants/layout';
import { MENU_COLORS } from '../constants/colors';

interface MenuProps {
  isDarkMode?: boolean;
  showHeader?: boolean;
  categories: Category[];
  isPreview?: boolean;
}

export default function Menu({ isDarkMode = false, showHeader = true, categories, isPreview = false }: MenuProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const colors = isDarkMode ? MENU_COLORS.dark : MENU_COLORS.light;

  // Ajustar el scroll margin para preview
  useEffect(() => {
    if (contentRef.current && isPreview) {
      contentRef.current.style.scrollBehavior = 'smooth';
    }
  }, [isPreview]);

  // Filter visible products and categories
  const visibleCategories = categories
    .map(category => ({
      ...category,
      products: category.products.filter(product => product.visible !== false)
    }))
    .filter(category => category.products.length > 0);

  // Get featured products
  const featuredProducts = categories
    .flatMap(category => category.products)
    .filter(product => product.visible !== false && product.featured);

  // Scroll the active category button into view
  const scrollActiveButtonIntoView = (categoryId: string) => {
    if (!navRef.current || !isPreview) return; // Solo auto-scroll en modo preview
    
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
  };

  // Initialize Intersection Observer
  useEffect(() => {
    if (!contentRef.current) return;

    const options = {
      root: contentRef.current,
      rootMargin: isPreview ? '-20% 0px -60% 0px' : '-10% 0px -70% 0px', // Ajustar márgenes según el modo
      threshold: 0
    };

    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const categoryId = entry.target.id;
          setActiveCategory(categoryId);
          if (isPreview) {
            scrollActiveButtonIntoView(categoryId);
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(callback, options);

    visibleCategories.forEach(category => {
      const element = document.getElementById(category.id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [visibleCategories, isPreview]);

  useEffect(() => {
    if (visibleCategories.length > 0 && !activeCategory) {
      setActiveCategory(visibleCategories[0].id);
    }
  }, [visibleCategories, activeCategory]);

  // Scroll handling
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const handleScroll = () => {
      setIsScrolled(content.scrollTop > (isPreview ? 20 : 50)); // Ajustar umbral según el modo
    };

    content.addEventListener('scroll', handleScroll);
    return () => content.removeEventListener('scroll', handleScroll);
  }, [isPreview]);

  // Scroll to category with offset calculation
  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (!element || !contentRef.current) return;

    const container = contentRef.current;
    const elementTop = element.offsetTop;
    const headerHeight = isScrolled ? (isPreview ? 60 : 80) : (isPreview ? 120 : 140); // Ajustar offsets según el modo
    
    container.scrollTo({
      top: elementTop - headerHeight,
      behavior: 'smooth',
    });

    setActiveCategory(categoryId);
    if (isPreview) {
      scrollActiveButtonIntoView(categoryId);
    }
  };

  return (
    <div 
      ref={contentRef}
      className={`${MENU_STYLES.container.base} bg-gradient-to-b ${colors.background.gradient} ${
        isPreview ? 'preview-mode' : ''
      }`}
    >
      {/* Header Section */}
      <div className={`${MENU_STYLES.container.header.wrapper} ${colors.background.primary}`}>
        {showHeader && (
          <div className={`${MENU_STYLES.container.header.content.base} ${
            isScrolled ? MENU_STYLES.container.header.content.collapsed : MENU_STYLES.container.header.content.expanded
          }`}>
            <div className={`overflow-hidden transition-all duration-200 ${isScrolled ? 'h-0 opacity-0' : 'h-auto opacity-100'}`}>
              <div className="flex flex-col items-start">
                <div className={`${MENU_STYLES.container.header.logo.container} ${colors.logo.background} ${colors.logo.text}`}>
                  LP
                </div>
                <div className="flex items-center gap-1">
                  <h1 className={`${MENU_STYLES.container.header.logo.text} ${colors.text.primary}`}>
                    La Pizzería
                  </h1>
                </div>
                <p className={`${colors.text.secondary}`}>Pizza al paso • Comida Italiana</p>
                <div className={MENU_STYLES.container.header.info.container}>
                  <MapPinIcon className={`${MENU_STYLES.container.header.info.icon} ${colors.text.tertiary}`} />
                  <span className={`${MENU_STYLES.container.header.info.text} ${colors.text.tertiary}`}>
                    Av. Corrientes 3247, Buenos Aires
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Navigation */}
        {visibleCategories.length > 0 && (
          <div className={`${MENU_STYLES.container.navigation.wrapper} ${colors.background.primary} ${colors.border.primary}`}>
            <div className={MENU_STYLES.container.navigation.content} ref={navRef}>
              <div className={MENU_STYLES.container.navigation.list}>
                {visibleCategories.map((category) => (
                  <button
                    key={category.id}
                    data-category-id={category.id}
                    onClick={() => scrollToCategory(category.id)}
                    className={`${MENU_STYLES.container.navigation.item.base} ${
                      activeCategory === category.id
                        ? colors.navigation.active
                        : colors.navigation.inactive
                    }`}
                  >
                    {category.name}
                    {activeCategory === category.id && (
                      <div className={`${MENU_STYLES.container.navigation.item.indicator} ${colors.navigation.indicator}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Sections */}
      <div className={MENU_STYLES.sections.wrapper}>
        {/* Featured Section */}
        {featuredProducts.length > 0 && (
          <div className={MENU_STYLES.sections.featured.container}>
            <h2 className={`${MENU_STYLES.sections.header} ${colors.text.primary}`}>
              Destacados
            </h2>
            <div className={MENU_STYLES.sections.featured.grid.wrapper}>
              <div className={MENU_STYLES.sections.featured.grid.container}>
                {featuredProducts.map((product) => (
                  <div 
                    key={product.id}
                    className={`${MENU_STYLES.sections.featured.grid.item.container} ${colors.background.item} ${colors.border.primary}`}
                  >
                    <div className={MENU_STYLES.sections.featured.grid.item.image.wrapper}>
                      <img
                        src={product.image || 'https://via.placeholder.com/300'} 
                        alt={product.name}
                        className={MENU_STYLES.sections.featured.grid.item.image.img}
                      />
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
        )}

        {/* Category Sections */}
        {visibleCategories.map((category) => {
          const gridProducts = category.products.slice(0, 2);
          const listProducts = category.products.slice(2);

          return (
            <div
              key={category.id}
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
        })}
      </div>
    </div>
  );
} 