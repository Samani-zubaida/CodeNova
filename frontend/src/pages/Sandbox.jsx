import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Play, Settings, Loader2, Code2, Sparkles, X, TerminalSquare, Code, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CodeEditor from '../components/editor/CodeEditor';
import OutputTerminal from '../components/editor/OutputTerminal';
import VisualCanvas from '../components/editor/VisualCanvas';
import useAppStore from '../store/useAppStore';

const DEFAULT_CODE = {
  javascript: 'const arr = [10, 20, 30, 40, 50];\n\nfor (let i = 0; i < arr.length; i++) {\n  console.log(arr[i]);\n}',
  python: 'arr = [10, 20, 30, 40, 50]\n\nfor val in arr:\n    print(val)',
  cpp: '#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> arr = {10, 20, 30, 40, 50};\n    \n    for (int i = 0; i < arr.size(); i++) {\n        std::cout << arr[i] << "\\n";\n    }\n    \n    return 0;\n}',
  java: 'public class Main {\n    public static void main(String[] args) {\n        int[] arr = {10, 20, 30, 40, 50};\n        \n        for (int i = 0; i < arr.length; i++) {\n            System.out.println(arr[i]);\n        }\n    }\n}'
};

const Sandbox = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isError, setIsError] = useState(false);
  
  const [showTerminal, setShowTerminal] = useState(false);
  const [mobileTab, setMobileTab] = useState('editor'); // 'editor', 'terminal', 'visualizer'
  
  // Resizing state
  const [terminalHeight, setTerminalHeight] = useState(250);
  const [leftPanelWidth, setLeftPanelWidth] = useState(50); // percentage
  
  const [isDraggingTerminal, setIsDraggingTerminal] = useState(false);
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false);
  
  const [visualData, setVisualData] = useState(null);
  const [visualMetadata, setVisualMetadata] = useState(null);
  const [isVisualizing, setIsVisualizing] = useState(false);
  
  const { setExecutionOutput } = useAppStore();

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(DEFAULT_CODE[newLang]);
    setShowTerminal(false);
  };

  const handleRunCode = async () => {
    setShowTerminal(true);
    setMobileTab('terminal');
    setIsExecuting(true);
    setIsError(false);
    setExecutionOutput('Executing...');
    
    try {
      const response = await axios.post('http://localhost:5000/api/sandbox/execute', {
        language,
        code
      });
      
      const { run } = response.data;
      if (run.stderr) {
        setIsError(true);
        setExecutionOutput(run.stderr);
      } else {
        setExecutionOutput(run.stdout);
      }
    } catch (error) {
      setIsError(true);
      setExecutionOutput(`Error executing code: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleVisualize = async () => {
    setMobileTab('visualizer');
    setIsVisualizing(true);
    setVisualData(null);
    setVisualMetadata(null);
    try {
      const response = await axios.post('http://localhost:5000/api/sandbox/visualize', {
        code,
        language
      });
      setVisualData(response.data.steps);
      setVisualMetadata(response.data.metadata || null);
    } catch (error) {
      console.error('Visualization failed:', error);
      setVisualData({ error: 'Failed to generate visual steps.' });
    } finally {
      setIsVisualizing(false);
    }
  };

  // Drag to resize logic for Terminal (Vertical)
  const startTerminalDrag = (e) => {
    e.preventDefault();
    setIsDraggingTerminal(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingTerminal) return;
      const newHeight = window.innerHeight - e.clientY - 20;
      if (newHeight > 100 && newHeight < window.innerHeight - 200) {
        setTerminalHeight(newHeight);
      }
    };
    
    const handleMouseUp = () => setIsDraggingTerminal(false);

    if (isDraggingTerminal) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingTerminal]);

  // Drag to resize logic for Sidebar (Horizontal)
  const startSidebarDrag = (e) => {
    e.preventDefault();
    setIsDraggingSidebar(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingSidebar) return;
      const newWidthPercent = (e.clientX / window.innerWidth) * 100;
      if (newWidthPercent > 20 && newWidthPercent < 80) {
        setLeftPanelWidth(newWidthPercent);
      }
    };
    
    const handleMouseUp = () => setIsDraggingSidebar(false);

    if (isDraggingSidebar) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSidebar]);

  return (
    <motion.div 
      transition={{ duration: 0.4 }}
      className="fixed top-16 left-0 right-0 bottom-0 flex flex-col lg:flex-row overflow-hidden w-full bg-gray-50 dark:bg-[#09090b]"
    >
      {/* Invisible overlay to prevent iframes/canvases from swallowing mouse events during drag */}
      {(isDraggingTerminal || isDraggingSidebar) && (
        <div 
          className="fixed inset-0 z-50" 
          style={{ cursor: isDraggingSidebar ? 'col-resize' : 'row-resize' }} 
        />
      )}

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-white/50 dark:bg-[#111] p-2 z-10 shrink-0">
        <button 
          onClick={() => setMobileTab('editor')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${mobileTab === 'editor' ? 'bg-[var(--color-nova-red)]/10 text-[var(--color-nova-red)]' : 'text-gray-500 hover:bg-black/5'}`}
        >
          <Code size={14} /> Code
        </button>
        <button 
          onClick={() => setMobileTab('terminal')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${mobileTab === 'terminal' ? 'bg-[var(--color-nova-brown)]/10 text-[var(--color-nova-brown)]' : 'text-gray-500 hover:bg-black/5'}`}
        >
          <TerminalSquare size={14} /> Output
        </button>
        <button 
          onClick={() => setMobileTab('visualizer')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${mobileTab === 'visualizer' ? 'bg-[var(--color-nova-red)]/10 text-[var(--color-nova-red)]' : 'text-gray-500 hover:bg-black/5'}`}
        >
          <LayoutDashboard size={14} /> Visualizer
        </button>
      </div>

      {/* Left Panel: Editor & Terminal */}
      <div 
        className={`flex-col w-full h-full lg:border-r border-black/5 dark:border-white/5 ${mobileTab === 'visualizer' ? 'hidden lg:flex' : 'flex'}`}
        style={typeof window !== 'undefined' && window.innerWidth >= 1024 ? { width: `${leftPanelWidth}%` } : {}}
      >
        
        {/* Editor Area */}
        <div className={`flex-col flex-1 min-h-0 p-3 lg:p-4 gap-3 ${mobileTab !== 'editor' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex items-center justify-between glass-card px-2 py-1.5 shadow-sm shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center bg-[var(--color-nova-red)]/10 p-1 rounded-md text-[var(--color-nova-red)]">
                <Code2 size={14} />
              </div>
              <div className="relative">
                <select 
                  value={language} 
                  onChange={handleLanguageChange}
                  className="appearance-none bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-md pl-2 pr-6 py-1 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-[var(--color-nova-red)]/50 transition-all cursor-pointer"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-500">
                  <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleVisualize}
                disabled={isVisualizing}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-gradient-to-r from-[var(--color-nova-brown)] to-[#a88a7c] hover:brightness-110 text-white shadow-sm shadow-[var(--color-nova-brown)]/30 rounded-md transition-all transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              >
                {isVisualizing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                <span className="hidden sm:inline">Visualize</span>
              </button>
              <button 
                onClick={handleRunCode}
                disabled={isExecuting}
                className="flex items-center gap-1 px-3 py-1 text-[11px] font-bold bg-gradient-to-r from-[var(--color-nova-red)] to-[#C86B85] text-white shadow-sm shadow-[var(--color-nova-red)]/40 hover:shadow-[var(--color-nova-red)]/60 rounded-md transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0 disabled:active:scale-100"
              >
                {isExecuting ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} className="fill-white" />}
                <span className="hidden sm:inline">Run Code</span>
              </button>
            </div>
          </div>

          <div className="flex-grow min-h-0 glass-card p-0.5 shadow-md relative group">
            <CodeEditor code={code} setCode={setCode} language={language} />
          </div>
        </div>

        {/* Terminal Area with Slide Effect */}
        <AnimatePresence>
          {showTerminal && (
            <motion.div
              key="terminal-container"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: typeof window !== 'undefined' && window.innerWidth >= 1024 ? terminalHeight : 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={`flex flex-col shrink-0 overflow-hidden ${mobileTab !== 'terminal' ? 'hidden lg:flex' : 'flex flex-1'}`}
            >
              {/* Resizer Handle (Vertical - Terminal) */}
              <div 
                className="hidden lg:flex w-full h-2 cursor-row-resize items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-[var(--color-nova-red)]/30 transition-colors shrink-0"
                onMouseDown={startTerminalDrag}
              >
                <div className="w-8 h-0.5 bg-gray-400/50 rounded-full" />
              </div>

              {/* Terminal Inner Area */}
              <div className="relative w-full h-full overflow-hidden lg:px-4 lg:pb-4 p-3 flex-1 flex">
                 <div className="w-full h-full relative">
                   <OutputTerminal isLoading={isExecuting} isError={isError} />
                   
                   {/* Close Terminal Button (Desktop only) */}
                   <button 
                     onClick={() => setShowTerminal(false)}
                     className="hidden lg:block absolute top-2 right-3 p-1 rounded bg-black/40 text-gray-400 hover:text-white hover:bg-[var(--color-nova-red)]/80 transition-colors z-20"
                     title="Close Terminal"
                   >
                     <X size={12} />
                   </button>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Resizer Handle (Horizontal - Editor vs Visualizer) */}
      <div 
        className="hidden lg:flex w-2 h-full cursor-col-resize items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-[var(--color-nova-red)]/30 transition-colors shrink-0 z-10"
        onMouseDown={startSidebarDrag}
      >
        <div className="h-8 w-0.5 bg-gray-400/50 rounded-full" />
      </div>

      {/* Right Panel: Visualizer */}
      <div 
        className={`w-full h-full p-3 lg:p-4 ${mobileTab !== 'visualizer' ? 'hidden lg:block' : 'block'}`}
        style={typeof window !== 'undefined' && window.innerWidth >= 1024 ? { width: `calc(${100 - leftPanelWidth}% - 8px)` } : {}}
      >
        <VisualCanvas 
          data={visualData} 
          metadata={visualMetadata}
          isVisualizing={isVisualizing} 
          setShowTerminal={(show) => {
            setShowTerminal(show);
            if(show && typeof window !== 'undefined' && window.innerWidth < 1024) setMobileTab('terminal');
          }} 
        />
      </div>
    </motion.div>
  );
};

export default Sandbox;
