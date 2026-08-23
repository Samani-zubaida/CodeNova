import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronDown, ChevronUp, Lock, ShieldAlert, Key, Eye, ShieldCheck, Database } from 'lucide-react';
import VisualizerNav from '../../components/layout/VisualizerNav';

export default function EncapsulationVisualizer() {
  // Config
  const [className] = useState('UserAuth');
  
  // Interactive State
  const [passwordInput, setPasswordInput] = useState('');
  const [activeOperation, setActiveOperation] = useState(null); // 'login', 'direct', 'inspect'
  const [isError, setIsError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Internal (Encapsulated) State
  const [passwordHash, setPasswordHash] = useState('null');
  const [sessionToken, setSessionToken] = useState('null');
  const [showInternal, setShowInternal] = useState(false);
  
  // Console Output State
  const [outputLines, setOutputLines] = useState([{msg: "> UserAuth System Initialized.", isError: false}]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);

  const logOutput = (msg, isError = false) => {
    setOutputLines(prev => [...prev, { msg, isError }].slice(-8));
  };

  const handleDirectAccess = () => {
    setIsError(true);
    setActiveOperation('direct');
    logOutput(`> console.log(${className.toLowerCase()}._passwordHash)`, false);
    logOutput(`  Error: Property '_passwordHash' is strictly private.`, true);
    setTimeout(() => {
      setIsError(false);
      setActiveOperation(null);
    }, 2000);
  };

  const handleInspect = () => {
    setActiveOperation('inspect');
    setShowInternal(true);
    logOutput(`> Visualizing encapsulated memory space...`, false);
    logOutput(`  Internal state is securely hidden from external access.`, false);
    setTimeout(() => {
      setActiveOperation(null);
      setShowInternal(false);
    }, 3000);
  };

  const handleLogin = async () => {
    if (!passwordInput) return;
    
    setActiveOperation('login');
    logOutput(`> ${className.toLowerCase()}.login("****")`, false);
    logOutput(`  Encrypting payload...`, false);
    
    // Simulate hashing
    await new Promise(r => setTimeout(r, 600));
    const mockHash = "0x" + Math.random().toString(16).slice(2, 10).toUpperCase();
    const mockToken = "JWT_" + Math.random().toString(36).slice(2, 12).toUpperCase();
    
    setPasswordHash(mockHash);
    setSessionToken(mockToken);
    
    logOutput(`  Authentication Success!`, false);
    logOutput(`  Session token generated and securely stored.`, false);
    
    setIsLoggedIn(true);
    
    setTimeout(() => {
      setActiveOperation(null);
    }, 1000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPasswordHash('null');
    setSessionToken('null');
    logOutput(`> ${className.toLowerCase()}.logout()`, false);
    logOutput(`  Session cleared.`, false);
  };

  return (
    <div className="fixed top-[64px] bottom-0 left-0 right-0 bg-gray-50 dark:bg-[#09090b] flex flex-col lg:flex-row overflow-hidden">
      
      {/* Left Sidebar: Controls & Output */}
      <div className="w-full lg:w-[350px] xl:w-[400px] h-1/2 lg:h-full bg-white/80 dark:bg-black/40 backdrop-blur-xl border-r border-b lg:border-b-0 border-gray-200 dark:border-white/10 shadow-2xl flex flex-col z-10 shrink-0 overflow-y-auto">
        <div className="p-4 lg:p-6 flex flex-col gap-6 lg:gap-8 h-full">
          
          <VisualizerNav currentPath="/visualizer/encapsulation" />

          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-[var(--color-nova-brown)] tracking-tight mb-2">Encapsulation</h1>
            <p className="text-xs lg:text-sm text-gray-500 font-medium">Bundling data with methods that operate on it, and restricting direct access to internal state.</p>
          </div>

          {/* External Interface Form */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-white/10 pb-2">Client Application</h3>
            
            <div className="flex flex-col gap-4 bg-white dark:bg-[#161b22] p-6 rounded-xl border border-gray-200 dark:border-white/5 shadow-md">
              <div className="text-center font-bold text-lg border-b border-gray-100 dark:border-white/5 pb-2 mb-2">
                User Login
              </div>
              
              {!isLoggedIn ? (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500 font-bold">Password</label>
                    <input 
                      type="password" 
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter password..."
                      className="bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-800 rounded px-3 py-2 text-sm w-full font-mono focus:border-[var(--color-nova-brown)] outline-none"
                    />
                  </div>
                  
                  <button 
                    disabled={activeOperation !== null || !passwordInput} 
                    onClick={handleLogin} 
                    className="w-full bg-[var(--color-nova-brown)] text-white py-2 rounded text-sm font-bold shadow-sm hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-50 mt-2 transition-all"
                  >
                    <Key size={16} /> Authenticate
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 py-4">
                  <ShieldCheck size={48} className="text-green-500" />
                  <span className="font-bold text-green-500">Authenticated successfully</span>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded text-sm font-bold transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Operations */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-white/10 pb-2">Encapsulation Tests</h3>
            
            <div className="flex flex-col gap-2">
              <button disabled={activeOperation !== null} onClick={handleInspect} className="bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 py-2 rounded text-sm font-bold shadow-sm hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                <Eye size={16} /> Inspect Encapsulated Data
              </button>
              
              <button disabled={activeOperation !== null} onClick={handleDirectAccess} className="bg-red-500/10 border border-red-500/50 text-red-600 dark:text-red-400 py-2 rounded text-sm font-bold shadow-sm hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
                <ShieldAlert size={16} /> Force Access obj._passwordHash
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
          
          {/* Aesthetic glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-nova-brown)] opacity-5 blur-[100px] rounded-full pointer-events-none"></div>

          {/* Data Flow Animation */}
          <div className="absolute top-1/4 w-full flex justify-center pointer-events-none">
            <AnimatePresence>
              {activeOperation === 'login' && (
                <motion.div 
                  initial={{ y: -50, opacity: 0, scale: 0.8 }} 
                  animate={{ y: 80, opacity: 1, scale: 1 }} 
                  exit={{ y: 150, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 1 }}
                  className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 font-mono text-sm flex items-center gap-2 z-50 text-[var(--color-nova-brown)]"
                >
                  <Key size={14} /> Encrypting payload...
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* The Class Instance Vault */}
          <motion.div 
            animate={{ 
              scale: isError ? [1, 1.05, 0.95, 1.05, 0.95, 1] : 1,
              borderColor: isError ? 'rgb(239, 68, 68)' : (activeOperation === 'inspect' ? 'rgba(59, 130, 246, 0.6)' : 'rgba(217, 119, 87, 0.4)'),
              boxShadow: activeOperation === 'inspect' ? '0 0 40px rgba(59, 130, 246, 0.2)' : '0 20px 60px rgba(0,0,0,0.1)'
            }}
            transition={{ duration: 0.4 }}
            className={`w-full max-w-lg bg-white/60 dark:bg-black/60 backdrop-blur border-4 rounded-[40px] p-8 relative z-10 flex flex-col items-center`}
          >
            {/* Class Header */}
            <div className="absolute -top-4 bg-[var(--color-nova-brown)] text-white px-6 py-1.5 rounded-full font-bold shadow-md tracking-wider flex items-center gap-2">
              <Database size={16} /> Instance of {className}
            </div>

            {/* Public Interface */}
            <div className="w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 mt-6 flex flex-col items-center relative">
              <div className="absolute -top-3 bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs px-2 py-0.5 rounded uppercase tracking-widest font-bold">Public Interface</div>
              
              <div className="flex gap-4 w-full justify-center mb-6 text-sm font-mono font-bold">
                <motion.span 
                  animate={{ 
                    backgroundColor: activeOperation === 'login' ? 'var(--color-nova-green)' : 'rgba(217, 119, 87, 0.1)',
                    color: activeOperation === 'login' ? 'black' : 'var(--color-nova-brown)'
                  }}
                  className="px-3 py-1 rounded-md border border-[var(--color-nova-brown)]/20 transition-colors"
                >
                  + login(password)
                </motion.span>
                <span className="px-3 py-1 rounded-md border border-[var(--color-nova-brown)]/20 bg-[var(--color-nova-brown)]/10 text-[var(--color-nova-brown)]">
                  + logout()
                </span>
              </div>

              {/* Encapsulated Private Core */}
              <motion.div 
                animate={{
                  borderColor: activeOperation === 'inspect' ? 'rgba(59, 130, 246, 0.8)' : (isError ? 'rgba(239, 68, 68, 0.8)' : 'rgba(252, 165, 165, 0.2)'),
                  backgroundColor: activeOperation === 'inspect' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.05)'
                }}
                className="w-full border-2 rounded-xl p-8 flex flex-col gap-4 relative overflow-hidden transition-all duration-300"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-100 dark:bg-red-900/80 text-red-600 dark:text-red-400 text-xs px-3 py-1 rounded-b-md flex items-center gap-1 uppercase font-bold tracking-widest border-x border-b border-red-200 dark:border-red-800">
                  <Lock size={12} /> Encapsulated Private Data
                </div>

                <div className="flex justify-between items-center z-10 mt-4 border-b border-black/5 dark:border-white/5 pb-2">
                  <span className="font-mono text-red-500 font-semibold text-sm">- _passwordHash</span>
                  <motion.span 
                    animate={{ filter: showInternal ? 'blur(0px)' : 'blur(5px)', opacity: showInternal ? 1 : 0.5 }}
                    className="font-mono font-bold text-gray-800 dark:text-gray-200 text-xs bg-black/5 dark:bg-white/5 px-2 py-1 rounded"
                  >
                    {passwordHash}
                  </motion.span>
                </div>
                
                <div className="flex justify-between items-center z-10">
                  <span className="font-mono text-red-500 font-semibold text-sm">- _sessionToken</span>
                  <motion.span 
                    animate={{ filter: showInternal ? 'blur(0px)' : 'blur(5px)', opacity: showInternal ? 1 : 0.5 }}
                    className="font-mono font-bold text-gray-800 dark:text-gray-200 text-xs bg-black/5 dark:bg-white/5 px-2 py-1 rounded"
                  >
                    {sessionToken}
                  </motion.span>
                </div>

                {/* Direct Access Attack Line */}
                <AnimatePresence>
                  {activeOperation === 'direct' && (
                    <motion.div 
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute -top-12 left-1/4 w-2 h-24 bg-red-500 origin-top z-40 shadow-[0_0_15px_rgba(239,68,68,1)]"
                    >
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-white bg-red-500 rounded-full p-1"><ShieldAlert size={16}/></div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Pulse Effect */}
                <AnimatePresence>
                  {isError && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-red-500/20 z-0"
                    />
                  )}
                </AnimatePresence>
                
                {/* Inspect Scan Effect */}
                <AnimatePresence>
                  {activeOperation === 'inspect' && (
                    <motion.div 
                      initial={{ top: '-20%' }}
                      animate={{ top: '120%' }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-8 bg-gradient-to-b from-transparent via-blue-400/30 to-transparent z-0"
                    />
                  )}
                </AnimatePresence>

              </motion.div>
            </div>
          </motion.div>

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
