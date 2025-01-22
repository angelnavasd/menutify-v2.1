export const THEME_COLORS = {
  primary: {
    DEFAULT: '#f97316', // orange-500
    light: '#fb923c', // orange-400
    dark: '#ea580c', // orange-600
    hover: '#f97316', // orange-500
  },
  secondary: {
    DEFAULT: '#1f2937', // gray-800
    light: '#374151', // gray-700
    dark: '#111827', // gray-900
    hover: '#374151', // gray-700
  },
  background: {
    DEFAULT: '#030712', // gray-950
    light: '#1f2937', // gray-800
    dark: '#000000',
    overlay: 'rgba(0, 0, 0, 0.6)',
    hover: '#F3F4F6'
  },
  text: {
    primary: '#ffffff',
    secondary: '#9ca3af', // gray-400
    tertiary: '#6b7280', // gray-500
    accent: '#fdba74', // orange-300
    DEFAULT: '#1F2937',
    light: '#6B7280',
    dark: '#F9FAFB'
  },
  border: {
    DEFAULT: 'rgba(31, 41, 55, 0.5)', // gray-800/50
    light: '#F3F4F6',
    dark: '#374151'
  },
  status: {
    success: {
      text: '#22c55e', // green-500
      bg: 'rgba(34, 197, 94, 0.1)', // green-500/10
    },
    warning: {
      text: '#f97316', // orange-500
      bg: 'rgba(249, 115, 22, 0.1)', // orange-500/10
    },
    error: {
      text: '#ef4444', // red-500
      bg: 'rgba(239, 68, 68, 0.1)', // red-500/10
    },
    info: '#3B82F6'
  }
};

export const DARK_MODE_COLORS = {
  background: {
    primary: 'bg-gray-900',
    secondary: 'bg-gray-800',
    tertiary: 'bg-gray-700'
  },
  text: {
    primary: 'text-gray-100',
    secondary: 'text-gray-300',
    tertiary: 'text-gray-400'
  },
  border: {
    primary: 'border-gray-700',
    secondary: 'border-gray-600',
    tertiary: 'border-gray-500'
  }
} as const;

export const STATUS_COLORS = {
  active: 'bg-green-400/10 text-green-400',
  inactive: 'bg-gray-400/10 text-gray-400',
  warning: 'bg-yellow-400/10 text-yellow-400',
  error: 'bg-red-400/10 text-red-400'
} as const;

export const CATEGORY_ITEM_COLORS = {
  text: {
    title: 'text-gray-900',
    subtitle: 'text-gray-500',
    icon: 'text-gray-400'
  },
  border: 'border-gray-200',
  ring: 'ring-orange-300',
  background: {
    base: 'bg-white',
    hover: 'hover:bg-gray-50'
  }
} as const; 