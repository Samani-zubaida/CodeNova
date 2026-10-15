import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export default function HotPotatoView({
  potatoPlayers = ['Alice', 'Bob', 'Charlie', 'David', 'Emma'],
  stepData = {}
}) {
  const currentPlayers = stepData.q || potatoPlayers;
  const currentHolder = stepData.currentHolder;
  const eliminated = stepData.eliminated || [];

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-6">
      {/* Central Passing Arena */}
      <div className="relative w-[340px] h-[300px] flex items-center justify-center">
        {currentPlayers.map((player, idx) => {
          const angle = (2 * Math.PI * idx) / currentPlayers.length - Math.PI / 2;
          const x = 170 + 110 * Math.cos(angle);
          const y = 150 + 100 * Math.sin(angle);
          const hasPotato = player === currentHolder;

          return (
            <motion.div
              key={player}
              style={{ position: 'absolute', left: x - 40, top: y - 25 }}
              animate={{ scale: hasPotato ? 1.15 : 1 }}
              className={`w-20 h-14 rounded-2xl flex flex-col items-center justify-center font-mono font-bold text-xs shadow-lg border-2 transition-all ${
                hasPotato
                  ? 'bg-[#AB526B] border-[#F0E2A4] text-white shadow-[#AB526B]/50'
                  : 'bg-white dark:bg-[#423834] border-[#EBE0D3] dark:border-[#5C4E49] text-gray-800 dark:text-[#FAF7F2]'
              }`}
            >
              <span>{player}</span>
              {hasPotato && (
                <span className="text-[10px] text-[#F0E2A4] flex items-center gap-0.5">
                  <Flame size={10} /> HOT!
                </span>
              )}
            </motion.div>
          );
        })}

        {/* Center Potato Fire */}
        <div className="w-20 h-20 rounded-full bg-[#AB526B]/20 border border-[#AB526B]/40 flex flex-col items-center justify-center text-center">
          <Flame size={26} className="text-[#AB526B] animate-bounce" />
          <span className="text-[9px] font-mono font-black text-[#AB526B]">ROUND {stepData.passCount || 0}</span>
        </div>
      </div>

      {/* Eliminated Bench */}
      {eliminated.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-400 dark:text-[#BCA297]">Eliminated Bench:</span>
          <div className="flex items-center gap-1.5">
            {eliminated.map((p, i) => (
              <span key={i} className="line-through px-2.5 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 font-mono text-xs">
                {p}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
