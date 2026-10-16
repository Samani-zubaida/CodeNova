import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Moon, Sun, Circle, Sparkles, LogOut, LogIn,
  Boxes, Shield, Terminal, Menu, X, ArrowRight
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';

/**
 * Premium Glassmorphism Navbar for Code Nova
 * Featuring layered specular lighting, harmonious multi-accent iconography,
 * high-contrast accessible typography, and responsive mobile glass drawer.
 */
export default function Navbar() {
  const { theme, setTheme, user, logout } = useAppStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync mobile drawer state with route transitions
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setMobileMenuOpen(false);
  }

  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';
  const isOopRoute = location.pathname.includes('oop');

  // Exact active route matching
  const isCryptoRoute = location.pathname.includes('/crypto') || 
    ['caesar', 'vigenere', 'playfair', 'railfence', 'columnar', 'aes', 'rsa', 'hash', 'signature', 'steg', 'enigma', 'hacker', 'dh']
      .some(algo => location.pathname.includes(algo));
  const isOopVisualizerRoute = (location.pathname.startsWith('/oop') || location.pathname.startsWith('/visualizer')) && !isCryptoRoute;
  const isSandboxRoute = location.pathname.startsWith('/sandbox');
  const isGameRoute = location.pathname.startsWith('/game') || location.pathname.startsWith('/host');

  // Glassmorphic Navbar Container Surface
  const navBgClass = isDark
    ? isOopRoute
      ? 'bg-[#0B0F17]/85 border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
      : 'bg-[#1D131A]/85 border-white/[0.08] shadow-[0_8px_32px_rgba(20,10,18,0.5)]'
    : isWarm
    ? 'bg-[#FAF7F2]/88 border-[#EBE0D3] shadow-[0_4px_24px_rgba(45,31,35,0.05)]'
    : 'bg-white/85 border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)]';

  // Center Floating Capsule Background
  const capsuleBgClass = isDark
    ? 'bg-white/[0.05] border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_20px_rgba(0,0,0,0.25)]'
    : isWarm
    ? 'bg-black/[0.03] border-[#EBE0D3] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_2px_8px_rgba(45,31,35,0.04)]'
    : 'bg-slate-100/70 border-slate-200/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)]';

  // Desktop Navigation Link Styling
  const getNavLinkClass = (isActive) => `
    relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[13px] tracking-tight transition-all duration-200 select-none
    ${isActive
      ? isDark
        ? 'text-white bg-gradient-to-r from-[#AB526B] via-[#BD5A75] to-[#99445B] shadow-[0_2px_12px_rgba(171,82,107,0.45)] border border-white/20 font-semibold'
        : 'text-white bg-gradient-to-r from-[#AB526B] via-[#BD5A75] to-[#99445B] shadow-[0_2px_10px_rgba(171,82,107,0.3)] border border-white/20 font-semibold'
      : isDark
        ? 'text-slate-300 hover:text-white hover:bg-white/[0.08] font-medium'
        : isWarm
        ? 'text-[#2D1F23]/80 hover:text-[#2D1F23] hover:bg-black/[0.05] font-medium'
        : 'text-slate-600 hover:text-slate-900 hover:bg-black/[0.04] font-medium'
    }
  `;

  return (
    <nav className={`sticky top-0 z-50 w-full ${navBgClass} backdrop-blur-xl border-b transition-colors duration-300`}>
      {/* Top Specular Highlight Edge */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 dark:via-white/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <NavLink to="/oop" className="flex items-center gap-3 group shrink-0 select-none">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#AB526B] via-[#C9637E] to-[#8C3A50] flex items-center justify-center text-white font-mono font-bold text-sm shadow-[0_2px_10px_rgba(171,82,107,0.35)] border border-white/25 group-hover:scale-105 group-hover:shadow-[0_4px_16px_rgba(171,82,107,0.5)] transition-all duration-200">
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            &lt;/&gt;
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className={`text-[17px] font-black tracking-tight transition-colors duration-200 ${
                isDark ? 'text-white group-hover:text-rose-300' : 'text-slate-900 group-hover:text-[#AB526B]'
              }`}>
                Code Nova
              </span>
              <span className={`hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wide uppercase border ${
                isDark 
                  ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' 
                  : 'bg-rose-50 text-[#AB526B] border-rose-200'
              }`}>
                Studio
              </span>
            </div>
          </div>
        </NavLink>

        {/* Center: Desktop Floating Glass Capsule */}
        <div className={`hidden md:flex items-center ${capsuleBgClass} rounded-full p-1 border backdrop-blur-lg transition-colors duration-300`}>
          <NavLink
            to="/oop"
            className={getNavLinkClass(isOopVisualizerRoute)}
          >
            <Boxes 
              size={14} 
              className={isOopVisualizerRoute ? 'text-white' : 'text-[#AB526B] dark:text-[#E27D86]'} 
            />
            <span>OOP & Visualizers</span>
          </NavLink>

          <NavLink
            to="/visualizer/crypto"
            className={getNavLinkClass(isCryptoRoute)}
          >
            <Shield 
              size={14} 
              className={isCryptoRoute ? 'text-white' : 'text-[#38BDF8]'} 
            />
            <span>Cryptography</span>
          </NavLink>

          <NavLink
            to="/sandbox"
            className={getNavLinkClass(isSandboxRoute)}
          >
            <Terminal 
              size={14} 
              className={isSandboxRoute ? 'text-white' : 'text-[#10B981]'} 
            />
            <span>Sandbox</span>
          </NavLink>

          {/* Glass Separator */}
          <div className="w-px h-4 bg-slate-300/60 dark:bg-white/10 mx-1" />

          <NavLink
            to="/game"
            className={getNavLinkClass(isGameRoute)}
          >
            <Sparkles 
              size={14} 
              className={isGameRoute ? 'text-white' : 'text-[#F59E0B]'} 
            />
            <span>3D Game</span>
          </NavLink>
        </div>

        {/* Right Controls: Theme Toggle + Profile / Sign In + Mobile Menu Button */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* 3-Mode Theme Switcher Capsule */}
          <div className={`h-9 px-1 rounded-full flex items-center gap-0.5 backdrop-blur-md border ${
            isDark
              ? 'bg-white/[0.05] border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]'
              : isWarm
              ? 'bg-black/[0.03] border-[#EBE0D3] shadow-xs'
              : 'bg-slate-100/70 border-slate-200/80 shadow-xs'
          }`}>
            <button
              onClick={() => setTheme('light')}
              title="Light mode"
              aria-label="Light mode"
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                theme === 'light'
                  ? 'bg-white text-amber-500 shadow-sm border border-slate-200/70 scale-105'
                  : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-white/5'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-black/5'
              }`}
            >
              <Sun size={14} className={theme === 'light' ? 'stroke-[2.5]' : 'stroke-2'} />
            </button>
            <button
              onClick={() => setTheme('warm')}
              title="Warm Sepia mode"
              aria-label="Warm Sepia mode"
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                theme === 'warm'
                  ? 'bg-[#FAF7F2] text-amber-700 shadow-sm border border-[#EBE0D3] scale-105'
                  : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-white/5'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-black/5'
              }`}
            >
              <Circle size={13} className={`stroke-[2] ${theme === 'warm' ? 'fill-amber-400 stroke-amber-600' : 'fill-none'}`} />
            </button>
            <button
              onClick={() => setTheme('dark')}
              title="Warm Dark mode"
              aria-label="Warm Dark mode"
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-slate-800 text-sky-400 shadow-sm border border-white/15 scale-105'
                  : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-white/5'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-black/5'
              }`}
            >
              <Moon size={14} className={theme === 'dark' ? 'stroke-[2.5]' : 'stroke-2'} />
            </button>
          </div>

          {/* User Profile or Sign In Button */}
          {user ? (
            <div className={`h-9 pl-1.5 pr-2.5 rounded-full flex items-center gap-2 backdrop-blur-md border ${
              isDark
                ? 'bg-white/[0.05] border-white/10 shadow-xs'
                : isWarm
                ? 'bg-black/[0.03] border-[#EBE0D3] shadow-xs'
                : 'bg-slate-100/70 border-slate-200/80 shadow-xs'
            }`}>
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#AB526B] via-[#C9637E] to-[#F43F5E] flex items-center justify-center text-white text-[11px] font-bold shadow-xs shrink-0">
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className={`text-xs font-semibold max-w-[100px] truncate hidden sm:inline ${
                isDark ? 'text-slate-200' : 'text-slate-800'
              }`}>
                {user.username || 'Explorer'}
              </span>
              <button
                onClick={() => {
                  logout();
                  window.location.href = '/auth';
                }}
                className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-full hover:bg-rose-500/10 ml-0.5"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <NavLink 
              to="/auth" 
              className="h-9 px-4 rounded-full font-semibold text-xs text-white bg-gradient-to-r from-[#AB526B] via-[#BE5A75] to-[#99445B] hover:opacity-95 shadow-[0_2px_10px_rgba(171,82,107,0.35)] hover:shadow-[0_4px_14px_rgba(171,82,107,0.45)] border border-white/20 flex items-center gap-1.5 transition-all duration-200 active:scale-95 shrink-0"
            >
              <LogIn size={13} />
              <span>Sign In</span>
            </NavLink>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className={`md:hidden w-9 h-9 rounded-full flex items-center justify-center transition-colors border backdrop-blur-md shrink-0 ${
              mobileMenuOpen
                ? 'bg-rose-500/15 text-rose-500 border-rose-500/30'
                : isDark
                ? 'bg-white/[0.05] border-white/10 text-slate-300 hover:text-white'
                : isWarm
                ? 'bg-black/[0.03] border-[#EBE0D3] text-[#2D1F23]'
                : 'bg-slate-100/70 border-slate-200 text-slate-700'
            }`}
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

        </div>
      </div>

      {/* Responsive Mobile Glass Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className={`md:hidden border-b overflow-hidden backdrop-blur-2xl ${
              isDark
                ? 'bg-[#0B0F17]/95 border-white/10 shadow-2xl text-white'
                : isWarm
                ? 'bg-[#FAF7F2]/95 border-[#EBE0D3] shadow-2xl text-[#2D1F23]'
                : 'bg-white/95 border-slate-200 shadow-2xl text-slate-900'
            }`}
          >
            <div className="px-5 py-4 space-y-2">
              <NavLink
                to="/oop"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                  isOopVisualizerRoute
                    ? 'bg-gradient-to-r from-[#AB526B]/20 to-[#AB526B]/10 border border-[#AB526B]/30 font-semibold'
                    : isDark
                    ? 'hover:bg-white/5 border border-transparent text-slate-300'
                    : 'hover:bg-black/5 border border-transparent text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-[#AB526B]">
                    <Boxes size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">OOP & Visualizers</div>
                    <div className="text-[11px] opacity-70">Interactive pillars & 3D algorithms</div>
                  </div>
                </div>
                <ArrowRight size={14} className="opacity-60" />
              </NavLink>

              <NavLink
                to="/visualizer/crypto"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                  isCryptoRoute
                    ? 'bg-gradient-to-r from-sky-500/20 to-sky-500/10 border border-sky-500/30 font-semibold'
                    : isDark
                    ? 'hover:bg-white/5 border border-transparent text-slate-300'
                    : 'hover:bg-black/5 border border-transparent text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center text-sky-500">
                    <Shield size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Cryptography</div>
                    <div className="text-[11px] opacity-70">13 Ciphers, AES, RSA, & Enigma</div>
                  </div>
                </div>
                <ArrowRight size={14} className="opacity-60" />
              </NavLink>

              <NavLink
                to="/sandbox"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                  isSandboxRoute
                    ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 border border-emerald-500/30 font-semibold'
                    : isDark
                    ? 'hover:bg-white/5 border border-transparent text-slate-300'
                    : 'hover:bg-black/5 border border-transparent text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-500">
                    <Terminal size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Sandbox</div>
                    <div className="text-[11px] opacity-70">Multi-language code execution</div>
                  </div>
                </div>
                <ArrowRight size={14} className="opacity-60" />
              </NavLink>

              <NavLink
                to="/game"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                  isGameRoute
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/10 border border-amber-500/30 font-semibold'
                    : isDark
                    ? 'hover:bg-white/5 border border-transparent text-slate-300'
                    : 'hover:bg-black/5 border border-transparent text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-500">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">3D Game World</div>
                    <div className="text-[11px] opacity-70">Interactive algorithm quest terrain</div>
                  </div>
                </div>
                <ArrowRight size={14} className="opacity-60" />
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
