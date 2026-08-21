import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function LinkedListVisualizer() {
  const [list, setList] = useState([{ val: 10, id: 'n1' }, { val: 20, id: 'n2' }, { val: 30, id: 'n3' }]);
  const [newVal, setNewVal] = useState(40);

  const appendNode = () => {
    setList([...list, { val: newVal, id: `n${Date.now()}` }]);
    setNewVal(newVal + 10);
  };

  const prependNode = () => {
    setList([{ val: newVal, id: `n${Date.now()}` }, ...list]);
    setNewVal(newVal + 10);
  };

  return (
    <div className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl p-6 overflow-hidden">
      <h3 className="text-xl font-bold mb-4 text-[var(--color-nova-red)]">Singly Linked List</h3>
      
      <div className="flex gap-4 mb-12">
        <button onClick={prependNode} className="border border-[var(--color-nova-brown)] px-4 py-1 rounded hover:bg-black/5">Prepend</button>
        <button onClick={appendNode} className="bg-[var(--color-nova-brown)] text-white px-4 py-1 rounded hover:bg-[var(--color-nova-red)]">Append</button>
      </div>

      <div className="flex items-center flex-wrap gap-y-8 min-h-[100px]">
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
              className="flex items-center"
            >
              <div className="flex border-2 border-[var(--color-nova-brown)] rounded bg-[var(--color-nova-wheat)] text-black shadow-md">
                <div className="px-4 py-2 font-bold border-r border-[var(--color-nova-brown)] flex items-center justify-center min-w-[3rem]">
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
    </div>
  );
}
