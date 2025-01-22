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

export const PRODUCT_CARD_STYLES = {
  container: 'flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200',
  imageContainer: 'relative flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden',
  imagePlaceholder: 'absolute inset-0 animate-pulse bg-gray-200',
  dragHandle: 'flex-shrink-0 cursor-grab active:cursor-grabbing touch-none',
  contentContainer: 'flex-grow min-w-0 flex flex-col gap-2',
  headerContainer: 'flex justify-between items-start',
  title: 'font-medium text-gray-900 truncate',
  featuredBadge: 'px-2 py-0.5 flex items-center bg-amber-50 rounded-md',
  priceBadge: 'px-2 py-0.5 text-sm font-medium text-green-700 bg-green-50 rounded-md',
  description: 'text-sm text-gray-500 line-clamp-2 flex-grow',
  actionsContainer: 'flex items-center gap-1 ml-2',
  actionButton: {
    base: 'p-1 rounded transition-colors',
    edit: 'text-gray-500 hover:text-orange-400 hover:bg-orange-50',
    visibility: {
      visible: 'text-gray-500 hover:text-orange-400 hover:bg-orange-50',
      hidden: 'text-orange-400 hover:text-orange-500 hover:bg-orange-50'
    },
    delete: 'text-gray-500 hover:text-red-400 hover:bg-red-50'
  }
} as const;

export const CATEGORY_ITEM_STYLES = {
  container: {
    base: 'bg-white rounded-lg overflow-hidden',
    dragging: 'opacity-50'
  },
  header: {
    base: 'relative w-full flex items-center justify-between text-left',
    editMode: 'ml-6',
    dragHandle: 'absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing'
  },
  input: {
    base: 'px-2 py-0.5 border border-gray-200 rounded text-sm text-gray-900 bg-white',
    focus: 'focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent'
  },
  title: {
    base: 'text-base font-medium text-gray-900',
    count: 'text-xs text-gray-500'
  },
  icons: {
    base: 'h-4 w-4 text-gray-400'
  }
} as const;

export const PREVIEW_PANEL_STYLES = {
  container: {
    base: 'hidden md:flex flex-col items-center justify-start w-[400px] bg-white border-l border-gray-200',
    content: 'w-full h-full flex flex-col items-center justify-center px-4 pt-6'
  },
  iphone: {
    frame: {
      container: 'relative mx-auto w-[320px] h-[650px] bg-black rounded-[60px] shadow-xl border-[10px] border-black overflow-hidden',
      dynamicIsland: 'absolute top-2 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-[20px]'
    },
    statusBar: {
      container: 'sticky top-0 z-30 transition-colors duration-300',
      content: 'h-7 px-7 pt-3 pb-1 flex items-center justify-between relative',
      time: 'text-[14px] font-medium',
      icons: {
        container: 'flex items-center gap-0.5',
        signal: 'w-3.5 h-2.5',
        wifi: 'w-3.5 h-2.5',
        battery: {
          container: 'w-[20px] h-3 rounded-[3px] border border-current flex items-center px-0.5',
          level: 'flex-1 h-[8px] bg-current rounded-sm'
        }
      }
    },
    content: 'h-[calc(100%-1rem)]'
  },
  footer: {
    container: 'flex flex-col items-center mt-6 text-gray-500',
    icon: 'w-5 h-5 animate-bounce mb-2',
    text: 'text-sm'
  }
} as const; 