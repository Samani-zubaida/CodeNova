import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Boxes, LayoutGrid, Shield, Lock, GitFork, RefreshCw, 
  ChevronDown, Check, Sparkles
} from 'lucide-react';
import useAppStore from '../../../../store/useAppStore';
import { INHERITANCE_DROPDOWN_ITEMS } from '../../data/inheritanceData';

const OOP_NAV_ITEMS = [
  { id: 'overview', name: 'Overview', path: '/oop', icon: LayoutGrid },
  { id: 'abstraction', name: 'Abstraction', path: '/oop/abstraction', icon: Shield },
  { id: 'encapsulation', name: 'Encapsulation', path: '/oop/encapsulation', icon: Lock },
  { id: 'inheritance', name: 'Inheritance', path: '/oop/inheritance', icon: GitFork, hasDropdown: true },
  { id: 'polymorphism', name: 'Polymorphism', path: '/oop/polymorphism', icon: RefreshCw },
];

/**
 * OopSubNavbar - Dedicated OOP Navigation Bar
 * Handles routing between OOP pillars and visualizers.
 * Does NOT contain any theme switchers (the global Navbar is the single source of truth).
 * Consumes global theme to style its own surface, borders, and text.
 */
export const OopSubNavbar = ({
  // Optional prop overrides for backwards compatibility
  activeConcept: propConcept,
  onSelectConcept,
  activeInheritanceType: propInheritanceType,
  onSelectInheritanceType,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine active concept from current route
  const currentPath = location.pathname.toLowerCase();
  let currentActiveConcept = 'overview';
  if (currentPath.includes('/abstraction')) {
    currentActiveConcept = 'abstraction';
  } else if (currentPath.includes('/encapsulation')) {
    currentActiveConcept = 'encapsulation';
  } else if (currentPath.includes('/inheritance')) {
    currentActiveConcept = 'inheritance';
  } else if (currentPath.includes('/polymorphism')) {
    currentActiveConcept = 'polymorphism';
  } else if (propConcept) {
    currentActiveConcept = propConcept;
  }

  // Determine active inheritance subtype
  let currentInheritanceType = propInheritanceType || 'hierarchical';
  if (currentPath.includes('/inheritance/single')) {
    currentInheritanceType = 'single';
  } else if (currentPath.includes('/inheritance/hierarchical')) {
    currentInheritanceType = 'hierarchical';
  } else if (currentPath.includes('/inheritance/multilevel')) {
    currentInheritanceType = 'multilevel';
  } else if (currentPath.includes('/inheritance/multiple')) {
    currentInheritanceType = 'multiple';
  } else if (currentPath.includes('/inheritance/hybrid')) {
    currentInheritanceType = 'hybrid';
  }

  // Handle navigation click
  const handleNavClick = (item) => {
    if (item.hasDropdown) {
      // Toggle dropdown menu
      setDropdownOpen(prev => !prev);
      if (currentActiveConcept !== 'inheritance') {
        if (onSelectConcept) {
          onSelectConcept('inheritance');
        } else {
          navigate('/oop/inheritance/hierarchical');
        }
      }
    } else {
      setDropdownOpen(false);
      if (onSelectConcept) {
        onSelectConcept(item.id);
      } else {
        navigate(item.path);
      }
    }
  };

  // Handle selection inside inheritance dropdown
  const handleSelectSubtype = (subType) => {
    setDropdownOpen(false);
    if (onSelectInheritanceType) {
      onSelectInheritanceType(subType.id);
    } else {
      navigate(`/oop/inheritance/${subType.id}`);
    }
  };

  // Dynamic Theme Styles
  const navSurfaceClass = isDark
    ? 'bg-[#080C16]/90 border-white/10 text-slate-200'
    : isWarm
    ? 'bg-[#FDFBF7]/95 border-[#EBE0D3] text-[#2D1F23]'
    : 'bg-white/95 border-slate-200 text-slate-800 shadow-sm';

  const pillContainerClass = isDark
    ? 'bg-white/[0.04] border-white/10'
    : isWarm
    ? 'bg-[#FAF7F2] border-[#EBE0D3]'
    : 'bg-slate-100 border-slate-200';

  const brandPillClass = isDark
    ? 'bg-rose-500/15 border-rose-500/30 text-rose-400 group-hover:bg-rose-500/25'
    : isWarm
    ? 'bg-[#AB526B]/15 border-[#AB526B]/30 text-[#AB526B] group-hover:bg-[#AB526B]/25'
    : 'bg-rose-50 border-rose-200 text-rose-600 group-hover:bg-rose-100';

  return (
    <header className={`w-full px-4 sm:px-8 py-2.5 backdrop-blur-xl border-b flex items-center justify-between z-40 shrink-0 transition-colors duration-300 ${navSurfaceClass}`}>
      
      {/* ── LEFT: OOP BRAND INDICATOR ── */}
      <Link 
        to="/oop" 
        className="flex items-center gap-2 group cursor-pointer select-none"
        title="Code Nova Object-Oriented Programming"
      >
        <div className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black tracking-wider uppercase flex items-center gap-1.5 border transition-all ${brandPillClass}`}>
          <Boxes size={14} className="group-hover:rotate-12 transition-transform" />
          <span>OOP</span>
        </div>
      </Link>

      {/* ── CENTER: OOP NAVIGATION TABS ── */}
      <div className={`flex items-center gap-1 sm:gap-1.5 p-1 rounded-2xl border backdrop-blur-md transition-colors duration-300 ${pillContainerClass}`}>
        {OOP_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentActiveConcept === item.id;

          // Theme-aware active & hover styling for tabs
          let tabStyle = '';
          if (isActive) {
            if (isDark) {
              tabStyle = item.id === 'encapsulation'
                ? 'bg-rose-500/20 text-white border border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.35)]'
                : 'bg-sky-500/20 text-white border border-sky-500/60 shadow-[0_0_15px_rgba(56,189,248,0.35)]';
            } else if (isWarm) {
              tabStyle = 'bg-sky-600 text-white border border-sky-700 shadow-sm';
            } else {
              tabStyle = 'bg-sky-500 text-white border border-sky-600 shadow-md shadow-sky-500/25';
            }
          } else {
            if (isDark) {
              tabStyle = 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent';
            } else if (isWarm) {
              tabStyle = 'text-[#2D1F23]/70 hover:text-[#2D1F23] hover:bg-black/5 border border-transparent';
            } else {
              tabStyle = 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-transparent';
            }
          }

          // Dropdown Item: Inheritance
          if (item.hasDropdown) {
            return (
              <div key={item.id} className="relative" ref={dropdownRef}>
                <button
                  onClick={() => handleNavClick(item)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${tabStyle}`}
                >
                  <Icon size={13} className={isActive ? (isDark ? 'text-sky-400' : 'text-white') : 'text-slate-500'} />
                  <span className="hidden sm:inline">{item.name}</span>
                  <span className="sm:hidden">{item.name.slice(0, 4)}</span>
                  <ChevronDown 
                    size={12} 
                    className={`ml-0.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-amber-400' : 'opacity-70'}`} 
                  />
                </button>

                {/* Popover Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className={`absolute top-full mt-2 -left-12 sm:left-0 w-72 sm:w-80 rounded-2xl border backdrop-blur-2xl shadow-2xl z-50 p-2 text-left ${
                        isDark 
                          ? 'bg-[#090D17]/95 border-white/15' 
                          : isWarm 
                          ? 'bg-[#FAF7F2]/98 border-[#D9CAB9]' 
                          : 'bg-white/98 border-slate-200'
                      }`}
                    >
                      <div className={`px-3 py-2 border-b mb-1 flex items-center justify-between text-[10px] font-mono ${
                        isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
                      }`}>
                        <span className="font-bold tracking-wider uppercase">INHERITANCE TYPES (5 ARCHETYPES)</span>
                        <span className="text-emerald-500 font-bold">3 Active</span>
                      </div>

                      <div className="flex flex-col gap-1">
                        {INHERITANCE_DROPDOWN_ITEMS.map((subType) => {
                          const isSelected = currentInheritanceType === subType.id;
                          const isActiveLab = subType.status && subType.status.includes('Active');

                          return (
                            <button
                              key={subType.id}
                              onClick={() => handleSelectSubtype(subType)}
                              className={`w-full p-2.5 rounded-xl flex items-center justify-between gap-2 text-left font-mono transition-all cursor-pointer ${
                                isSelected
                                  ? isDark 
                                    ? 'bg-sky-500/20 text-white border border-sky-500/40 shadow-xs' 
                                    : 'bg-sky-50 text-sky-950 border border-sky-300 shadow-xs'
                                  : isDark
                                  ? 'hover:bg-white/5 text-slate-300 border border-transparent'
                                  : 'hover:bg-slate-100 text-slate-800 border border-transparent'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`p-1.5 rounded-lg shrink-0 ${
                                  isSelected 
                                    ? 'bg-sky-500 text-white' 
                                    : isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  <GitFork size={12} />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold truncate flex items-center gap-1.5">
                                    <span>{subType.name}</span>
                                    {isSelected && <Check size={11} className="text-emerald-400 shrink-0" />}
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate">
                                    {subType.subtitle}
                                  </div>
                                </div>
                              </div>

                              <span className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                                isActiveLab
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/35'
                                  : isDark
                                  ? 'bg-white/5 text-slate-400 border-white/10'
                                  : 'bg-slate-100 text-slate-500 border-slate-200'
                              }`}>
                                {subType.status}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className={`mt-2 pt-2 border-t px-2 text-[10px] font-mono text-center ${
                        isDark ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-400'
                      }`}>
                        <span>Single, Multilevel & Hierarchical are live interactive laboratories</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          // Standard Tab Button
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${tabStyle}`}
            >
              <Icon size={13} className={isActive ? (isDark ? (item.id === 'encapsulation' ? 'text-rose-400' : 'text-sky-400') : 'text-white') : 'text-slate-500'} />
              <span className="hidden sm:inline">{item.name}</span>
              <span className="sm:hidden">{item.name.slice(0, 4)}</span>
            </button>
          );
        })}
      </div>

      {/* ── RIGHT: SUBTLE INTERACTIVE STATUS TAG (NO THEME CHANGER) ── */}
      <div className="flex items-center gap-2">
        <div className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-mono ${
          isDark 
            ? 'bg-sky-500/10 border-sky-500/25 text-sky-400'
            : isWarm
            ? 'bg-sky-100/60 border-sky-300/50 text-sky-700'
            : 'bg-sky-50 border-sky-200 text-sky-700'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse shadow-[0_0_8px_#0284C7]" />
          <span className="font-bold">Interactive Lab</span>
        </div>
      </div>

    </header>
  );
};
