import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Sparkles, Shield, User, Layers, ArrowUpRight, Info, Check, Plus, RefreshCw, X } from 'lucide-react';
import { MemberBadge } from './MemberBadge';
import { PersonCharacter, Child1Character, Child2Character } from './HumanCharacters';
import useAppStore from '../../../store/useAppStore';

export const ClassNodeCard = ({
  classData,
  isHovered = false,
  isDimmed = false,
  isSelected = false,
  onMouseEnter,
  onMouseLeave,
  onSelectNode,
  onOpenCode,
  isInheritanceActive = true,
  highlightedMembers = [],
}) => {
  const { theme } = useAppStore();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  const { id, name, role, extendsClass, badge, properties = [], methods = [], ownProperties = [], ownMethods = [], overriddenProperties = [] } = classData;
  const isParent = role === 'parent';
  const nodeId = isParent ? 'node-parent' : id === 'child1' || id === 'student' ? 'node-child1' : 'node-child2';

  // Semantic Color Palette
  const accentTheme = isParent
    ? {
        border: isSelected ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-amber-500/40 hover:border-amber-400',
        badge: isDark ? 'bg-amber-500/15 text-amber-300 border-amber-500/35' : isWarm ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-amber-50 text-amber-800 border-amber-300',
        glow: 'shadow-[0_0_35px_rgba(245,158,11,0.25)]',
        headerGrad: 'from-amber-500/20 via-orange-500/5 to-transparent',
        tagText: 'BASE CLASS',
        accentColor: '#F59E0B',
      }
    : id === 'child1' || id === 'student'
    ? {
        border: isSelected ? 'border-emerald-400 ring-2 ring-emerald-400/50' : 'border-emerald-500/40 hover:border-emerald-400',
        badge: isDark ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35' : isWarm ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-emerald-50 text-emerald-800 border-emerald-300',
        glow: 'shadow-[0_0_35px_rgba(16,185,129,0.25)]',
        headerGrad: 'from-emerald-500/20 via-teal-500/5 to-transparent',
        tagText: 'SUBCLASS 1',
        accentColor: '#10B981',
      }
    : {
        border: isSelected ? 'border-indigo-400 ring-2 ring-indigo-400/50' : 'border-indigo-500/40 hover:border-indigo-400',
        badge: isDark ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/35' : isWarm ? 'bg-indigo-100 text-indigo-900 border-indigo-300' : 'bg-indigo-50 text-indigo-800 border-indigo-300',
        glow: 'shadow-[0_0_35px_rgba(99,102,241,0.25)]',
        headerGrad: 'from-indigo-500/20 via-blue-500/5 to-transparent',
        tagText: 'SUBCLASS 2',
        accentColor: '#6366F1',
      };

  const cardBgClass = isDark
    ? 'bg-[#090D17]/90 text-white'
    : isWarm
    ? 'bg-[#FAF7F2]/95 border-[#EBE0D3] text-[#2D1F23]'
    : 'bg-white/95 border-slate-200/90 text-slate-900';

  return (
    <motion.div
      id={nodeId}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => {
        if (onSelectNode) onSelectNode(id);
      }}
      animate={{
        scale: isHovered || isSelected ? 1.018 : 1,
        opacity: isDimmed ? 0.4 : 1,
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`relative z-20 w-full max-w-[360px] sm:max-w-[390px] rounded-3xl border backdrop-blur-xl p-4 sm:p-4.5 flex flex-col gap-3 transition-all duration-300 shadow-xl cursor-pointer ${
        cardBgClass
      } ${
        accentTheme.border
      } ${isHovered || isSelected ? accentTheme.glow : ''}`}
    >
      {/* Top Ambient Glow Sheen */}
      <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${accentTheme.headerGrad} rounded-t-3xl pointer-events-none`} />

      {/* Card Header: Character + Class Signature */}
      <div className="flex items-center gap-3 relative z-10">
        {/* Semi-realistic 2.5D Human Character Avatar */}
        <div className="shrink-0 flex items-center justify-center">
          {isParent && <PersonCharacter isHovered={isHovered || isSelected} isDimmed={isDimmed} />}
          {(id === 'child1' || id === 'student') && <Child1Character isHovered={isHovered || isSelected} isDimmed={isDimmed} />}
          {(id === 'child2' || id === 'employee') && <Child2Character isHovered={isHovered || isSelected} isDimmed={isDimmed} />}
        </div>

        {/* Class Signature & Badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-black uppercase border tracking-wider ${accentTheme.badge}`}>
              {badge || accentTheme.tagText}
            </span>
            {extendsClass && (
              <span className="font-mono text-[10.5px] text-slate-400">
                extends <span className="font-bold text-amber-400">{extendsClass}</span>
              </span>
            )}
          </div>

          <h3 className={`font-mono text-base sm:text-lg font-extrabold tracking-wide truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
            class {name}
          </h3>

          <p className={`text-[10.5px] leading-snug mt-0.5 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {classData.description}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className={`w-full h-px relative z-10 ${isDark ? 'bg-white/10' : isWarm ? 'bg-[#EBE0D3]' : 'bg-slate-200'}`} />

      {/* Members Section */}
      <div className="flex flex-col gap-2.5 relative z-10 text-xs font-mono">
        
        {/* 1. Superclass Root Members (For Parent: Person) */}
        {isParent && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-amber-400 px-1">
              <span className="uppercase tracking-wider">Base Properties & Behaviors</span>
              <span className="text-[9px] text-slate-400 font-normal">Inherited by Child1 & Child2</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {properties.map((prop) => (
                <MemberBadge
                  key={prop.name}
                  name={prop.name}
                  dataType={prop.dataType}
                  value={prop.value}
                  type="property"
                  isInherited={false}
                  isHighlighted={highlightedMembers.includes(prop.name)}
                />
              ))}
              {methods.map((method) => (
                <MemberBadge
                  key={method.name}
                  name={method.name}
                  type="method"
                  isInherited={false}
                  isHighlighted={highlightedMembers.includes(method.name)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 2. Inherited Members (Only for Subclasses: Child1 & Child2) */}
        {!isParent && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-sky-400 px-1">
              <span className="flex items-center gap-1 uppercase tracking-wider">
                <Shield size={11} className="text-sky-400" />
                Inherited from {extendsClass || 'Person'}
              </span>
              <span className="text-[9px] text-slate-400 font-normal">
                {isInheritanceActive ? '✓ active' : 'awaiting...'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {properties.map((prop) => (
                <MemberBadge
                  key={prop.name}
                  name={prop.name}
                  dataType={prop.dataType}
                  value={prop.value}
                  type="property"
                  isInherited={true}
                  isHighlighted={highlightedMembers.includes(prop.name)}
                />
              ))}
              {methods.map((method) => (
                <MemberBadge
                  key={method.name}
                  name={method.name}
                  type="method"
                  isInherited={true}
                  isHighlighted={highlightedMembers.includes(method.name)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 3. Own Specialized & Overridden Members (Subclasses) */}
        {!isParent && (ownProperties?.length > 0 || ownMethods?.length > 0 || overriddenProperties?.length > 0) && (
          <div className="flex flex-col gap-1.5 pt-1.5 border-t border-white/5">
            <div className="flex items-center justify-between text-[10px] font-bold px-1">
              <span className="flex items-center gap-1 uppercase tracking-wider text-purple-400">
                <Sparkles size={11} className="text-purple-400" />
                Specializations & Overrides
              </span>
              <span className="text-[9px] text-amber-400 font-normal">subclass traits</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {/* Overridden properties (e.g. Child1 hairColor = "black") */}
              {overriddenProperties?.map((prop) => (
                <MemberBadge
                  key={prop.name}
                  name={prop.name}
                  dataType={prop.dataType}
                  value={prop.value}
                  type="property"
                  isOverridden={true}
                  isHighlighted={highlightedMembers.includes(prop.name)}
                />
              ))}
              {/* Own unique properties (e.g. Child2 skinTone = "fair", eyeColor = "blue") */}
              {ownProperties?.map((prop) => (
                <MemberBadge
                  key={prop.name}
                  name={prop.name}
                  dataType={prop.dataType}
                  value={prop.value}
                  type="property"
                  isInherited={false}
                  isHighlighted={highlightedMembers.includes(prop.name)}
                />
              ))}
              {ownMethods?.map((method) => (
                <MemberBadge
                  key={method.name}
                  name={method.name}
                  type="method"
                  isInherited={false}
                  isHighlighted={highlightedMembers.includes(method.name)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Action Button: View Java Code */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenCode(name);
        }}
        className={`mt-1.5 w-full py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-mono text-[11px] font-bold transition-all active:scale-95 cursor-pointer shadow-xs ${
          isDark
            ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-amber-500/40 text-slate-300 hover:text-white'
            : isWarm
            ? 'bg-[#EBE0D3]/50 hover:bg-[#EBE0D3] border-[#D9CAB9] text-[#2D1F23]'
            : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
        }`}
      >
        <Code2 size={13} className="text-amber-500" />
        <span>View {name}.java</span>
        <ArrowUpRight size={11} className={isDark ? 'text-slate-500 group-hover:text-amber-400' : 'text-slate-400'} />
      </button>
    </motion.div>
  );
};
