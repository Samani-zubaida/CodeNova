import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, Cpu, Camera, Send, Wifi, Layers, Activity, Sparkles, CheckCircle2, Zap, Eye, EyeOff, Sliders
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
    <div className="w-full flex-1 flex flex-col items-center justify-between text-[#FAF7F2] font-sans select-none space-y-3">
      {!isEmbedded && <VisualizerNav title="Abstraction: Smartphone & Microchip Studio" />}

      {/* TOP HEADER */}
      <div className="w-full max-w-6xl bg-[#331921]/90 backdrop-blur-xl border-2 border-[#F0E2A4] rounded-2xl p-4 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#F0E2A4] text-[#331921] font-extrabold shadow-lg">
            <Smartphone size={26} />
          </div>
          <div>
            <h3 className="text-base font-mono font-extrabold text-[#F0E2A4] uppercase tracking-wider">
              ABSTRACTION: SIMPLE INTERFACE VS COMPLEX INTERNALS
            </h3>
            <p className="text-xs text-[#BCA297]">
              Abstraction hides unnecessary background complexity and shows ONLY essential features to the user.
            </p>
          </div>
        </div>

        {/* X-Ray Circuit Toggle */}
        <button
          onClick={() => setShowInternalHardware(!showInternalHardware)}
          className={`px-4 py-2.5 rounded-xl font-mono text-xs font-extrabold shadow-xl transition-all flex items-center gap-2 ${
            showInternalHardware 
              ? 'bg-[#AB526B] text-white ring-2 ring-white scale-105' 
              : 'bg-[#C5CEAE] text-[#331921] hover:bg-[#A8B48D]'
          }`}
        >
          {showInternalHardware ? <EyeOff size={16} /> : <Eye size={16} />}
          <span>{showInternalHardware ? "Hide Hardware Complexity" : "🔍 Reveal Microchip Complexity"}</span>
        </button>
      </div>

      {/* TELEMETRY LOG BANNER */}
      <div className="w-full max-w-6xl py-3 px-6 rounded-2xl bg-[#423834] border-2 border-[#5C4E49] text-center font-mono text-xs md:text-sm font-bold shadow-xl text-[#F0E2A4] flex items-center justify-center gap-3">
        <Activity size={18} className="text-[#C5CEAE] animate-pulse" />
        <span>{logMessage}</span>
      </div>

      {/* MAIN CANVAS: SMARTPHONE & HARDWARE CIRCUIT */}
      <div className="w-full max-w-6xl bg-gradient-to-b from-[#140D0F] via-[#1E1417] to-[#2B1B21] border-2 border-[#5C4E49] rounded-3xl p-6 md:p-8 shadow-[0_0_90px_rgba(0,0,0,0.9)] relative overflow-hidden flex-1 flex items-center justify-center min-h-[460px]">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full max-w-4xl z-10">
          
          {/* SMARTPHONE USER INTERFACE (ABSTRACTED FRONT END) */}
          <div className="flex flex-col items-center">
            <div className="w-72 h-[380px] bg-[#140D0F] border-4 border-[#F0E2A4] rounded-[40px] p-4 shadow-[0_0_60px_rgba(240,226,164,0.4)] flex flex-col justify-between relative">
              {/* Phone Speaker Notch */}
              <div className="w-20 h-4 bg-[#331921] rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-6 h-1 bg-[#5C4E49] rounded-full" />
              </div>

              {/* Screen Content */}
              <div className="flex-1 bg-[#331921] rounded-2xl p-4 flex flex-col items-center justify-between border border-white/10 font-mono">
                <div className="text-center">
                  <span className="text-xs font-bold text-[#F0E2A4] block">Abstracted Phone Interface</span>
                  <span className="text-[10px] text-[#BCA297]">Simple Public Methods</span>
                </div>

                {/* Interactive Touch Buttons */}
                <div className="w-full space-y-3">
                  <button
                    onClick={() => handlePhoneAction('takePhoto', 'Capture 48MP Photo', 'phone.takePhoto()')}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-between transition-all ${
                      activeAction === 'takePhoto'
                        ? 'bg-[#F0E2A4] text-[#331921] scale-105 shadow-[0_0_25px_#F0E2A4]'
                        : 'bg-[#423834] text-[#FAF7F2] hover:bg-[#5C4E49]'
                    }`}
                  >
                    <span className="flex items-center gap-2"><Camera size={16} /> phone.takePhoto()</span>
                    <Zap size={14} />
                  </button>

                  <button
                    onClick={() => handlePhoneAction('sendMessage', 'Transmit Encrypted SMS', 'phone.sendMessage()')}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-between transition-all ${
                      activeAction === 'sendMessage'
                        ? 'bg-[#C5CEAE] text-[#331921] scale-105 shadow-[0_0_25px_#C5CEAE]'
                        : 'bg-[#423834] text-[#FAF7F2] hover:bg-[#5C4E49]'
                    }`}
                  >
                    <span className="flex items-center gap-2"><Send size={16} /> phone.sendMessage()</span>
                    <Zap size={14} />
                  </button>

                  <button
                    onClick={() => handlePhoneAction('payNFC', 'Process NFC Payment', 'phone.payNFC()')}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-between transition-all ${
                      activeAction === 'payNFC'
                        ? 'bg-[#AB526B] text-white scale-105 shadow-[0_0_25px_#AB526B]'
                        : 'bg-[#423834] text-[#FAF7F2] hover:bg-[#5C4E49]'
                    }`}
                  >
                    <span className="flex items-center gap-2"><Wifi size={16} /> phone.payNFC()</span>
                    <Zap size={14} />
                  </button>
                </div>

                <div className="text-[9px] text-[#BCA297] text-center">
                  Click any button to trigger the operation!
                </div>
              </div>
            </div>
          </div>

          {/* HARDWARE MICROCHIP CIRCUITRY (COMPLEXITY HIDDEN BY ABSTRACTION) */}
          <div className="flex flex-col items-center">
            <motion.div 
              animate={{ 
                borderColor: showInternalHardware ? '#AB526B' : '#5C4E49',
                scale: activeAction ? [1, 1.03, 1] : 1
              }}
              className={`w-full p-6 rounded-3xl bg-[#331921] border-4 shadow-2xl font-mono flex flex-col space-y-4 relative ${
                showInternalHardware ? 'shadow-[0_0_60px_rgba(171,82,107,0.6)]' : 'opacity-60'
              }`}
            >
              <div className="flex items-center justify-between border-b border-white/20 pb-2">
                <span className="text-sm font-extrabold text-[#AB526B] flex items-center gap-2">
                  <Cpu size={20} /> Microchip Hardware Circuitry
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#AB526B] text-white font-bold">
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
                ].map((chip, i) => (
                  <div 
                    key={chip.name}
                    className={`p-3 rounded-xl border text-center text-xs transition-all ${
                      chip.status !== 'IDLE' 
                        ? 'bg-[#F0E2A4] text-[#331921] border-white font-black animate-pulse' 
                        : 'bg-[#423834] text-[#BCA297] border-[#5C4E49]'
                    }`}
                  >
                    <div className="font-bold">{chip.name}</div>
                    <div className="text-[9px] mt-1 font-mono">{chip.status}</div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-[#423834] border border-[#5C4E49] text-[11px] text-[#F0E2A4] font-bold text-center">
                💡 Abstraction Principle: The user ONLY sees 3 simple buttons on the phone screen while 1,000+ hardware signals fire under the hood!
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </div>
  );
}
