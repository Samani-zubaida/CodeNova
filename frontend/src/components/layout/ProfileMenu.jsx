import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User, Zap, Flame, Trophy, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white/10 dark:bg-[#1A1A1A]/80 backdrop-blur-md border border-[#EBE0D3]/30 dark:border-[#333]/50 px-1 py-1 rounded-full shadow-sm hover:shadow-md transition-all duration-300 group"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-[#BC4A54] to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-inner group-hover:scale-105 transition-transform">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 pl-1 pr-3 hidden sm:block">
          {user.username}
        </span>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-72 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden z-50"
          >
            {/* Header / Banner */}
            <div className="relative p-5 bg-gradient-to-br from-[#BC4A54]/10 to-orange-500/10 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#BC4A54] to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
                    {user.username}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Gamification Stats */}
            <div className="p-4 grid grid-cols-2 gap-3 bg-gray-50 dark:bg-[#1A1A1A]/50">
              <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-[#222] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <Zap size={20} className="text-yellow-500 mb-1" />
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total XP</span>
                <span className="font-bold text-gray-900 dark:text-white">{user.xp || 0}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-[#222] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <Flame size={20} className="text-orange-500 mb-1" />
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Streak</span>
                <span className="font-bold text-gray-900 dark:text-white">{user.currentStreak || 0} Days</span>
              </div>
            </div>

            {/* Badges Preview */}
            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent Badges</span>
                <Trophy size={14} className="text-gray-400" />
              </div>
              <div className="flex gap-2">
                {user.earnedBadges && user.earnedBadges.length > 0 ? (
                  user.earnedBadges.slice(0, 4).map((badge, idx) => (
                    <div key={idx} className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 flex items-center justify-center" title={badge.name}>
                      <Award size={16} className="text-blue-600 dark:text-blue-400" />
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 italic">No badges earned yet.</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-2 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
