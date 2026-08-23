import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronDown, ChevronUp, Play, Settings, CreditCard, ShieldAlert, Database, Banknote, ShieldCheck } from 'lucide-react';
import VisualizerNav from '../../components/layout/VisualizerNav';

export default function AbstractionVisualizer() {
  const [amount, setAmount] = useState(50);
  
  const [isRunning, setIsRunning] = useState(false);
  const [internalState, setInternalState] = useState(0); // 0: Idle, 1: Auth, 2: Fraud, 3: Ledger, 4: Dispense

  // Console Output State
  const [outputLines, setOutputLines] = useState([{msg: "> BankAccount API Initialized.", isError: false}]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);

  const logOutput = (msg, isError = false) => {
    setOutputLines(prev => [...prev, { msg, isError }].slice(-8));
  };

  const triggerWithdraw = () => {
    if (isRunning) return;
    setIsRunning(true);
    setInternalState(1);
    logOutput(`> account.withdraw(${amount})`, false);
    logOutput(`  User triggered simple withdraw interface.`, false);
  };

  useEffect(() => {
    let timer;
    if (isRunning) {
      if (internalState === 1) {
        logOutput(`  [Abstracted] Verifying Account Balance...`);
        timer = setTimeout(() => setInternalState(2), 1500);
      } else if (internalState === 2) {
        logOutput(`  [Abstracted] Running Fraud Detection Algorithms...`);
        timer = setTimeout(() => setInternalState(3), 1500);
      } else if (internalState === 3) {
        logOutput(`  [Abstracted] Updating Ledger Database (ACID Transaction)...`);
        timer = setTimeout(() => setInternalState(4), 1500);
      } else if (internalState === 4) {
        logOutput(`  [Abstracted] Triggering Hardware Dispenser...`);
        timer = setTimeout(() => {
          logOutput(`> Cash dispensed! Return control to user.`, false);
          setInternalState(0);
          setIsRunning(false);
        }, 1500);
      }
    }
    return () => clearTimeout(timer);
  }, [isRunning, internalState]);

  return (
    <div className="fixed top-[64px] bottom-0 left-0 right-0 bg-gray-50 dark:bg-[#09090b] flex flex-col lg:flex-row overflow-hidden">
      
      {/* Left Sidebar: Controls & Output */}
      <div className="w-full lg:w-[350px] xl:w-[400px] h-1/2 lg:h-full bg-white/80 dark:bg-black/40 backdrop-blur-xl border-r border-b lg:border-b-0 border-gray-200 dark:border-white/10 shadow-2xl flex flex-col z-10 shrink-0 overflow-y-auto">
        <div className="p-4 lg:p-6 flex flex-col gap-6 lg:gap-8 h-full">
          
          <VisualizerNav currentPath="/visualizer/abstraction" />

          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-[var(--color-nova-red)] tracking-tight mb-2">Abstraction</h1>
            <p className="text-xs lg:text-sm text-gray-500 font-medium">Hiding complex implementation details behind a simple interface so the user doesn't need to understand the underlying logic.</p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-white/10 pb-2">The Interface (User View)</h3>
            <p className="text-xs text-gray-500">The user only interacts with a simple ATM screen. They don't need to know how banking regulations or databases work.</p>
            
            <div className="bg-blue-900 text-white p-6 rounded-xl shadow-inner border-4 border-gray-300 dark:border-gray-700 flex flex-col items-center gap-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-4 bg-gray-800"></div>
              <h2 className="text-xl font-bold mt-2">NOVA BANK ATM</h2>
              
              <div className="flex items-center gap-2 bg-blue-950 p-2 rounded">
                <span className="font-bold text-lg">$</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  disabled={isRunning}
                  className="bg-transparent text-white font-mono text-xl w-24 outline-none text-center disabled:opacity-50"
                />
              </div>

              <button 
                disabled={isRunning}
                onClick={triggerWithdraw}
                className={`w-full py-3 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-md font-bold ${isRunning ? 'bg-gray-500 text-white cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600 hover:scale-[1.02]'}`}
              >
                <Banknote size={20} /> WITHDRAW CASH
              </button>
            </div>
          </div>
          
          <div className="mt-auto pt-8"></div>
        </div>
      </div>

      {/* Right Canvas: Visualization & Console */}
      <div className="w-full lg:flex-1 h-1/2 lg:h-full flex flex-col relative overflow-hidden bg-gray-50/50 dark:bg-black/20">
        
        {/* Main Visualization Area */}
        <div className="flex-1 flex flex-col p-8 lg:p-12 overflow-y-auto overflow-x-auto relative items-center justify-center min-h-[400px]">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-nova-red)] opacity-5 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="w-full max-w-3xl bg-white/60 dark:bg-black/60 backdrop-blur border-4 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-8 shadow-lg relative z-10 flex flex-col items-center">
            
            <div className="absolute -top-4 bg-gray-800 text-white px-6 py-1.5 rounded-full font-bold shadow-md tracking-wider text-sm flex items-center gap-2">
              <Settings size={14}/> Abstracted Internal Implementation (Hidden from User)
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-4">
              
              {/* Balance Check */}
              <div className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-4 transition-all duration-500 ${internalState === 1 ? 'border-blue-500 bg-blue-500/20 scale-110 shadow-[0_0_30px_rgba(59,130,246,0.4)]' : 'border-gray-200 dark:border-gray-800 bg-black/5 dark:bg-white/5 opacity-50'}`}>
                <CreditCard size={32} className={internalState === 1 ? 'text-blue-500' : 'text-gray-400'} />
                <div className="text-center font-mono text-xs font-bold leading-tight">
                  1. Balance<br/><span className="text-[10px] text-gray-500 font-normal">Verification</span>
                </div>
              </div>

              {/* Fraud Check */}
              <div className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-4 transition-all duration-500 ${internalState === 2 ? 'border-orange-500 bg-orange-500/20 scale-110 shadow-[0_0_30px_rgba(249,115,22,0.4)]' : 'border-gray-200 dark:border-gray-800 bg-black/5 dark:bg-white/5 opacity-50'}`}>
                <ShieldAlert size={32} className={internalState === 2 ? 'text-orange-500' : 'text-gray-400'} />
                <div className="text-center font-mono text-xs font-bold leading-tight">
                  2. Fraud<br/><span className="text-[10px] text-gray-500 font-normal">Detection ML</span>
                </div>
              </div>

              {/* Ledger DB */}
              <div className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-4 transition-all duration-500 ${internalState === 3 ? 'border-purple-500 bg-purple-500/20 scale-110 shadow-[0_0_30px_rgba(168,85,247,0.4)]' : 'border-gray-200 dark:border-gray-800 bg-black/5 dark:bg-white/5 opacity-50'}`}>
                <Database size={32} className={internalState === 3 ? 'text-purple-500' : 'text-gray-400'} />
                <div className="text-center font-mono text-xs font-bold leading-tight">
                  3. Ledger<br/><span className="text-[10px] text-gray-500 font-normal">ACID Transaction</span>
                </div>
              </div>
              
              {/* Hardware API */}
              <div className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-4 transition-all duration-500 ${internalState === 4 ? 'border-green-500 bg-green-500/20 scale-110 shadow-[0_0_30px_rgba(34,197,94,0.4)]' : 'border-gray-200 dark:border-gray-800 bg-black/5 dark:bg-white/5 opacity-50'}`}>
                <Settings size={32} className={internalState === 4 ? 'text-green-500' : 'text-gray-400'} />
                <div className="text-center font-mono text-xs font-bold leading-tight">
                  4. Hardware<br/><span className="text-[10px] text-gray-500 font-normal">Dispense API</span>
                </div>
              </div>

            </div>

            {/* Connecting Data Flow */}
            <div className="w-full mt-12 space-y-2 relative">
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: isRunning ? '100%' : '-100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-[var(--color-nova-red)] to-transparent"
                />
              </div>
              
              {/* Highlight Overlay to emphasize "Abstraction" */}
              <AnimatePresence>
                {isRunning && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -inset-8 border-2 border-[var(--color-nova-red)]/50 rounded-3xl bg-[var(--color-nova-red)]/5 pointer-events-none flex items-center justify-center -z-10"
                  >
                    <span className="absolute top-2 right-4 text-[var(--color-nova-red)] font-bold tracking-widest uppercase text-xs opacity-70">
                      Abstracted Layer
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>

        {/* Output Console Panel */}
        <div className={`w-full bg-[#0d1117] border-t border-white/10 flex flex-col shrink-0 font-mono shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20 transition-all duration-300 ${isConsoleOpen ? 'h-48 lg:h-56' : 'h-10'}`}>
          <div 
            onClick={() => setIsConsoleOpen(!isConsoleOpen)}
            className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/5 cursor-pointer hover:bg-[#1f2630] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-gray-400" />
              <span className="text-xs text-gray-400 font-bold tracking-wider">CONSOLE OUTPUT</span>
            </div>
            {isConsoleOpen ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronUp size={14} className="text-gray-400" />}
          </div>
          <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-1 text-sm">
            <AnimatePresence initial={false}>
              {outputLines.map((line, i) => (
                <motion.div 
                  key={`${i}-${line.msg}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${line.msg.startsWith('>') ? 'text-[#7ee787]' : (line.isError ? 'text-red-400 ml-4 font-bold' : 'text-[#c9d1d9] ml-4 opacity-80')}`}
                >
                  {line.msg}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>

    </div>
  );
}
