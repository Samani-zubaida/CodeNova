import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Play, Activity } from 'lucide-react';
import VisualizerNav from '../../components/layout/VisualizerNav';
import { POLYMORPHIC_ROLES } from './data/polymorphismData';

export default function PolymorphismVisualizer({ isEmbedded = false }) {
  const [activeRole, setActiveRole] = useState('developer'); // 'developer' | 'parent' | 'athlete' | 'musician'
  const [activePulse, setActivePulse] = useState(null);
  const [logMessage, setLogMessage] = useState("Polymorphism: 1 Person connected to 4 Subclass Forms in 1 line. Click any form to trigger performRole()!");

  const handleExecuteRole = async (roleId) => {
    if (activePulse) return;
    setActiveRole(roleId);
    setActivePulse(roleId);

    const targetRole = POLYMORPHIC_ROLES.find(r => r.id === roleId);
    setLogMessage(`⚡ DYNAMIC DISPATCH: Calling alex.performRole() -> Flowing down connection to ${targetRole.title}...`);

    await new Promise(r => setTimeout(r, 1500));

    setLogMessage(`✅ EXECUTED: ${targetRole.title} performed "${targetRole.task}"!`);
    setActivePulse(null);
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-between text-slate-800 dark:text-slate-100 font-sans select-none space-y-3">
      {!isEmbedded && <VisualizerNav title="Polymorphism: Person & 4 Connected Forms" />}

      {/* TOP HEADER */}
      <div className="w-full max-w-6xl bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-amber-500/20 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 font-extrabold shadow-sm">
            <User size={26} />
          </div>
          <div>
            <h3 className="text-base font-mono font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              POLYMORPHISM: 1 PERSON CONNECTED TO 4 FORMS
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              One Base Identity (<span className="text-amber-600 dark:text-amber-400 font-bold">Person alex</span>) connected to 4 Subclass Forms in 1 single line.
            </p>
          </div>
        </div>

        {/* Global Dispatch Button */}
        <button
          onClick={() => handleExecuteRole(activeRole)}
          disabled={!!activePulse}
          className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-mono text-xs font-black shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2 disabled:opacity-40 hover:scale-105"
        >
          <Play size={18} />
          <span>RUN alex.performRole()</span>
        </button>
      </div>

      {/* TELEMETRY LOG BANNER */}
      <div className="w-full max-w-6xl py-3 px-6 rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 text-center font-mono text-xs md:text-sm font-bold shadow-md text-slate-800 dark:text-slate-200 flex items-center justify-center gap-3">
        <Activity size={18} className="text-amber-500 animate-pulse" />
        <span className="text-slate-700 dark:text-amber-300">{logMessage}</span>
      </div>

      {/* MAIN CONNECTED TREE CANVAS */}
      <div className="w-full max-w-6xl bg-slate-950/95 dark:bg-[#070A11] border border-slate-200/80 dark:border-amber-500/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex-1 flex flex-col items-center justify-between min-h-[480px]">
        
        {/* 1. TOP SINGLE PERSON NODE */}
        <motion.div 
          animate={{ scale: activePulse ? 1.05 : 1 }}
          className="p-5 rounded-3xl bg-slate-900/90 border-2 border-amber-400 shadow-2xl font-mono text-center z-10 w-80 relative"
        >
          <div className="text-4xl mb-1">👤</div>
          <div className="text-base font-extrabold text-amber-300">Person alex</div>
          <div className="text-xs text-slate-400">Base Reference Type</div>
          <div className="mt-2 px-3 py-1 rounded-full bg-slate-800 text-[10px] text-amber-300 font-bold border border-slate-700">
            Method Signature: performRole()
          </div>
        </motion.div>

        {/* CONNECTING SVG ARROWS NETWORK */}
        <div className="w-full flex justify-center items-center my-2 relative z-0">
          <div className="w-full max-w-4xl h-12 flex justify-between items-center relative">
            {/* Horizontal Line */}
            <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-slate-700 -translate-y-1/2" />
            {/* Vertical Stem */}
            <div className="absolute top-0 bottom-1/2 left-1/2 w-0.5 bg-slate-700 -translate-x-1/2" />

            {/* Glowing Connector Pulses */}
            {POLYMORPHIC_ROLES.map(r => (
              <div key={r.id} className="flex-1 flex justify-center relative">
                <div className={`w-0.5 h-6 transition-all ${activePulse === r.id ? 'bg-amber-400 shadow-[0_0_15px_#F59E0B]' : 'bg-slate-700'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* 2. SINGLE HORIZONTAL LINE OF 4 FORMS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full z-10">
          {POLYMORPHIC_ROLES.map(role => {
            const isSelected = activeRole === role.id;
            const isPulsing = activePulse === role.id;

            return (
              <motion.div
                key={role.id}
                animate={{ 
                  scale: isPulsing ? 1.06 : isSelected ? 1.02 : 1,
                  y: isPulsing ? -6 : 0
                }}
                className={`p-4 rounded-3xl bg-slate-900/90 border-2 shadow-2xl font-mono flex flex-col justify-between text-center space-y-3 transition-all relative ${
                  isPulsing 
                    ? 'shadow-[0_0_40px_rgba(245,158,11,0.5)]' 
                    : isSelected 
                    ? 'shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                    : ''
                }`}
                style={{ borderColor: role.color }}
              >
                <div>
                  <div className="text-5xl mb-2">{role.emoji}</div>
                  <h4 className="text-sm font-extrabold text-white">{role.title}</h4>
                  <div className="text-[10px] text-slate-400">{role.context}</div>
                </div>

                <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-bold text-slate-200">
                  {role.task}
                </div>

                <button
                  onClick={() => handleExecuteRole(role.id)}
                  className="w-full py-2 rounded-xl text-white text-xs font-extrabold shadow-md transition-all hover:brightness-110 active:scale-95"
                  style={{ backgroundColor: role.color }}
                >
                  Run performRole()
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* CODE & CONCEPT FOOTER */}
        <div className="w-full mt-4 pt-3 border-t border-white/10 font-mono text-xs text-center text-slate-400 flex items-center justify-center gap-2">
          <span>💡 <strong className="text-amber-300">Polymorphism Rule:</strong> All 4 forms sit in 1 horizontal line extending from <code className="text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded">Person alex</code>. Calling <code className="text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded">alex.performRole()</code> dynamically dispatches down to the active form!</span>
        </div>

      </div>
    </div>
  );
}
