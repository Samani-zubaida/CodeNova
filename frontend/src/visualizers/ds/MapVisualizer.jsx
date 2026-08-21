import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MapVisualizer() {
  const NUM_BUCKETS = 5;
  const [buckets, setBuckets] = useState(Array.from({ length: NUM_BUCKETS }, () => []));
  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  
  const hash = (str) => {
    let sum = 0;
    for (let i = 0; i < str.length; i++) sum += str.charCodeAt(i);
    return sum % NUM_BUCKETS;
  };

  const handleInsert = () => {
    if (!keyInput || !valueInput) return;
    const index = hash(keyInput);
    
    // Check if key already exists, if so update it
    const newBuckets = [...buckets];
    const existingIndex = newBuckets[index].findIndex(item => item.key === keyInput);
    
    if (existingIndex !== -1) {
      newBuckets[index][existingIndex] = { key: keyInput, value: valueInput };
    } else {
      newBuckets[index] = [...newBuckets[index], { key: keyInput, value: valueInput }];
    }
    
    setBuckets(newBuckets);
    setKeyInput('');
    setValueInput('');
  };

  return (
    <div className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl p-8 flex flex-col gap-8">
      <div>
        <h3 className="text-xl font-bold mb-2 text-[var(--color-nova-red)]">Hash Map</h3>
        <p className="text-sm text-gray-500">Keys are hashed to calculate a bucket index. Collisions are handled via chaining (arrays in buckets).</p>
      </div>
      
      {/* Control Panel */}
      <div className="flex gap-4 items-center bg-gray-50 dark:bg-white/5 p-4 rounded-lg w-fit border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-bold">Key (String)</label>
          <input 
            value={keyInput} 
            onChange={(e) => setKeyInput(e.target.value)} 
            placeholder="e.g. name" 
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded px-3 py-1 w-24"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-bold">Value</label>
          <input 
            value={valueInput} 
            onChange={(e) => setValueInput(e.target.value)} 
            placeholder="e.g. Alice" 
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded px-3 py-1 w-24"
          />
        </div>
        <button onClick={handleInsert} className="bg-[var(--color-nova-green)] text-black font-bold px-6 py-2 rounded mt-4 hover:scale-105 transition-transform">
          Put
        </button>
      </div>

      {/* Simplified Bucket Layout */}
      <div className="flex gap-4 overflow-x-auto pb-4 w-full justify-between mt-4">
        {buckets.map((bucket, i) => (
          <div key={i} className="flex flex-col flex-1 min-w-[120px]">
            {/* Bucket Header */}
            <div className="bg-[var(--color-nova-brown)] text-white text-center font-bold py-2 rounded-t-lg shadow-md z-10 relative">
              Bucket {i}
            </div>
            
            {/* Bucket Body */}
            <div className="flex flex-col gap-2 bg-gray-50 dark:bg-black/20 p-2 min-h-[150px] border-x-2 border-b-2 border-gray-200 dark:border-gray-800 rounded-b-lg">
              <AnimatePresence>
                {bucket.map((item, idx) => (
                  <motion.div 
                    key={`${item.key}`}
                    initial={{ opacity: 0, y: -20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="flex flex-col bg-[var(--color-nova-wheat)] text-black text-sm rounded shadow-sm overflow-hidden"
                  >
                    <div className="font-bold border-b border-black/10 px-2 py-1 bg-black/5 truncate">{item.key}</div>
                    <div className="px-2 py-1 truncate">{item.value}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
