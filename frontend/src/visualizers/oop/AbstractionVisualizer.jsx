import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Smartphone, Cpu, Camera, Send, Wifi, Activity, Zap, Eye, EyeOff
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { useAuth } from '../../context/AuthContext';
import OopStudioWorkspace from './components/common/OopStudioWorkspace';

const JAVA_ABSTRACTION_CODE = `// Abstraction: Public Interface defining what the object does, hiding how it works
public interface Smartphone {
    void takePhoto();   // Contracts for high-resolution image processing
    void sendMessage(); // Contracts for 5G cellular communication
    void payNFC();      // Contracts for contactless secure token payment
}

// Low-Level Concrete Engine (Hardware Complexity Hidden)
class ModernPhone implements Smartphone {
    public void takePhoto() {
        System.out.println("Photon photodiodes captured 48MP image.");
    }

    public void sendMessage() {
        System.out.println("Payload routed through 5G cellular network.");
    }

    public void payNFC() {
        System.out.println("Contactless 13.56 MHz electromagnetic transaction authorized.");
    }
}`;

const ABSTRACTION_PHASES = [
  {
    id: 'interface',
    stepNumber: 1,
    title: 'Public API Interface',
    tag: 'ABSTRACT COCKPIT',
    desc: 'The user only interacts with 3 simple, declarative method buttons. No low-level hardware or signal routing knowledge required.',
    accentColor: '#10B981',
    principleInsight: 'Abstraction provides clean contracts (methods) while keeping internal complexity fully hidden.'
  },
  {
    id: 'takePhoto',
    stepNumber: 2,
    title: 'Camera Method: takePhoto()',
    tag: 'SENSOR SUBSYSTEM',
    desc: 'Executing phone.takePhoto() fires the CMOS sensor matrix, exposes photon photodiodes, and applies demosaic algorithms.',
    accentColor: '#10B981',
    principleInsight: 'The caller simply writes "phone.takePhoto()" without managing low-level voltage drivers.'
  },
  {
    id: 'sendMessage',
    stepNumber: 3,
    title: 'Network Method: sendMessage()',
    tag: 'MODEM SUBSYSTEM',
    desc: 'Executing phone.sendMessage() primes the 5G baseband modem, packetizes payload, and routes through cellular towers.',
    accentColor: '#0EA5E9',
    principleInsight: 'Callers are decoupled from networking hardware protocols through procedural encapsulation.'
  },
  {
    id: 'payNFC',
    stepNumber: 4,
    title: 'Secure Method: payNFC()',
    tag: 'SECURE ELEMENT',
    desc: 'Executing phone.payNFC() triggers biometric enclave authentication and contactless 13.56 MHz electromagnetic coupling.',
    accentColor: '#F59E0B',
    principleInsight: 'Cryptographic transactions occur securely behind a single unified boolean public contract.'
  },
  {
    id: 'xray',
    stepNumber: 5,
    title: 'Complexity Boundary',
    tag: 'INTERNAL COMPLEXITY',
    desc: 'Under the hood, 10,000+ microchip pathways process instructions. Abstraction protects developers from this noise.',
    accentColor: '#8B5CF6',
    principleInsight: 'Abstraction reduces cognitive load, allowing engineers to build complex software by combining simple interfaces.'
  }
];

export default function AbstractionVisualizer({ isEmbedded = false, onNext }) {
  const { theme } = useAppStore();
  const { isAuthenticated, requireAuth } = useAuth();
  const isDark = theme === 'dark' || !theme;
  const isWarm = theme === 'warm';

  const [showInternalHardware, setShowInternalHardware] = useState(false);
  const [activeAction, setActiveAction] = useState(null); // 'takePhoto' | 'sendMessage' | 'payNFC'
  const [activePhaseId, setActivePhaseId] = useState('interface');
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [logMessage, setLogMessage] = useState("Tap any button on the smartphone to execute a complex task without worrying about microchip circuitry!");

  const handlePhoneAction = async (actionType, title) => {
    if (!requireAuth(null, { message: 'Please log in first to access this feature.' })) return;
    if (activeAction) return;
    setActiveAction(actionType);
    setActivePhaseId(actionType);
    setLogMessage(`Executing phone.${actionType}() [${title}]`);

    await new Promise(r => setTimeout(r, 1600));
    setActiveAction(null);
    setLogMessage(`Completed: ${title}. Abstraction hid 10,000+ lines of microchip assembly code!`);
  };

  const handleSelectPhase = (phaseId) => {
    if (phaseId !== 'interface' && !requireAuth(null, { message: 'Please log in first to access this feature.' })) return;
    setActivePhaseId(phaseId);
    if (phaseId === 'takePhoto') {
      handlePhoneAction('takePhoto', 'Capture 48MP Photo');
    } else if (phaseId === 'sendMessage') {
      handlePhoneAction('sendMessage', 'Transmit Encrypted SMS');
    } else if (phaseId === 'payNFC') {
      handlePhoneAction('payNFC', 'Process NFC Payment');
    } else if (phaseId === 'xray') {
      setShowInternalHardware(true);
    } else {
      setShowInternalHardware(false);
    }
  };

  return (
    <OopStudioWorkspace
      conceptName="Abstraction"
      conceptSubtitle="OOP PILLAR • HIDING COMPLEXITY"
      conceptDesc="Abstraction hides internal microchip and protocol complexity, presenting a clean, declarative public interface."
      conceptIcon={Smartphone}
      conceptAccent="#10B981"
      phases={ABSTRACTION_PHASES}
      activePhaseId={activePhaseId}
      onSelectPhase={handleSelectPhase}
      onReplay={() => handleSelectPhase('interface')}
      primaryAction={{
        label: showInternalHardware ? 'Hide Internals' : 'X-Ray Internals',
        onClick: () => {
          const next = !showInternalHardware;
          setShowInternalHardware(next);
          if (next) setActivePhaseId('xray');
        },
        icon: showInternalHardware ? <EyeOff size={13} className="text-emerald-400" /> : <Eye size={13} className="text-emerald-400" />
      }}
      isCodeOpen={isCodeOpen}
      onToggleCode={() => setIsCodeOpen(prev => !prev)}
      codeFilename="Smartphone.java"
      rawCode={JAVA_ABSTRACTION_CODE}
      activeLineNumbers={
        activePhaseId === 'interface' ? [2, 3, 4, 5] :
          activePhaseId === 'takePhoto' ? [3, 10, 11] :
            activePhaseId === 'sendMessage' ? [4, 14, 15] :
              activePhaseId === 'payNFC' ? [5, 18, 19] :
                [8, 9]
      }
      activeBadgeText={
        activePhaseId === 'interface' ? 'INTERFACE' :
          activePhaseId === 'takePhoto' ? 'METHOD' :
            activePhaseId === 'sendMessage' ? 'NETWORK' :
              activePhaseId === 'payNFC' ? 'SECURE' :
                'IMPLEMENTATION'
      }
      canvasHeaderTitle="Interactive Smartphone & Circuitry Cockpit"
      canvasHeaderBadge="LIVE DISPATCH"
      canvasHeaderActions={
        <button
          type="button"
          onClick={() => {
            const next = !showInternalHardware;
            setShowInternalHardware(next);
            if (next) setActivePhaseId('xray');
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${showInternalHardware
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            : (isDark ? 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300')
            }`}
        >
          {showInternalHardware ? <EyeOff size={12} /> : <Eye size={12} />}
          <span>{showInternalHardware ? 'Hide X-Ray' : 'X-Ray Microchip'}</span>
        </button>
      }
      nextConcept={{
        label: "Next: Inheritance",
        onNext: onNext
      }}
    >
      <div className="w-full max-w-4xl flex flex-col items-center justify-center py-4">

        {/* Realtime Action Toast / Telemetry Banner */}
        {activeAction && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 py-2 px-4 rounded-xl border text-center font-mono text-xs font-bold flex items-center justify-center gap-2 bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-lg"
          >
            <Activity size={14} className="animate-pulse" />
            <span>{logMessage}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center w-full">

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
                  <span className="text-[10px] text-slate-400">Simple Public Contracts</span>
                </div>

                {/* Interactive Touch Buttons */}
                <div className="w-full space-y-2.5">
                  <button
                    onClick={() => handlePhoneAction('takePhoto', 'Capture 48MP Photo')}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${activeAction === 'takePhoto'
                        ? 'bg-emerald-500 text-white scale-105 shadow-[0_0_20px_#10B981]'
                        : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30'
                      }`}
                  >
                    <span className="flex items-center gap-2"><Camera size={15} /> phone.takePhoto()</span>
                    <Zap size={13} />
                  </button>

                  <button
                    onClick={() => handlePhoneAction('sendMessage', 'Transmit Encrypted SMS')}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${activeAction === 'sendMessage'
                        ? 'bg-sky-500 text-white scale-105 shadow-[0_0_20px_#38BDF8]'
                        : 'bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30'
                      }`}
                  >
                    <span className="flex items-center gap-2"><Send size={15} /> phone.sendMessage()</span>
                    <Zap size={13} />
                  </button>

                  <button
                    onClick={() => handlePhoneAction('payNFC', 'Process NFC Payment')}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${activeAction === 'payNFC'
                        ? 'bg-amber-500 text-white scale-105 shadow-[0_0_20px_#F59E0B]'
                        : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
                      }`}
                  >
                    <span className="flex items-center gap-2"><Wifi size={15} /> phone.payNFC()</span>
                    <Zap size={13} />
                  </button>
                </div>

                <div className="text-[9px] text-slate-400 text-center">
                  Click any button to trigger the operation!
                </div>
              </div>
            </div>
          </div>

          {/* HARDWARE MICROCHIP CIRCUITRY (COMPLEXITY HIDDEN BY ABSTRACTION) */}
          <div className="flex flex-col items-center w-full">
            <motion.div
              animate={{
                borderColor: showInternalHardware ? '#10B981' : (isDark ? '#334155' : '#CBD5E1'),
                scale: activeAction ? [1, 1.02, 1] : 1
              }}
              className={`w-full p-5 sm:p-6 rounded-3xl border-2 shadow-2xl font-mono flex flex-col space-y-3.5 relative transition-all ${isDark ? 'bg-slate-900/90' : 'bg-white'
                } ${showInternalHardware ? 'shadow-[0_0_50px_rgba(16,185,129,0.25)]' : 'opacity-85'
                }`}
            >
              <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-white/10">
                <span className={`text-sm font-extrabold flex items-center gap-2 ${isDark ? 'text-emerald-400' : 'text-emerald-700'
                  }`}>
                  <Cpu size={18} /> Microchip Hardware Circuitry
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${showInternalHardware
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40'
                    : isDark
                      ? 'bg-slate-800 text-slate-400 border-slate-700'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}>
                  {showInternalHardware ? "VISIBLE" : "HIDDEN BY ABSTRACTION"}
                </span>
              </div>

              {/* Hardware Circuit Nodes */}
              <div className="grid grid-cols-2 gap-2.5 py-1">
                {[
                  { name: 'CMOS Sensor Matrix', status: activeAction === 'takePhoto' ? 'FIRING' : 'IDLE' },
                  { name: '5G Baseband Modem', status: activeAction === 'sendMessage' ? 'TRANSMITTING' : 'IDLE' },
                  { name: 'Secure Element NFC Chip', status: activeAction === 'payNFC' ? 'ENCRYPTING' : 'IDLE' },
                  { name: 'Octa-Core Neural Engine', status: activeAction ? 'PROCESSING' : 'IDLE' }
                ].map((chip) => (
                  <div
                    key={chip.name}
                    className={`p-2.5 rounded-xl border text-center text-xs transition-all ${chip.status !== 'IDLE'
                        ? 'bg-emerald-500 text-white font-black animate-pulse shadow-[0_0_20px_#10B981] border-emerald-300'
                        : isDark
                          ? 'bg-slate-800/80 text-slate-300 border-slate-700'
                          : 'bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
                      }`}
                  >
                    <div className="font-bold text-[11px]">{chip.name}</div>
                    <div className={`text-[9px] mt-0.5 font-mono font-bold ${chip.status !== 'IDLE'
                        ? 'text-emerald-100'
                        : isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                      {chip.status}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </OopStudioWorkspace>
  );
}
