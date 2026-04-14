import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard,
  CheckSquare,
  Briefcase,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      section: 'MAIN',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/jobs', label: 'Jobs', icon: <Briefcase size={20} /> },
        { path: '/tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
      ]
    },
    {
      section: 'ACCOUNT',
      items: [
        { path: '/profile', label: 'Profile', icon: <User size={20} /> },
      ]
    }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex fixed left-0 top-24 h-[calc(100vh-96px)] bg-linear-to-b from-gray-900 to-gray-800 text-white flex-col transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-24'
        } shadow-xl border-r border-gray-700`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-4 top-4 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-lg transition-colors"
          title={isSidebarOpen ? 'Collapse' : 'Expand'}
        >
          {isSidebarOpen ? <ChevronDown size={20} className="rotate-90" /> : <ChevronDown size={20} className="-rotate-90" />}
        </button>

        {/* Logo Section */}
        {isSidebarOpen && (
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-indigo-400">Menu</h2>
            <p className="text-xs text-gray-400 mt-1">Navigation</p>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-8">
          {menuItems.map((section) => (
            <div key={section.section}>
              {isSidebarOpen && (
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pl-3">
                  {section.section}
                </h3>
              )}
              <div className="space-y-2">
                {section.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/50'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    title={!isSidebarOpen ? item.label : ''}
                  >
                    {item.icon}
                    {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-gray-700 p-4 space-y-3">
          {isSidebarOpen ? (
            <>
              <div className="bg-gray-700 rounded-lg p-3">
                <p className="text-sm font-semibold text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-400 mt-1">{user?.email || 'email@example.com'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        {/* Mobile Header with Menu Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg z-40 transition-colors"
          title="Menu"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Sidebar Menu */}
        {isSidebarOpen && (
          <div className="fixed left-0 top-24 w-full h-[calc(100vh-96px)] bg-gray-900 text-white overflow-y-auto z-30 shadow-xl">
            <nav className="p-6 space-y-8">
              {menuItems.map((section) => (
                <div key={section.section}>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pl-3">
                    {section.section}
                  </h3>
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive(item.path)
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            {/* Mobile User Section */}
            <div className="border-t border-gray-700 p-6 space-y-3">
              <div className="bg-gray-700 rounded-lg p-3">
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
