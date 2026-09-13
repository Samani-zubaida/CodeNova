import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, Lock, Unlock, ShieldAlert, ShieldCheck, Flame, Zap, Sparkles, Activity, Gauge, Ban, CheckCircle2, Sliders, Volume2, ArrowRight
} from 'lucide-react';
import VisualizerNav from '../../components/layout/VisualizerNav';

export default function EncapsulationVisualizer({ isEmbedded = false }) {
  const [isEngineOn, setIsEngineOn] = useState(false);
  const [gasPedal, setGasPedal] = useState(30); // 0 to 100
  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [gear, setGear] = useState(1);
  const [viewMode, setViewMode] = useState('cockpit'); // 'cockpit' | 'xray' | 'shield'
  const [hackAttempt, setHackAttempt] = useState(false);
  const [logMessage, setLogMessage] = useState("Encapsulation Studio Ready. Turn key to start engine.");

  // Engine Physics & Telemetry Engine Loop
  useEffect(() => {
    let timer;
    if (isEngineOn) {
      timer = setInterval(() => {
        const targetRpm = 1000 + Math.round(gasPedal * 50);
        setRpm(prev => Math.round(prev + (targetRpm - prev) * 0.25));

        const targetSpeed = Math.round(gasPedal * 1.2);
        setSpeed(prev => Math.round(Math.max(0, prev + (targetSpeed - prev) * 0.2)));

        // Automatic Gear Shifting based on speed
        if (targetSpeed < 15) setGear(1);
        else if (targetSpeed < 35) setGear(2);
        else if (targetSpeed < 65) setGear(3);
        else if (targetSpeed < 90) setGear(4);
        else setGear(5);
      }, 50);
    } else {
      setRpm(0);
      setSpeed(0);
      setGear(1);
    }
    return () => clearInterval(timer);
  }, [isEngineOn, gasPedal]);

  // Handle Direct Access Hack Attempt (account.#engineRpm = 9999)
  const handleIllegalHack = async () => {
    if (hackAttempt) return;
    setHackAttempt(true);
    setLogMessage("⛔ DIRECT HACK ATTEMPT: Executing car.#engineRpm = 9999...");

    await new Promise(r => setTimeout(r, 600));
    setLogMessage("🛡️ ENCAPSULATION DEFENSE TRIGGERED! Error: Cannot write private property #engineRpm");

    await new Promise(r => setTimeout(r, 1800));
    setHackAttempt(false);
    setLogMessage("System safe. Encapsulation protected private engine variables.");
  };

  // Toggle Ignition
  const handleToggleIgnition = () => {
    const nextState = !isEngineOn;
    setIsEngineOn(nextState);
    if (nextState) {
      setLogMessage("🔑 PUBLIC METHOD CALL: car.start() -> Engine started smoothly!");
    } else {
      setLogMessage("🔑 PUBLIC METHOD CALL: car.stop() -> Engine shut down.");
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-between text-[#FAF7F2] font-sans select-none space-y-3">
      {!isEmbedded && <VisualizerNav title="Encapsulation: Interactive Driving Laboratory" />}

      {/* TOP CONTROL HUB BANNER */}
      <div className="w-full max-w-5xl bg-[#331921]/90 backdrop-blur-xl border-2 border-[#F0E2A4] rounded-2xl p-4 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#F0E2A4] text-[#331921] font-extrabold shadow-lg">
            <Gauge size={24} />
          </div>
          <div>
            <h3 className="text-sm font-mono font-extrabold text-[#F0E2A4] uppercase tracking-wider">
              INTERACTIVE ENCAPSULATION CAR LABORATORY
            </h3>
            <p className="text-xs text-[#BCA297]">
              Drive the car using public methods (<span className="text-[#C5CEAE] font-bold">start(), accelerate()</span>). Switch to X-Ray mode or test illegal direct hacks!
            </p>
          </div>
        </div>

        {/* View Selector Buttons */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {[
            { id: 'cockpit', label: '🚗 Driver Cockpit' },
            { id: 'xray', label: '🔍 Under-The-Hood X-Ray' },
            { id: 'shield', label: '🛡️ Vault Protection' }
          ].map(v => (
            <button
              key={v.id}
              onClick={() => setViewMode(v.id)}
              className={`px-3 py-2 rounded-xl font-bold transition-all ${
                viewMode === v.id 
                  ? 'bg-[#F0E2A4] text-[#331921] shadow-lg scale-105 ring-2 ring-white' 
                  : 'bg-[#423834] text-[#BCA297] hover:bg-[#5C4E49]'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* DYNAMIC TELEMETRY LOG BAR */}
      <div className="w-full max-w-5xl py-2.5 px-6 rounded-2xl bg-[#423834] border border-[#5C4E49] text-center font-mono text-xs md:text-sm font-bold shadow-lg text-[#F0E2A4] flex items-center justify-center gap-2">
        <Activity size={16} className={hackAttempt ? 'text-[#AB526B] animate-bounce' : 'text-[#C5CEAE]'} />
        <span className={hackAttempt ? 'text-[#AB526B]' : 'text-[#F0E2A4]'}>{logMessage}</span>
      </div>

      {/* MAIN VISUAL DRIVE ARENA */}
      <div className="w-full max-w-5xl bg-gradient-to-b from-[#140D0F] via-[#1E1417] to-[#2B1B21] border-2 border-[#5C4E49] rounded-3xl p-6 md:p-8 shadow-[0_0_90px_rgba(0,0,0,0.9)] relative overflow-hidden flex-1 flex flex-col justify-between min-h-[460px]">
        
        {/* Animated Highway Background Lines */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ x: isEngineOn && speed > 0 ? [-200, 0] : 0 }}
            transition={{ repeat: Infinity, duration: Math.max(0.2, 1.5 - speed / 80), ease: 'linear' }}
            className="absolute bottom-12 left-0 w-[200%] h-12 border-t-2 border-b-2 border-dashed border-[#F0E2A4]/40 flex items-center justify-around"
          >
            <div className="w-24 h-1 bg-[#F0E2A4]" />
            <div className="w-24 h-1 bg-[#F0E2A4]" />
            <div className="w-24 h-1 bg-[#F0E2A4]" />
            <div className="w-24 h-1 bg-[#F0E2A4]" />
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: DRIVER COCKPIT & DASHBOARD INSTRUMENTS */}
        {/* ========================================================================= */}
        {viewMode === 'cockpit' && (
          <div className="my-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center z-10 w-full">
            
            {/* Animated Car Visual */}
            <div className="flex flex-col items-center justify-center">
              <motion.div 
                animate={{ y: isEngineOn ? [0, -3, 0] : 0 }}
                transition={{ repeat: Infinity, duration: Math.max(0.1, 0.5 - rpm / 10000) }}
                className="relative w-80 md:w-[380px] h-44 bg-gradient-to-r from-[#AB526B] to-[#9E455E] rounded-3xl border-4 border-white/90 shadow-[0_0_60px_rgba(171,82,107,0.7)] flex items-center justify-between px-6"
              >
                {/* Driver Cockpit Windshield */}
                <div className="w-48 h-24 bg-[#FAF7F2]/20 border-2 border-white/70 rounded-t-full rounded-br-2xl flex items-center justify-center backdrop-blur-sm relative">
                  <span className="text-4xl">😎</span>
                  <div className="ml-2 font-mono text-xs text-[#F0E2A4] font-bold">
                    {isEngineOn ? `GEAR ${gear}` : "PARKED"}
                  </div>
                </div>

                {/* Headlight */}
                <div className={`w-5 h-12 rounded-r-xl shadow-2xl transition-all ${
                  isEngineOn ? 'bg-[#F0E2A4] shadow-[0_0_35px_#F0E2A4] animate-pulse' : 'bg-[#423834]'
                }`} />

                {/* Spinning Alloy Wheels */}
                <motion.div 
                  animate={{ rotate: isEngineOn ? 360 : 0 }}
                  transition={{ repeat: Infinity, duration: Math.max(0.1, 1 - speed / 60), ease: 'linear' }}
                  className="absolute -bottom-6 left-8 w-16 h-16 rounded-full bg-[#140D0F] border-4 border-[#F0E2A4] flex items-center justify-center shadow-2xl"
                >
                  <div className="w-6 h-6 rounded-full border-2 border-dashed border-white bg-[#423834]" />
                </motion.div>

                <motion.div 
                  animate={{ rotate: isEngineOn ? 360 : 0 }}
                  transition={{ repeat: Infinity, duration: Math.max(0.1, 1 - speed / 60), ease: 'linear' }}
                  className="absolute -bottom-6 right-12 w-16 h-16 rounded-full bg-[#140D0F] border-4 border-[#F0E2A4] flex items-center justify-center shadow-2xl"
                >
                  <div className="w-6 h-6 rounded-full border-2 border-dashed border-white bg-[#423834]" />
                </motion.div>
              </motion.div>
            </div>

            {/* Dashboard Telemetry Gauges */}
            <div className="bg-[#331921] p-6 rounded-3xl border-2 border-[#C5CEAE] shadow-2xl flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b border-white/20 pb-2 font-mono text-xs">
                <span className="text-[#C5CEAE] font-extrabold uppercase">Public Telemetry Dashboard</span>
                <span className="text-[#F0E2A4] font-bold">Public Methods Only</span>
              </div>

              {/* Speedometer & RPM Gauges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#423834] p-4 rounded-2xl border border-[#5C4E49] text-center font-mono">
                  <span className="text-[10px] text-[#BCA297] uppercase block font-bold">Speedometer</span>
                  <span className="text-3xl font-extrabold text-[#F0E2A4]">{speed}</span>
                  <span className="text-[10px] text-[#C5CEAE] block">MPH</span>
                </div>

                <div className="bg-[#423834] p-4 rounded-2xl border border-[#5C4E49] text-center font-mono">
                  <span className="text-[10px] text-[#BCA297] uppercase block font-bold">Tachometer</span>
                  <span className="text-3xl font-extrabold text-[#AB526B]">{rpm}</span>
                  <span className="text-[10px] text-[#AB526B] block">RPM</span>
                </div>
              </div>

              {/* Gas Pedal Controls */}
              <div className="bg-[#423834] p-4 rounded-2xl border border-[#5C4E49] flex flex-col space-y-2 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#BCA297]">Gas Pedal (Public Method):</span>
                  <span className="text-[#F0E2A4] font-extrabold">car.accelerate({gasPedal}%)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  disabled={!isEngineOn}
                  value={gasPedal}
                  onChange={e => setGasPedal(Number(e.target.value))}
                  className="w-full accent-[#C5CEAE] cursor-pointer disabled:opacity-30"
                />
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: UNDER THE HOOD X-RAY ENGINE MECHANICAL DETAILS */}
        {/* ========================================================================= */}
        {viewMode === 'xray' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="my-auto bg-[#331921] p-6 md:p-8 rounded-3xl border-4 border-[#AB526B] shadow-[0_0_80px_rgba(171,82,107,0.7)] flex flex-col items-center space-y-6 z-10 w-full max-w-2xl"
          >
            <div className="w-full flex items-center justify-between border-b border-white/20 pb-3 font-mono text-xs">
              <span className="text-[#AB526B] font-extrabold flex items-center gap-2 text-sm">
                <Flame size={20} /> Internal Implementation (#private variables)
              </span>
              <span className="text-[#F0E2A4] font-extrabold">{rpm} RPM</span>
            </div>

            {/* 4 Piston Cylinders */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {[1, 2, 3, 4].map(p => (
                <motion.div
                  key={p}
                  animate={{ y: isEngineOn ? [0, -18, 0] : 0 }}
                  transition={{ repeat: Infinity, duration: Math.max(0.15, 0.6 - rpm / 8000), delay: p * 0.08 }}
                  className="p-4 rounded-2xl bg-[#423834] border-2 border-[#AB526B] flex flex-col items-center text-center shadow-xl font-mono"
                >
                  <Flame size={22} className={isEngineOn ? "text-[#AB526B] animate-bounce" : "text-[#5C4E49]"} />
                  <span className="text-[10px] font-bold text-[#F0E2A4] mt-2">#piston{p}</span>
                  <span className="text-[9px] text-[#BCA297]">{isEngineOn ? `${rpm} RPM` : 'STOPPED'}</span>
                </motion.div>
              ))}
            </div>

            <div className="w-full p-3 rounded-2xl bg-[#423834] border border-[#AB526B] font-mono text-xs text-[#F0E2A4] text-center font-bold">
              🔒 Internal engine complexity is encapsulated. Outside code cannot see or tamper with #piston fields directly!
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: ENCAPSULATION VAULT PROTECTION & HACK DEFENSE */}
        {/* ========================================================================= */}
        {viewMode === 'shield' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="my-auto bg-[#331921] p-6 md:p-8 rounded-3xl border-4 border-[#C5CEAE] shadow-[0_0_80px_rgba(197,206,174,0.6)] flex flex-col items-center space-y-6 z-10 w-full max-w-2xl text-center"
          >
            <div className="w-full flex items-center justify-between border-b border-white/20 pb-3 font-mono text-xs">
              <span className="text-[#C5CEAE] font-extrabold flex items-center gap-2 text-sm">
                <ShieldCheck size={20} /> Encapsulation Vault Protection
              </span>
              <span className="text-[#C5CEAE] font-bold">ACCESS CONTROL</span>
            </div>

            <motion.div 
              animate={{ 
                scale: hackAttempt ? [1, 1.1, 1] : 1,
                borderColor: hackAttempt ? '#AB526B' : '#C5CEAE'
              }}
              className={`w-full py-8 px-6 rounded-3xl border-4 bg-[#423834] flex flex-col items-center space-y-3 transition-all ${
                hackAttempt ? 'bg-[#AB526B]/20 shadow-[0_0_50px_#AB526B]' : 'shadow-2xl'
              }`}
            >
              {hackAttempt ? (
                <ShieldAlert size={48} className="text-[#AB526B] animate-bounce" />
              ) : (
                <Lock size={48} className="text-[#C5CEAE] animate-pulse" />
              )}

              <h4 className="text-base font-mono font-extrabold text-[#F0E2A4] uppercase">
                {hackAttempt ? "⚠️ DEFENSE DEFLECTED DIRECT WRITE!" : "Protected Private Boundary"}
              </h4>

              <p className="text-xs text-[#BCA297] max-w-md leading-relaxed">
                Direct access to <code className="text-[#AB526B]">car.#engineRpm</code> from outside the class is strictly forbidden by the language compiler!
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* BOTTOM INTERACTIVE ACTION BAR */}
        <div className="w-full mt-auto pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 font-mono text-xs z-10">
          
          {/* Public Methods Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleIgnition}
              className={`px-4 py-2.5 rounded-2xl font-extrabold shadow-xl transition-all flex items-center gap-2 ${
                isEngineOn 
                  ? 'bg-[#AB526B] text-white hover:bg-[#8F3E54]' 
                  : 'bg-[#C5CEAE] text-[#331921] hover:bg-[#A8B48D]'
              }`}
            >
              <Zap size={16} />
              <span>{isEngineOn ? "car.stop()" : "car.start()"}</span>
            </button>

            <button
              onClick={handleIllegalHack}
              disabled={hackAttempt}
              className="px-4 py-2.5 rounded-2xl bg-[#AB526B]/20 hover:bg-[#AB526B] border border-[#AB526B] text-[#AB526B] hover:text-white font-extrabold shadow-xl transition-all flex items-center gap-1.5 disabled:opacity-40"
            >
              <Ban size={15} />
              <span>Test Direct Hack (Illegal)</span>
            </button>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => { setIsEngineOn(false); setGasPedal(30); setViewMode('cockpit'); setLogMessage("Laboratory reset."); }}
            className="p-2.5 rounded-xl bg-[#331921] hover:bg-[#5C4E49] text-[#BCA297] hover:text-white border border-white/10"
            title="Reset Lab"
          >
            <RotateCcw size={16} />
          </button>

        </div>

      </div>
    </div>
  );
}
