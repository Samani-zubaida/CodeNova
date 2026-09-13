import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitMerge, ArrowUp, RefreshCw, Sparkles, CheckCircle2, Play, Layers, Activity, Shield, Zap, ArrowDown, Code2
} from 'lucide-react';
import VisualizerNav from '../../components/layout/VisualizerNav';

export default function InheritanceVisualizer({ isEmbedded = false }) {
  const [activeTab, setActiveTab] = useState('single'); // 'single' | 'multilevel' | 'hierarchical' | 'multiple' | 'hybrid'
  const [activePulse, setActivePulse] = useState(null); // node ID where pulse is currently located
  const [activeCodeLine, setActiveCodeLine] = useState(1);
  const [logMessage, setLogMessage] = useState("Select an inheritance tree and click any method button to trigger method delegation!");

  // Method Delegation Execution Simulation
  const triggerMethod = async (targetNode, parentNode, methodName, isOverridden = false, codeLineNum = 1) => {
    if (activePulse) return;
    setActiveCodeLine(codeLineNum);

    if (isOverridden) {
      setActivePulse(targetNode);
      setLogMessage(`⚡ EXECUTED DIRECTLY IN CHILD (${targetNode}): ${methodName}() [Method Overridden]`);
      await new Promise(r => setTimeout(r, 1400));
      setActivePulse(null);
      return;
    }

    // Step 1: Target Child Node receives call
    setActivePulse(targetNode);
    setLogMessage(`🔍 METHOD CALL: ${targetNode}.${methodName}() -> Not found in ${targetNode}, delegating up...`);
    await new Promise(r => setTimeout(r, 900));

    // Step 2: Pulse surges UP to Parent Node
    setActivePulse(parentNode);
    setLogMessage(`⬆️ DELEGATED TO PARENT CLASS (${parentNode}): Executed ${parentNode}.${methodName}()!`);
    await new Promise(r => setTimeout(r, 1400));

    setActivePulse(null);
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-between text-[#FAF7F2] font-sans select-none space-y-3">
      {!isEmbedded && <VisualizerNav title="Inheritance: Big Tree & Relationships" />}

      {/* TOP TOPOLOGY TAB HEADER */}
      <div className="w-full max-w-6xl bg-[#331921]/90 backdrop-blur-xl border-2 border-[#C5CEAE] rounded-2xl p-4 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#C5CEAE] text-[#331921] font-extrabold shadow-lg">
            <GitMerge size={26} />
          </div>
          <div>
            <h3 className="text-base font-mono font-extrabold text-[#F0E2A4] uppercase tracking-wider">
              INHERITANCE CLASS TREES & RELATIONSHIPS
            </h3>
            <p className="text-xs text-[#BCA297]">
              Clear hierarchy trees showing <span className="text-[#F0E2A4] font-bold">extends</span> & <span className="text-[#C5CEAE] font-bold">implements</span> relationships.
            </p>
          </div>
        </div>

        {/* Big Tab Selector */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {[
            { id: 'single', label: '1. Single Tree' },
            { id: 'multilevel', label: '2. Multilevel Chain' },
            { id: 'hierarchical', label: '3. Hierarchical Tree' },
            { id: 'multiple', label: '4. Multiple Interfaces' },
            { id: 'hybrid', label: '5. Hybrid Hierarchy' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setLogMessage(`Loaded ${tab.label}.`); }}
              className={`px-4 py-2 rounded-xl font-extrabold transition-all text-xs ${
                activeTab === tab.id 
                  ? 'bg-[#C5CEAE] text-[#331921] shadow-lg scale-105 ring-2 ring-white' 
                  : 'bg-[#423834] text-[#BCA297] hover:bg-[#5C4E49]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* DYNAMIC TELEMETRY LOG BANNER */}
      <div className="w-full max-w-6xl py-3 px-6 rounded-2xl bg-[#423834] border-2 border-[#5C4E49] text-center font-mono text-xs md:text-sm font-bold shadow-xl text-[#F0E2A4] flex items-center justify-center gap-3">
        <Activity size={18} className="text-[#C5CEAE] animate-pulse" />
        <span>{logMessage}</span>
      </div>

      {/* MAIN BIG TREE CANVAS & CODE PANEL SPLIT */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-stretch">
        
        {/* BIG TREE DIAGRAM CANVAS (2 COLUMNS) */}
        <div className="lg:col-span-2 bg-gradient-to-b from-[#140D0F] via-[#1E1417] to-[#2B1B21] border-2 border-[#5C4E49] rounded-3xl p-6 md:p-8 shadow-[0_0_90px_rgba(0,0,0,0.9)] relative overflow-hidden flex flex-col items-center justify-center min-h-[460px]">
          
          <AnimatePresence mode="wait">
            
            {/* ========================================================================= */}
            {/* 1. SINGLE INHERITANCE TREE (Animal -> Dog) */}
            {/* ========================================================================= */}
            {activeTab === 'single' && (
              <motion.div
                key="single-tree"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex flex-col items-center justify-between w-full max-w-lg space-y-6 my-auto z-10"
              >
                {/* PARENT CLASS CARD */}
                <motion.div 
                  animate={{ 
                    scale: activePulse === 'Animal' ? 1.05 : 1,
                    borderColor: activePulse === 'Animal' ? '#F0E2A4' : '#F0E2A4'
                  }}
                  className={`w-full p-5 rounded-3xl bg-[#331921] border-4 shadow-2xl font-mono transition-all relative ${
                    activePulse === 'Animal' ? 'bg-[#F0E2A4]/20 shadow-[0_0_50px_#F0E2A4]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-white/20 pb-2 mb-3">
                    <span className="text-base font-extrabold text-[#F0E2A4]">class Animal</span>
                    <span className="px-3 py-1 rounded-full bg-[#F0E2A4] text-[#331921] text-xs font-black">SUPERCLASS</span>
                  </div>
                  <div className="space-y-1 text-xs text-[#FAF7F2]">
                    <div><span className="text-[#AB526B]">protected</span> String species = "Canine";</div>
                    <div><span className="text-[#C5CEAE]">public void</span> <strong className="text-[#F0E2A4]">eat()</strong> &#123; System.out.println("Eating..."); &#125;</div>
                  </div>
                </motion.div>

                {/* RELATIONSHIP ARROW BADGE */}
                <div className="flex flex-col items-center relative my-1">
                  <div className="px-4 py-1.5 rounded-full bg-[#C5CEAE] text-[#331921] font-mono text-xs font-black shadow-lg border-2 border-white flex items-center gap-1 z-10">
                    <ArrowUp size={14} /> extends (Inherits From)
                  </div>
                  <div className="w-1 h-10 bg-[#C5CEAE]" />
                </div>

                {/* CHILD CLASS CARD */}
                <motion.div 
                  animate={{ 
                    scale: activePulse === 'Dog' ? 1.05 : 1,
                    borderColor: activePulse === 'Dog' ? '#C5CEAE' : '#C5CEAE'
                  }}
                  className={`w-full p-5 rounded-3xl bg-[#331921] border-4 shadow-2xl font-mono transition-all ${
                    activePulse === 'Dog' ? 'bg-[#C5CEAE]/20 shadow-[0_0_50px_#C5CEAE]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-white/20 pb-2 mb-3">
                    <span className="text-base font-extrabold text-[#C5CEAE]">class Dog extends Animal</span>
                    <span className="px-3 py-1 rounded-full bg-[#C5CEAE] text-[#331921] text-xs font-black">SUBCLASS</span>
                  </div>
                  <div className="space-y-1 text-xs text-[#FAF7F2] mb-4">
                    <div><span className="text-[#C5CEAE]">public void</span> <strong className="text-[#C5CEAE]">bark()</strong> &#123; System.out.println("Woof!"); &#125;</div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                    <button 
                      onClick={() => triggerMethod('Dog', 'Animal', 'eat', false, 12)}
                      className="flex-1 py-2.5 rounded-xl bg-[#F0E2A4] hover:bg-[#D6C88B] text-[#331921] text-xs font-extrabold shadow-lg transition-all"
                    >
                      call dog.eat() [Delegates Up]
                    </button>
                    <button 
                      onClick={() => triggerMethod('Dog', 'Dog', 'bark', true, 13)}
                      className="flex-1 py-2.5 rounded-xl bg-[#C5CEAE] hover:bg-[#A8B48D] text-[#331921] text-xs font-extrabold shadow-lg transition-all"
                    >
                      call dog.bark() [Direct Child]
                    </button>
                  </div>
                </motion.div>

              </motion.div>
            )}

            {/* ========================================================================= */}
            {/* 2. MULTILEVEL INHERITANCE TREE (Organism -> Mammal -> Dog) */}
            {/* ========================================================================= */}
            {activeTab === 'multilevel' && (
              <motion.div
                key="multilevel-tree"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex flex-col items-center justify-between w-full max-w-lg space-y-4 my-auto z-10"
              >
                {/* GRANDPARENT CARD */}
                <motion.div 
                  animate={{ scale: activePulse === 'Organism' ? 1.05 : 1 }}
                  className={`w-full p-4 rounded-2xl bg-[#331921] border-3 border-[#F0E2A4] shadow-xl font-mono ${
                    activePulse === 'Organism' ? 'bg-[#F0E2A4]/20 shadow-[0_0_35px_#F0E2A4]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-[#F0E2A4]">class Organism</span>
                    <span className="text-xs text-[#BCA297]">breathe()</span>
                  </div>
                </motion.div>

                <div className="px-3 py-1 rounded-full bg-[#5C4E49] text-[#F0E2A4] font-mono text-[10px] font-bold">
                  ⬆️ extends
                </div>

                {/* PARENT CARD */}
                <motion.div 
                  animate={{ scale: activePulse === 'Mammal' ? 1.05 : 1 }}
                  className={`w-full p-4 rounded-2xl bg-[#331921] border-3 border-[#C5CEAE] shadow-xl font-mono ${
                    activePulse === 'Mammal' ? 'bg-[#C5CEAE]/20 shadow-[0_0_35px_#C5CEAE]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-[#C5CEAE]">class Mammal extends Organism</span>
                    <span className="text-xs text-[#BCA297]">feedMilk()</span>
                  </div>
                </motion.div>

                <div className="px-3 py-1 rounded-full bg-[#5C4E49] text-[#C5CEAE] font-mono text-[10px] font-bold">
                  ⬆️ extends
                </div>

                {/* CHILD CARD */}
                <motion.div 
                  animate={{ scale: activePulse === 'Dog' ? 1.05 : 1 }}
                  className={`w-full p-4 rounded-2xl bg-[#331921] border-3 border-[#AB526B] shadow-xl font-mono ${
                    activePulse === 'Dog' ? 'bg-[#AB526B]/20 shadow-[0_0_35px_#AB526B]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-extrabold text-[#AB526B]">class Dog extends Mammal</span>
                    <span className="text-xs text-[#BCA297]">bark()</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => triggerMethod('Dog', 'Organism', 'breathe', false, 5)} className="flex-1 py-2 rounded-xl bg-[#F0E2A4] text-[#331921] text-xs font-bold">
                      breathe() [2 Levels Up]
                    </button>
                    <button onClick={() => triggerMethod('Dog', 'Mammal', 'feedMilk', false, 8)} className="flex-1 py-2 rounded-xl bg-[#C5CEAE] text-[#331921] text-xs font-bold">
                      feedMilk() [1 Level Up]
                    </button>
                  </div>
                </motion.div>

              </motion.div>
            )}

            {/* ========================================================================= */}
            {/* 3. HIERARCHICAL INHERITANCE TREE (Shape -> Circle, Square, Triangle) */}
            {/* ========================================================================= */}
            {activeTab === 'hierarchical' && (
              <motion.div
                key="hierarchical-tree"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex flex-col items-center justify-between w-full space-y-6 my-auto z-10"
              >
                {/* PARENT CARD */}
                <motion.div 
                  animate={{ scale: activePulse === 'Shape' ? 1.08 : 1 }}
                  className="p-5 rounded-3xl bg-[#331921] border-4 border-[#F0E2A4] text-center font-mono shadow-2xl w-72"
                >
                  <span className="text-base font-extrabold text-[#F0E2A4] block">class Shape</span>
                  <span className="text-xs text-[#BCA297]">public void draw()</span>
                </motion.div>

                <div className="px-4 py-1 rounded-full bg-[#C5CEAE] text-[#331921] font-mono text-xs font-black">
                  ⬆️ 3 Children extend Shape
                </div>

                {/* 3 CHILDREN CARDS */}
                <div className="grid grid-cols-3 gap-4 w-full">
                  {[
                    { name: 'Circle', color: '#AB526B' },
                    { name: 'Square', color: '#C5CEAE' },
                    { name: 'Triangle', color: '#FAF7F2' }
                  ].map(child => (
                    <motion.div
                      key={child.name}
                      animate={{ scale: activePulse === child.name ? 1.05 : 1 }}
                      className="p-4 rounded-2xl bg-[#331921] border-3 flex flex-col items-center text-center space-y-2 font-mono shadow-xl"
                      style={{ borderColor: child.color }}
                    >
                      <span className="text-sm font-extrabold" style={{ color: child.color }}>{child.name}</span>
                      <button
                        onClick={() => triggerMethod(child.name, 'Shape', 'draw', false, 15)}
                        className="w-full py-2 rounded-xl bg-[#423834] hover:bg-[#5C4E49] text-[#F0E2A4] text-xs font-bold border border-white/10"
                      >
                        draw()
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ========================================================================= */}
            {/* 4. MULTIPLE INTERFACES (Flyable + Mammal -> Bat) */}
            {/* ========================================================================= */}
            {activeTab === 'multiple' && (
              <motion.div
                key="multiple-tree"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex flex-col items-center justify-between w-full space-y-6 my-auto z-10"
              >
                <div className="grid grid-cols-2 gap-6 w-full">
                  <motion.div animate={{ scale: activePulse === 'Flyable' ? 1.05 : 1 }} className="p-4 rounded-2xl bg-[#331921] border-3 border-[#F0E2A4] text-center font-mono shadow-xl">
                    <span className="text-sm font-extrabold text-[#F0E2A4] block">interface Flyable</span>
                    <span className="text-xs text-[#BCA297]">fly()</span>
                  </motion.div>

                  <motion.div animate={{ scale: activePulse === 'Mammal' ? 1.05 : 1 }} className="p-4 rounded-2xl bg-[#331921] border-3 border-[#C5CEAE] text-center font-mono shadow-xl">
                    <span className="text-sm font-extrabold text-[#C5CEAE] block">class Mammal</span>
                    <span className="text-xs text-[#BCA297]">walk()</span>
                  </motion.div>
                </div>

                <div className="px-4 py-1 rounded-full bg-[#AB526B] text-white font-mono text-xs font-black">
                  ⬆️ implements Flyable, extends Mammal
                </div>

                <motion.div animate={{ scale: activePulse === 'Bat' ? 1.05 : 1 }} className="w-full p-5 rounded-3xl bg-[#331921] border-4 border-[#AB526B] font-mono shadow-2xl flex items-center justify-between">
                  <div>
                    <span className="text-base font-extrabold text-[#AB526B] block">class Bat</span>
                    <span className="text-xs text-[#BCA297]">Inherits both interfaces!</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => triggerMethod('Bat', 'Flyable', 'fly', false, 18)} className="px-4 py-2 rounded-xl bg-[#F0E2A4] text-[#331921] text-xs font-extrabold">
                      bat.fly()
                    </button>
                    <button onClick={() => triggerMethod('Bat', 'Mammal', 'walk', false, 20)} className="px-4 py-2 rounded-xl bg-[#C5CEAE] text-[#331921] text-xs font-extrabold">
                      bat.walk()
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ========================================================================= */}
            {/* 5. HYBRID HIERARCHY */}
            {/* ========================================================================= */}
            {activeTab === 'hybrid' && (
              <motion.div
                key="hybrid-tree"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="flex flex-col items-center justify-between w-full space-y-6 my-auto z-10"
              >
                <motion.div animate={{ scale: activePulse === 'Entity' ? 1.05 : 1 }} className="p-4 rounded-2xl bg-[#331921] border-3 border-[#F0E2A4] text-center font-mono w-64 shadow-xl">
                  <span className="text-sm font-extrabold text-[#F0E2A4] block">class Entity</span>
                  <span className="text-xs text-[#BCA297]">takeDamage()</span>
                </motion.div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <motion.div animate={{ scale: activePulse === 'Hero' ? 1.05 : 1 }} className="p-4 rounded-2xl bg-[#331921] border-2 border-[#C5CEAE] text-center font-mono text-xs">
                    <span className="font-extrabold text-[#C5CEAE] block mb-2">Hero extends Entity</span>
                    <button onClick={() => triggerMethod('Hero', 'Entity', 'takeDamage', false, 22)} className="w-full py-1.5 rounded-lg bg-[#C5CEAE] text-[#331921] font-bold">
                      super.takeDamage()
                    </button>
                  </motion.div>

                  <motion.div animate={{ scale: activePulse === 'Monster' ? 1.05 : 1 }} className="p-4 rounded-2xl bg-[#331921] border-2 border-[#AB526B] text-center font-mono text-xs">
                    <span className="font-extrabold text-[#AB526B] block mb-2">Monster extends Entity</span>
                    <button onClick={() => triggerMethod('Monster', 'Entity', 'takeDamage', false, 24)} className="w-full py-1.5 rounded-lg bg-[#AB526B] text-white font-bold">
                      super.takeDamage()
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* CODE & CODE HIGHLIGHT PANEL (1 COLUMN) */}
        <div className="bg-[#1E1417] border-2 border-[#5C4E49] rounded-3xl p-5 shadow-2xl flex flex-col justify-between font-mono text-xs">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-[#F0E2A4] font-extrabold">
            <Code2 size={18} />
            <span>Synchronized Code View</span>
          </div>

          <div className="space-y-1.5 py-4 overflow-x-auto text-[11px] leading-relaxed">
            <div className={activeCodeLine === 1 ? 'bg-[#F0E2A4]/20 text-[#F0E2A4] font-bold px-2 py-0.5 rounded' : 'text-[#BCA297]'}>
              1: class Animal &#123;
            </div>
            <div className={activeCodeLine === 2 ? 'bg-[#F0E2A4]/20 text-[#F0E2A4] font-bold px-2 py-0.5 rounded' : 'text-[#BCA297]'}>
              2:   void eat() &#123; System.out.println("Eating"); &#125;
            </div>
            <div className={activeCodeLine === 3 ? 'bg-[#F0E2A4]/20 text-[#F0E2A4] font-bold px-2 py-0.5 rounded' : 'text-[#BCA297]'}>
              3: &#125;
            </div>
            <div className="text-[#5C4E49]">-------------------</div>
            <div className={activeCodeLine === 12 ? 'bg-[#C5CEAE]/20 text-[#C5CEAE] font-bold px-2 py-0.5 rounded' : 'text-[#BCA297]'}>
              12: class Dog extends Animal &#123;
            </div>
            <div className={activeCodeLine === 13 ? 'bg-[#C5CEAE]/20 text-[#C5CEAE] font-bold px-2 py-0.5 rounded' : 'text-[#BCA297]'}>
              13:   void bark() &#123; System.out.println("Woof"); &#125;
            </div>
            <div className={activeCodeLine === 14 ? 'bg-[#C5CEAE]/20 text-[#C5CEAE] font-bold px-2 py-0.5 rounded' : 'text-[#BCA297]'}>
              14: &#125;
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#331921] border border-[#5C4E49] text-[10px] text-[#BCA297]">
            💡 <strong className="text-[#F0E2A4]">Inheritance Rule:</strong> Subclasses inherit all non-private properties and methods from their Parent classes automatically!
          </div>
        </div>

      </div>
    </div>
  );
}
