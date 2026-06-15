import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/hooks';
import {
  BarChart3,
  Bot,
  FileText,
  History,
  Trophy,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/ai-assistant', label: 'AI Assistant', icon: Bot },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/activity-history', label: 'Activity History', icon: History },
    { path: '/achievements', label: 'Achievements', icon: Trophy },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-emerald-500 text-white p-3 rounded-full shadow-lg hover:bg-emerald-600"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 z-30 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            🌿 CarbonLens
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Carbon Footprint Tracker
          </p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive(item.path)
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        {user && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition"
            >
              <LogOut size={16} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};
