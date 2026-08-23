import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OOPVisualizer() {
  const [showChild, setShowChild] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto min-h-[600px] glass-card p-8 flex flex-col items-center justify-center overflow-hidden relative">
      <Link to="/visualizer" className="absolute top-8 left-8 text-gray-500 hover:text-[var(--color-nova-red)] transition-colors flex items-center gap-2 font-semibold z-10">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>
      <h2 className="absolute top-8 right-8 text-xl font-bold text-[var(--color-nova-brown)]">OOP Inheritance</h2>
      
      <div className="flex flex-col items-center gap-12 w-full max-w-2xl">
        {/* Parent Class Object */}
        <motion.div 
          layoutId="classShape"
          className="w-64 bg-[var(--color-nova-red)] text-white p-6 rounded-2xl shadow-xl flex flex-col gap-3 relative z-10"
        >
          <div className="font-bold text-center border-b border-white/30 pb-2">Class: Animal</div>
          <div className="text-sm font-mono opacity-90">+ species: string</div>
          <div className="text-sm font-mono opacity-90">+ eat()</div>
          <div className="text-sm font-mono opacity-90">+ sleep()</div>
        </motion.div>

        {/* Inheriting Object */}
        <AnimatePresence>
          {showChild && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              transition={{ type: 'spring', bounce: 0.4, duration: 0.8 }}
              className="w-64 bg-[var(--color-nova-wheat)] text-black p-6 rounded-2xl shadow-lg border-2 border-[var(--color-nova-red)] flex flex-col gap-3 relative"
            >
              <div className="absolute -top-12 left-1/2 w-0.5 h-12 bg-dashed border-l-2 border-dashed border-[var(--color-nova-brown)] -translate-x-1/2" />
              
              <div className="font-bold text-center border-b border-black/20 pb-2">Class: Dog extends Animal</div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm font-mono text-[var(--color-nova-red)] font-semibold"
              >
                + species = "Canine"
              </motion.div>
              
              <div className="text-sm font-mono opacity-70">+ breed: string</div>
              <div className="text-sm font-mono opacity-70">+ bark()</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button 
        onClick={() => setShowChild(!showChild)}
        className="absolute bottom-6 bg-[var(--color-nova-brown)] text-white px-6 py-2 rounded-full font-semibold shadow-md hover:scale-105 transition-transform"
      >
        {showChild ? "Hide Subclass" : "Instantiate Subclass"}
      </button>
    </div>
  );
}
