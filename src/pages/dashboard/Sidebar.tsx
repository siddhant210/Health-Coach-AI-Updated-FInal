import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, Pill, Dumbbell, Apple, Heart, MessageSquare, Settings,
  User, FileText, Menu, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { FaRobot } from "react-icons/fa";
import { RiRobot2Line } from "react-icons/ri";
import { GiRobotAntennas } from 'react-icons/gi';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  userProfile: {
    name?: string;
    email?: string;
    avatar_url?: string;
  } | null;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, userProfile }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'overview', icon: Activity, label: 'Overview' },
    { id: 'medications', icon: Pill, label: 'Medications', link: '/medication' },
    { id: 'diet', icon: Apple, label: 'Diet', link: '/diet' },
    { id: 'monitoring', icon: Heart, label: 'Monitoring', link: '/monitoring' },
    { id: 'activity', icon: Activity, label: 'Activity', link: '/activity-summary' },
    { id: 'documents', icon: FileText, label: 'Documents', link: '/documents' },
    { id: 'AI', icon: FaRobot, label: 'AI', link: '/ai' },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:hidden fixed top-20 left-4 z-50 p-2 rounded-lg bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-gray-200/40 dark:border-slate-700/40 shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div className={`sticky top-0 h-screen ${isOpen ? 'block sm:block' : 'hidden sm:block'}`}>
        <motion.nav 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-20 sm:w-24 md:w-64 h-full bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border-r border-gray-200/40 dark:border-slate-700/40 shadow-xl dark:shadow-slate-950/50"
        >
          <div className="p-3 sm:p-4 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8">
              {userProfile?.avatar_url ? (
                <img 
                  src={userProfile.avatar_url} 
                  alt="Profile"
                  className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gradient-to-r from-blue-400 to-green-400 object-cover"
                />
              ) : (
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                </div>
              )}
              <div className="hidden md:block text-center sm:text-left">
                <h3 className="font-semibold text-sm md:text-base text-gray-800 dark:text-slate-100">
                  {userProfile?.name || 'User'}
                </h3>
                <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400 truncate">
                  {userProfile?.email || ''}
                </p>
              </div>
            </div>
            <div className="space-y-1 flex-1 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.link || '#'}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0 p-2 sm:p-3 rounded-lg transition-all duration-200 justify-center sm:justify-start ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg dark:shadow-blue-900/50'
                      : 'hover:bg-gray-100/50 dark:hover:bg-slate-700/50 text-gray-700 dark:text-slate-300'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs sm:text-sm md:text-base font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </motion.nav>
      </div>
    </>
  );
};

export default Sidebar;