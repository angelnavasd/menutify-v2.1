import { useEffect, useRef, useState } from 'react';
import { MapPinIcon, StarIcon } from '@heroicons/react/24/outline';
import { Category } from './types';

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
      setIsScrolled(content.scrollTop > 20);
    };

    content.addEventListener('scroll', handleScroll);
    return () => content.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to category
  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (!element || !contentRef.current) return;

    const container = contentRef.current;
    const elementTop = element.offsetTop;
    const headerHeight = 120; // Approximate header height
    
    container.scrollTo({
      top: elementTop - headerHeight,
      behavior: 'smooth',
    });

    setActiveCategory(categoryId);
  };

  return (
    <div 
      ref={contentRef}
      className={`h-full overflow-y-auto scrollbar-none bg-gradient-to-b ${
        isDarkMode 
          ? 'from-[#0a0c10] to-[#0f1218]'
          : 'from-gray-50 to-white'
      }`}
    >
      {/* Header Section */}
      <div className={`sticky top-0 z-20 ${
        isDarkMode ? 'bg-[#0a0c10]' : 'bg-white'
      }`}>
        {showHeader && (
          <div className={`px-3 transition-all duration-200 ${isScrolled ? 'pt-4 pb-1' : 'py-4'}`}>
            <div className={`overflow-hidden transition-all duration-200 ${isScrolled ? 'h-0 opacity-0' : 'h-auto opacity-100'}`}>
              <div className="flex flex-col items-start">
                <div className={`w-12 h-12 rounded-md flex items-center justify-center text-xl font-medium ${
                  isDarkMode 
                    ? 'bg-orange-500/10 text-orange-400'
                    : 'bg-orange-50 text-orange-600'
                } mb-2`}>
                  LP
                </div>
                <div className="flex items-center gap-1">
                  <h1 className={`text-2xl font-semibold ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>La Pizzería</h1>
                </div>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>Pizza al paso • Comida Italiana</p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPinIcon className={`w-3.5 h-3.5 ${
                    isDarkMode ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                  <span className={`text-xs ${
                    isDarkMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>Av. Corrientes 3247, Buenos Aires</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Navigation */}
        {visibleCategories.length > 0 && (
          <div className={`border-b ${
            isDarkMode 
              ? 'bg-[#0a0c10] border-gray-800/50' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="overflow-x-auto scrollbar-none" ref={navRef}>
              <div className="flex px-3 space-x-6 min-w-max py-3">
                {visibleCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => scrollToCategory(category.id)}
                    className={`text-base font-medium whitespace-nowrap transition-all duration-300 relative px-1 py-0.5 ${
                      activeCategory === category.id
                        ? isDarkMode
                          ? 'text-orange-400'
                          : 'text-orange-600'
                        : isDarkMode
                        ? 'text-gray-500 hover:text-gray-400'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {category.name}
                    {activeCategory === category.id && (
                      <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                        isDarkMode
                          ? 'bg-orange-400'
                          : 'bg-orange-600'
                      }`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Sections */}
      <div className="pb-20">
        {/* Featured Section */}
        {featuredProducts.length > 0 && (
          <div className="px-3 pt-4 pb-6">
            <h2 className={`text-xl font-medium mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              Destacados
            </h2>
            <div className="overflow-x-auto scrollbar-none -mx-3">
              <div className="flex gap-3 px-3 min-w-max">
                {featuredProducts.map((product) => (
                  <div 
                    key={product.id}
                    className={`w-[85%] flex-shrink-0 rounded-md overflow-hidden ${
                      isDarkMode ? 'bg-[#151820] border-gray-800/50' : 'bg-white border-gray-100'
                    } border p-2.5`}
                  >
                    <div className="aspect-video rounded-md overflow-hidden mb-2.5">
                      <img
                        src={product.image || 'https://via.placeholder.com/300'} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className={`text-base font-medium leading-snug ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {product.name}
                    </h3>
                    <p className={`text-sm leading-snug text-gray-500 mt-1`}>
                      {product.description}
                    </p>
                    <span className={`inline-block mt-2 px-2 py-0.5 text-sm font-medium rounded ${
                      isDarkMode ? 'bg-green-400/10 text-green-400' : 'bg-green-50 text-green-700'
                    }`}>${product.price.toLocaleString('es-AR')}</span>
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
              className="px-3 pt-6 pb-8"
            >
              <h2 className={`text-xl font-medium mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {category.name}
              </h2>
              
              {/* Grid Layout - First 2 products */}
              {gridProducts.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {gridProducts.map((product) => (
                    <div 
                      key={product.id}
                      className={`rounded-md overflow-hidden ${
                        isDarkMode ? 'bg-[#151820] border-gray-800/50' : 'bg-white border-gray-100'
                      } border p-2.5`}
                    >
                      <div className="aspect-square rounded-md overflow-hidden mb-2.5">
                        <img
                          src={product.image || 'https://via.placeholder.com/300'} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className={`text-base font-medium leading-snug ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {product.name}
                      </h3>
                      <p className={`text-sm leading-snug text-gray-500 mt-1 line-clamp-2`}>
                        {product.description}
                      </p>
                      <span className={`inline-block mt-2 px-2 py-0.5 text-sm font-medium rounded ${
                        isDarkMode ? 'bg-green-400/10 text-green-400' : 'bg-green-50 text-green-700'
                      }`}>${product.price.toLocaleString('es-AR')}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* List Layout - Remaining products */}
              {listProducts.length > 0 && (
                <div className="space-y-2">
                  {listProducts.map((product) => (
                    <div 
                      key={product.id}
                      className={`flex items-start gap-3 p-2.5 rounded-md ${
                        isDarkMode ? 'bg-[#151820] border-gray-800/50' : 'bg-white border-gray-100'
                      } border`}
                    >
                      <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                        <img 
                          src={product.image || 'https://via.placeholder.com/300'} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className={`text-base font-medium leading-snug ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                            {product.name}
                          </h3>
                          <span className={`shrink-0 px-2 py-0.5 text-sm font-medium rounded ${
                            isDarkMode ? 'bg-green-400/10 text-green-400' : 'bg-green-50 text-green-700'
                          }`}>${product.price.toLocaleString('es-AR')}</span>
                        </div>
                        <p className={`text-sm leading-snug text-gray-500 mt-1 line-clamp-2`}>
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