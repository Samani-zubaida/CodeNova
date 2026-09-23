import React from 'react';
import { Layers } from 'lucide-react';

export default function SlidingWindowView({
  swArray = [1, 3, -1, -3, 5, 3, 6, 7],
  swK = 3,
  stepData = {}
}) {
  const currIdx = stepData.idx ?? -1;
  const dequeIndices = stepData.deque || [];
  const resArr = stepData.res || [];

  return (
    <div className="w-full max-w-3xl flex flex-col items-center gap-6">
      {/* Array Runway with Sliding Window Bracket */}
      <div className="w-full flex flex-col items-center gap-2">
        <span className="text-xs font-mono font-bold text-gray-500 dark:text-[#BCA297] uppercase">
          Input Array (Window Size K = {swK})
        </span>
        <div className="flex items-center justify-center gap-2.5 flex-wrap">
          {swArray.map((val, idx) => {
            const inWindow = idx >= currIdx - swK + 1 && idx <= currIdx;
            return (
              <div
                key={idx}
                className={`w-14 h-16 rounded-2xl border-2 flex flex-col items-center justify-center font-mono font-black transition-all ${
                  inWindow
                    ? 'bg-[#AB526B] border-[#F0E2A4] text-white scale-110 shadow-xl'
                    : 'bg-white dark:bg-[#423834] border-[#EBE0D3] dark:border-[#5C4E49] text-gray-800 dark:text-[#FAF7F2]'
                }`}
              >
                <span className="text-base">{val}</span>
                <span className="text-[9px] opacity-70">[{idx}]</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dedicated Monotonic Decreasing Deque Runway */}
      <div className="w-full bg-[#FAF7F2] dark:bg-[#331921] border-2 border-[#EBE0D3] dark:border-[#5C4E49] rounded-3xl p-5 shadow-lg flex flex-col items-center gap-3">
        <div className="flex items-center justify-between w-full">
          <span className="text-xs font-mono font-bold text-[#AB526B] dark:text-[#F0E2A4] flex items-center gap-1">
            <Layers size={14} /> Monotonic Decreasing Deque (Indices & Values)
          </span>
          <span className="text-[10px] font-mono text-[#BCA297]">
            Front holds Current Max
          </span>
        </div>

        <div className="flex items-center justify-center gap-3 min-h-[70px]">
          {dequeIndices.length === 0 ? (
            <span className="text-xs font-mono text-[#BCA297] italic">Deque is empty</span>
          ) : (
            dequeIndices.map((i, dIdx) => (
              <div
                key={`${i}-${dIdx}`}
                className="px-3.5 py-2 rounded-xl bg-[#5C4E49] border border-[#C5CEAE] text-white font-mono flex items-center gap-2 shadow-md"
              >
                <span className="text-xs text-[#F0E2A4] font-bold">[{i}]</span>
                <span className="text-base font-black">{swArray[i]}</span>
                {dIdx === 0 && (
                  <span className="text-[9px] bg-[#AB526B] text-white px-1.5 py-0.2 rounded font-black">
                    MAX
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Output Result Stream */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono font-bold text-gray-600 dark:text-[#BCA297]">Max Output Stream:</span>
        <div className="flex items-center gap-1.5">
          {resArr.map((v, i) => (
            <span key={i} className="px-3 py-1 rounded-xl bg-[#C5CEAE] text-[#2D1F23] font-mono font-black text-xs shadow-sm">
              {v}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
