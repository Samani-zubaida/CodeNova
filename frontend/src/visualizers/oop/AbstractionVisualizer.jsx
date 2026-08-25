import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Settings, Power } from 'lucide-react';

export default function AbstractionVisualizer() {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="w-full max-w-6xl mx-auto glass-card p-8 min-h-[600px] flex flex-col items-center relative">
      <Link to="/visualizer" className="absolute top-8 left-8 text-gray-500 hover:text-[var(--color-nova-red)] transition-colors flex items-center gap-2 font-semibold z-10">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>
      
      <div className="text-center mt-12 mb-12">
        <h1 className="text-4xl font-extrabold mb-4 text-[var(--color-nova-red)] tracking-tight">Abstraction</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Hiding complex implementation details and showing only the essential features of the object.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center w-full max-w-3xl">
        
        {/* Simple Interface */}
        <div className="flex-1 border-2 border-[var(--color-nova-green)] rounded-xl p-6 flex flex-col items-center gap-4 bg-white dark:bg-black relative">
          <div className="absolute -top-3 bg-[var(--color-nova-green)] text-black text-xs font-bold px-2 py-1 rounded">Simple Interface</div>
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center transition-colors shadow-lg ${isRunning ? 'border-[var(--color-nova-red)] text-[var(--color-nova-red)] bg-red-50 dark:bg-red-900/20' : 'border-gray-300 text-gray-400 hover:border-[var(--color-nova-green)] hover:text-[var(--color-nova-green)]'}`}
          >
            <Power size={48} />
            <span className="font-bold mt-2">{isRunning ? "STOP" : "START"}</span>
          </button>
          <div className="text-xs text-center text-gray-500">The user only needs to press this button.</div>
        </div>

        {/* Arrow */}
        <div className="text-gray-400 font-mono text-xs text-center">
          <div>Triggers</div>
          <div className="text-2xl">→</div>
        </div>

        {/* Complex Implementation */}
        <div className="flex-[1.5] border-2 border-dashed border-[var(--color-nova-brown)] rounded-xl p-6 bg-gray-50 dark:bg-white/5 relative overflow-hidden">
          <div className="absolute -top-3 right-6 bg-[var(--color-nova-brown)] text-white text-xs font-bold px-2 py-1 rounded">Complex Implementation (Hidden)</div>
          
          <div className="grid grid-cols-2 gap-4 mt-2">
            <motion.div animate={{ rotate: isRunning ? 360 : 0 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="flex items-center justify-center text-[var(--color-nova-brown)] opacity-50">
              <Settings size={64} />
            </motion.div>
            <div className="flex flex-col justify-center gap-2">
              <div className="h-2 w-full bg-gray-200 rounded overflow-hidden">
                <motion.div animate={{ x: isRunning ? ['-100%', '100%'] : '-100%' }} transition={{ repeat: Infinity, duration: 1 }} className="h-full bg-[var(--color-nova-red)]" />
              </div>
              <div className="h-2 w-3/4 bg-gray-200 rounded overflow-hidden">
                <motion.div animate={{ x: isRunning ? ['-100%', '100%'] : '-100%' }} transition={{ repeat: Infinity, duration: 1.5 }} className="h-full bg-[var(--color-nova-green)]" />
              </div>
              <div className="text-[10px] font-mono text-gray-400 mt-2">
                1. Check fuel injection<br/>
                2. Ignite spark plugs<br/>
                3. Regulate alternator
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
