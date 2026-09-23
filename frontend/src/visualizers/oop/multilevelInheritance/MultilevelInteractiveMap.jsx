import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GitFork, ArrowDown, Sparkles, CheckCircle2, Shield, Info, Layers } from 'lucide-react';
import useAppStore from '../../../store/useAppStore';
import { MEMBER_ORIGIN_REGISTRY } from '../data/multilevelInheritanceData';

/**
 * MultilevelInteractiveMap - Interactive Inheritance Chain Map & Educational Architecture Panel
 * Renders the vertical inheritance chain with interactive member chips.
 * Hovering any member highlights its complete journey through the chain!
 */
export const MultilevelInteractiveMap = ({
  activeHoveredMember = null,
  onHoverMember,
}) => {
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  const [internalHover, setInternalHover] = useState(null);
  const activeMemberKey = activeHoveredMember?.id || internalHover;
  const activeMemberInfo = activeMemberKey ? MEMBER_ORIGIN_REGISTRY[activeMemberKey] : null;

  const handleChipEnter = (key) => {
    setInternalHover(key);
    if (onHoverMember) onHoverMember(MEMBER_ORIGIN_REGISTRY[key]);
  };

  const handleChipLeave = () => {
    setInternalHover(null);
    if (onHoverMember) onHoverMember(null);
  };

  // Card theme tokens
  const containerClass = isDark
    ? 'bg-[#090D17]/80 border-white/10 text-slate-200'
    : isWarm
    ? 'bg-[#FAF7F2] border-[#E2D5C5] text-[#2D1F23]'
    : 'bg-white border-slate-200 text-slate-800 shadow-md';

  return (
    <div className={`w-full max-w-7xl mx-auto my-6 p-5 sm:p-8 rounded-3xl border backdrop-blur-xl ${containerClass} transition-colors`}>
      {/* ── SECTION HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-500 border border-sky-500/30">
              <Layers size={16} />
            </div>
            <h3 className="font-mono text-base sm:text-lg font-black tracking-wide uppercase">
              How Multilevel Inheritance Works
            </h3>
          </div>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Each class inherits from the class immediately above it, forming a continuous linear chain.
          </p>
        </div>

        {/* Highlighted Insight Badge */}
        <div className={`px-4 py-2 rounded-2xl border font-mono text-xs font-bold flex items-center gap-2 ${
          isDark
            ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
            : isWarm
            ? 'bg-purple-100/60 border-purple-300 text-purple-900'
            : 'bg-purple-50 border-purple-200 text-purple-800 shadow-xs'
        }`}>
          <Sparkles size={14} className="text-purple-400 animate-pulse" />
          <span>Manager can access members inherited through Employee from Person!</span>
        </div>
      </div>

      {/* ── 2-COLUMN EDUCATIONAL WORKSPACE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-start">
        
        {/* ── LEFT: INTERACTIVE CHAIN MAP (7 COLS) ── */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full text-center mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Interactive Inheritance Map (Hover any member to illuminate its path)
            </span>
          </div>

          {/* ════ LEVEL 1: PERSON ════ */}
          <div className={`w-full max-w-md p-3.5 rounded-2xl border transition-all ${
            activeMemberInfo?.originallyDefinedIn === 'Person'
              ? 'ring-2 ring-sky-400 bg-sky-500/15 border-sky-400/60 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
              : isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-mono text-xs font-black text-sky-400 uppercase tracking-wider">
                LEVEL 1: Person (Base Class)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-bold border border-sky-500/30">
                Root Origin
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2.5">
              {['name', 'age', 'introduce'].map(key => {
                const isSelected = activeMemberKey === key;
                return (
                  <button
                    key={key}
                    onMouseEnter={() => handleChipEnter(key)}
                    onMouseLeave={handleChipLeave}
                    className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-sky-500 text-white border-sky-400 shadow-md scale-105'
                        : isDark
                        ? 'bg-white/5 hover:bg-sky-500/20 text-slate-300 border-white/10'
                        : 'bg-white hover:bg-sky-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    ● {key}{key === 'introduce' ? '()' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conduit 1: Person -> Employee */}
          <div className="flex flex-col items-center py-2">
            <div className={`w-0.5 h-6 transition-all duration-300 ${
              activeMemberInfo?.originallyDefinedIn === 'Person'
                ? 'bg-sky-400 shadow-[0_0_8px_#38BDF8] h-8'
                : 'bg-slate-500/40'
            }`} />
            <div className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${
              activeMemberInfo?.originallyDefinedIn === 'Person'
                ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                : isDark ? 'bg-white/5 border-white/10 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              extends Person ↓
            </div>
            <div className={`w-0.5 h-6 transition-all duration-300 ${
              activeMemberInfo?.originallyDefinedIn === 'Person'
                ? 'bg-sky-400 shadow-[0_0_8px_#38BDF8] h-8'
                : 'bg-slate-500/40'
            }`} />
          </div>

          {/* ════ LEVEL 2: EMPLOYEE ════ */}
          <div className={`w-full max-w-md p-3.5 rounded-2xl border transition-all ${
            activeMemberInfo?.originallyDefinedIn === 'Employee' || activeMemberInfo?.originallyDefinedIn === 'Person'
              ? 'ring-2 ring-indigo-400 bg-indigo-500/15 border-indigo-400/60 shadow-[0_0_20px_rgba(99,102,241,0.25)]'
              : isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-mono text-xs font-black text-indigo-400 uppercase tracking-wider">
                LEVEL 2: Employee extends Person
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/30">
                Intermediate
              </span>
            </div>

            <div className="space-y-2 pt-2.5">
              {/* Inherited from Person */}
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                <span>INHERITED FROM PERSON:</span>
                <span className="font-bold text-sky-400">name, age, introduce()</span>
              </div>

              {/* Own Members */}
              <div className="flex flex-wrap gap-1.5">
                {['employeeId', 'department', 'work'].map(key => {
                  const isSelected = activeMemberKey === key;
                  return (
                    <button
                      key={key}
                      onMouseEnter={() => handleChipEnter(key)}
                      onMouseLeave={handleChipLeave}
                      className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-400 shadow-md scale-105'
                          : isDark
                          ? 'bg-white/5 hover:bg-indigo-500/20 text-slate-300 border-white/10'
                          : 'bg-white hover:bg-indigo-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      ● {key}{key === 'work' ? '()' : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Conduit 2: Employee -> Manager */}
          <div className="flex flex-col items-center py-2">
            <div className={`w-0.5 h-6 transition-all duration-300 ${
              activeMemberInfo?.originallyDefinedIn === 'Person' || activeMemberInfo?.originallyDefinedIn === 'Employee'
                ? 'bg-purple-400 shadow-[0_0_8px_#C084FC] h-8'
                : 'bg-slate-500/40'
            }`} />
            <div className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${
              activeMemberInfo?.originallyDefinedIn === 'Person' || activeMemberInfo?.originallyDefinedIn === 'Employee'
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                : isDark ? 'bg-white/5 border-white/10 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              extends Employee ↓
            </div>
            <div className={`w-0.5 h-6 transition-all duration-300 ${
              activeMemberInfo?.originallyDefinedIn === 'Person' || activeMemberInfo?.originallyDefinedIn === 'Employee'
                ? 'bg-purple-400 shadow-[0_0_8px_#C084FC] h-8'
                : 'bg-slate-500/40'
            }`} />
          </div>

          {/* ════ LEVEL 3: MANAGER ════ */}
          <div className={`w-full max-w-md p-3.5 rounded-2xl border transition-all ${
            activeMemberInfo
              ? 'ring-2 ring-purple-400 bg-purple-500/15 border-purple-400/60 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
              : isDark ? 'bg-white/[0.03] border-white/10' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-mono text-xs font-black text-purple-400 uppercase tracking-wider">
                LEVEL 3: Manager extends Employee
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold border border-purple-500/30">
                Final Subclass
              </span>
            </div>

            <div className="space-y-2 pt-2.5">
              <div className="flex flex-col gap-1 text-[10px] font-mono text-slate-400">
                <div>
                  <span>VIA PERSON (2 LEVELS): </span>
                  <span className="font-bold text-sky-400">name, age, introduce()</span>
                </div>
                <div>
                  <span>VIA EMPLOYEE (1 LEVEL): </span>
                  <span className="font-bold text-indigo-400">employeeId, department, work()</span>
                </div>
              </div>

              {/* Own Members */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['teamSize', 'conductMeeting'].map(key => {
                  const isSelected = activeMemberKey === key;
                  return (
                    <button
                      key={key}
                      onMouseEnter={() => handleChipEnter(key)}
                      onMouseLeave={handleChipLeave}
                      className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-400 shadow-md scale-105'
                          : isDark
                          ? 'bg-white/5 hover:bg-purple-500/20 text-slate-300 border-white/10'
                          : 'bg-white hover:bg-purple-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      ● {key}{key === 'conductMeeting' ? '()' : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: LIVE MEMBER SOURCE INSPECTOR (5 COLS) ── */}
        <div className="lg:col-span-5">
          <div className={`p-5 rounded-2xl border ${
            isDark ? 'bg-[#080C16] border-white/10' : 'bg-slate-50 border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
              <Info size={16} className={isDark ? 'text-sky-400' : 'text-sky-600'} />
              <h4 className={`font-mono text-xs font-black uppercase tracking-wider ${
                isDark ? 'text-slate-200' : 'text-slate-900'
              }`}>
                Member Source Inspector
              </h4>
            </div>

            {activeMemberInfo ? (
              <div className="space-y-4 font-mono text-xs text-left">
                {/* Member Title */}
                <div>
                  <span className={`text-[10px] uppercase tracking-wider block ${
                    isDark ? 'text-slate-400' : 'text-slate-600 font-semibold'
                  }`}>Inspecting Member:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-base font-black ${
                      isDark ? 'text-amber-400' : 'text-amber-800'
                    }`}>
                      {activeMemberInfo.name}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      isDark ? 'bg-white/10 text-slate-200' : 'bg-slate-200 text-slate-800 border border-slate-300'
                    }`}>
                      {activeMemberInfo.dataType} {activeMemberInfo.kind}
                    </span>
                  </div>
                </div>

                {/* Origin */}
                <div className={`p-3 rounded-xl border ${
                  isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <span className={`text-[10px] uppercase tracking-wider block mb-1 ${
                    isDark ? 'text-slate-400' : 'text-slate-600 font-semibold'
                  }`}>
                    Originally Defined In:
                  </span>
                  <span className={`text-sm font-black ${
                    isDark ? 'text-emerald-400' : 'text-emerald-700'
                  }`}>
                    class {activeMemberInfo.originallyDefinedIn}
                  </span>
                </div>

                {/* Available In */}
                <div>
                  <span className={`text-[10px] uppercase tracking-wider block mb-1 ${
                    isDark ? 'text-slate-400' : 'text-slate-600 font-semibold'
                  }`}>
                    Available In Classes:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {activeMemberInfo.availableIn.map(cls => (
                      <span key={cls} className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        cls === activeMemberInfo.originallyDefinedIn
                          ? (isDark ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-emerald-100 text-emerald-900 border-emerald-300')
                          : (isDark ? 'bg-sky-500/20 text-sky-400 border-sky-500/40' : 'bg-sky-100 text-sky-900 border-sky-300')
                      }`}>
                        {cls} {cls === activeMemberInfo.originallyDefinedIn ? '(Origin)' : '(Inherited)'}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Complete Inheritance Path */}
                <div>
                  <span className={`text-[10px] uppercase tracking-wider block mb-1.5 ${
                    isDark ? 'text-slate-400' : 'text-slate-600 font-semibold'
                  }`}>
                    Inheritance Path:
                  </span>
                  <div className="space-y-1.5">
                    {activeMemberInfo.inheritancePath.map((hop, idx) => (
                      <div key={hop.class} className="flex items-center gap-2 text-[11px]">
                        <span className={`w-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{idx + 1}.</span>
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{hop.class}</span>
                        <ArrowDown size={11} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{hop.role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="pt-2 border-t border-white/10 dark:border-white/10 flex items-center justify-between text-[11px]">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Status:</span>
                  <span className={`font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-800'}`}>{activeMemberInfo.status}</span>
                </div>
              </div>
            ) : (
              <div className={`py-10 text-center font-mono text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <GitFork size={28} className="mx-auto mb-2 opacity-40 animate-pulse" />
                <p>Hover over any member pill (e.g. <span className={`font-bold ${isDark ? 'text-sky-400' : 'text-sky-700'}`}>name</span>, <span className={`font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`}>employeeId</span>, <span className={`font-bold ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>teamSize</span>) to inspect its complete origin and inheritance journey.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
