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
  container: 'flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200/80 hover:border-gray-300/80 transition-colors',
  imageContainer: {
    wrapper: 'relative flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden',
    placeholder: {
      container: 'absolute inset-0 flex items-center justify-center bg-gray-50',
      icon: 'w-8 h-8 text-gray-300'
    }
  },
  contentContainer: 'flex-grow min-w-0 flex flex-col gap-1.5',
  headerContainer: 'flex flex-col min-w-0',
  title: 'font-medium text-gray-900 truncate',
  description: 'text-sm text-gray-500 line-clamp-2',
  actionsContainer: 'flex items-center gap-2 ml-auto',
  priceBadge: 'inline-flex px-2 py-0.5 text-sm font-medium text-green-700 bg-green-50 rounded-md text-right',
  featuredBadge: 'w-7 h-[26px] flex items-center justify-center bg-amber-50 rounded-md text-amber-600',
  featuredPlaceholder: 'w-7',
  actionButton: {
    base: 'p-1 rounded transition-colors',
    edit: 'text-gray-400 hover:text-orange-500 hover:bg-orange-50',
    visibility: {
      visible: 'text-gray-400 hover:text-orange-500 hover:bg-orange-50',
      hidden: 'text-orange-400 hover:text-orange-500 hover:bg-orange-50'
    },
    delete: 'text-gray-400 hover:text-red-500 hover:bg-red-50'
  },
  divider: 'w-px h-4 bg-gray-200 mx-2',
  dragHandle: 'flex-shrink-0 cursor-grab active:cursor-grabbing touch-none text-gray-400 hover:text-gray-500'
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

export const MENU_STYLES = {
  container: {
    base: 'h-full overflow-y-auto scrollbar-none',
    header: {
      wrapper: 'sticky top-0 z-20',
      content: {
        base: 'px-3 transition-all duration-200',
        expanded: 'py-4',
        collapsed: 'pt-4 pb-1'
      },
      heights: {
        preview: {
          expanded: 120,
          collapsed: 60
        },
        normal: {
          expanded: 140,
          collapsed: 80
        }
      },
      logo: {
        container: 'w-12 h-12 rounded-md flex items-center justify-center text-xl font-medium mb-2',
        text: 'text-2xl font-semibold'
      },
      info: {
        container: 'flex items-center gap-1 mt-1',
        icon: 'w-3.5 h-3.5',
        text: 'text-xs'
      }
    },
    navigation: {
      wrapper: 'border-b',
      content: 'overflow-x-auto scrollbar-none',
      list: 'flex px-3 space-x-6 min-w-max py-3',
      item: {
        base: 'text-base font-medium whitespace-nowrap transition-all duration-300 relative px-1 py-0.5',
        indicator: 'absolute bottom-0 left-0 right-0 h-0.5 rounded-full'
      }
    }
  },
  sections: {
    wrapper: 'pb-20',
    header: 'text-xl font-medium mb-3',
    featured: {
      container: 'px-3 pt-4 pb-6',
      grid: {
        wrapper: 'overflow-x-auto scrollbar-none -mx-3',
        container: 'flex gap-3 px-3 min-w-max',
        item: {
          container: 'w-[85%] flex-shrink-0 rounded-md overflow-hidden border p-2.5',
          image: {
            wrapper: 'h-40 rounded-md overflow-hidden mb-2.5',
            img: 'w-full h-full object-cover'
          },
          title: 'text-base font-medium leading-snug',
          description: 'text-sm leading-snug mt-1',
          price: 'inline-block mt-2 px-2 py-0.5 text-sm font-medium rounded'
        }
      }
    },
    category: {
      container: 'px-3 pt-6 pb-8',
      grid: {
        wrapper: 'grid grid-cols-2 gap-2 mb-3',
        item: {
          container: 'rounded-md overflow-hidden border p-2.5',
          image: {
            wrapper: 'aspect-square rounded-md overflow-hidden mb-2.5',
            img: 'w-full h-full object-cover'
          },
          title: 'text-base font-medium leading-snug',
          description: 'text-sm leading-snug mt-1 line-clamp-2',
          price: 'inline-block mt-2 px-2 py-0.5 text-sm font-medium rounded'
        }
      },
      list: {
        wrapper: 'space-y-2',
        item: {
          container: 'flex items-start gap-3 p-2.5 rounded-md border',
          image: {
            wrapper: 'w-20 h-20 flex-shrink-0 rounded-md overflow-hidden',
            img: 'w-full h-full object-cover'
          },
          content: {
            wrapper: 'flex-1 min-w-0',
            header: 'flex justify-between items-start gap-2',
            title: 'text-base font-medium leading-snug',
            price: 'shrink-0 px-2 py-0.5 text-sm font-medium rounded',
            description: 'text-sm leading-snug mt-1 line-clamp-2'
          }
        }
      }
    }
  }
} as const;

export const PRODUCT_FORM_STYLES = {
  overlay: 'fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity',
  container: {
    wrapper: 'fixed inset-y-0 right-0 w-full max-w-md bg-gray-50 shadow-xl z-50 flex flex-col',
    content: 'flex-1 overflow-y-auto',
    section: 'px-5 py-4 space-y-6'
  },
  header: {
    wrapper: 'px-5 py-3 border-b border-gray-200 flex items-center justify-between bg-white',
    title: 'text-xl font-semibold text-gray-800',
    subtitle: 'text-xs text-gray-500',
    closeButton: 'text-gray-500 hover:text-gray-700 transition-colors'
  },
  formSection: {
    wrapper: 'space-y-3',
    title: 'text-sm font-medium text-gray-700 border-b border-gray-100 pb-1'
  },
  field: {
    wrapper: 'space-y-2',
    label: {
      wrapper: 'flex items-center',
      text: 'block text-sm font-medium text-gray-700'
    },
    input: 'w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors',
    textarea: 'w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none h-20',
    select: 'w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white'
  },
  imageUpload: {
    wrapper: 'flex gap-4 h-24',
    dropzone: {
      base: 'w-1/2 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50',
      active: 'border-blue-500 bg-blue-50',
      inactive: 'border-gray-300',
      content: 'text-center text-gray-500 text-sm p-2'
    },
    preview: {
      wrapper: 'w-1/2 relative',
      image: 'w-full h-24 object-cover rounded-lg',
      removeButton: 'absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors'
    }
  },
  currencyField: {
    wrapper: 'flex items-center gap-2',
    select: 'px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white w-28',
    inputWrapper: 'relative flex-1',
    input: 'w-full pl-3 pr-10 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-right',
    icon: 'absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400'
  },
  toggle: {
    wrapper: 'flex-1',
    container: 'flex items-center justify-between',
    label: 'mr-3',
    labelText: 'text-sm font-medium text-gray-700',
    switch: {
      base: 'relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2',
      active: 'bg-orange-400',
      inactive: 'bg-gray-200',
      handle: {
        base: 'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
        active: 'translate-x-5',
        inactive: 'translate-x-1'
      }
    }
  },
  submitButton: {
    wrapper: 'sticky bottom-0 px-5 py-3 border-t border-gray-200 bg-white',
    button: {
      base: 'w-full py-3 rounded-lg transition-colors relative',
      success: 'bg-green-500 hover:bg-green-600',
      default: 'bg-orange-400 hover:bg-orange-500'
    },
    content: 'relative',
    spinner: 'h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin',
    text: 'text-white font-medium'
  }
} as const; 