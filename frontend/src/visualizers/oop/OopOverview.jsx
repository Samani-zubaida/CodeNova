import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { OOP_CATALOG } from './data/oopCatalogData';
import { ConceptCard } from './components/catalog/ConceptCard';

/**
 * OopOverview - The OOP Discovery Landing Page (/oop)
 * Displays the 4 Core Pillars of OOP with live cards that link to each visualizer.
 */
export default function OopOverview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  // Handle legacy query params like /oop?concept=encapsulation
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
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wide uppercase shadow-xs mb-4 backdrop-blur-md border ${
              isDark 
                ? 'bg-slate-800/80 border-white/10 text-[#FAF7F2]' 
                : isWarm
                ? 'bg-[#FAF7F2]/90 border-[#EBE0D3] text-[#2D1F23]'
                : 'bg-white/80 border-slate-200 text-slate-800'
            }`}
          >
            <Sparkles size={14} className="text-[#F43F5E] animate-pulse" />
            <span>Interactive OOP Universe &bull; Real-Time Studio</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight ${
              isDark ? 'text-white' : isWarm ? 'text-[#2D1F23]' : 'text-slate-900'
            }`}
          >
            The 4 Core Pillars of <span className="bg-gradient-to-r from-[#F43F5E] via-[#38BDF8] to-[#10B981] bg-clip-text text-transparent">OOP</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-sm sm:text-base mt-3 font-normal leading-relaxed ${
              isDark ? 'text-slate-300' : isWarm ? 'text-[#2D1F23]/80' : 'text-slate-600'
            }`}
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
