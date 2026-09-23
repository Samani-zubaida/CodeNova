import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useLocation, useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Box } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { OOP_CATALOG } from './data/oopCatalogData';
import { ConceptCard } from './components/catalog/ConceptCard';
import { OopSubNavbar } from './components/common/OopSubNavbar';
import InheritanceInPrepView from './inheritance/InheritanceInPrepView';

// Re-export OOP_CATALOG for backwards compatibility
export { OOP_CATALOG };

// Dynamic Code-Splitting for the 4 Full-Screen Visualizers
const EncapsulationVisualizer = lazy(() => import('./EncapsulationVisualizer'));
const AbstractionVisualizer = lazy(() => import('./AbstractionVisualizer'));
const InheritanceVisualizer = lazy(() => import('./InheritanceVisualizer'));
const SingleInheritanceVisualizer = lazy(() => import('./SingleInheritanceVisualizer'));
const PolymorphismVisualizer = lazy(() => import('./PolymorphismVisualizer'));

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

export default function OopHub({ defaultConcept, defaultType }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { type: paramType } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme } = useAppStore();

  const queryConcept = searchParams.get('concept');
  const initialConcept = defaultConcept || queryConcept || location.state?.concept;

  // View mode: 'catalog' (4 Cards Grid) vs 'studio' (Full-Screen Visualizer)
  const [viewMode, setViewMode] = useState(initialConcept ? 'studio' : 'catalog');
  const [activeConcept, setActiveConcept] = useState(initialConcept || 'encapsulation');

  // Sub-navbar dropdown for Inheritance
  const activeInheritanceType = paramType || defaultType || 'hierarchical';
  const [inheritanceDropdownOpen, setInheritanceDropdownOpen] = useState(false);

  const handleSelectInheritanceType = (itype) => {
    setInheritanceDropdownOpen(false);
    if (itype === 'hierarchical') {
      navigate('/oop/inheritance/hierarchical');
    } else {
      navigate(`/oop/inheritance/${itype}`);
    }
  };

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

  // ── STUDIO MODE: FULL-SCREEN VISUALIZER WITH UNIFIED SUB-NAVBAR ──
  if (viewMode === 'studio') {
    const isEncapsulation = activeConcept === 'encapsulation';

    return (
      <div className={`w-full h-full overflow-hidden flex flex-col ${
        isEncapsulation ? 'bg-[#080C16] text-[#FAF7F2]' : ''
      } font-sans relative transition-colors duration-300`}>
        {/* Unified, theme-aware sub-navbar */}
        <OopSubNavbar
          activeConcept={activeConcept}
          onSelectConcept={handleEnterCard}
          onReturnToCatalog={handleReturnToCatalog}
          activeInheritanceType={activeInheritanceType}
          onSelectInheritanceType={handleSelectInheritanceType}
          inheritanceDropdownOpen={inheritanceDropdownOpen}
          setInheritanceDropdownOpen={setInheritanceDropdownOpen}
        />

        {/* Studio Viewport Canvas */}
        <div className="w-full flex-1 relative overflow-y-auto overflow-x-hidden flex flex-col [scrollbar-width:thin] [scrollbar-color:rgba(56,189,248,0.35)_transparent]">
          <Suspense fallback={<OopLoadingFallback />}>
            {activeConcept === 'encapsulation' && (
              <EncapsulationVisualizer 
                isEmbedded={true}
                onNext={() => handleEnterCard('abstraction')}
                onReturnToCatalog={handleReturnToCatalog}
              />
            )}
            {activeConcept === 'abstraction' && (
              <AbstractionVisualizer isEmbedded={true} />
            )}
            {activeConcept === 'inheritance' && (
              activeInheritanceType === 'single' ? (
                <SingleInheritanceVisualizer 
                  isEmbedded={true}
                  onNext={() => handleEnterCard('polymorphism')}
                  onReturnToCatalog={handleReturnToCatalog}
                />
              ) : activeInheritanceType === 'hierarchical' ? (
                <InheritanceVisualizer 
                  isEmbedded={true}
                  onNext={() => handleEnterCard('polymorphism')}
                  onReturnToCatalog={handleReturnToCatalog}
                />
              ) : (
                <InheritanceInPrepView 
                  type={activeInheritanceType}
                  onSwitchType={(t) => handleSelectInheritanceType(t)}
                  onSwitchToHierarchical={() => handleSelectInheritanceType('hierarchical')}
                />
              )
            )}
            {activeConcept === 'polymorphism' && (
              <PolymorphismVisualizer isEmbedded={true} />
            )}
          </Suspense>
        </div>
      </div>
    );
  }

  // ── CATALOG MODE: 4 PILLARS DISCOVERY DASHBOARD ──
  return (
    <div className="w-full flex-1 flex flex-col font-sans relative overflow-x-hidden transition-colors duration-300">
      
      {/* Ambient Aurora Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[12%] -left-[8%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full blur-[150px] opacity-15 dark:opacity-20 bg-[#F43F5E]" />
        <div className="absolute -top-[10%] -right-[8%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full blur-[160px] opacity-15 dark:opacity-20 bg-[#10B981]" />
        <div className="absolute -bottom-[15%] -left-[10%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full blur-[170px] opacity-15 dark:opacity-20 bg-[#38BDF8]" />
        <div className="absolute -bottom-[12%] -right-[8%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full blur-[160px] opacity-15 dark:opacity-20 bg-[#F59E0B]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-1 flex flex-col justify-center">
        
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wide uppercase shadow-xs mb-4 bg-white/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-[#FAF7F2] backdrop-blur-md"
          >
            <Sparkles size={14} className="text-[#F43F5E] animate-pulse" />
            <span>Interactive OOP Universe &bull; Real-Time Studio</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white"
          >
            The 4 Core Pillars of <span className="bg-gradient-to-r from-[#F43F5E] via-[#38BDF8] to-[#10B981] bg-clip-text text-transparent">OOP</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 font-normal leading-relaxed"
          >
            Explore object-oriented architecture through hands-on, live-rendered laboratories.
            Click any pillar below to test private vaults, engine abstractions, class hierarchy trees, and dynamic role dispatch.
          </motion.p>
        </div>

        {/* 4 Pillars Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {OOP_CATALOG.map((item, idx) => (
            <ConceptCard
              key={item.id}
              item={item}
              index={idx}
              onEnter={handleEnterCard}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
