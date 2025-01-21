// src/components/PreviewPanel.tsx

import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Menu from './Menu';
import { Category } from './types';

interface PreviewPanelProps {
  categories: Category[];
  isDarkMode: boolean;
}

const PreviewPanel = ({ categories, isDarkMode }: PreviewPanelProps) => {
  return (
    <aside className="hidden md:flex flex-col items-center justify-start w-[400px] bg-white border-l border-gray-200">
      <div className="w-full h-full flex flex-col items-center justify-center px-4 pt-6">
        {/* iPhone Frame */}
        <div className="relative mx-auto w-[320px] h-[650px] bg-black rounded-[60px] shadow-xl border-[10px] border-black overflow-hidden">
          {/* Status Bar */}
          <div className={`sticky top-0 z-30 ${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
          } transition-colors duration-300`}>
            <div className={`h-7 px-7 pt-3 pb-1 flex items-center justify-between relative ${
              isDarkMode ? 'text-gray-200' : 'text-gray-900'
            }`}>
              {/* Left - Time */}
              <span className="text-[14px] font-medium">4:16</span>
              
              {/* Right - Icons */}
              <div className="flex items-center gap-0.5">
                {/* Mobile Signal */}
                <svg className="w-3.5 h-2.5" viewBox="0 0 16 12" fill="none">
                  <path d="M1 9h2v1H1V9zM4 7h2v3H4V7zM7 5h2v5H7V5zM10 3h2v7h-2V3zM13 1h2v9h-2V1z" fill="currentColor"/>
                </svg>
                {/* WiFi */}
                <svg className="w-3.5 h-2.5" viewBox="0 0 16 12" fill="none">
                  <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="currentColor"/>
                  <path d="M13.5 6.5c-1.5-1.5-3.5-2.5-5.5-2.5S4 5 2.5 6.5" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M15.5 4.5c-2-2-4.5-3-7.5-3S2.5 2.5.5 4.5" stroke="currentColor" strokeWidth="1.3"/>
                </svg>
                {/* Battery */}
                <div className="w-[20px] h-3 rounded-[3px] border border-current flex items-center px-0.5">
                  <div className="flex-1 h-[8px] bg-current rounded-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-[20px]" />

          {/* Menu Content */}
          <div className="h-[calc(100%-1rem)]">
            <Menu 
              categories={categories} 
              isDarkMode={isDarkMode}
              showHeader={true}
              isPreview={true}
            />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center mt-6 text-gray-500">
          <ChevronDownIcon className="w-5 h-5 animate-bounce mb-2" />
          <p className="text-sm">Así es como los clientes verán tu menú</p>
        </div>
      </div>
    </aside>
  );
};

export default PreviewPanel;