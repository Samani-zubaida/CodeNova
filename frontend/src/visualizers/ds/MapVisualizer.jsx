import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MapVisualizer() {
  const [buckets, setBuckets] = useState([[], [], [], []]);
  const [key, setKey] = useState('');
  
  const hash = (str) => {
    let sum = 0;
    for (let i = 0; i < str.length; i++) sum += str.charCodeAt(i);
    return sum % 4;
  };

  const handleInsert = () => {
    if (!key) return;
    const index = hash(key);
    const newBuckets = [...buckets];
    newBuckets[index] = [...newBuckets[index], key];
    setBuckets(newBuckets);
    setKey('');
  };

  return (
    <div className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-bold mb-2 text-[var(--color-nova-red)]">Hash Map</h3>
      <p className="text-sm text-gray-500 mb-6">Keys are hashed to calculate their bucket index (collisions shown as arrays).</p>
      
      <div className="flex gap-4 mb-8">
        <input 
          value={key} 
          onChange={(e) => setKey(e.target.value)} 
          placeholder="String Key" 
          className="border border-gray-300 dark:border-gray-700 bg-transparent rounded px-3 py-1 w-32"
        />
        <button onClick={handleInsert} className="bg-[var(--color-nova-green)] text-black font-semibold px-4 py-1 rounded">Put</button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {buckets.map((bucket, i) => (
          <div key={i} className="flex flex-col border border-[var(--color-nova-brown)] rounded overflow-hidden">
            <div className="bg-[var(--color-nova-brown)] text-white text-center font-bold py-1">Bucket {i}</div>
            <div className="p-2 min-h-[60px] flex flex-col gap-1 bg-black/5 dark:bg-white/5">
              <AnimatePresence>
                {bucket.map((item, idx) => (
                  <motion.div 
                    key={`${item}-${idx}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-[var(--color-nova-wheat)] text-black text-xs font-bold px-2 py-1 rounded truncate border border-black/10 shadow-sm"
                  >
                    {item}
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
