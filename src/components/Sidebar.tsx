import { useState } from 'react';
import {
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [active, setActive] = useState('Creador de Menú');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Cuenta', icon: UserIcon, path: '/account' },
    { name: 'Ajustes', icon: Cog6ToothIcon, path: '/settings' },
  ];

  return (
    <>
      {/* 🔥 Header para Mobile */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-20 flex items-center justify-between bg-gray-900 text-white px-4 py-3 shadow-md">
        <div className="bg-white text-gray-900 font-bold h-9 w-9 flex items-center justify-center rounded-md">
          M
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? (
            <XMarkIcon className="h-8 w-8 text-white" />
          ) : (
            <Bars3Icon className="h-8 w-8 text-white" />
          )}
        </button>
      </header>

      {/* 🚀 Sidebar (Desktop y Mobile Drawer) */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:translate-x-0 md:static z-30 flex flex-col justify-between`}>
        <div>
          {/* ✅ Header con Menutify (Desktop y Mobile) */}
          <div className="px-6 py-4 border-b border-gray-800 flex flex-col">
            <h1 className="text-2xl font-bold text-white">Menutify</h1>
            <p className="text-sm text-gray-400 mt-1">Gestor de menús</p>
          </div>

          <div className="px-4 py-5">
            <button
              onClick={() => {
                setActive('Creador de Menú');
                navigate('/');
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center justify-between px-5 py-3 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white text-base shadow-md hover:opacity-90 transition-all"
            >
              <span>Creador de Menú</span>
              <SparklesIcon className="h-6 w-6 text-white" />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-4">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActive(item.name);
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-5 py-3 rounded-lg transition-all text-base ${
                  active === item.name
                    ? 'bg-gray-800 text-white'
                    : 'hover:bg-gray-800 hover:text-gray-100'
                }`}
              >
                {item.icon && <item.icon className="h-6 w-6" />}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="px-4 py-4 border-t border-gray-800">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-5 py-3 rounded-lg hover:bg-gray-800 transition-all"
          >
            <div className="flex items-center gap-4">
              <img
                src="https://i.pravatar.cc/300"
                alt="Avatar"
                className="h-10 w-10 rounded-md object-cover"
              />
              <div className="text-left">
                <p className="text-base font-medium">Ángel Navas</p>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm text-green-400">Menutify Pro</span>
                </div>
              </div>
            </div>
            <ChevronDownIcon className={`h-6 w-6 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute bottom-20 left-4 w-56 bg-gray-800 text-white rounded-md shadow-lg py-2 space-y-2">
              <button className="w-full flex items-center gap-3 px-5 py-3 text-base hover:bg-gray-700 rounded-md">
                <UserIcon className="h-6 w-6" /> Ver perfil
              </button>
              <button className="w-full flex items-center gap-3 px-5 py-3 text-base hover:bg-gray-700 rounded-md">
                <Cog6ToothIcon className="h-6 w-6" /> Configuración
              </button>
              <button className="w-full flex items-center gap-3 px-5 py-3 text-base text-red-500 hover:bg-red-600 rounded-md">
                <ArrowRightOnRectangleIcon className="h-6 w-6" /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
