import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { flushSync } from 'react-dom';
import { Moon, Sun, Code2, Gamepad2, Blocks, LogOut, LogIn, User, Sparkles } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

export default function Navbar() {
  const { theme, toggleTheme, user, logout } = useAppStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-colors ${
      isActive
        ? 'bg-[#BC4A54] text-white shadow-md'
        : 'text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10'
    }`;

  const handleThemeToggle = async (e) => {
    if (!document.startViewTransition) {
      toggleTheme();
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    document.documentElement.classList.add('view-transition-active');
    
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        toggleTheme();
      });
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
          ]
        },
        {
          duration: 700,
          easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
          pseudoElement: '::view-transition-new(root)'
        }
      );
    });
    
    transition.finished.then(() => {
      document.documentElement.classList.remove('view-transition-active');
    });
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#FDFBF7] dark:bg-[#121212] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          
          <div className="flex items-center gap-2">
            <Sparkles size={24} className="text-[#BC4A54] fill-[#BC4A54]" />
            <span className="text-2xl font-extrabold text-[#BC4A54]">
              Code Nova
            </span>
          </div>

          <div className="hidden md:flex items-center bg-[#FDFBF7] dark:bg-[#1A1A1A] border border-[#EBE0D3] dark:border-[#333] rounded-full p-1 shadow-sm transition-colors duration-300">
            <NavLink to="/visualizer" className={navLinkClass}>
              <span>Visualizers</span>
            </NavLink>
            <NavLink to="/sandbox" className={navLinkClass}>
              <span>Sandbox</span>
            </NavLink>
            <div className="w-px h-6 bg-[#EBE0D3] dark:bg-[#333] mx-2"></div>
            <NavLink to="/game" className={navLinkClass}>
              <span>3D Game</span>
            </NavLink>
          </div>

          <div className="flex items-center gap-6">
            <div 
              onClick={handleThemeToggle}
              className="flex items-center gap-2 cursor-pointer bg-white dark:bg-[#1A1A1A] border border-[#EBE0D3] dark:border-[#333] rounded-full px-3 py-1.5 shadow-sm transition-colors duration-300"
              aria-label="Toggle Dark Mode"
            >
              <Sun size={14} className={theme === 'light' ? 'text-[#BC4A54]' : 'text-gray-500'} />
              <div className="w-8 h-4 rounded-full bg-[#EBE0D3] dark:bg-[#333] relative flex items-center p-0.5 transition-colors duration-300">
                <div className={`w-3 h-3 rounded-full bg-[#BC4A54] shadow-sm transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </div>
              <Moon size={14} className={theme === 'dark' ? 'text-[#BC4A54]' : 'text-gray-400'} />
            </div>

            {user ? (
              <div className="flex items-center gap-3 bg-white dark:bg-[#1A1A1A] border border-[#EBE0D3] dark:border-[#333] px-1 py-1 rounded-full shadow-sm transition-colors duration-300">
                <div className="w-8 h-8 bg-[#A8988B] dark:bg-[#BC4A54] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 pl-1 pr-3">{user.username}</span>
                <button
                  onClick={() => {
                    logout();
                    window.location.href = '/auth';
                  }}
                  className="pr-4 text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <NavLink 
                to="/auth" 
                className="flex items-center gap-2 px-6 py-2 rounded-full font-bold bg-[#BC4A54] text-white hover:bg-[#8e4257] transition-colors text-sm"
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </NavLink>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
