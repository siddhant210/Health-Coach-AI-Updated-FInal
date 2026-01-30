import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, Activity, User, ChevronDown, Settings, LogOut, Languages } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [translateOpen, setTranslateOpen] = useState(false);
  const isAuthenticated = true; // No auth, always show user menu

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownOpen((prev) => !prev);
  };

  const handleTranslateToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTranslateOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
  };

  // Initialize Google Translate
  useEffect(() => {
    if (translateOpen) {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          { 
            pageLanguage: 'en',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          },
          'google_translate_element'
        );
      };

      return () => {
        document.body.removeChild(script);
        // Remove the Google Translate dropdown if it exists
        const googGtTT = document.getElementById('goog-gt-tt');
        if (googGtTT) {
          document.body.removeChild(googGtTT);
        }
      };
    }
  }, [translateOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(false);
      setTranslateOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className="relative w-full bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl shadow-lg dark:shadow-slate-950/50 border-b border-gray-200/40 dark:border-slate-700/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            to={isAuthenticated ? "/dashboard" : "/"} 
            className="flex items-center space-x-2"
            onClick={() => setDropdownOpen(false)}
          >
            <Activity className="w-8 h-8 text-primary-from" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-from to-primary-to bg-clip-text text-transparent">
              Health Coach AI
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Google Translate Button */}
            <div className="relative">
              <button
                onClick={handleTranslateToggle}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/60 transition-all duration-200"
                aria-label="Translate"
              >
                <Languages className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </button>
              
              {translateOpen && (
                <div 
                  className="absolute right-0 mt-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-lg dark:shadow-slate-950/50 rounded-lg z-50 p-2 border border-gray-200/40 dark:border-slate-700/40"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div id="google_translate_element"></div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/60 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={handleDropdownToggle}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/60 transition-all duration-200"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-from to-primary-to flex items-center justify-center shadow-md dark:shadow-lg dark:shadow-blue-900/50">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </button>

                {dropdownOpen && (
                  <div 
                    className="absolute right-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-lg dark:shadow-slate-950/50 rounded-lg z-50 mt-2 w-48 border border-gray-200/40 dark:border-slate-700/40"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700/60 transition-all duration-200 rounded-t-lg"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      View Profile
                    </Link>
                    <Link
                      to="/profile-setup"
                      className="flex items-center px-4 py-3 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700/60 transition-all duration-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-3 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700/60 transition-all duration-200 rounded-b-lg"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-primary-from dark:hover:text-primary-to transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-from to-primary-to rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;