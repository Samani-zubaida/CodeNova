import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EncapsulationVisualizer() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [secret, setSecret] = useState("Hidden Data");

  return (
    <div className="w-full max-w-6xl mx-auto glass-card p-8 min-h-[600px] flex flex-col relative">
      
      <Link to="/visualizer" className="absolute top-8 left-8 text-gray-500 hover:text-[var(--color-nova-red)] transition-colors flex items-center gap-2 font-semibold z-10">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <div className="text-center mt-12 mb-12">
        <h1 className="text-4xl font-extrabold mb-4 text-[var(--color-nova-brown)] tracking-tight">Encapsulation</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Bundling data and methods, restricting direct access to some components to prevent accidental interference and misuse.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 w-full flex-1 items-center justify-center">
        
        {/* Class Capsule */}
        <div className="w-full lg:w-1/2 bg-gray-100 dark:bg-black/40 border-4 border-[var(--color-nova-brown)] rounded-[40px] p-8 relative overflow-hidden flex flex-col shadow-inner">
          <div className="absolute top-0 left-0 w-full bg-[var(--color-nova-brown)] text-white text-center font-bold py-2 tracking-widest uppercase">Class: UserAccount</div>
          
          <div className="mt-12 flex flex-col gap-6 relative z-10">
            {/* Private Data */}
            <div className="border border-red-300 bg-red-50 dark:bg-red-900/20 p-6 rounded-xl flex items-center justify-between shadow-sm">
              <div className="flex flex-col">
                <span className="text-sm text-red-500 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Lock size={16} /> private _balance
                </span>
                <motion.span 
                  animate={{ filter: isUnlocked ? 'blur(0px)' : 'blur(8px)' }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-3xl mt-2 text-black dark:text-white font-bold"
                >
                  $1,250.00
                </motion.span>
              </div>
            </div>

            {/* Public Method */}
            <div className="border border-green-300 bg-green-50 dark:bg-green-900/20 p-6 rounded-xl shadow-sm">
              <span className="text-sm text-green-600 font-bold uppercase tracking-wider flex items-center gap-2 mb-4">
                <Unlock size={16} /> public getBalance()
              </span>
              <button 
                onClick={() => setIsUnlocked(!isUnlocked)}
                className="w-full bg-[var(--color-nova-green)] text-black font-bold py-3 rounded-lg hover:bg-white transition-colors flex justify-center items-center gap-2 shadow-sm hover:shadow-md"
              >
                {isUnlocked ? <><EyeOff size={18}/> Hide Data</> : <><Eye size={18}/> Call Method</>}
              </button>
            </div>
          </div>
        </div>

        {/* External Code */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div className="bg-[#0d1117] text-[#c9d1d9] p-8 rounded-xl font-mono text-base leading-relaxed shadow-xl border border-white/10">
            <span className="text-[#ff7b72]">const</span> account = <span className="text-[#ff7b72]">new</span> <span className="text-[#d2a8ff]">UserAccount</span>();
            <br/><br/>
            <span className="text-[#8b949e] italic">// ERROR: Cannot access private property</span><br/>
            <span className="line-through text-red-400 opacity-70">console.log(account._balance);</span>
            <br/><br/>
            <span className="text-[#8b949e] italic">// SUCCESS: Access via public getter</span><br/>
            <motion.span 
              animate={{ color: isUnlocked ? '#7ee787' : '#c9d1d9' }}
              className="inline-block transition-colors font-bold"
            >
              console.log(account.getBalance());
            </motion.span>
          </div>
        </div>

      </div>
    </div>
  );
}
