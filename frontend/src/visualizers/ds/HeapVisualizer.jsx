import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeapVisualizer() {
  const [heap, setHeap] = useState([]);
  const [isMaxHeap, setIsMaxHeap] = useState(true);
  const [inputVal, setInputVal] = useState('');
  const [isBubbling, setIsBubbling] = useState(false);
  const [activeIndices, setActiveIndices] = useState([]);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const insert = async () => {
    if (!inputVal || isBubbling) return;
    setIsBubbling(true);
    
    const val = Number(inputVal);
    let currentHeap = [...heap, val];
    setHeap([...currentHeap]);
    setInputVal('');
    
    let currentIndex = currentHeap.length - 1;
    
    await delay(600); // Wait for insertion animation
    
    while (currentIndex > 0) {
      let parentIndex = Math.floor((currentIndex - 1) / 2);
      setActiveIndices([currentIndex, parentIndex]);
      
      await delay(800); // Highlight nodes being compared
      
      const shouldSwap = isMaxHeap 
        ? currentHeap[currentIndex] > currentHeap[parentIndex]
        : currentHeap[currentIndex] < currentHeap[parentIndex];
        
      if (shouldSwap) {
        // Swap
        let temp = currentHeap[currentIndex];
        currentHeap[currentIndex] = currentHeap[parentIndex];
        currentHeap[parentIndex] = temp;
        setHeap([...currentHeap]);
        currentIndex = parentIndex;
        await delay(600); // Wait for swap animation
      } else {
        break; // Correct position found
      }
    }
    
    setActiveIndices([]);
    setIsBubbling(false);
  };

  const handleReset = () => {
    setHeap([]);
    setActiveIndices([]);
  };

  return (
    <div className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl p-6 flex flex-col gap-6">
      
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div>
          <h3 className="text-xl font-bold text-[var(--color-nova-brown)]">Priority Queue (Heap)</h3>
          <p className="text-sm text-gray-500">Visualizing array-backed tree insertions and bubble-up priority.</p>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-black/40 rounded-lg p-1 border border-gray-200 dark:border-gray-800">
          <button 
            onClick={() => { setIsMaxHeap(true); handleReset(); }}
            className={`px-4 py-1 text-sm font-bold rounded ${isMaxHeap ? 'bg-[var(--color-nova-brown)] text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'}`}
          >
            Max-Heap
          </button>
          <button 
            onClick={() => { setIsMaxHeap(false); handleReset(); }}
            className={`px-4 py-1 text-sm font-bold rounded ${!isMaxHeap ? 'bg-[var(--color-nova-brown)] text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'}`}
          >
            Min-Heap
          </button>
        </div>
      </div>
      
      <div className="flex gap-4 items-center bg-gray-50 dark:bg-white/5 p-4 rounded-lg w-fit border border-gray-200 dark:border-gray-800">
        <label className="text-sm font-bold text-gray-500">Value to Insert</label>
        <input 
          type="number" 
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="w-20 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded px-2 py-1 text-center"
          placeholder="Val"
          disabled={isBubbling}
        />
        <button 
          onClick={insert} 
          disabled={isBubbling || !inputVal} 
          className="bg-[var(--color-nova-brown)] text-white px-4 py-1 rounded font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
        >
          Insert
        </button>
        <button onClick={handleReset} disabled={isBubbling} className="border border-gray-400 px-4 py-1 rounded text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-50">
          Clear
        </button>
      </div>

      <div className="flex flex-col items-center gap-8 bg-black/5 dark:bg-black/20 p-8 rounded-xl border border-gray-200 dark:border-white/5 min-h-[300px]">
        {/* Array representation */}
        <div className="flex gap-2 flex-wrap justify-center w-full max-w-2xl">
          <AnimatePresence>
            {heap.map((val, i) => (
              <motion.div 
                layout 
                key={`${val}-${i}`} 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: activeIndices.includes(i) ? 1.1 : 1,
                  backgroundColor: activeIndices.includes(i) ? 'var(--color-nova-green)' : 'var(--color-nova-wheat)'
                }}
                className="w-12 h-12 flex flex-col items-center justify-center rounded border-2 border-[var(--color-nova-brown)] text-black font-bold shadow-md transition-colors"
              >
                <span>{val}</span>
                <span className="text-[9px] text-gray-600 border-t border-black/10 w-full text-center bg-black/5 rounded-b">idx {i}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {heap.length === 0 && <div className="text-gray-400 font-bold tracking-widest my-4">HEAP IS EMPTY</div>}
        </div>
      </div>
    </div>
  );
}
