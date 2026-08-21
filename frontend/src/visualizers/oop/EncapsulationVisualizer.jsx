import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Eye, EyeOff } from 'lucide-react';

export default function EncapsulationVisualizer() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [secret, setSecret] = useState("Hidden Data");

  return (
    <div className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl p-8 flex flex-col items-center">
      <h3 className="text-xl font-bold mb-2 text-[var(--color-nova-brown)]">Encapsulation</h3>
      <p className="text-sm text-gray-500 mb-8">Bundling data and methods, restricting direct access to some components.</p>

      <div className="flex flex-col md:flex-row gap-12 w-full max-w-2xl">
        
        {/* Class Capsule */}
        <div className="flex-1 bg-gray-100 dark:bg-black/40 border-4 border-[var(--color-nova-brown)] rounded-[40px] p-6 relative overflow-hidden flex flex-col shadow-inner">
          <div className="absolute top-0 left-0 w-full bg-[var(--color-nova-brown)] text-white text-center font-bold py-1">Class: UserAccount</div>
          
          <div className="mt-8 flex flex-col gap-6 relative z-10">
            {/* Private Data */}
            <div className="border border-red-300 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-red-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Lock size={12} /> private _balance
                </span>
                <motion.span 
                  animate={{ filter: isUnlocked ? 'blur(0px)' : 'blur(5px)' }}
                  className="font-mono text-xl mt-1 text-black dark:text-white"
                >
                  $1,250.00
                </motion.span>
              </div>
            </div>

            {/* Public Method */}
            <div className="border border-green-300 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
              <span className="text-xs text-green-600 font-bold uppercase tracking-wider flex items-center gap-1 mb-2">
                <Unlock size={12} /> public getBalance()
              </span>
              <button 
                onClick={() => setIsUnlocked(!isUnlocked)}
                className="w-full bg-[var(--color-nova-green)] text-black font-semibold py-2 rounded hover:bg-white transition-colors flex justify-center items-center gap-2"
              >
                {isUnlocked ? <><EyeOff size={16}/> Hide Data</> : <><Eye size={16}/> Call Method</>}
              </button>
            </div>
          </div>
        </div>

        {/* External Code */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-gray-900 text-gray-300 p-4 rounded-lg font-mono text-sm leading-relaxed shadow-xl">
            <span className="text-[var(--color-nova-red)]">const</span> account = <span className="text-[var(--color-nova-red)]">new</span> <span className="text-[var(--color-nova-wheat)]">UserAccount</span>();
            <br/><br/>
            <span className="text-gray-500">// ERROR: Cannot access private property</span><br/>
            <span className="line-through text-red-400">console.log(account._balance);</span>
            <br/><br/>
            <span className="text-gray-500">// SUCCESS: Access via public getter</span><br/>
            <span className={isUnlocked ? "text-[var(--color-nova-green)]" : ""}>console.log(account.getBalance());</span>
          </div>
        </div>

      </div>
    </div>
  );
}
