import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, Lock, Layers, Terminal,
  ArrowRight, Compass
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { OOP_CATALOG } from './data/oopCatalogData';
import { ConceptCard } from './components/catalog/ConceptCard';
import OopInfoWidget from './components/catalog/OopInfoWidget';
import Visualizer3DLibrary, { CATEGORIES, InnerView } from './components/Visualizer3DLibrary';

/**
 * OopOverview - The Unified OOP & Visualizer Discovery Universe (/oop)
 * Prioritizes the 4 Core Pillars of OOP front-and-center at the top of the viewport.
 * Introductory theory is housed inside a compact, accessible OOP Guide information widget.
 */
export default function OopOverview() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  // Derive initial tab/category from search params or location state
  const tabParam = searchParams.get('tab') || searchParams.get('view') || location.state?.activeTab;
  const initialCategory = (tabParam === 'ds' || tabParam === 'dsa')
    ? (CATEGORIES.find(c => c.id === 'dsa') || null)
    : (tabParam === 'crypto' || tabParam === 'cryptography')
    ? (CATEGORIES.find(c => c.id === 'crypto') || null)
    : null;

  // Mode: 'pillars' (default discovery grid) or '3d' (Three.js 3D Library canvas)
  const [viewMode, setViewMode] = useState(tabParam === '3d' ? '3d' : 'pillars');
  const [selectedCat, setSelectedCat] = useState(initialCategory);

  // Handle legacy query params concept redirection (e.g. /oop?concept=encapsulation)
  useEffect(() => {
    const concept = searchParams.get('concept');
    if (concept) {
      if (concept === 'inheritance') {
        navigate('/oop/inheritance/hierarchical', { replace: true });
      } else if (['encapsulation', 'abstraction', 'polymorphism'].includes(concept)) {
        navigate(`/oop/${concept}`, { replace: true });
      }
    }
  }, [searchParams, navigate]);

  const handleEnterCard = (conceptId) => {
    if (conceptId === 'inheritance') {
      navigate('/oop/inheritance/hierarchical');
    } else {
      navigate(`/oop/${conceptId}`);
    }
  };

  // If 3D view is active, render full-screen 3D library
  if (viewMode === '3d') {
    return (
      <div className="w-full flex-1 flex flex-col h-full min-h-[calc(100vh-64px)] relative">
        <Visualizer3DLibrary onExitToPillars={() => setViewMode('pillars')} />
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col font-sans relative overflow-x-hidden transition-colors duration-300">
      
      {/* Ambient Aurora Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[8%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full blur-[150px] opacity-15 dark:opacity-20 bg-[#F43F5E]" />
        <div className="absolute -top-[8%] -right-[8%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] rounded-full blur-[160px] opacity-15 dark:opacity-20 bg-[#10B981]" />
        <div className="absolute -bottom-[12%] -left-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full blur-[170px] opacity-15 dark:opacity-20 bg-[#38BDF8]" />
        <div className="absolute -bottom-[10%] -right-[8%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] rounded-full blur-[160px] opacity-15 dark:opacity-20 bg-[#F59E0B]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex-1 flex flex-col">
        
        {/* Top Control Bar: Compact OOP Info Widget on Left, Hub Navigation on Right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
          
          {/* Left: Compact OOP Guide Widget with Tooltip/Popover */}
          <div className="flex items-center gap-3">
            <OopInfoWidget />
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>4 Interactive Labs Online</span>
            </div>
          </div>

          {/* Right: Quick View Switcher & Category Hubs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 [scrollbar-width:none]">
            <button
              onClick={() => setViewMode('pillars')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 select-none shadow-xs ${
                viewMode === 'pillars'
                  ? 'bg-gradient-to-r from-[#AB526B] via-[#BD5A75] to-[#99445B] text-white shadow-[0_2px_10px_rgba(171,82,107,0.35)] border border-white/20'
                  : isDark
                  ? 'bg-white/[0.05] hover:bg-white/[0.09] text-slate-300 hover:text-white border border-white/10'
                  : isWarm
                  ? 'bg-black/[0.03] hover:bg-black/[0.06] text-[#2D1F23]/80 hover:text-[#2D1F23] border border-[#EBE0D3]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90'
              }`}
            >
              <span>🏛️ Pillars</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 font-mono">4</span>
            </button>

            <button
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 select-none ${
                isDark
                  ? 'bg-white/[0.05] hover:bg-white/[0.09] text-slate-300 hover:text-white border border-white/10 hover:border-amber-400/40'
                  : isWarm
                  ? 'bg-black/[0.03] hover:bg-black/[0.06] text-[#2D1F23]/80 hover:text-amber-800 border border-[#EBE0D3]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90'
              }`}
            >
              <Compass size={13} className="text-amber-500" />
              <span>3D Library</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono">3D</span>
            </button>

            <button
              onClick={() => {
                const dsa = CATEGORIES.find(c => c.id === 'dsa');
                if (dsa) setSelectedCat(dsa);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 select-none ${
                isDark
                  ? 'bg-white/[0.05] hover:bg-white/[0.09] text-slate-300 hover:text-white border border-white/10 hover:border-sky-400/40'
                  : isWarm
                  ? 'bg-black/[0.03] hover:bg-black/[0.06] text-[#2D1F23]/80 hover:text-sky-800 border border-[#EBE0D3]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90'
              }`}
            >
              <Layers size={13} className="text-sky-400" />
              <span>Data Structures</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-400 font-mono hidden md:inline-block">40+</span>
            </button>

            <button
              onClick={() => {
                const crypto = CATEGORIES.find(c => c.id === 'crypto');
                if (crypto) setSelectedCat(crypto);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 select-none ${
                isDark
                  ? 'bg-white/[0.05] hover:bg-white/[0.09] text-slate-300 hover:text-white border border-white/10 hover:border-rose-400/40'
                  : isWarm
                  ? 'bg-black/[0.03] hover:bg-black/[0.06] text-[#2D1F23]/80 hover:text-rose-800 border border-[#EBE0D3]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90'
              }`}
            >
              <Lock size={13} className="text-[#F43F5E]" />
              <span>Cryptography</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 font-mono hidden md:inline-block">13</span>
            </button>
          </div>
        </div>

        {/* ── 4 Core Concept Pillars (The Visual Centerpiece of /oop) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mb-12 items-stretch">
          {OOP_CATALOG.map((item, idx) => (
            <ConceptCard
              key={item.id}
              item={item}
              index={idx}
              onEnter={handleEnterCard}
            />
          ))}
        </div>

        {/* ── Integrated Visualizer Universe Showcase Section ── */}
        <div className="pt-8 sm:pt-10 border-t border-slate-200/70 dark:border-white/[0.08]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#AB526B] dark:text-rose-400 mb-1.5">
                <Box size={14} />
                <span>Integrated Visualizer Universe</span>
              </div>
              <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${
                isDark ? 'text-white' : isWarm ? 'text-[#2D1F23]' : 'text-slate-900'
              }`}>
                Explore Cross-Disciplinary Suites
              </h2>
              <p className={`text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed ${
                isDark ? 'text-slate-400' : isWarm ? 'text-[#2D1F23]/70' : 'text-slate-600'
              }`}>
                Access the full suite of computer science visualizers, algorithms, cryptographic engines, and the real-time 3D library without leaving /oop.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            
            {/* Card 1: 3D Interactive Library */}
            <motion.div
              whileHover={{ y: -4 }}
              className={`p-5 sm:p-6 rounded-3xl border flex flex-col justify-between transition-all backdrop-blur-md ${
                isDark 
                  ? 'bg-[#0E131F]/80 border-amber-500/20 hover:border-amber-500/50 shadow-lg' 
                  : isWarm
                  ? 'bg-[#FAF7F2]/90 border-[#EBE0D3] hover:border-amber-600/40 shadow-xs'
                  : 'bg-white border-slate-200/80 hover:border-amber-500/40 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold">
                    🌌
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    THREE.JS 3D
                  </span>
                </div>
                <h3 className={`text-base sm:text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Virtual 3D Library
                </h3>
                <p className={`text-xs leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Walk through the interactive 3D virtual library room with procedural books, realistic chandeliers, and dynamic camera navigation.
                </p>
              </div>
              <button
                onClick={() => setViewMode('3d')}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <span>Launch 3D Room</span>
                <ArrowRight size={13} />
              </button>
            </motion.div>

            {/* Card 2: Data Structures */}
            <motion.div
              whileHover={{ y: -4 }}
              className={`p-5 sm:p-6 rounded-3xl border flex flex-col justify-between transition-all backdrop-blur-md ${
                isDark 
                  ? 'bg-[#0E131F]/80 border-blue-500/20 hover:border-blue-500/50 shadow-lg' 
                  : isWarm
                  ? 'bg-[#FAF7F2]/90 border-[#EBE0D3] hover:border-blue-600/40 shadow-xs'
                  : 'bg-white border-slate-200/80 hover:border-blue-500/40 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-500 font-bold">
                    ⟨⟩
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    8 SUITES · 40+ ALGOS
                  </span>
                </div>
                <h3 className={`text-base sm:text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Data Structures & Algos
                </h3>
                <p className={`text-xs leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Full visualizer suites for Arrays, Linked Lists, Trees, Graphs, Stacks, Queues, Heaps, and Strings with step-by-step memory tracking.
                </p>
              </div>
              <button
                onClick={() => {
                  const dsa = CATEGORIES.find(c => c.id === 'dsa');
                  if (dsa) setSelectedCat(dsa);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <span>Explore 8 Suites</span>
                <ArrowRight size={13} />
              </button>
            </motion.div>

            {/* Card 3: Cryptography */}
            <motion.div
              whileHover={{ y: -4 }}
              className={`p-5 sm:p-6 rounded-3xl border flex flex-col justify-between transition-all backdrop-blur-md ${
                isDark 
                  ? 'bg-[#0E131F]/80 border-rose-500/20 hover:border-rose-500/50 shadow-lg' 
                  : isWarm
                  ? 'bg-[#FAF7F2]/90 border-[#EBE0D3] hover:border-rose-600/40 shadow-xs'
                  : 'bg-white border-slate-200/80 hover:border-rose-500/40 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 font-bold">
                    🔒
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    13 CIPHERS & PROTOCOLS
                  </span>
                </div>
                <h3 className={`text-base sm:text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Cryptography Studio
                </h3>
                <p className={`text-xs leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Live cryptographic engines: AES-256 Rijndael, RSA asymmetric factoring, Diffie-Hellman key exchange, SHA-256, and Enigma machine.
                </p>
              </div>
              <button
                onClick={() => {
                  const crypto = CATEGORIES.find(c => c.id === 'crypto');
                  if (crypto) setSelectedCat(crypto);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#AB526B] hover:bg-[#8B4255] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <span>Explore 13 Ciphers</span>
                <ArrowRight size={13} />
              </button>
            </motion.div>

            {/* Card 4: Code Studio & 3D Game */}
            <motion.div
              whileHover={{ y: -4 }}
              className={`p-5 sm:p-6 rounded-3xl border flex flex-col justify-between transition-all backdrop-blur-md ${
                isDark 
                  ? 'bg-[#0E131F]/80 border-emerald-500/20 hover:border-emerald-500/50 shadow-lg' 
                  : isWarm
                  ? 'bg-[#FAF7F2]/90 border-[#EBE0D3] hover:border-emerald-600/40 shadow-xs'
                  : 'bg-white border-slate-200/80 hover:border-emerald-500/40 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 font-bold">
                    💻
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    LIVE RUNNER & GAME
                  </span>
                </div>
                <h3 className={`text-base sm:text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Code Studio & Game
                </h3>
                <p className={`text-xs leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Compile and debug code in the interactive multi-language sandbox or embark on algorithm quests in the 3D terrain gameworld.
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/sandbox"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md text-center"
                >
                  <Terminal size={12} />
                  <span>Sandbox</span>
                </Link>
                <Link
                  to="/game"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md text-center"
                >
                  <span>3D Game</span>
                </Link>
              </div>
            </motion.div>

          </div>
        </div>

      </div>

      {/* Category Modal / Detail Drawer */}
      <AnimatePresence>
        {selectedCat && (
          <InnerView cat={selectedCat} onClose={() => setSelectedCat(null)} />
        )}
      </AnimatePresence>

    </div>
  );
}
