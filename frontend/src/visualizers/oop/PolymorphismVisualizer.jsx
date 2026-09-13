import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Briefcase, Heart, Trophy, Music, Play, RotateCcw, Activity, Code2, Sparkles, CheckCircle2, Zap, ArrowDown
} from 'lucide-react';
import VisualizerNav from '../../components/layout/VisualizerNav';

export default function PolymorphismVisualizer({ isEmbedded = false }) {
  const [activeRole, setActiveRole] = useState('developer'); // 'developer' | 'parent' | 'athlete' | 'musician'
  const [activePulse, setActivePulse] = useState(null);
  const [logMessage, setLogMessage] = useState("Polymorphism: 1 Person connected to 4 Subclass Forms in 1 line. Click any form to trigger performRole()!");

  const roles = [
    {
      id: 'developer',
      title: 'Software Developer',
      context: 'At Office',
      emoji: '👨‍💻',
      task: 'Build Web Apps 💻',
      color: '#AB526B'
    },
    {
      id: 'parent',
      title: 'Loving Parent',
      context: 'At Home',
      emoji: '👨‍👩‍👧',
      task: 'Cook & Care 🍲',
      color: '#F0E2A4'
    },
    {
      id: 'athlete',
      title: 'Soccer Athlete',
      context: 'On Field',
      emoji: '⚽',
      task: 'Score Goals ⚽',
      color: '#C5CEAE'
    },
    {
      id: 'musician',
      title: 'Rock Musician',
      context: 'On Stage',
      emoji: '🎸',
      task: 'Rock Out 🎸',
      color: '#FAF7F2'
    }
  ];

  const activeRoleObj = roles.find(r => r.id === activeRole);

  const handleExecuteRole = async (roleId) => {
    if (activePulse) return;
    setActiveRole(roleId);
    setActivePulse(roleId);

    const targetRole = roles.find(r => r.id === roleId);
    setLogMessage(`⚡ DYNAMIC DISPATCH: Calling alex.performRole() -> Flowing down connection to ${targetRole.title}...`);

    await new Promise(r => setTimeout(r, 1500));

    setLogMessage(`✅ EXECUTED: ${targetRole.title} performed "${targetRole.task}"!`);
    setActivePulse(null);
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-between text-[#FAF7F2] font-sans select-none space-y-3">
      {!isEmbedded && <VisualizerNav title="Polymorphism: Person & 4 Connected Forms" />}

      {/* TOP HEADER */}
      <div className="w-full max-w-6xl bg-[#331921]/90 backdrop-blur-xl border-2 border-[#C5CEAE] rounded-2xl p-4 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#C5CEAE] text-[#331921] font-extrabold shadow-lg">
            <User size={26} />
          </div>
          <div>
            <h3 className="text-base font-mono font-extrabold text-[#F0E2A4] uppercase tracking-wider">
              POLYMORPHISM: 1 PERSON CONNECTED TO 4 FORMS
            </h3>
            <p className="text-xs text-[#BCA297]">
              One Base Identity (<span className="text-[#F0E2A4] font-bold">Person alex</span>) connected to 4 Subclass Forms in 1 single line.
            </p>
          </div>
        </div>

        {/* Global Dispatch Button */}
        <button
          onClick={() => handleExecuteRole(activeRole)}
          disabled={!!activePulse}
          className="px-5 py-3 rounded-2xl bg-[#C5CEAE] hover:bg-[#A8B48D] text-[#331921] font-mono text-xs font-black shadow-xl transition-all flex items-center gap-2 disabled:opacity-40 hover:scale-105"
        >
          <Play size={18} />
          <span>RUN alex.performRole()</span>
        </button>
      </div>

      {/* TELEMETRY LOG BANNER */}
      <div className="w-full max-w-6xl py-3 px-6 rounded-2xl bg-[#423834] border-2 border-[#5C4E49] text-center font-mono text-xs md:text-sm font-bold shadow-xl text-[#F0E2A4] flex items-center justify-center gap-3">
        <Activity size={18} className="text-[#C5CEAE] animate-pulse" />
        <span>{logMessage}</span>
      </div>

      {/* MAIN CONNECTED TREE CANVAS */}
      <div className="w-full max-w-6xl bg-gradient-to-b from-[#140D0F] via-[#1E1417] to-[#2B1B21] border-2 border-[#5C4E49] rounded-3xl p-6 md:p-8 shadow-[0_0_90px_rgba(0,0,0,0.9)] relative overflow-hidden flex-1 flex flex-col items-center justify-between min-h-[480px]">
        
        {/* 1. TOP SINGLE PERSON NODE */}
        <motion.div 
          animate={{ scale: activePulse ? 1.05 : 1 }}
          className="p-5 rounded-3xl bg-[#331921] border-4 border-[#F0E2A4] shadow-2xl font-mono text-center z-10 w-80 relative"
        >
          <div className="text-4xl mb-1">👤</div>
          <div className="text-base font-extrabold text-[#F0E2A4]">Person alex</div>
          <div className="text-xs text-[#BCA297]">Base Reference Type</div>
          <div className="mt-2 px-3 py-1 rounded-full bg-[#423834] text-[10px] text-[#C5CEAE] font-bold">
            Method Signature: performRole()
          </div>
        </motion.div>

        {/* CONNECTING SVG ARROWS NETWORK */}
        <div className="w-full flex justify-center items-center my-2 relative z-0">
          <div className="w-full max-w-4xl h-12 flex justify-between items-center relative">
            {/* Horizontal Line */}
            <div className="absolute top-1/2 left-8 right-8 h-1 bg-[#5C4E49] -translate-y-1/2" />
            {/* Vertical Stem */}
            <div className="absolute top-0 bottom-1/2 left-1/2 w-1 bg-[#5C4E49] -translate-x-1/2" />

            {/* Glowing Connector Pulses */}
            {roles.map(r => (
              <div key={r.id} className="flex-1 flex justify-center relative">
                <div className={`w-1 h-6 ${activePulse === r.id ? 'bg-[#F0E2A4] shadow-[0_0_15px_#F0E2A4]' : 'bg-[#5C4E49]'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* 2. SINGLE HORIZONTAL LINE OF 4 FORMS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full z-10">
          {roles.map(role => {
            const isSelected = activeRole === role.id;
            const isPulsing = activePulse === role.id;

            return (
              <motion.div
                key={role.id}
                animate={{ 
                  scale: isPulsing ? 1.08 : isSelected ? 1.03 : 1,
                  y: isPulsing ? -8 : 0
                }}
                className={`p-4 rounded-3xl bg-[#331921] border-4 shadow-2xl font-mono flex flex-col justify-between text-center space-y-3 transition-all relative ${
                  isPulsing 
                    ? 'shadow-[0_0_50px_#F0E2A4] bg-[#F0E2A4]/20' 
                    : isSelected 
                    ? 'shadow-[0_0_25px_rgba(240,226,164,0.4)]' 
                    : ''
                }`}
                style={{ borderColor: role.color }}
              >
                <div>
                  <div className="text-5xl mb-2">{role.emoji}</div>
                  <h4 className="text-sm font-extrabold text-[#FAF7F2]">{role.title}</h4>
                  <div className="text-[10px] text-[#BCA297]">{role.context}</div>
                </div>

                <div className="p-2 rounded-xl bg-[#423834] text-xs font-bold text-[#F0E2A4]">
                  {role.task}
                </div>

                <button
                  onClick={() => handleExecuteRole(role.id)}
                  className="w-full py-2 rounded-xl bg-[#C5CEAE] hover:bg-[#A8B48D] text-[#331921] text-xs font-extrabold shadow-md transition-all"
                >
                  Select & Run performRole()
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* CODE & CONCEPT FOOTER */}
        <div className="w-full mt-4 pt-3 border-t border-white/10 font-mono text-xs text-center text-[#BCA297] flex items-center justify-center gap-2">
          <span>💡 <strong className="text-[#F0E2A4]">Polymorphism Rule:</strong> All 4 forms sit in 1 horizontal line extending from <code className="text-[#C5CEAE]">Person alex</code>. Calling <code className="text-[#C5CEAE]">alex.performRole()</code> dynamically dispatches down to the active form!</span>
        </div>

      </div>
    </div>
  );
}
