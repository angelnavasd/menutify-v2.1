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