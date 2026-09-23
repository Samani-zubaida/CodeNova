import React from 'react';

export default function GraphConceptModal({
  isOpen,
  onClose,
  intuitionData
}) {
  if (!isOpen || !intuitionData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl p-6 bg-white dark:bg-[#423834] border border-amber-500/40 rounded-3xl shadow-2xl text-white flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-amber-400 font-sans font-black text-base">
            <span className="text-xl">💡</span>
            <span>{intuitionData.name} — Concept Guide</span>
          </div>
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 font-mono text-xs font-bold transition-all cursor-pointer"
          >
            ✕ Close
          </button>
        </div>

        <div className="flex flex-col gap-3.5 max-h-[70vh] overflow-y-auto pr-1">
          {/* 1. Mental Model */}
          <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-1.5">
            <span className="text-xs font-mono font-black text-cyan-400 flex items-center gap-1.5">
              <span>🧠</span>
              <span>Real-World Mental Model (ELI5)</span>
            </span>
            <p className="text-xs text-[#2D1F23] dark:text-[#F0E2A4] leading-relaxed font-sans">
              {intuitionData.analogy}
            </p>
            <div className="mt-1 pt-1.5 border-t border-white/10 text-xs text-gray-500 dark:text-[#BCA297] italic">
              {intuitionData.concept}
            </div>
          </div>

          {/* 2. Golden Rule */}
          <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-1.5">
            <span className="text-xs font-mono font-black text-emerald-400 flex items-center gap-1.5">
              <span>⚡</span>
              <span>The 1 Golden Rule</span>
            </span>
            <p className="text-xs text-emerald-200 font-bold leading-snug font-sans">
              {intuitionData.goldenRule}
            </p>
            <div className="mt-1.5 flex flex-col gap-1 pt-1.5 border-t border-white/10">
              {intuitionData.steps?.map((st, sIdx) => (
                <span key={sIdx} className="text-xs text-[#2D1F23] dark:text-[#F0E2A4] font-mono leading-relaxed">
                  {st}
                </span>
              ))}
            </div>
          </div>

          {/* 3. Why Data Structure */}
          <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-1.5">
            <span className="text-xs font-mono font-black text-amber-400 flex items-center gap-1.5">
              <span>📦</span>
              <span>Why This Data Structure?</span>
            </span>
            <p className="text-xs text-[#2D1F23] dark:text-[#F0E2A4] leading-relaxed font-sans">
              {intuitionData.whyDataStructure}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
