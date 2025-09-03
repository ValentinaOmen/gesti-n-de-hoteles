import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaTachometerAlt, FaBed, FaBuilding, FaCouch } from 'react-icons/fa';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navLinks = [
    { to: '/dashboard', icon: <FaBuilding />, text: 'Hoteles' },
    { to: '/habitaciones', icon: <FaTachometerAlt />, text: 'Habitaciones' },
    { to: '/tipo-habitacion', icon: <FaBed />, text: 'Tipos de Habitación' },
    { to: '/tipo-acomodacion', icon: <FaCouch />, text: 'Tipos de Acomodación' },
    { to: '/tipo-habitacion-acomodacion', icon: <FaBed />, text: 'Habitación - Acomodación', },
  ];

  return (
    <div
      className={`bg-gray-900 text-white transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}>
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && <h2 className="text-xl font-bold">Menú</h2>}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-700">
          {isCollapsed ? (
            <FiChevronRight size={24} />
          ) : (
            <FiChevronLeft size={24} />
          )}
        </button>
      </div>
      <nav className="mt-4">
        <ul>
          {navLinks.map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center p-4 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
                }>
                <span className="mr-4">{link.icon}</span>
                {!isCollapsed && <span>{link.text}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
