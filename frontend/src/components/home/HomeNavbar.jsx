import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Sun, Moon, ArrowRight } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

/**
 * HomeNavbar — A minimal transparent navbar used only on the village homepage.
 * Does not compete with the village scene visually.
 */
export default function HomeNavbar() {
  const { theme, toggleTheme } = useAppStore();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <Sparkles size={22} className="text-[#BC4A54] fill-[#BC4A54]" />
          <span className="text-xl font-extrabold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            Code Nova
          </span>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Skip to Dashboard */}
          <Link
            to="/visualizer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 transition-all"
          >
            Skip to Dashboard
            <ArrowRight size={12} />
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun size={14} className="text-amber-400" />
            ) : (
              <Moon size={14} className="text-indigo-300" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
