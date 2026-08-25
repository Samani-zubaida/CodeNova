import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronDown, ChevronUp, Play, Plus, Trash2, Code2, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import VisualizerNav from '../../components/layout/VisualizerNav';

export default function PolymorphismVisualizer() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [shapesArray, setShapesArray] = useState(['Circle', 'Square', 'Triangle']);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isIterating, setIsIterating] = useState(false);
  const [drawnShapes, setDrawnShapes] = useState([]);
  
  // Console Output State
  const [outputLines, setOutputLines] = useState([{msg: "> Polymorphism System Initialized.", isError: false}]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);

  const logOutput = (msg, isError = false) => {
    setOutputLines(prev => [...prev, { msg, isError }].slice(-8));
  };

  const handleAddShape = (type) => {
    if (shapesArray.length >= 6) {
      logOutput(`  Array full (max 6 items).`, true);
      return;
    }
    setShapesArray([...shapesArray, type]);
    logOutput(`> shapes.push(new ${type}())`, false);
  };

  const handleRemoveShape = (index) => {
    const newArr = [...shapesArray];
    newArr.splice(index, 1);
    setShapesArray(newArr);
  };

  const handleExecute = async () => {
    if (isIterating || shapesArray.length === 0) return;
    setIsIterating(true);
    setDrawnShapes([]);
    logOutput(`> renderShapes(shapes)`, false);
    
    for (let i = 0; i < shapesArray.length; i++) {
      setActiveIndex(i);
      logOutput(`  Iterating index [${i}]...`, false);
      
      await new Promise(r => setTimeout(r, 600));
      
      const type = shapesArray[i];
      if (type === 'Circle') logOutput(`  shape.draw() -> Executing Circle's draw logic (rendering 360 degrees)`, false);
      if (type === 'Square') logOutput(`  shape.draw() -> Executing Square's draw logic (rendering 4 equal sides)`, false);
      if (type === 'Triangle') logOutput(`  shape.draw() -> Executing Triangle's draw logic (rendering 3 connected points)`, false);
      if (type === 'Rectangle') logOutput(`  shape.draw() -> Executing Rectangle's draw logic (rendering 2 pairs of equal sides)`, false);
      
      setDrawnShapes(prev => [...prev, shapesArray[i]]);
      
      await new Promise(r => setTimeout(r, 1000));
    }
    
    setActiveIndex(null);
    setIsIterating(false);
    logOutput(`> Execution complete.`, false);
  };

  const getShapeClasses = (type) => {
    if (type === 'Circle') return "rounded-full bg-red-500 w-24 h-24 shadow-[0_0_20px_rgba(239,68,68,0.5)]";
    if (type === 'Square') return "rounded-lg bg-blue-500 w-24 h-24 shadow-[0_0_20px_rgba(59,130,246,0.5)]";
    if (type === 'Rectangle') return "rounded-lg bg-yellow-500 w-32 h-20 shadow-[0_0_20px_rgba(234,179,8,0.5)]";
    if (type === 'Triangle') return "w-0 h-0 border-l-[48px] border-l-transparent border-r-[48px] border-r-transparent border-b-[96px] border-b-green-500 drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]";
    return "";
  };

  return (
    <div className="fixed top-[64px] bottom-0 left-0 right-0 bg-gray-50 dark:bg-[#09090b] flex flex-col lg:flex-row overflow-hidden">
      
      {/* Left Sidebar: Controls & Output */}
      <div className={`w-full lg:w-[350px] xl:w-[400px] h-1/2 lg:h-full bg-white/80 dark:bg-black/40 backdrop-blur-xl border-r border-b lg:border-b-0 border-gray-200 dark:border-white/10 shadow-2xl flex flex-col z-10 shrink-0 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? "ml-0" : "-ml-[100%] lg:-ml-[400px]"}`}>
        <div className="p-4 lg:p-6 flex flex-col gap-6 lg:gap-8 h-full">
          
          <VisualizerNav currentPath="/visualizer/polymorphism" />

          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-[var(--color-nova-brown)] tracking-tight mb-2">Polymorphism</h1>
            <p className="text-xs lg:text-sm text-gray-500 font-medium">Treating instances of different subclasses through the same base class interface. One method call, different behaviors.</p>
          </div>

          {/* Configuration */}
          <div className="flex flex-col gap-4 relative">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-white/10 pb-2">Shape Array (Type: Shape[])</h3>
            
            <div className="flex flex-col gap-3 bg-black/5 dark:bg-white/5 p-4 rounded-lg border border-gray-200 dark:border-white/5">
              <div className="grid grid-cols-2 gap-2">
                <button disabled={isIterating} onClick={() => handleAddShape('Circle')} className="bg-red-500 text-white rounded text-xs font-bold py-2 flex items-center justify-center gap-1 hover:brightness-110 disabled:opacity-50"><Plus size={12}/> Circle</button>
                <button disabled={isIterating} onClick={() => handleAddShape('Square')} className="bg-blue-500 text-white rounded text-xs font-bold py-2 flex items-center justify-center gap-1 hover:brightness-110 disabled:opacity-50"><Plus size={12}/> Square</button>
                <button disabled={isIterating} onClick={() => handleAddShape('Triangle')} className="bg-green-500 text-white rounded text-xs font-bold py-2 flex items-center justify-center gap-1 hover:brightness-110 disabled:opacity-50"><Plus size={12}/> Triangle</button>
                <button disabled={isIterating} onClick={() => handleAddShape('Rectangle')} className="bg-yellow-500 text-white rounded text-xs font-bold py-2 flex items-center justify-center gap-1 hover:brightness-110 disabled:opacity-50"><Plus size={12}/> Rectangle</button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 mt-2 pt-2 border-t border-gray-200 dark:border-white/10 relative min-h-[90px] items-center">
                <AnimatePresence>
                  {shapesArray.map((shape, i) => (
                    <motion.div 
                      key={`${i}-${shape}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: activeIndex === i ? 1.1 : 1, y: activeIndex === i ? -10 : 0 }}
                      exit={{ scale: 0 }}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl flex flex-col items-center justify-center relative border-2 ${activeIndex === i ? 'border-[var(--color-nova-brown)] bg-[var(--color-nova-brown)]/20 shadow-[0_0_20px_rgba(217,119,87,0.3)]' : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-[#161b22]'}`}
                    >
                      <span className="text-[10px] font-bold text-gray-500">Shape</span>
                      <span className={`text-xs font-mono font-bold mt-1 ${activeIndex === i ? 'text-[var(--color-nova-brown)]' : ''}`}>{shape}</span>
                      {!isIterating && (
                        <button onClick={() => handleRemoveShape(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:scale-110">
                          <Trash2 size={10} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {shapesArray.length === 0 && <span className="text-xs text-gray-500 italic">Empty Array</span>}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 relative">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-white/10 pb-2">Polymorphic Function</h3>
            
            <div className="bg-[#0d1117] text-[#c9d1d9] p-4 rounded-xl font-mono text-xs leading-loose border border-white/10 relative shadow-inner">
              <Code2 size={16} className="absolute top-4 right-4 text-gray-500" />
              <span className="text-[#ff7b72]">function</span> <span className="text-[#d2a8ff]">renderShapes</span>(shapes) {'{'}<br/>
              &nbsp;&nbsp;<span className="text-[#ff7b72]">for</span> (<span className="text-[#ff7b72]">let</span> shape <span className="text-[#ff7b72]">of</span> shapes) {'{'}<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#8b949e] italic">// Same method call, different behavior!</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<motion.span 
                animate={{ backgroundColor: activeIndex !== null ? 'rgba(210,168,255,0.2)' : 'transparent' }}
                className="inline-block px-1 rounded relative font-bold"
              >
                shape.<span className="text-[#d2a8ff]">draw</span>();
                
                {/* Method Call Animation packet */}
                <AnimatePresence>
                  {activeIndex !== null && (
                    <motion.div 
                      initial={{ opacity: 0, x: 0 }}
                      animate={{ opacity: [0, 1, 0], x: 200 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="absolute top-1/2 -translate-y-1/2 left-full ml-2 text-[var(--color-nova-brown)] z-50 flex items-center gap-1 bg-white dark:bg-black px-2 py-0.5 rounded shadow-lg border border-[var(--color-nova-brown)]/30 font-bold text-[10px]"
                    >
                      <ArrowRight size={10} /> call()
                    </motion.div>
                  )}
                </AnimatePresence>
                
              </motion.span><br/>
              &nbsp;&nbsp;{'}'}<br/>
              {'}'}
            </div>

            <button 
              disabled={isIterating || shapesArray.length === 0}
              onClick={handleExecute}
              className="bg-[var(--color-nova-brown)] text-white py-3 rounded-lg text-sm font-bold shadow-md hover:brightness-110 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <Play size={16} /> Execute Loop
            </button>
          </div>
          
          <div className="mt-auto pt-8"></div>
        </div>
      </div>

      {/* Right Canvas: Visualization & Console */}
      <div className="w-full lg:flex-1 h-1/2 lg:h-full flex flex-col relative overflow-hidden bg-gray-50/50 dark:bg-black/20">
        {/* Sidebar Toggle Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-4 left-4 z-50 p-2 bg-white/80 dark:bg-black/40 backdrop-blur border border-gray-200 dark:border-white/10 rounded shadow-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          {isSidebarOpen ? <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" /> : <ChevronRight size={20} className="text-gray-600 dark:text-gray-300" />}
        </button>

        
        {/* Main Visualization Area */}
        <div className="flex-1 flex flex-col p-8 lg:p-12 overflow-y-auto overflow-x-auto relative items-center min-h-[400px]">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-nova-brown)] opacity-5 blur-[100px] rounded-full pointer-events-none"></div>

          <h2 className="text-xl font-bold mb-8 text-gray-400 tracking-widest uppercase mt-4">Canvas Output</h2>

          <div className="flex flex-wrap gap-8 justify-center items-center max-w-2xl mt-8">
            <AnimatePresence>
              {drawnShapes.map((shape, i) => (
                <motion.div
                  key={`${i}-${shape}`}
                  initial={{ opacity: 0, scale: 0, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', bounce: 0.5 }}
                  className="flex flex-col items-center gap-4 relative"
                >
                  <motion.div 
                    initial={{ opacity: 1, scale: 2 }}
                    animate={{ opacity: 0, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 border-2 border-[var(--color-nova-brown)] rounded-full -z-10"
                  />
                  <div className={getShapeClasses(shape)} />
                  <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">{shape}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {drawnShapes.length === 0 && !isIterating && (
            <div className="text-gray-400 font-mono text-sm mt-12 opacity-50 flex items-center gap-2">
              <Play size={14} /> Click Execute Loop to draw...
            </div>
          )}

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
