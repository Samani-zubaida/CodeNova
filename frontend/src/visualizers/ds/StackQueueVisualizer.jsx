import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StackQueueVisualizer() {
  const [stack, setStack] = useState([1, 2]);
  const [queue, setQueue] = useState([1, 2]);
  
  const [stackInput, setStackInput] = useState('3');
  const [queueInput, setQueueInput] = useState('3');

  const pushStack = () => {
    if (!stackInput) return;
    setStack([...stack, Number(stackInput)]);
    setStackInput('');
  };
  const popStack = () => setStack(stack.slice(0, -1));

  const enqueue = () => {
    if (!queueInput) return;
    setQueue([...queue, Number(queueInput)]);
    setQueueInput('');
  };
  const dequeue = () => setQueue(queue.slice(1));

  return (
    <div className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl p-6 flex flex-col md:flex-row gap-12 justify-around">
      
      {/* Stack Area */}
      <div className="flex flex-col items-center">
        <h3 className="text-xl font-bold mb-2 text-[var(--color-nova-red)]">Stack (LIFO)</h3>
        <p className="text-xs text-gray-500 mb-4">Last In, First Out</p>
        
        <div className="flex gap-2 mb-6 items-center">
          <input 
            type="number" 
            value={stackInput}
            onChange={(e) => setStackInput(e.target.value)}
            className="w-16 border border-gray-300 dark:border-gray-700 bg-transparent rounded px-2 py-1 text-center"
            placeholder="Val"
          />
          <button onClick={pushStack} className="bg-[var(--color-nova-brown)] text-white px-3 py-1 rounded font-bold hover:scale-105 transition-transform">Push</button>
          <button onClick={popStack} className="border border-[var(--color-nova-brown)] text-[var(--color-nova-brown)] px-3 py-1 rounded font-bold hover:bg-[var(--color-nova-brown)] hover:text-white transition-colors">Pop</button>
        </div>

        <div className="w-32 h-64 border-b-4 border-x-4 border-[var(--color-nova-brown)] rounded-b-xl flex flex-col-reverse p-2 gap-2 overflow-hidden bg-black/5 dark:bg-white/5 relative">
          <AnimatePresence>
            {stack.map((item, idx) => (
              <motion.div
                key={`${idx}-${item}`}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50, scale: 0.8 }}
                className="w-full h-12 bg-[var(--color-nova-red)] text-white font-bold flex items-center justify-center rounded shadow-md border-2 border-white/20"
              >
                {item}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Queue Area */}
      <div className="flex flex-col items-center">
        <h3 className="text-xl font-bold mb-2 text-[var(--color-nova-green)]">Queue (FIFO)</h3>
        <p className="text-xs text-gray-500 mb-4">First In, First Out</p>
        
        <div className="flex gap-2 mb-6 items-center">
          <input 
            type="number" 
            value={queueInput}
            onChange={(e) => setQueueInput(e.target.value)}
            className="w-16 border border-gray-300 dark:border-gray-700 bg-transparent rounded px-2 py-1 text-center"
            placeholder="Val"
          />
          <button onClick={enqueue} className="bg-[var(--color-nova-green)] text-black px-3 py-1 rounded font-bold hover:scale-105 transition-transform">Enqueue</button>
          <button onClick={dequeue} className="border border-[var(--color-nova-green)] text-[var(--color-nova-green)] px-3 py-1 rounded font-bold hover:bg-[var(--color-nova-green)] hover:text-black transition-colors">Dequeue</button>
        </div>

        <div className="w-80 h-32 border-y-4 border-[var(--color-nova-green)] flex items-center p-2 gap-2 overflow-hidden bg-black/5 dark:bg-white/5 relative">
          <AnimatePresence>
            {queue.map((item, idx) => (
              <motion.div
                key={`${idx}-${item}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50, scale: 0.8 }}
                layout
                className="w-16 h-16 shrink-0 bg-[var(--color-nova-wheat)] text-black font-bold flex items-center justify-center rounded shadow-md border-2 border-[var(--color-nova-green)]"
              >
                {item}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
