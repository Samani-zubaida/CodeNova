import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function HeapVisualizer() {
  const [heap, setHeap] = useState([100, 50, 40, 20, 10]);
  const [isBubbling, setIsBubbling] = useState(false);

  const insert = () => {
    setIsBubbling(true);
    setHeap([...heap, 80]); // simple dummy bubble simulation
    setTimeout(() => {
      setHeap([100, 80, 40, 20, 10, 50]);
      setIsBubbling(false);
    }, 1500);
  };

  return (
    <div className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-bold mb-2 text-[var(--color-nova-brown)]">Max Heap (Priority Queue)</h3>
      <p className="text-sm text-gray-500 mb-6">Visualizing array-backed trees and bubble-up priority.</p>
      
      <button onClick={insert} disabled={isBubbling} className="bg-[var(--color-nova-brown)] text-white px-4 py-1 rounded mb-8 disabled:opacity-50">
        Insert 80
      </button>

      <div className="flex flex-col items-center gap-8">
        {/* Array representation */}
        <div className="flex gap-1 border-2 border-gray-200 p-2 rounded bg-gray-50 dark:bg-black/20">
          <AnimatePresence>
            {heap.map((val, i) => (
              <motion.div layout key={`${val}-${i}`} className="w-10 h-10 bg-[var(--color-nova-wheat)] text-black font-bold flex items-center justify-center rounded border border-[var(--color-nova-brown)]">
                {val}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pseudo Tree representation */}
        <div className="relative w-full max-w-sm h-48 border border-dashed border-gray-300 rounded flex flex-col items-center pt-4">
          <div className="absolute top-2 left-2 text-xs text-gray-400">Conceptual Tree</div>
          
          <AnimatePresence mode="popLayout">
            <motion.div layout className="flex flex-col items-center w-full">
              {/* Root */}
              <div className="w-12 h-12 rounded-full bg-[var(--color-nova-red)] text-white font-bold flex items-center justify-center z-10">{heap[0]}</div>
              
              {/* Level 1 */}
              <div className="flex w-full justify-around mt-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-nova-brown)] text-white font-bold flex items-center justify-center relative">
                  {heap[1]}
                  {isBubbling && heap.length === 6 && <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="absolute -left-6 text-[var(--color-nova-green)]"><ArrowUp/></motion.div>}
                </div>
                <div className="w-12 h-12 rounded-full bg-[var(--color-nova-brown)] text-white font-bold flex items-center justify-center">{heap[2]}</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
