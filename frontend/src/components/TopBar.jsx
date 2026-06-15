import React, { useState, useRef, useEffect } from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useAuth } from '../utils/hooks';
import { User, LogOut } from 'lucide-react';

export const TopBar = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get user initials
  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track your carbon footprint with AI insights
          </p>
        </div>

        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          
          {/* Profile Avatar with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold hover:from-emerald-500 hover:to-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {getUserInitial()}
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                {/* User Info */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 break-all">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};