import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { flushSync } from 'react-dom';
import { Moon, Sun, Code2, Gamepad2, Blocks } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

export default function Navbar() {
  const { theme, toggleTheme } = useAppStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
      isActive
        ? 'bg-[var(--color-nova-red)] text-white'
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
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-[var(--color-nova-red)] to-[var(--color-nova-brown)] bg-clip-text text-transparent">
              Code Nova
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <NavLink to="/visualizer" className={navLinkClass}>
              <Blocks size={18} />
              <span className="hidden md:inline">Visualizers</span>
            </NavLink>
            <NavLink to="/sandbox" className={navLinkClass}>
              <Code2 size={18} />
              <span className="hidden md:inline">Sandbox</span>
            </NavLink>
            <NavLink to="/game" className={navLinkClass}>
              <Gamepad2 size={18} />
              <span className="hidden md:inline">3D Game</span>
            </NavLink>

            <div className="h-6 w-px bg-gray-300 dark:bg-white/20 mx-2"></div>

            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
