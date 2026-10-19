import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Play, Settings, Loader2, Code2, Sparkles, X, TerminalSquare, Code, LayoutDashboard, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CodeEditor from '../components/editor/CodeEditor';
import OutputTerminal from '../components/editor/OutputTerminal';
import VisualCanvas from '../components/editor/VisualCanvas';
import useAppStore from '../store/useAppStore';
import { useAuth } from '../context/AuthContext';

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
  const [mobileTab, setMobileTab] = useState('editor'); // 'editor', 'terminal', 'analysis'
  
  // Resizing state
  const [terminalHeight, setTerminalHeight] = useState(250);
  const [leftPanelWidth, setLeftPanelWidth] = useState(50); // percentage
  
  const [isDraggingTerminal, setIsDraggingTerminal] = useState(false);
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false);
  
  const [analysisData, setAnalysisData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { setExecutionOutput } = useAppStore();
  const { isAuthenticated, token, requireAuth } = useAuth();

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(DEFAULT_CODE[newLang]);
    setShowTerminal(false);
  };

  const handleRunCode = useCallback(async () => {
    // Enforce authentication gate
    if (!requireAuth(null, { from: '/sandbox', message: 'Please log in first to access this feature.' })) {
      return;
    }

    setShowTerminal(true);
    setMobileTab('terminal');
    setIsExecuting(true);
    setIsError(false);
    setExecutionOutput('Executing...');
    
    try {
      const response = await axios.post('http://localhost:5000/api/sandbox/execute', {
        language,
        code
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
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
      if (error.response?.status === 401) {
        setExecutionOutput('Authentication required: Please log in to execute code in the sandbox.');
        requireAuth(null, { from: '/sandbox', message: 'Please log in first to access this feature.' });
      } else {
        setExecutionOutput(`Error executing code: ${error.message}`);
      }
    } finally {
      setIsExecuting(false);
    }
  }, [code, language, requireAuth, setExecutionOutput, token]);

  const handleAnalyze = useCallback(async () => {
    // Enforce authentication gate
    if (!requireAuth(null, { from: '/sandbox', message: 'Please log in first to access this feature.' })) {
      return;
    }

    setMobileTab('analysis');
    setIsAnalyzing(true);
    setAnalysisData(null);
    try {
      const response = await axios.post('http://localhost:5000/api/sandbox/visualize', {
        code,
        language
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setAnalysisData(response.data.analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
      if (error.response?.status === 401) {
        setAnalysisData({ error: 'Authentication required. Please log in first.' });
        requireAuth(null, { from: '/sandbox', message: 'Please log in first to access this feature.' });
      } else {
        setAnalysisData({ error: 'Failed to generate code analysis.' });
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [code, language, requireAuth, token]);

  // Keyboard shortcut listener: Ctrl+Enter / Cmd+Enter runs code through the action guard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRunCode]);

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full overflow-hidden bg-[#FAF7F2] warm:bg-[#FAF5ED] dark:bg-[#1C131A] text-[#2D1F23] dark:text-[#F4EBC3] transition-colors"
    >
      {/* Invisible overlay to prevent iframes/canvases from swallowing mouse events during drag */}
      {(isDraggingTerminal || isDraggingSidebar) && (
        <div 
          className="fixed inset-0 z-50" 
          style={{ cursor: isDraggingSidebar ? 'col-resize' : 'row-resize' }} 
        />
      )}

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden flex items-center justify-between border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#251821] p-2 z-10 shrink-0 backdrop-blur-md">
        <button 
          onClick={() => setMobileTab('editor')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
            mobileTab === 'editor' 
              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <Code size={14} className="text-emerald-500" /> Code
        </button>
        <button 
          onClick={() => setMobileTab('terminal')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
            mobileTab === 'terminal' 
              ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <TerminalSquare size={14} className="text-sky-500" /> Output
        </button>
        <button 
          onClick={() => setMobileTab('analysis')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
            mobileTab === 'analysis' 
              ? 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-500/30' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <LayoutDashboard size={14} className="text-violet-500" /> Analysis
        </button>
      </div>

      {/* Left Panel: Editor & Terminal */}
      <div 
        className={`flex-col w-full h-full lg:border-r border-[#E2D5C5] dark:border-[#4D3640] ${mobileTab === 'analysis' ? 'hidden lg:flex' : 'flex'}`}
        style={typeof window !== 'undefined' && window.innerWidth >= 1024 ? { width: `${leftPanelWidth}%` } : {}}
      >
        
        {/* Editor Area */}
        <div className={`flex-col flex-1 min-h-0 p-3 lg:p-4 gap-3 ${mobileTab !== 'editor' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex items-center justify-between rounded-2xl border border-[#E2D5C5] dark:border-[#4D3640] bg-white/90 dark:bg-[#251821]/90 px-3 py-2 shadow-xs backdrop-blur-xl shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30 p-1.5 rounded-xl shadow-xs">
                <Code2 size={15} />
              </div>
              <div className="relative">
                <select 
                  value={language} 
                  onChange={handleLanguageChange}
                  className="appearance-none bg-slate-50 hover:bg-white dark:bg-[#181016] dark:hover:bg-[#20151E] border border-slate-300 dark:border-[#5C4550] text-slate-800 dark:text-amber-100 rounded-xl pl-3 pr-8 py-1.5 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all cursor-pointer shadow-xs"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400">
                  <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                id="analyze-code-btn"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                title={!isAuthenticated ? "Login required to analyze code" : "Analyze code with AI"}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-sm shadow-violet-500/25 rounded-xl transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer ${
                  !isAuthenticated ? 'ring-1 ring-violet-400/50' : ''
                }`}
              >
                {isAnalyzing ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : !isAuthenticated ? (
                  <Lock size={13} className="text-violet-200" />
                ) : (
                  <Sparkles size={13} className="text-violet-200" />
                )}
                <span className="hidden sm:inline">
                  {!isAuthenticated ? 'Analyze (Login Required)' : 'Analyze'}
                </span>
              </button>
              <button 
                id="run-code-btn"
                onClick={handleRunCode}
                disabled={isExecuting}
                title={!isAuthenticated ? "Login required to run code" : "Run Code (Ctrl + Enter)"}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-500/25 rounded-xl transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 cursor-pointer ${
                  !isAuthenticated ? 'ring-1 ring-emerald-400/50' : ''
                }`}
              >
                {isExecuting ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : !isAuthenticated ? (
                  <Lock size={13} className="text-emerald-100" />
                ) : (
                  <Play size={13} className="fill-white" />
                )}
                <span className="hidden sm:inline">
                  {!isAuthenticated ? 'Run Code (Login Required)' : 'Run Code'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex-grow min-h-0 rounded-2xl p-0.5 shadow-md relative group bg-white/60 dark:bg-[#1A1218]/60 border border-[#E2D5C5] dark:border-[#4D3640] backdrop-blur-md">
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
                className="hidden lg:flex w-full h-2 cursor-row-resize items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-sky-500/30 transition-colors shrink-0"
                onMouseDown={startTerminalDrag}
              >
                <div className="w-8 h-0.5 bg-slate-400/60 dark:bg-slate-500/60 rounded-full" />
              </div>

              {/* Terminal Inner Area */}
              <div className="relative w-full h-full overflow-hidden lg:px-4 lg:pb-4 p-3 flex-1 flex">
                 <div className="w-full h-full relative">
                   <OutputTerminal isLoading={isExecuting} isError={isError} />
                   
                   {/* Close Terminal Button (Desktop only) */}
                   <button 
                     onClick={() => setShowTerminal(false)}
                     className="hidden lg:block absolute top-2.5 right-3 p-1.5 rounded-lg bg-slate-200/80 hover:bg-rose-500 hover:text-white dark:bg-black/50 dark:hover:bg-rose-500 text-slate-600 dark:text-slate-300 transition-all z-20 cursor-pointer shadow-xs"
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
        className="hidden lg:flex w-2 h-full cursor-col-resize items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-sky-500/30 transition-colors shrink-0 z-10"
        onMouseDown={startSidebarDrag}
      >
        <div className="h-8 w-0.5 bg-slate-400/60 dark:bg-slate-500/60 rounded-full" />
      </div>

      {/* Right Panel: Visualizer */}
      <div 
        className={`w-full h-full p-3 lg:p-4 ${mobileTab !== 'analysis' ? 'hidden lg:block' : 'block'}`}
        style={typeof window !== 'undefined' && window.innerWidth >= 1024 ? { width: `calc(${100 - leftPanelWidth}% - 8px)` } : {}}
      >
        <VisualCanvas 
          analysisData={analysisData} 
          isAnalyzing={isAnalyzing} 
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
