export const CONTAINER_PADDING = {
  mobile: 'px-3 py-2',
  desktop: 'px-4 py-3'
} as const;

export const SPACING = {
  xs: '0.5rem',    // 8px
  sm: '1rem',      // 16px
  md: '1.5rem',    // 24px
  lg: '2rem',      // 32px
  xl: '2.5rem'     // 40px
} as const;

export const CONTAINER_MARGINS = {
  mobile: 'mb-4',
  desktop: 'mb-6'
} as const;

export const ROUNDED = {
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-full'
} as const;

export const GRID_LAYOUTS = {
  twoColumns: 'grid-cols-1 sm:grid-cols-2',
  threeColumns: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
  fourColumns: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
} as const;

export const FLEX_LAYOUTS = {
  center: 'flex items-center justify-center',
  between: 'flex items-center justify-between',
  start: 'flex items-center justify-start',
  end: 'flex items-center justify-end'
} as const;

export const CONTAINER_STYLES = {
  padding: {
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem'    // 24px
  },
  maxWidth: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  },
  rounded: {
    sm: '0.375rem', // 6px
    md: '0.5rem',   // 8px
    lg: '0.75rem'   // 12px
  }
};

export const MENU_LIST_STYLES = {
  maxHeight: 'calc(100vh - 180px)',
  scrollbar: {
    width: '10px',
    thumb: {
      default: 'bg-gray-300',
      hover: 'bg-gray-400'
    },
    track: 'bg-transparent'
  },
  spacing: {
    itemGap: '1rem',
    containerPadding: '0.75rem',
    categoryPadding: 'px-4 py-2.5',
    buttonPadding: 'p-1',
    contentPadding: 'px-4 pb-3',
    iconGap: 'gap-2',
    contentGap: 'gap-0',
    sectionGap: 'space-y-2'
  },
  hover: {
    item: 'hover:bg-gray-50',
    editButton: 'hover:text-gray-600',
    deleteButton: 'hover:text-red-500'
  },
  transitions: {
    all: 'transition-all',
    colors: 'transition-colors'
  },
  borders: {
    container: 'border border-gray-200',
    divider: 'border-t border-gray-100'
  }
}; 