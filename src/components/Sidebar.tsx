import { useState } from 'react';
import {
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [active, setActive] = useState('Creador de Menú');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Cuenta', icon: UserIcon, path: '/account' },
    { name: 'Ajustes', icon: Cog6ToothIcon, path: '/settings' },
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col shadow-lg">
      {/* ✅ Header con Menutify */}
      <div className="px-6 py-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">Menutify</h1>
        <p className="text-xs text-gray-400 mt-1">Gestor de menús</p>
      </div>

      {/* ✅ Botón limpio sin animación */}
      <div className="px-4 py-5">
        <button
          onClick={() => {
            setActive('Creador de Menú');
            navigate('/');
          }}
          className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white text-sm shadow-md hover:opacity-90 transition-all"
        >
          <span>Creador de Menú</span>
          <SparklesIcon className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* ✅ Navegación */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => {
              setActive(item.name);
              navigate(item.path);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm ${
              active === item.name
                ? 'bg-gray-800 text-white'
                : 'hover:bg-gray-800 hover:text-gray-100'
            }`}
          >
            {item.icon && <item.icon className="h-5 w-5" />}
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      {/* ✅ Footer con perfil ajustado */}
      <div className="px-4 py-3 border-t border-gray-800 relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-gray-800 transition-all"
        >
          <div className="flex items-center gap-3">
            {/* ✅ Avatar cuadrado */}
            <img
              src="https://i.pravatar.cc/300"
              alt="Avatar"
              className="h-9 w-9 rounded-md object-cover"
            />
            <div className="text-left">
              <p className="text-sm font-medium">Ángel Navas</p>

              {/* ✅ Menutify Pro alineado a la izquierda */}
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                <span className="text-xs text-green-400">Menutify Pro</span>
              </div>
            </div>
          </div>
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-400 transition-transform ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* ✅ Dropdown con Ver Perfil y Cerrar sesión */}
        {isDropdownOpen && (
          <div className="absolute bottom-20 left-4 w-52 bg-gray-800 text-white rounded-md shadow-lg py-2 space-y-1">
            <button
              onClick={() => alert('Ver perfil')}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-700 hover:text-white rounded-md transition-all"
            >
              <UserIcon className="h-5 w-5" />
              <span>Ver perfil</span>
            </button>

            <button
              onClick={() => alert('Configuración')}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-700 hover:text-white rounded-md transition-all"
            >
              <Cog6ToothIcon className="h-5 w-5" />
              <span>Configuración</span>
            </button>

            {/* 🔥 Botón de cerrar sesión en rojo */}
            <button
              onClick={() => alert('Cerrar sesión')}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-600 hover:text-white rounded-md transition-all"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
