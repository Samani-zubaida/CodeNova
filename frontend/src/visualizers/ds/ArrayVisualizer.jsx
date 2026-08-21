import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ArrayVisualizer() {
  const [array, setArray] = useState([10, 25, 33]);
  const [inputValue, setInputValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);

  const handlePush = () => {
    if (!inputValue) return;
    setArray([...array, Number(inputValue)]);
    setInputValue('');
  };

  const handleIterate = async () => {
    for (let i = 0; i < array.length; i++) {
      setActiveIndex(i);
      await new Promise(r => setTimeout(r, 600));
    }
    setActiveIndex(null);
  };

  return (
    <div className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4 text-[var(--color-nova-red)]">Array</h3>
      
      <div className="flex flex-wrap gap-4 mb-8">
        <input 
          type="number" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 bg-transparent rounded px-3 py-1 w-24"
          placeholder="Value"
        />
        <button onClick={handlePush} className="bg-[var(--color-nova-brown)] text-white px-4 py-1 rounded hover:bg-[var(--color-nova-red)]">Push</button>
        <button onClick={handleIterate} className="bg-[var(--color-nova-green)] text-black font-semibold px-4 py-1 rounded hover:bg-white">Iterate</button>
      </div>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {array.map((val, idx) => (
            <motion.div 
              key={`${idx}-${val}`}
              initial={{ opacity: 0, scale: 0.5, y: -20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                backgroundColor: activeIndex === idx ? 'var(--color-nova-green)' : 'var(--color-nova-wheat)'
              }}
              exit={{ opacity: 0, scale: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 border-2 border-[var(--color-nova-brown)] flex items-center justify-center text-xl font-bold text-black rounded-t shadow-sm">
                {val}
              </div>
              <div className="w-16 bg-[var(--color-nova-red)] text-white text-xs text-center py-1 rounded-b font-mono">
                [{idx}]
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
