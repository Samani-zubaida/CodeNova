import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Lock, Shield, GitFork, RefreshCw, Sparkles, Box, 
  ArrowRight, LayoutGrid, MonitorPlay, ChevronRight
} from 'lucide-react';

// Dynamic Code-Splitting for the 4 Full-Screen Visualizers
const EncapsulationVisualizer = lazy(() => import('./EncapsulationVisualizer'));
const AbstractionVisualizer = lazy(() => import('./AbstractionVisualizer'));
const InheritanceVisualizer = lazy(() => import('./InheritanceVisualizer'));
const PolymorphismVisualizer = lazy(() => import('./PolymorphismVisualizer'));

const OopLoadingFallback = () => (
  <div className="w-full h-[600px] flex flex-col items-center justify-center gap-4 text-[#BCA297]">
    <div className="w-16 h-16 rounded-2xl bg-[#AB526B]/20 flex items-center justify-center text-[#F0E2A4] border border-[#AB526B]/40 animate-pulse">
      <Box size={32} className="animate-spin" style={{ animationDuration: '3s' }} />
    </div>
    <span className="text-xs font-mono font-bold tracking-widest text-[#F0E2A4] uppercase">
      Booting Visual Engine...
    </span>
  </div>
);

// 4 SVG GRAPHIC PREVIEWS FOR THE CARDS
const EncapsulationGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#331921" />
    <circle cx="50" cy="50" r="32" fill="#423834" stroke="#AB526B" strokeWidth="3" />
    <circle cx="50" cy="50" r="22" fill="#331921" stroke="#F0E2A4" strokeWidth="2" strokeDasharray="4 2" />
    <circle cx="50" cy="50" r="8" fill="#AB526B" />
  </svg>
);

const AbstractionGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#331921" />
    <circle cx="50" cy="40" r="24" fill="#423834" stroke="#C5CEAE" strokeWidth="3" />
    <line x1="50" y1="40" x2="68" y2="28" stroke="#AB526B" strokeWidth="3" strokeLinecap="round" />
    <line x1="20" y1="75" x2="80" y2="75" stroke="#5C4E49" strokeWidth="2" strokeDasharray="3 3" />
    <rect x="35" y="78" width="8" height="12" rx="2" fill="#BCA297" />
    <rect x="57" y="78" width="8" height="12" rx="2" fill="#BCA297" />
  </svg>
);

const InheritanceGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#331921" />
    <rect x="35" y="16" width="30" height="18" rx="6" fill="#423834" stroke="#BCA297" strokeWidth="2" />
    <line x1="50" y1="34" x2="50" y2="52" stroke="#C5CEAE" strokeWidth="2" />
    <rect x="35" y="52" width="30" height="18" rx="6" fill="#423834" stroke="#C5CEAE" strokeWidth="2" />
    <line x1="50" y1="70" x2="50" y2="82" stroke="#AB526B" strokeWidth="2" />
    <rect x="35" y="82" width="30" height="14" rx="4" fill="#AB526B" />
  </svg>
);

const PolymorphismGraphic = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="16" fill="#331921" />
    <circle cx="50" cy="30" r="14" fill="#423834" stroke="#F0E2A4" strokeWidth="2" />
    <path d="M38 44 L 24 64 M 50 44 L 50 64 M 62 44 L 76 64" stroke="#F0E2A4" strokeWidth="2" strokeLinecap="round" />
    <circle cx="24" cy="74" r="8" fill="#AB526B" />
    <rect x="44" y="68" width="12" height="12" rx="2" fill="#F0E2A4" />
    <polygon points="76,66 68,80 84,80" fill="#C5CEAE" />
  </svg>
);

export const OOP_CATALOG = [
  {
    id: 'encapsulation',
    name: 'Encapsulation',
    category: 'Information Hiding & Access Control',
    tag: 'Private Core & Shield Deflection',
    path: '/visualizer/encapsulation',
    graphic: <EncapsulationGraphic />,
    icon: Lock,
    color: '#AB526B'
  },
  {
    id: 'abstraction',
    name: 'Abstraction',
    category: 'Interface Separation',
    tag: 'Cockpit Controls vs 4-Piston Engine',
    path: '/visualizer/abstraction',
    graphic: <AbstractionGraphic />,
    icon: Shield,
    color: '#C5CEAE'
  },
  {
    id: 'inheritance',
    name: 'Inheritance',
    category: 'Hierarchical Reuse & super()',
    tag: 'RPG Evolution & Conduit Flow',
    path: '/visualizer/inheritance',
    graphic: <InheritanceGraphic />,
    icon: GitFork,
    color: '#BCA297'
  },
  {
    id: 'polymorphism',
    name: 'Polymorphism',
    category: 'Dynamic Dispatch & Overriding',
    tag: 'One Call -> Battle Arena Dispatch',
    path: '/visualizer/polymorphism',
    graphic: <PolymorphismGraphic />,
    icon: RefreshCw,
    color: '#F0E2A4'
  }
];

export default function OopHub({ defaultConcept }) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryConcept = searchParams.get('concept');
  const initialConcept = defaultConcept || queryConcept || location.state?.concept;

  // View mode: 'catalog' (4 Cards Grid) vs 'studio' (Full-Screen Visualizer)
  const [viewMode, setViewMode] = useState(initialConcept ? 'studio' : 'catalog');
  const [activeConcept, setActiveConcept] = useState(initialConcept || 'encapsulation');

  useEffect(() => {
    const target = defaultConcept || searchParams.get('concept') || location.state?.concept;
    if (target) {
      setActiveConcept(target);
      setViewMode('studio');
    }
  }, [defaultConcept, searchParams, location.state]);

  const handleEnterCard = (id) => {
    setActiveConcept(id);
    setViewMode('studio');
    setSearchParams({ concept: id });
  };

  const handleReturnToCatalog = () => {
    setViewMode('catalog');
    setSearchParams({});
  };

  const renderStudioVisualizer = () => {
    return (
      <Suspense fallback={<OopLoadingFallback />}>
        {activeConcept === 'encapsulation' && <EncapsulationVisualizer isEmbedded={true} />}
        {activeConcept === 'abstraction' && <AbstractionVisualizer isEmbedded={true} />}
        {activeConcept === 'inheritance' && <InheritanceVisualizer isEmbedded={true} />}
        {activeConcept === 'polymorphism' && <PolymorphismVisualizer isEmbedded={true} />}
      </Suspense>
    );
  };

  const activeItem = OOP_CATALOG.find(c => c.id === activeConcept) || OOP_CATALOG[0];

  return (
    <div className="w-full min-h-screen bg-[#331921] text-[#FAF7F2] flex flex-col font-sans selection:bg-[#AB526B] selection:text-white">
      
      {/* HEADER NAVBAR */}
      <header className="h-16 px-4 md:px-8 border-b border-[#5C4E49] bg-[#331921]/95 backdrop-blur-md flex items-center justify-between z-30 sticky top-0 shadow-lg">
        
        {/* Left: Navigation */}
        <div className="flex items-center gap-3">
          <Link 
            to="/visualizer" 
            className="flex items-center gap-2 text-xs font-bold text-[#BCA297] hover:text-[#FAF7F2] transition-colors px-3 py-1.5 rounded-xl hover:bg-[#423834] border border-transparent hover:border-[#5C4E49]"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Visualizers</span>
          </Link>
          <div className="h-5 w-px bg-[#5C4E49]" />

          {viewMode === 'studio' ? (
            <button
              onClick={handleReturnToCatalog}
              className="flex items-center gap-2 text-xs font-bold text-[#F0E2A4] hover:text-white transition-colors px-3 py-1.5 rounded-xl bg-[#423834] border border-[#5C4E49]"
            >
              <LayoutGrid size={14} />
              <span>← All 4 Pillars</span>
            </button>
          ) : (
            <span className="font-bold text-sm text-[#FAF7F2]">
              Code Nova &bull; 4 Pillars of OOP
            </span>
          )}
        </div>

        {/* Center: Pillar Pills in Studio View */}
        {viewMode === 'studio' && (
          <div className="hidden md:flex items-center gap-1.5 bg-[#423834] p-1.5 rounded-2xl border border-[#5C4E49]">
            {OOP_CATALOG.map((item) => {
              const IconComp = item.icon;
              const isActive = activeConcept === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleEnterCard(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#AB526B] text-white shadow-lg scale-105 border border-[#FAF7F2]/30'
                      : 'text-[#BCA297] hover:text-[#FAF7F2] hover:bg-[#331921]'
                  }`}
                >
                  <IconComp size={14} style={{ color: isActive ? '#FAF7F2' : item.color }} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Right: Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#423834] border border-[#5C4E49] text-xs font-mono text-[#F0E2A4]">
          <Sparkles size={13} className="text-[#AB526B] animate-pulse" />
          <span className="hidden sm:inline">Interactive Studio</span>
        </div>
      </header>

      {/* MAIN VIEW */}
      <main className="flex-1 flex flex-col items-center w-full">
        {viewMode === 'catalog' ? (
          /* ============================================================
             MODE 1: THE 4 CARDS CATALOG PAGE
             ============================================================ */
          <div className="p-6 md:p-12 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
            
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#AB526B]/20 text-[#AB526B] border border-[#AB526B]/40 inline-flex items-center gap-1.5 mb-3">
                <Sparkles size={13} /> Select a Pillar to Enter Visualization
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-[#FAF7F2] tracking-tight">
                The 4 Core Pillars of OOP
              </h1>
              <p className="text-sm text-[#BCA297] mt-2">
                Click any card to launch its spacious, real-time animated simulation playground equipped with a dedicated Play button!
              </p>
            </div>

            {/* 4 CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {OOP_CATALOG.map((item) => {
                const IconComp = item.icon;

                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleEnterCard(item.id)}
                    className="group cursor-pointer rounded-3xl p-5 bg-[#423834] border-2 border-[#5C4E49] hover:border-[#AB526B] shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                  >
                    <div>
                      {/* Animated Graphic Box */}
                      <div className="w-full h-36 rounded-2xl overflow-hidden mb-4 p-3 bg-[#331921] border border-[#5C4E49] group-hover:border-[#AB526B]/50 transition-colors">
                        {item.graphic}
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <div 
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${item.color}25`, border: `1px solid ${item.color}60` }}
                        >
                          <IconComp size={15} style={{ color: item.color }} />
                        </div>
                        <h3 className="font-bold text-lg text-[#FAF7F2] group-hover:text-[#F0E2A4] transition-colors">
                          {item.name}
                        </h3>
                      </div>

                      <div className="text-xs font-mono text-[#C5CEAE] mt-1 font-semibold">
                        {item.category}
                      </div>
                      <div className="text-[11px] font-mono text-[#BCA297] mt-0.5">
                        &bull; {item.tag}
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-[#5C4E49] flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F0E2A4] group-hover:underline flex items-center gap-1">
                        Enter Visualization
                      </span>
                      <ArrowRight size={16} className="text-[#AB526B] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        ) : (
          /* ============================================================
             MODE 2: FULL-SCREEN ANIMATED VISUALIZER STUDIO
             ============================================================ */
          <div className="w-full flex-1 flex flex-col p-4 md:p-6 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeConcept}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full flex-1 flex flex-col"
              >
                {renderStudioVisualizer()}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </main>

    </div>
  );
}
