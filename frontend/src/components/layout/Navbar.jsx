import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Moon, Sun, Circle, Sparkles, LogOut, LogIn, ChevronDown } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

export default function Navbar() {
  const { theme, setTheme, user, logout } = useAppStore();
  const location = useLocation();
  const isOopRoute = location.pathname.includes('oop');

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all ${
      isActive
        ? 'bg-[#AB526B] text-white shadow-xs'
        : 'text-[#2D1F23]/70 dark:text-[#F4EBC3]/70 hover:text-[#AB526B] dark:hover:text-[#F0E2A4] hover:bg-black/5 dark:hover:bg-white/5'
    }`;

  const navBgClass = isOopRoute
    ? 'bg-white/80 dark:bg-[#0B0F17]/85 border-slate-200/80 dark:border-white/10'
    : 'bg-[#FAF7F2]/90 dark:bg-[#331921]/90 border-[#EBE0D3] dark:border-[#5C4E49]';

  const pillContainerClass = isOopRoute
    ? 'bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10'
    : 'bg-white/70 dark:bg-[#423834]/70 border border-[#EBE0D3] dark:border-[#5C4E49]';

  return (
    <nav className={`sticky top-0 z-50 w-full ${navBgClass} backdrop-blur-md border-b transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <NavLink to="/visualizer" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#AB526B] flex items-center justify-center text-white font-mono font-bold text-sm shadow-xs group-hover:opacity-90 transition-opacity">
              &lt;/&gt;
            </div>
            <span className="text-xl font-bold tracking-tight text-[#2D1F23] dark:text-[#F4EBC3] group-hover:text-[#AB526B] transition-colors">
              Code Nova
            </span>
          </NavLink>

          {/* Navigation Links */}
          <div className={`hidden md:flex items-center ${pillContainerClass} rounded-full p-1 shadow-xs transition-colors duration-300`}>
            <NavLink to="/visualizer" className={navLinkClass}>
              <span>Visualizers</span>
            </NavLink>
            <NavLink to="/oop" className={({ isActive }) => navLinkClass({ isActive: isActive || isOopRoute })}>
              <span>OOP</span>
            </NavLink>
            <NavLink to="/visualizer/crypto" className={navLinkClass}>
              <span>Cryptography</span>
            </NavLink>
            <NavLink to="/sandbox" className={navLinkClass}>
              <span>Sandbox</span>
            </NavLink>
            <div className="w-px h-5 bg-[#EBE0D3] dark:bg-[#54323E] mx-1"></div>
            <NavLink to="/game" className={navLinkClass}>
              <span>3D Game</span>
            </NavLink>
          </div>

          {/* Right Controls: 3-mode theme toggle + Profile */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* 3-Mode Theme Switcher */}
            <div className="flex items-center gap-1 bg-white/70 dark:bg-[#423834]/70 border border-[#EBE0D3] dark:border-[#5C4E49] p-1 rounded-full shadow-xs">
              <button
                onClick={() => setTheme('light')}
                title="Light mode"
                className={`p-1.5 rounded-full transition-all ${
                  theme === 'light'
                    ? 'bg-[#AB526B] text-white shadow-xs'
                    : 'text-[#2D1F23]/60 dark:text-[#F4EBC3]/60 hover:text-[#AB526B]'
                }`}
              >
                <Sun size={14} />
              </button>
              <button
                onClick={() => setTheme('warm')}
                title="Warm Sepia mode"
                className={`p-1.5 rounded-full transition-all ${
                  theme === 'warm'
                    ? 'bg-[#AB526B] text-[#F0E2A4] shadow-xs'
                    : 'text-[#2D1F23]/60 dark:text-[#F4EBC3]/60 hover:text-[#AB526B]'
                }`}
              >
                <Circle size={14} className="fill-[#F0E2A4] stroke-[#BCA297]" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                title="Warm Dark mode"
                className={`p-1.5 rounded-full transition-all ${
                  theme === 'dark'
                    ? 'bg-[#AB526B] text-white shadow-xs'
                    : 'text-[#2D1F23]/60 dark:text-[#F4EBC3]/60 hover:text-[#AB526B]'
                }`}
              >
                <Moon size={14} />
              </button>
            </div>

            {/* Profile Pill */}
            {user ? (
              <div className="flex items-center gap-2 bg-white/70 dark:bg-[#423834]/70 border border-[#EBE0D3] dark:border-[#5C4E49] pl-1 pr-3 py-1 rounded-full shadow-xs transition-colors duration-300">
                <div className="w-7 h-7 rounded-full bg-[#AB526B] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user.username ? user.username.charAt(0).toUpperCase() : 'D'}
                </div>
                <span className="text-xs font-semibold text-[#2D1F23] dark:text-[#F4EBC3] hidden sm:inline">
                  {user.username || 'DemoExplorer'}
                </span>
                <button
                  onClick={() => {
                    logout();
                    window.location.href = '/auth';
                  }}
                  className="text-gray-400 hover:text-[#AB526B] transition-colors ml-1"
                  title="Logout"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <NavLink 
                to="/auth" 
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold bg-[#AB526B] text-white hover:bg-[#8E3B53] transition-colors text-xs shadow-xs"
              >
                <LogIn size={13} />
                <span>Sign In</span>
              </NavLink>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
