import { Variants } from 'framer-motion';

// Transiciones base
export const TRANSITION_SPRING = {
  type: "spring",
  stiffness: 200,
  damping: 20
};

export const TRANSITION_EASE = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.2
};

// Animaciones de Fade
export const FADE_VARIANTS: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

// Animaciones de Modal
export const MODAL_VARIANTS: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 20, scale: 0.95 }
};

// Animaciones de Slide
export const SLIDE_VARIANTS: Variants = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 }
};

// Animaciones de Expand
export const EXPAND_VARIANTS: Variants = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 }
};

// Animaciones de Lista
export const LIST_ITEM_VARIANTS: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

// Animaciones de Scroll
export const SCROLL_REVEAL_VARIANTS: Variants = {
  offscreen: { y: 50, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
};

// Animaciones de Hover
export const HOVER_SCALE_VARIANTS = {
  initial: { scale: 1 },
  hover: { scale: 1.05 }
};

// Animaciones de Botones
export const BUTTON_TAP_VARIANTS = {
  initial: { scale: 1 },
  tap: { scale: 0.95 }
};

// Animaciones de Loading
export const LOADING_VARIANTS: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: "linear",
      repeat: Infinity
    }
  }
};

// Animaciones de Notificación
export const NOTIFICATION_VARIANTS: Variants = {
  initial: { opacity: 0, y: -50, scale: 0.3 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 20, scale: 0.5 }
};

// Animaciones específicas del Sidebar
export const SIDEBAR_BACKDROP_VARIANTS: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const SIDEBAR_DROPDOWN_VARIANTS: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 }
};

export const SIDEBAR_CHEVRON_VARIANTS = {
  initial: { rotate: 0 },
  animate: { rotate: 180 }
};

export const SIDEBAR_ARROW_VARIANTS = {
  initial: { opacity: 0, x: -8 },
  hover: { opacity: 1, x: 0 }
};

// Animaciones específicas del MenuList
export const MENU_LIST_DRAG_VARIANTS: Variants = {
  initial: { scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)" },
  dragging: { 
    scale: 1.02,
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    cursor: "grabbing"
  }
};

export const MENU_LIST_EXPAND_VARIANTS: Variants = {
  initial: { height: 0, opacity: 0 },
  expanded: { 
    height: "auto", 
    opacity: 1,
    transition: {
      height: { type: "spring", stiffness: 500, damping: 40 },
      opacity: { duration: 0.2 }
    }
  },
  collapsed: { 
    height: 0, 
    opacity: 0,
    transition: {
      height: { type: "spring", stiffness: 500, damping: 40 },
      opacity: { duration: 0.2 }
    }
  }
};

export const MENU_LIST_ITEM_HOVER_VARIANTS = {
  initial: { x: 0 },
  hover: { x: 4 }
};

export const PRODUCT_CARD_ANIMATION_VARIANTS = {
  drag: {
    initial: { opacity: 1 },
    dragging: { opacity: 0.5 }
  },
  image: {
    loading: { opacity: 0 },
    loaded: { opacity: 1 }
  }
} as const; 