import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PhaserGame from '../components/home/PhaserVillage/PhaserGame';
import ZoneDetailPanel from '../components/home/ZoneDetailPanel';
import HomeNavbar from '../components/home/HomeNavbar';
import BlackHoleTransition from '../components/home/BlackHoleTransition';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Mouse } from 'lucide-react';

/**
 * Home — The explorable village homepage of Code Nova.
 * 
 * - Camera stays strictly centered on the person (person is always in frame)
 * - Walking is familiar, fluid 8-directional RPG movement
 * - Stepping into the main door of any house triggers a cosmic black hole / wormhole
 * - Swirling particles surround the singularity, sucking the camera into a hyperspace dive
 *   before arriving at the route!
 */
export default function Home() {
  const navigate = useNavigate();
  const [activeZone, setActiveZone] = useState(null);
  const [showHUD, setShowHUD] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);
  const [portalActive, setPortalActive] = useState(false);
  const [targetRoute, setTargetRoute] = useState(null);
  const phaserRef = useRef(null);

  const handleZoneEvent = useCallback((event) => {
    switch (event.type) {
      case 'scene:ready':
        setSceneReady(true);
        setTimeout(() => setShowHUD(false), 6000);
        break;

      case 'zone:enter':
        setActiveZone(event.zoneId);
        break;

      case 'zone:exit':
        setActiveZone(null);
        break;

      case 'burn':
      case 'portal':
      case 'navigate':
        if (!portalActive && event.route) {
          setTargetRoute(event.route);
          setPortalActive(true);
        }
        break;
    }
  }, [portalActive]);

  // ── D-pad handlers ──
  const setDir = (dir, pressed) => {
    const scene = phaserRef.current?.getScene();
    if (scene?.externalInput) {
      scene.externalInput[dir] = pressed;
    }
  };

  const dpadEvents = (dir) => ({
    onPointerDown: (e) => { e.preventDefault(); setDir(dir, true); },
    onPointerUp: () => setDir(dir, false),
    onPointerLeave: () => setDir(dir, false),
    onTouchStart: (e) => { e.preventDefault(); setDir(dir, true); },
    onTouchEnd: () => setDir(dir, false),
  });

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050508]">
      {/* ── COSMIC BLACK HOLE & WARP PARTICLE TRANSITION ── */}
      <BlackHoleTransition
        active={portalActive}
        onComplete={() => {
          if (targetRoute) navigate(targetRoute);
        }}
      />

      {/* ── THE EXPLORABLE VILLAGE ── */}
      <div className="relative w-full h-full z-10">
        {/* Phaser Game Canvas */}
        <PhaserGame ref={phaserRef} onZoneEvent={handleZoneEvent} />

        {/* Top Navbar */}
        <HomeNavbar />

        {/* Loading Screen */}
        <AnimatePresence>
          {!sceneReady && (
            <motion.div
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-[100] bg-[#0a0f1e] flex flex-col items-center justify-center gap-4"
            >
              <div className="w-12 h-12 border-2 border-white/10 border-t-[#BC4A54] rounded-full animate-spin" />
              <p className="text-white/50 text-sm tracking-widest uppercase animate-pulse">
                Loading Village...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zone Detail Panel */}
        <ZoneDetailPanel
          activeZone={activeZone}
          onClose={() => setActiveZone(null)}
          onEnterZone={(route) => {
            if (route) handleZoneEvent({ type: 'portal', route });
          }}
        />

        {/* On-Screen D-Pad Controller (bottom-left) */}
        {sceneReady && !portalActive && (
          <div className="fixed bottom-8 left-8 z-40 select-none touch-none">
            <div className="relative w-[130px] h-[130px]">
              {/* UP */}
              <button
                {...dpadEvents('up')}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md border border-white/15 flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-lg"
              >
                <ChevronUp size={22} className="text-white/80" />
              </button>

              {/* DOWN */}
              <button
                {...dpadEvents('down')}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md border border-white/15 flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-lg"
              >
                <ChevronDown size={22} className="text-white/80" />
              </button>

              {/* LEFT */}
              <button
                {...dpadEvents('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md border border-white/15 flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-lg"
              >
                <ChevronLeft size={22} className="text-white/80" />
              </button>

              {/* RIGHT */}
              <button
                {...dpadEvents('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md border border-white/15 flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-lg"
              >
                <ChevronRight size={22} className="text-white/80" />
              </button>

              {/* Center dot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/5 border border-white/10" />
            </div>
          </div>
        )}

        {/* Keyboard HUD (bottom center, auto-hides) */}
        <AnimatePresence>
          {showHUD && sceneReady && !portalActive && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
            >
              <div className="flex items-center gap-6 px-6 py-3 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 shadow-lg">
                <div className="flex flex-col items-center gap-1">
                  <kbd className="w-7 h-7 rounded bg-white/10 border border-white/20 flex items-center justify-center text-white text-[10px] font-bold">W</kbd>
                  <div className="flex gap-1">
                    <kbd className="w-7 h-7 rounded bg-white/10 border border-white/20 flex items-center justify-center text-white text-[10px] font-bold">A</kbd>
                    <kbd className="w-7 h-7 rounded bg-white/10 border border-white/20 flex items-center justify-center text-white text-[10px] font-bold">S</kbd>
                    <kbd className="w-7 h-7 rounded bg-white/10 border border-white/20 flex items-center justify-center text-white text-[10px] font-bold">D</kbd>
                  </div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex items-center gap-2 text-white/50 text-xs">
                  <Mouse size={14} />
                  <span>Click to move · Walk into building doors to enter cosmic portal</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Branding */}
        <div className="fixed bottom-4 right-6 z-30 pointer-events-none">
          <p className="text-white/15 text-[10px] tracking-widest uppercase">
            Code Nova · Computational Universe
          </p>
        </div>
      </div>
    </div>
  );
}
