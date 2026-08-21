import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function LinkedListVisualizer() {
  const [list, setList] = useState([{ val: 10, id: 'n1' }, { val: 20, id: 'n2' }, { val: 30, id: 'n3' }]);
  const [inputVal, setInputVal] = useState('40');

  const appendNode = () => {
    if (!inputVal) return;
    setList([...list, { val: Number(inputVal), id: `n${Date.now()}` }]);
    setInputVal('');
  };

  const prependNode = () => {
    if (!inputVal) return;
    setList([{ val: Number(inputVal), id: `n${Date.now()}` }, ...list]);
    setInputVal('');
  };

  const removeNode = (idToRemove) => {
    setList(list.filter(node => node.id !== idToRemove));
  };

  return (
    <div className="w-full glass-card p-6 overflow-hidden flex flex-col gap-8">
      <h3 className="text-xl font-bold text-[var(--color-nova-red)]">Singly Linked List</h3>
      
      <div className="flex flex-wrap gap-4 items-center bg-gray-50 dark:bg-white/5 p-4 rounded-lg w-full md:w-fit border border-gray-200 dark:border-gray-800">
        <label className="text-sm font-bold text-gray-500">Node Value</label>
        <input 
          type="number" 
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="w-20 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded px-2 py-1 text-center"
          placeholder="Val"
        />
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2"></div>
        <button onClick={prependNode} className="border border-[var(--color-nova-brown)] text-[var(--color-nova-brown)] px-4 py-1 rounded font-bold hover:bg-[var(--color-nova-brown)] hover:text-white transition-colors">Prepend Head</button>
        <button onClick={appendNode} className="bg-[var(--color-nova-brown)] text-white px-4 py-1 rounded font-bold hover:scale-105 transition-transform">Append Tail</button>
      </div>

      <div className="flex items-center overflow-x-auto gap-y-12 min-h-[120px] p-4 bg-black/5 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/5 pb-8 scrollbar-thin">
        <div className="mr-4 font-bold text-gray-400">HEAD</div>
        <AnimatePresence mode="popLayout">
          {list.map((node, i) => (
            <motion.div 
              key={node.id}
              layout
              initial={{ opacity: 0, scale: 0.5, y: -30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 30 }}
              transition={{ type: 'spring', bounce: 0.3 }}
              className="flex items-center group cursor-pointer"
              onClick={() => removeNode(node.id)}
              title="Click to remove"
            >
              <div className="flex border-2 border-[var(--color-nova-brown)] rounded bg-[var(--color-nova-wheat)] text-black shadow-md group-hover:border-red-500 transition-colors">
                <div className="px-4 py-2 font-bold border-r border-[var(--color-nova-brown)] flex items-center justify-center min-w-[3rem] group-hover:border-red-500">
                  {node.val}
                </div>
                <div className="px-2 py-2 flex items-center justify-center text-xs opacity-50 bg-black/10">
                  *next
                </div>
              </div>
              
              {i < list.length - 1 && (
                <motion.div layout className="mx-2 text-[var(--color-nova-red)]">
                  <ArrowRight size={24} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="ml-4 font-bold text-gray-400 border-2 border-dashed border-gray-300 p-2 rounded">NULL</div>
      </div>
      <p className="text-xs text-gray-400 text-center">Tip: Click on a node to remove it.</p>
    </div>
  );
}
