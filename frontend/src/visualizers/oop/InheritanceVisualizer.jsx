import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronDown, ChevronUp, Plus, Code2, Play, ArrowRight, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import VisualizerNav from '../../components/layout/VisualizerNav';

const INHERITANCE_PRESETS = {
  single: [
    { id: 'Animal', name: 'Animal', parent: null, method: 'eat()', color: 'blue' },
    { id: 'Dog', name: 'Dog', parent: 'Animal', method: 'bark()', color: 'green' }
  ],
  multilevel: [
    { id: 'Animal', name: 'Animal', parent: null, method: 'eat()', color: 'blue' },
    { id: 'Dog', name: 'Dog', parent: 'Animal', method: 'bark()', color: 'green' },
    { id: 'Puppy', name: 'Puppy', parent: 'Dog', method: 'play()', color: 'purple' }
  ],
  hierarchical: [
    { id: 'Animal', name: 'Animal', parent: null, method: 'eat()', color: 'blue' },
    { id: 'Dog', name: 'Dog', parent: 'Animal', method: 'bark()', color: 'green' },
    { id: 'Cat', name: 'Cat', parent: 'Animal', method: 'meow()', color: 'orange' }
  ],
  multiple: [
    { id: 'Flyer', name: 'Flyer', parent: null, method: 'fly()', color: 'blue' },
    { id: 'Swimmer', name: 'Swimmer', parent: null, method: 'swim()', color: 'teal' },
    { id: 'Duck', name: 'Duck', parent: ['Flyer', 'Swimmer'], method: 'quack()', color: 'green' }
  ],
  hybrid: [
    { id: 'Vehicle', name: 'Vehicle', parent: null, method: 'start()', color: 'purple' },
    { id: 'Car', name: 'Car', parent: 'Vehicle', method: 'drive()', color: 'blue' },
    { id: 'Boat', name: 'Boat', parent: 'Vehicle', method: 'sail()', color: 'teal' },
    { id: 'Amphibious', name: 'Amphibious', parent: ['Car', 'Boat'], method: 'transform()', color: 'green' }
  ]
};

export default function InheritanceVisualizer() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [classes, setClasses] = useState(INHERITANCE_PRESETS.single);
  const [activePreset, setActivePreset] = useState('single');
  
  const [newClassName, setNewClassName] = useState('');
  const [newClassParent, setNewClassParent] = useState('Animal');
  const [newClassMethod, setNewClassMethod] = useState('');
  
  const [activeCall, setActiveCall] = useState(null); 
  const [isIterating, setIsIterating] = useState(false);

  const [outputLines, setOutputLines] = useState([{msg: "> Inheritance Engine Initialized.", isError: false}]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);

  const colors = ['blue', 'green', 'purple', 'orange', 'red', 'teal'];

  const logOutput = (msg, isError = false) => {
    setOutputLines(prev => [...prev, { msg, isError }].slice(-8));
  };

  const handleLoadPreset = (key) => {
    if (isIterating) return;
    setActivePreset(key);
    setClasses(INHERITANCE_PRESETS[key]);
    setNewClassParent(INHERITANCE_PRESETS[key][0].id);
    logOutput(`> Loaded ${key} inheritance pattern.`, false);
  };

  const handleAddClass = () => {
    if (!newClassName || !newClassMethod || !newClassParent) return;
    
    if (classes.some(c => c.name === newClassName)) {
      logOutput(`  Error: Class ${newClassName} already exists.`, true);
      return;
    }
    
    const parents = newClassParent.split(',').map(s => s.trim());
    if (parents.some(p => !classes.some(c => c.name === p))) {
      logOutput(`  Error: Parent class does not exist.`, true);
      return;
    }

    const color = colors[classes.length % colors.length];
    
    setClasses([...classes, { 
      id: newClassName, 
      name: newClassName, 
      parent: parents.length === 1 ? parents[0] : parents,
      method: newClassMethod, 
      color 
    }]);
    
    logOutput(`> class ${newClassName} extends ${newClassParent} { ... }`, false);
    setNewClassName('');
    setNewClassMethod('');
    setActivePreset('custom');
  };

  const handleCallMethod = async (callerId, targetMethodName, path) => {
    if (isIterating) return;
    setIsIterating(true);
    
    logOutput(`> const obj = new ${callerId}(); obj.${targetMethodName};`, false);
    setActiveCall({ id: callerId, calling: targetMethodName, path: [callerId] });
    
    for (let i = 0; i < path.length; i++) {
      const currentClassId = path[i];
      setActiveCall({ id: callerId, calling: targetMethodName, path: path.slice(0, i + 1) });
      
      const cls = classes.find(c => c.id === currentClassId);
      if (cls.method === targetMethodName) {
        logOutput(`  Found method '${targetMethodName}' on ${currentClassId}! Executing...`, false);
        break;
      } else {
        logOutput(`  Method not on ${currentClassId}, traversing up to prototype...`, false);
      }
      
      await new Promise(r => setTimeout(r, 1000));
    }
    
    await new Promise(r => setTimeout(r, 1000));
    setActiveCall(null);
    setIsIterating(false);
  };
  
  // Calculate paths for calling parent vs child methods (Breadth-First Search for multiple inheritance)
  const getClassPath = (startId, targetMethodName) => {
    let queue = [[startId]];
    
    while (queue.length > 0) {
      let path = queue.shift();
      let currId = path[path.length - 1];
      let currCls = classes.find(c => c.id === currId);
      
      if (!currCls) continue;
      if (currCls.method === targetMethodName) return path;
      
      if (currCls.parent) {
        let parents = Array.isArray(currCls.parent) ? currCls.parent : [currCls.parent];
        for (let p of parents) {
          queue.push([...path, p]);
        }
      }
    }
    return [startId];
  };

  const getColorClass = (color, type = 'border') => {
    const map = {
      blue: { border: 'border-blue-500', bg: 'bg-blue-500', text: 'text-blue-500', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]' },
      green: { border: 'border-green-500', bg: 'bg-green-500', text: 'text-green-500', glow: 'shadow-[0_0_15px_rgba(34,197,94,0.5)]' },
      purple: { border: 'border-purple-500', bg: 'bg-purple-500', text: 'text-purple-500', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]' },
      orange: { border: 'border-orange-500', bg: 'bg-orange-500', text: 'text-orange-500', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.5)]' },
      red: { border: 'border-red-500', bg: 'bg-red-500', text: 'text-red-500', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]' },
      teal: { border: 'border-teal-500', bg: 'bg-teal-500', text: 'text-teal-500', glow: 'shadow-[0_0_15px_rgba(20,184,166,0.5)]' },
    };
    return map[color]?.[type] || '';
  };

  // Group classes into levels for rendering
  const levels = [];
  const placed = new Set();
  let currentLevel = classes.filter(c => !c.parent);
  
  while (currentLevel.length > 0) {
    levels.push(currentLevel);
    currentLevel.forEach(c => placed.add(c.id));
    
    currentLevel = classes.filter(c => {
      if (placed.has(c.id)) return false;
      const parents = Array.isArray(c.parent) ? c.parent : [c.parent];
      return parents.some(p => levels[levels.length - 1].some(lc => lc.id === p));
    });
  }

  // Helper to get all inherited methods for a class
  const getAvailableMethods = (startId) => {
    let methods = [];
    let visited = new Set();
    let queue = [startId];
    
    while (queue.length > 0) {
      let currId = queue.shift();
      if (visited.has(currId)) continue;
      visited.add(currId);
      
      let cls = classes.find(c => c.id === currId);
      if (cls) {
        methods.push({ name: cls.method, sourceId: cls.id, isOwn: cls.id === startId });
        if (cls.parent) {
          let parents = Array.isArray(cls.parent) ? cls.parent : [cls.parent];
          queue.push(...parents);
        }
      }
    }
    return methods;
  };

  return (
    <div className="fixed top-[64px] bottom-0 left-0 right-0 bg-gray-50 dark:bg-[#09090b] flex flex-col lg:flex-row overflow-hidden">
      
      {/* Left Sidebar */}
      <div className={`w-full lg:w-[350px] xl:w-[400px] h-1/2 lg:h-full bg-white/80 dark:bg-black/40 backdrop-blur-xl border-r border-b lg:border-b-0 border-gray-200 dark:border-white/10 shadow-2xl flex flex-col z-10 shrink-0 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? "ml-0" : "-ml-[100%] lg:-ml-[400px]"}`}>
        <div className="p-4 lg:p-6 flex flex-col gap-6 lg:gap-8 h-full">
          
          <VisualizerNav currentPath="/visualizer/inheritance" />

          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-[var(--color-nova-brown)] tracking-tight mb-2">Inheritance</h1>
            <p className="text-xs lg:text-sm text-gray-500 font-medium">Explore how child classes inherit methods from parent classes across all inheritance patterns.</p>
          </div>

          {/* Preset Selector */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-white/10 pb-2 flex items-center gap-2">
              <BookOpen size={14} /> Select Pattern
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {['single', 'multilevel', 'hierarchical', 'multiple', 'hybrid'].map(type => (
                <button
                  key={type}
                  disabled={isIterating}
                  onClick={() => handleLoadPreset(type)}
                  className={`py-1.5 px-2 text-xs font-bold rounded capitalize transition-all border ${
                    activePreset === type 
                      ? 'bg-[var(--color-nova-brown)] text-white border-[var(--color-nova-brown)]' 
                      : 'bg-black/5 dark:bg-white/5 border-transparent text-gray-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Builder */}
          <div className="flex flex-col gap-4 relative">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-white/10 pb-2">Custom Class Builder</h3>
            
            <div className="flex flex-col gap-3 bg-black/5 dark:bg-white/5 p-4 rounded-lg border border-gray-200 dark:border-white/5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">New Class Name</label>
                <input 
                  type="text" 
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value.replace(/\s+/g, ''))}
                  placeholder="e.g. Bulldog"
                  className="bg-white dark:bg-black border border-gray-300 dark:border-gray-800 rounded px-2 py-1.5 text-sm w-full font-mono outline-none focus:border-[var(--color-nova-brown)]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Extends (Parent)</label>
                <input 
                  type="text" 
                  value={newClassParent}
                  onChange={(e) => setNewClassParent(e.target.value)}
                  placeholder="e.g. Dog, Animal"
                  className="bg-white dark:bg-black border border-gray-300 dark:border-gray-800 rounded px-2 py-1.5 text-sm w-full font-mono outline-none focus:border-[var(--color-nova-brown)]"
                />
                <span className="text-[9px] text-gray-400">Comma-separate for multiple inheritance.</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Own Method Signature</label>
                <input 
                  type="text" 
                  value={newClassMethod}
                  onChange={(e) => setNewClassMethod(e.target.value.replace(/\s+/g, ''))}
                  placeholder="e.g. guard()"
                  className="bg-white dark:bg-black border border-gray-300 dark:border-gray-800 rounded px-2 py-1.5 text-sm w-full font-mono outline-none focus:border-[var(--color-nova-brown)]"
                />
              </div>

              <button 
                onClick={handleAddClass}
                disabled={isIterating || !newClassName || !newClassMethod}
                className="w-full bg-[var(--color-nova-brown)] text-white py-2 rounded text-sm font-bold shadow-md hover:brightness-110 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                <Plus size={14} /> Add Custom Class
              </button>
            </div>
          </div>
          
          <div className="mt-auto pt-8"></div>
        </div>
      </div>

      {/* Right Canvas */}
      <div className="w-full lg:flex-1 h-1/2 lg:h-full flex flex-col relative overflow-hidden bg-gray-50/50 dark:bg-black/20">
        {/* Sidebar Toggle Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-4 left-4 z-50 p-2 bg-white/80 dark:bg-black/40 backdrop-blur border border-gray-200 dark:border-white/10 rounded shadow-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          {isSidebarOpen ? <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" /> : <ChevronRight size={20} className="text-gray-600 dark:text-gray-300" />}
        </button>

        
        {/* Main Visualization Area */}
        <div className="flex-1 flex flex-col p-8 overflow-y-auto overflow-x-auto relative items-center pt-16 min-h-[500px] gap-12">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-nova-brown)] opacity-5 blur-[100px] rounded-full pointer-events-none"></div>

          {levels.map((levelClasses, levelIdx) => (
            <div key={`level-${levelIdx}`} className="flex flex-wrap gap-8 justify-center items-start w-full relative">
              {levelClasses.map(cls => {
                const isActive = activeCall && activeCall.path.includes(cls.id);
                const isExecutionTarget = isActive && activeCall.path[activeCall.path.length - 1] === cls.id;
                const availableMethods = getAvailableMethods(cls.id);
                const parentsStr = Array.isArray(cls.parent) ? cls.parent.join(', ') : cls.parent;

                return (
                  <motion.div 
                    key={cls.id}
                    animate={{ scale: isExecutionTarget ? 1.05 : 1 }}
                    className={`w-64 bg-white/80 dark:bg-black/60 backdrop-blur-xl border-2 ${getColorClass(cls.color, 'border')} rounded-xl p-4 shadow-lg z-10 flex flex-col gap-3 relative ${isActive ? getColorClass(cls.color, 'glow') : ''}`}
                  >
                    {/* Parent Badge */}
                    {parentsStr && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-gray-600 dark:text-gray-400 whitespace-nowrap shadow-sm">
                        extends {parentsStr}
                      </div>
                    )}

                    <div className={`text-sm font-black uppercase tracking-widest ${getColorClass(cls.color, 'text')} text-center mt-1`}>
                      {cls.name}
                    </div>
                    
                    <div className="bg-black/5 dark:bg-white/5 p-2 rounded text-sm font-mono flex flex-col gap-1 border border-black/5 dark:border-white/5">
                      <span className="text-gray-500 text-[10px] uppercase font-bold">Class Definition</span>
                      <span className="font-bold text-gray-800 dark:text-gray-200">+ {cls.method}</span>
                    </div>

                    <div className="flex flex-col gap-1 mt-2">
                      <span className="text-gray-500 text-[10px] uppercase font-bold text-center border-b border-gray-200 dark:border-white/10 pb-1 mb-1">
                        Call Method on Instance
                      </span>
                      {availableMethods.map((m, i) => (
                        <button 
                          key={i}
                          disabled={isIterating}
                          onClick={() => handleCallMethod(cls.id, m.name, getClassPath(cls.id, m.name))}
                          className="w-full text-left px-2 py-1.5 bg-black/5 dark:bg-white/5 hover:bg-[var(--color-nova-brown)] hover:text-white rounded text-xs font-mono font-bold transition-colors disabled:opacity-50 flex items-center justify-between group border border-transparent hover:border-[var(--color-nova-brown)]"
                        >
                          <div className="flex flex-col">
                            <span>{m.name}</span>
                            {!m.isOwn && <span className="text-[8px] opacity-70 group-hover:text-white/80 text-gray-500 uppercase tracking-wider">from {m.sourceId}</span>}
                          </div>
                          <span className="opacity-0 group-hover:opacity-100"><Play size={12}/></span>
                        </button>
                      ))}
                    </div>

                    <AnimatePresence>
                      {isExecutionTarget && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className={`absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold text-white ${getColorClass(cls.color, 'bg')} shadow-xl border-2 border-white dark:border-gray-900 z-50 flex items-center gap-2`}
                        >
                          <Play size={10} /> Executing {activeCall.calling}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          ))}

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
