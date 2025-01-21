import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bars3Icon,
  XMarkIcon,
  DocumentPlusIcon,
  BuildingStorefrontIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const menuItems = [
  { name: 'Restaurante', icon: BuildingStorefrontIcon, path: '/restaurant' },
  { name: 'Cuenta', icon: UserIcon, path: '/account' }
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [active, setActive] = useState('Creador de Menú');

  return (
    <>
      {/* Header Mobile */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-20 flex items-center justify-between bg-gray-950 px-2 py-2 border-b border-gray-800/50">
        <div className="bg-gradient-to-r from-orange-400 to-amber-400 font-bold h-9 w-9 flex items-center justify-center rounded-lg shadow-lg shadow-orange-400/20">
          M
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isSidebarOpen ? (
            <XMarkIcon className="h-7 w-7" />
          ) : (
            <Bars3Icon className="h-7 w-7" />
          )}
        </button>
      </header>

      {/* Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-20"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed md:sticky top-0 left-0 h-[100dvh] w-[280px] bg-gray-950 text-white shadow-xl md:shadow-2xl md:shadow-gray-950/50 z-30 flex flex-col justify-between ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } transition-transform duration-300`}
      >
        <div>
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-800/50">
            <h1 className="text-2xl font-bold text-white">
              Menutify
            </h1>
            <p className="text-sm text-gray-400 mt-1">Gestor de menús</p>
          </div>

          {/* Menu Creator Button */}
          <div className="px-4 py-4">
            <button
              onClick={() => {
                setActive('Creador de Menú');
                navigate('/');
                setIsSidebarOpen(false);
              }}
              className="w-full group relative flex items-center justify-between px-4 py-2.5 rounded-lg animate-gradient text-white shadow-lg shadow-orange-400/20 hover:shadow-orange-400/30 transition-all duration-300"
            >
              <span className="text-sm font-medium">Creador de Menú</span>
              <DocumentPlusIcon className="h-5 w-5 text-orange-50 transition-all duration-300 group-hover:rotate-12" />
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
                    ? 'bg-gray-800/50 text-orange-300'
                    : 'text-gray-400 hover:bg-gray-800/30 hover:text-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </div>
                <ArrowRightIcon className={`h-4 w-4 transition-all duration-300 ${
                  active === item.name 
                    ? 'opacity-100 translate-x-0 text-orange-300' 
                    : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                }`} />
              </button>
            ))}
          </nav>
        </div>

        {/* User Profile */}
        <div className="relative px-4 py-3 border-t border-gray-800/50">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="Menu de usuario"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-800/30 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <img
                src="https://i.pravatar.cc/300"
                alt="Avatar"
                className="h-8 w-8 rounded-lg object-cover ring-2 ring-gray-800"
              />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-200">Restaurant Demo</p>
                <div className="inline-flex items-center gap-1.5 px-1.5 py-0.5 bg-orange-400/10 rounded-md mt-0.5">
                  <span className="w-1 h-1 rounded-full bg-orange-400"></span>
                  <span className="text-[10px] font-medium text-orange-400">Menutify Pro</span>
                </div>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="ml-1.5"
            >
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full left-4 right-4 mb-2 bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-xl border border-gray-800/50 py-1.5 space-y-1"
              >
                <button 
                  className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5" /> 
                    <span>Ver perfil</span>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </button>
                <button 
                  className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Cog6ToothIcon className="h-5 w-5" /> 
                    <span>Ajustes</span>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </button>
                <div className="h-px bg-gray-800/50 mx-3 my-1" />
                <button 
                  className="w-full flex items-center justify-between px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <ArrowRightOnRectangleIcon className="h-5 w-5" /> 
                    <span>Cerrar sesión</span>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
