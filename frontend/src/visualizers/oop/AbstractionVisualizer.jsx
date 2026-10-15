import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, Cpu, Camera, Send, Wifi, Activity, Zap, Eye, EyeOff 
} from 'lucide-react';
import VisualizerNav from '../../components/layout/VisualizerNav';

export default function AbstractionVisualizer({ isEmbedded = false }) {
  const [showInternalHardware, setShowInternalHardware] = useState(false);
  const [activeAction, setActiveAction] = useState(null); // 'photo' | 'message' | 'pay'
  const [logMessage, setLogMessage] = useState("Abstraction Studio: Tap any button on the smartphone to execute a complex task without worrying about microchip circuitry!");

  const handlePhoneAction = async (actionType, title, codeSnippet) => {
    if (activeAction) return;
    setActiveAction(actionType);
    setLogMessage(`📱 EXECUTING PUBLIC METHOD: phone.${actionType}() [${title}]`);

    await new Promise(r => setTimeout(r, 1600));
    setActiveAction(null);
    setLogMessage(`✅ COMPLETED: ${title}. Abstraction hid 10,000+ lines of microchip assembly code!`);
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-between text-slate-800 dark:text-slate-100 font-sans select-none space-y-3">
      {!isEmbedded && <VisualizerNav title="Abstraction: Smartphone & Microchip Studio" />}

      {/* TOP HEADER */}
      <div className="w-full max-w-6xl bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-emerald-500/20 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 font-extrabold shadow-sm">
            <Smartphone size={26} />
          </div>
          <div>
            <h3 className="text-base font-mono font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              ABSTRACTION: SIMPLE INTERFACE VS COMPLEX INTERNALS
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Abstraction hides unnecessary background complexity and shows ONLY essential features to the user.
            </p>
          </div>
        </div>

        {/* X-Ray Circuit Toggle */}
        <button
          onClick={() => setShowInternalHardware(!showInternalHardware)}
          className={`px-4 py-2.5 rounded-xl font-mono text-xs font-extrabold shadow-md transition-all flex items-center gap-2 ${
            showInternalHardware 
              ? 'bg-emerald-600 text-white shadow-emerald-500/30 scale-105' 
              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white'
          }`}
        >
          {showInternalHardware ? <EyeOff size={16} /> : <Eye size={16} />}
          <span>{showInternalHardware ? "Hide Hardware Complexity" : "🔍 Reveal Microchip Complexity"}</span>
        </button>
      </div>

      {/* TELEMETRY LOG BANNER */}
      <div className="w-full max-w-6xl py-3 px-6 rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 text-center font-mono text-xs md:text-sm font-bold shadow-md text-slate-800 dark:text-slate-200 flex items-center justify-center gap-3">
        <Activity size={18} className="text-emerald-500 animate-pulse" />
        <span className="text-slate-700 dark:text-emerald-300">{logMessage}</span>
      </div>

      {/* MAIN CANVAS: SMARTPHONE & HARDWARE CIRCUIT */}
      <div className="w-full max-w-6xl bg-slate-950/95 dark:bg-[#070A11] border border-slate-200/80 dark:border-emerald-500/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex-1 flex items-center justify-center min-h-[460px]">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full max-w-4xl z-10">
          
          {/* SMARTPHONE USER INTERFACE (ABSTRACTED FRONT END) */}
          <div className="flex flex-col items-center">
            <div className="w-72 h-[380px] bg-slate-900 border-4 border-emerald-400/80 rounded-[40px] p-4 shadow-[0_0_50px_rgba(16,185,129,0.3)] flex flex-col justify-between relative">
              {/* Phone Speaker Notch */}
              <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-6 h-1 bg-slate-600 rounded-full" />
              </div>

              {/* Screen Content */}
              <div className="flex-1 bg-slate-950/90 rounded-2xl p-4 flex flex-col items-center justify-between border border-white/10 font-mono">
                <div className="text-center">
                  <span className="text-xs font-bold text-emerald-400 block tracking-wide">Abstracted Phone Interface</span>
                  <span className="text-[10px] text-slate-400">Simple Public Methods</span>
                </div>

                {/* Interactive Touch Buttons */}
                <div className="w-full space-y-3">
                  <button
                    onClick={() => handlePhoneAction('takePhoto', 'Capture 48MP Photo', 'phone.takePhoto()')}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-between transition-all ${
                      activeAction === 'takePhoto'
                        ? 'bg-emerald-500 text-white scale-105 shadow-[0_0_20px_#10B981]'
                        : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    <span className="flex items-center gap-2"><Camera size={16} /> phone.takePhoto()</span>
                    <Zap size={14} />
                  </button>

                  <button
                    onClick={() => handlePhoneAction('sendMessage', 'Transmit Encrypted SMS', 'phone.sendMessage()')}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-between transition-all ${
                      activeAction === 'sendMessage'
                        ? 'bg-sky-500 text-white scale-105 shadow-[0_0_20px_#38BDF8]'
                        : 'bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30'
                    }`}
                  >
                    <span className="flex items-center gap-2"><Send size={16} /> phone.sendMessage()</span>
                    <Zap size={14} />
                  </button>

                  <button
                    onClick={() => handlePhoneAction('payNFC', 'Process NFC Payment', 'phone.payNFC()')}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-between transition-all ${
                      activeAction === 'payNFC'
                        ? 'bg-amber-500 text-white scale-105 shadow-[0_0_20px_#F59E0B]'
                        : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    <span className="flex items-center gap-2"><Wifi size={16} /> phone.payNFC()</span>
                    <Zap size={14} />
                  </button>
                </div>

                <div className="text-[9px] text-slate-400 text-center">
                  Click any button to trigger the operation!
                </div>
              </div>
            </div>
          </div>

          {/* HARDWARE MICROCHIP CIRCUITRY (COMPLEXITY HIDDEN BY ABSTRACTION) */}
          <div className="flex flex-col items-center">
            <motion.div 
              animate={{ 
                borderColor: showInternalHardware ? '#10B981' : '#334155',
                scale: activeAction ? [1, 1.02, 1] : 1
              }}
              className={`w-full p-6 rounded-3xl bg-slate-900/90 border-2 shadow-2xl font-mono flex flex-col space-y-4 relative ${
                showInternalHardware ? 'shadow-[0_0_50px_rgba(16,185,129,0.3)]' : 'opacity-70'
              }`}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-sm font-extrabold text-emerald-400 flex items-center gap-2">
                  <Cpu size={20} /> Microchip Hardware Circuitry
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${showInternalHardware ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'}`}>
                  {showInternalHardware ? "VISIBLE" : "HIDDEN BY ABSTRACTION"}
                </span>
              </div>

              {/* Hardware Circuit Nodes */}
              <div className="grid grid-cols-2 gap-3 py-2">
                {[
                  { name: 'CMOS Sensor Matrix', status: activeAction === 'takePhoto' ? 'FIRING' : 'IDLE' },
                  { name: '5G Baseband Modem', status: activeAction === 'sendMessage' ? 'TRANSMITTING' : 'IDLE' },
                  { name: 'Secure Element NFC Chip', status: activeAction === 'payNFC' ? 'ENCRYPTING' : 'IDLE' },
                  { name: 'Octa-Core Neural Engine', status: activeAction ? 'PROCESSING' : 'IDLE' }
                ].map((chip) => (
                  <div 
                    key={chip.name}
                    className={`p-3 rounded-xl border text-center text-xs transition-all ${
                      chip.status !== 'IDLE' 
                        ? 'bg-emerald-500 text-white font-black animate-pulse shadow-[0_0_20px_#10B981] border-emerald-300' 
                        : 'bg-slate-800/80 text-slate-300 border-slate-700'
                    }`}
                  >
                    <div className="font-bold">{chip.name}</div>
                    <div className={`text-[9px] mt-1 font-mono font-bold ${chip.status !== 'IDLE' ? 'text-emerald-100' : 'text-slate-400'}`}>{chip.status}</div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-emerald-500/20 text-[11px] text-emerald-300 font-bold text-center">
                💡 Abstraction Principle: The user ONLY sees 3 simple buttons on the phone screen while 1,000+ hardware signals fire under the hood!
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </div>
  );
}
