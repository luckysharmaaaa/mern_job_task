import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LogOut, 
  User, 
  Menu, 
  X,
  LayoutDashboard, 
  CheckSquare, 
  Briefcase,
  Home
} from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/jobs', label: 'Jobs', icon: <Briefcase size={18} /> },
    { path: '/tasks', label: 'Tasks', icon: <CheckSquare size={18} /> },
    { path: '/profile', label: 'Profile', icon: <User size={18} /> },
  ];

  if (!token || !user) return null;

  return (
    <nav className="bg-linear-to-r from-indigo-600 to-indigo-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="bg-white text-indigo-600 p-2 rounded-lg font-bold text-xl shadow-md">
              JB
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-bold text-lg">Job Board</h1>
              <p className="text-indigo-100 text-xs">Task Management</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-white text-indigo-600 font-semibold shadow-md'
                    : 'text-white hover:bg-indigo-500 hover:bg-opacity-50'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Section & Logout */}
          <div className="flex items-center gap-4">
            {/* User Info - Desktop */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white bg-opacity-10 rounded-lg">
              <div className="w-10 h-10 bg-white text-indigo-600 rounded-full flex items-center justify-center font-bold shadow-md">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{user.name || 'User'}</p>
                <p className="text-indigo-100 text-xs">{user.email?.split('@')[0]}</p>
              </div>
            </div>

            {/* Logout Button - Desktop */}
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-semibold shadow-md"
              title="Logout"
            >
              <LogOut size={18} />
              Logout
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white hover:bg-indigo-500 p-2 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-indigo-400 pt-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                  isActive(link.path)
                    ? 'bg-white text-indigo-600 font-semibold'
                    : 'text-white hover:bg-indigo-500'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            {/* Mobile User Info */}
            <div className="px-4 py-3 bg-white bg-opacity-10 rounded-lg">
              <p className="text-white text-sm font-semibold">{user.name}</p>
              <p className="text-indigo-100 text-xs">{user.email}</p>
            </div>

            {/* Mobile Logout */}
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-semibold"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
