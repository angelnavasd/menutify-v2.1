// src/components/PreviewPanel.tsx

import { memo } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Menu from './Menu';
import { Category } from './types';
import { PREVIEW_PANEL_STYLES } from '../constants/layout';
import { PREVIEW_PANEL_COLORS } from '../constants/colors';

interface PreviewPanelProps {
  categories: Category[];
  isDarkMode: boolean;
}

const PreviewPanel = memo(({ categories, isDarkMode }: PreviewPanelProps) => {
  const colors = isDarkMode ? PREVIEW_PANEL_COLORS.dark : PREVIEW_PANEL_COLORS.light;
  const statusBarColors = isDarkMode ? PREVIEW_PANEL_COLORS.statusBar.dark : PREVIEW_PANEL_COLORS.statusBar.light;

  return (
    <aside className={`${PREVIEW_PANEL_STYLES.container.base} ${colors.background}`}>
      <div className={PREVIEW_PANEL_STYLES.container.content}>
        {/* iPhone Frame */}
        <div className={`${PREVIEW_PANEL_STYLES.iphone.frame.container} ${colors.border}`}>
          {/* Status Bar */}
          <div className={`${PREVIEW_PANEL_STYLES.iphone.statusBar.container} ${statusBarColors.background}`}>
            <div className={`${PREVIEW_PANEL_STYLES.iphone.statusBar.content} ${statusBarColors.text}`}>
              {/* Left - Time */}
              <span className={PREVIEW_PANEL_STYLES.iphone.statusBar.time}>4:16</span>
              
              {/* Right - Icons */}
              <div className={PREVIEW_PANEL_STYLES.iphone.statusBar.icons.container}>
                {/* Mobile Signal */}
                <svg className={PREVIEW_PANEL_STYLES.iphone.statusBar.icons.signal} viewBox="0 0 16 12" fill="none">
                  <path d="M1 9h2v1H1V9zM4 7h2v3H4V7zM7 5h2v5H7V5zM10 3h2v7h-2V3zM13 1h2v9h-2V1z" fill="currentColor"/>
                </svg>
                {/* WiFi */}
                <svg className={PREVIEW_PANEL_STYLES.iphone.statusBar.icons.wifi} viewBox="0 0 16 12" fill="none">
                  <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="currentColor"/>
                  <path d="M13.5 6.5c-1.5-1.5-3.5-2.5-5.5-2.5S4 5 2.5 6.5" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M15.5 4.5c-2-2-4.5-3-7.5-3S2.5 2.5.5 4.5" stroke="currentColor" strokeWidth="1.3"/>
                </svg>
                {/* Battery */}
                <div className={PREVIEW_PANEL_STYLES.iphone.statusBar.icons.battery.container}>
                  <div className={PREVIEW_PANEL_STYLES.iphone.statusBar.icons.battery.level} />
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Island */}
          <div className={PREVIEW_PANEL_STYLES.iphone.frame.dynamicIsland} />

          {/* Menu Content */}
          <div className={PREVIEW_PANEL_STYLES.iphone.content}>
            <Menu 
              categories={categories} 
              isDarkMode={isDarkMode}
              showHeader={true}
              isPreview={true}
            />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={`${PREVIEW_PANEL_STYLES.footer.container} ${colors.text.secondary}`}>
          <ChevronDownIcon className={PREVIEW_PANEL_STYLES.footer.icon} />
          <p className={PREVIEW_PANEL_STYLES.footer.text}>
            Así es como los clientes verán tu menú
          </p>
        </div>
      </div>
    </aside>
  );
});

PreviewPanel.displayName = 'PreviewPanel';

export default PreviewPanel;