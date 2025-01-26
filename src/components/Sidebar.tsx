import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bars3Icon,
  DocumentPlusIcon,
  BuildingStorefrontIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { SIDEBAR_BACKDROP_VARIANTS, SIDEBAR_DROPDOWN_VARIANTS, SIDEBAR_CHEVRON_VARIANTS, SIDEBAR_ARROW_VARIANTS, TRANSITION_SPRING } from '../constants/animations';
import { THEME_COLORS, SIDEBAR_COLORS } from '../constants/colors';
import { updateThemeConfig } from '../firebase/services';
import menutifyIcon from '../assets/icons/menutify-icon.svg';
import { logout } from '@/firebase/authService';

const menuItems = [
  { name: 'Restaurante', icon: BuildingStorefrontIcon, path: '/restaurant' },
  { name: 'Cuenta', icon: UserIcon, path: '/account' }
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [active, setActive] = useState('Creador de Menú');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const colors = isDarkMode ? SIDEBAR_COLORS.dark : SIDEBAR_COLORS.light;

  const handleThemeToggle = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      await updateThemeConfig(newTheme);
    } catch (error) {
      console.error('Error updating theme:', error);
      // Revert if failed
      setIsDarkMode(!newTheme);
    }
  };

  return (
    <>
      {/* Header Mobile */}
      <header className={`md:hidden fixed top-0 left-0 right-0 z-20 bg-gray-900 border-b ${colors.border}`}>
        <div className="max-w-5xl mx-auto px-2 md:px-4">
          <div className="flex items-center justify-between py-3">
            <Link 
              to="/" 
              className="rounded-md"
            >
              <span className="relative block p-2">
                <div className="absolute inset-0 bg-white rounded-md" />
                <img src={menutifyIcon} alt="Menutify" className="relative w-5 h-5 text-orange-400" />
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.open('/menu', '_blank')}
                className="relative px-5 py-2.5 text-sm font-semibold text-white rounded-md overflow-hidden group shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all"
              >
                <div className="absolute inset-0 animate-gradient-x" />
                <div className="relative flex items-center gap-3">
                  <motion.div
                    animate={{ 
                      y: [0, -2, 0],
                      rotate: [0, -10, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <RocketLaunchIcon className="w-4 h-4" />
                  </motion.div>
                  <span>Ver menú online</span>
                </div>
              </button>
              <motion.button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="rounded-md"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="relative block px-2.5 py-2.5">
                  <div className="absolute inset-0 bg-orange-400/20 rounded-md" />
                  <Bars3Icon className="w-5 h-5 relative text-orange-400" />
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            variants={SIDEBAR_BACKDROP_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-20"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed md:sticky top-0 left-0 h-[100dvh] w-[280px] ${colors.background} ${colors.text.primary} shadow-xl md:shadow-2xl md:shadow-gray-950/50 z-30 flex flex-col justify-between ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } transition-transform duration-300`}
      >
        <div>
          {/* Header */}
          <div className={`px-6 py-4 border-b ${colors.border}`}>
            <h1 className={`text-2xl font-bold ${colors.text.primary}`}>
              Menutify
            </h1>
            <p className={`text-sm ${colors.text.secondary} mt-1`}>Gestor de menús</p>
          </div>

          {/* Menu Creator Button */}
          <div className="px-4 py-4">
            <button
              onClick={() => {
                setActive('Creador de Menú');
                navigate('/');
                setIsSidebarOpen(false);
              }}
              className={`w-full group relative flex items-center justify-between px-4 py-2.5 rounded-lg animate-gradient ${colors.text.primary} shadow-lg shadow-${THEME_COLORS.primary.DEFAULT}/20 hover:shadow-${THEME_COLORS.primary.DEFAULT}/30 transition-all duration-300`}
            >
              <span className="text-sm font-medium">Creador de Menú</span>
              <DocumentPlusIcon className={`h-5 w-5 text-${THEME_COLORS.primary.light} transition-all duration-300 group-hover:rotate-12`} />
            </button>
          </div>

          {/* Navigation */}
          <nav role="navigation" className="flex-1 px-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActive(item.name);
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all text-sm font-medium group ${
                  active === item.name
                    ? `${colors.active} text-${THEME_COLORS.primary.DEFAULT}`
                    : `${colors.text.secondary} ${colors.hover} ${colors.text.primary.replace('text-', 'hover:text-')}`
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </div>
                <motion.div
                  variants={SIDEBAR_ARROW_VARIANTS}
                  initial="initial"
                  animate={active === item.name ? "hover" : "initial"}
                  className="h-4 w-4"
                >
                  <ArrowRightIcon className={`h-4 w-4 ${
                    active === item.name 
                      ? `text-${THEME_COLORS.primary.DEFAULT}`
                      : colors.text.secondary
                  }`} />
                </motion.div>
              </button>
            ))}
          </nav>
        </div>

        {/* User Profile */}
        <div className={`relative px-4 py-3 border-t ${colors.border}`}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="Menu de usuario"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ${colors.hover} transition-all`}
          >
            <div className="flex items-center gap-2.5">
              <img
                src="https://i.pravatar.cc/300"
                alt="Avatar"
                className={`h-8 w-8 rounded-lg object-cover ring-2 ${colors.border}`}
              />
              <div className="flex-1 text-left">
                <p className={`text-sm font-medium ${colors.text.primary}`}>Restaurant Demo</p>
                <div className="inline-flex items-center gap-1.5 px-1.5 py-0.5 bg-orange-400/10 rounded-md mt-0.5">
                  <span className="w-1 h-1 rounded-full bg-orange-400"></span>
                  <span className="text-[10px] font-medium text-orange-400 font-sans">Menutify Pro</span>
                </div>
              </div>
            </div>
            <motion.div
              variants={SIDEBAR_CHEVRON_VARIANTS}
              initial="initial"
              animate={isDropdownOpen ? "animate" : "initial"}
              className="ml-1.5"
            >
              <ChevronDownIcon className={`h-4 w-4 ${colors.text.secondary}`} />
            </motion.div>
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                variants={SIDEBAR_DROPDOWN_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={TRANSITION_SPRING}
                className={`absolute bottom-full left-4 right-4 mb-2 ${colors.background} backdrop-blur-sm rounded-lg shadow-xl border ${colors.border} py-1.5 space-y-1 font-sans`}
              >
                <button 
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm ${colors.text.secondary} ${colors.hover} transition-colors group`}
                >
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5" /> 
                    <span>Ver perfil</span>
                  </div>
                  <motion.div
                    variants={SIDEBAR_ARROW_VARIANTS}
                    initial="initial"
                    whileHover="hover"
                    className="h-4 w-4"
                  >
                    <ArrowRightIcon className="h-4 w-4" />
                  </motion.div>
                </button>
                <button 
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm ${colors.text.secondary} ${colors.hover} transition-colors group`}
                >
                  <div className="flex items-center gap-3">
                    <Cog6ToothIcon className="h-5 w-5" /> 
                    <span>Ajustes</span>
                  </div>
                  <motion.div
                    variants={SIDEBAR_ARROW_VARIANTS}
                    initial="initial"
                    whileHover="hover"
                    className="h-4 w-4"
                  >
                    <ArrowRightIcon className="h-4 w-4" />
                  </motion.div>
                </button>
                {/* Theme Switch */}
                <button 
                  onClick={handleThemeToggle}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm ${colors.text.secondary} ${colors.hover} transition-colors group`}
                >
                  <div className="flex items-center gap-3">
                    {isDarkMode ? (
                      <SunIcon className="h-5 w-5" />
                    ) : (
                      <MoonIcon className="h-5 w-5" />
                    )}
                    <span>{isDarkMode ? 'Modo claro' : 'Modo oscuro'}</span>
                  </div>
                  <div className={`w-9 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out ${
                    isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                  }`}>
                    <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${
                      isDarkMode ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </div>
                </button>
                <div className={`h-px ${colors.border} mx-3 my-1`} />
                <div 
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm text-red-500 ${colors.hover} transition-colors group`}
                >
                  <button onClick={logout} className="flex items-center gap-3">
                    <ArrowRightOnRectangleIcon className="h-5 w-5" /> 
                    <span>Cerrar sesión</span>
                  </button>
                  <motion.div
                    variants={SIDEBAR_ARROW_VARIANTS}
                    initial="initial"
                    whileHover="hover"
                    className="h-4 w-4"
                  >
                    <ArrowRightIcon className="h-4 w-4" />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;