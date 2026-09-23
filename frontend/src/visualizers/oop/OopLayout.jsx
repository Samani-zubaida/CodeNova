import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { OopSubNavbar } from './components/common/OopSubNavbar';

const OopLoadingFallback = () => (
  <div className="w-full h-[550px] flex flex-col items-center justify-center gap-4 text-slate-400 dark:text-slate-300">
    <div className="w-16 h-16 rounded-2xl bg-[#AB526B]/20 flex items-center justify-center text-[#F43F5E] border border-[#F43F5E]/40 animate-pulse shadow-lg">
      <Box size={32} className="animate-spin" style={{ animationDuration: '3s' }} />
    </div>
    <span className="text-xs font-mono font-bold tracking-widest text-[#F43F5E] uppercase">
      Booting Simulation Engine...
    </span>
  </div>
);

/**
 * OopLayout - Nested layout wrapper for all /oop routes
 * Renders the dedicated OOP sub-navbar only on concept/visualizer routes.
 * On /oop (the Overview page), the sub-navbar is hidden as the global Navbar is displayed.
 */
export default function OopLayout() {
  const location = useLocation();
  const isOopOverview = ['/oop', '/oop/', '/oops', '/oops/'].includes(location.pathname);
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  const containerBg = isDark
    ? 'bg-[#0B0F17] text-slate-100'
    : isWarm
    ? 'bg-[#FDFBF7] text-[#2D1F23]'
    : 'bg-[#F8FAFC] text-slate-900';

  return (
    <div className={`w-full flex-1 flex flex-col ${containerBg} font-sans transition-colors duration-300 overflow-hidden`}>
      {/* Dedicated OOP Sub-Navbar (Rendered only on concept/visualizer pages, hidden on /oop overview) */}
      {!isOopOverview && <OopSubNavbar />}

      {/* Child Route Viewport Canvas */}
      <div className="w-full flex-1 relative overflow-y-auto overflow-x-hidden flex flex-col [scrollbar-width:thin] [scrollbar-color:rgba(56,189,248,0.35)_transparent]">
        <Suspense fallback={<OopLoadingFallback />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
