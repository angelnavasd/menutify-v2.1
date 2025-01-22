import { memo } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { MENU_STYLES } from '../constants/layout';
import { MENU_COLORS } from '../constants/colors';

interface MenuHeaderProps {
  isScrolled: boolean;
  isDarkMode: boolean;
}

const MenuHeader = memo(({ isScrolled, isDarkMode }: MenuHeaderProps) => {
  const colors = isDarkMode ? MENU_COLORS.dark : MENU_COLORS.light;

  return (
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
  );
});

MenuHeader.displayName = 'MenuHeader';

export default MenuHeader; 