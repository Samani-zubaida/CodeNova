import React, { useState } from 'react';
import axios from 'axios';
import { Play, Eye, Settings, Loader2, Code2, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CodeEditor from '../components/editor/CodeEditor';
import OutputTerminal from '../components/editor/OutputTerminal';
import VisualCanvas from '../components/editor/VisualCanvas';
import useAppStore from '../store/useAppStore';

const DEFAULT_CODE = {
  javascript: 'console.log("Hello, Code Nova!");',
  python: 'print("Hello, Code Nova!")',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, Code Nova!" << std::endl;\n    return 0;\n}',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Code Nova!");\n    }\n}'
};

const Sandbox = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isError, setIsError] = useState(false);
  
  const [showTerminal, setShowTerminal] = useState(false);
  
  const [visualData, setVisualData] = useState(null);
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
    setIsVisualizing(true);
    setVisualData(null);
    try {
      const response = await axios.post('http://localhost:5000/api/sandbox/visualize', {
        code,
        language
      });
      setVisualData(response.data.steps);
    } catch (error) {
      console.error('Visualization failed:', error);
      setVisualData({ error: 'Failed to generate visual steps.' });
    } finally {
      setIsVisualizing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex h-full p-4 gap-3 overflow-hidden bg-[#FAF7F2] dark:bg-[#331921] text-[#2D1F23] dark:text-[#F4EBC3] transition-colors"
    >
      <div className="flex flex-col w-1/2 gap-3 h-[calc(100vh-64px)]">
        
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex items-center justify-between glass-card px-2 py-1.5 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center bg-[var(--color-nova-red)]/10 p-1 rounded-md text-[var(--color-nova-red)]">
              <Code2 size={14} />
            </div>
            <div className="relative">
              <select 
                value={language} 
                onChange={handleLanguageChange}
                className="appearance-none bg-white/80 dark:bg-[#423834] border border-[#EBE0D3] dark:border-[#5C4E49] text-[#2D1F23] dark:text-[#F4EBC3] rounded-md pl-2 pr-6 py-1 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-[#AB526B]/50 transition-all cursor-pointer"
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
            <button className="p-1 text-gray-400 hover:text-[var(--color-nova-red)] hover:bg-[var(--color-nova-red)]/10 rounded-md transition-all">
              <Settings size={13} />
            </button>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleVisualize}
              disabled={isVisualizing}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-[#BCA297] hover:bg-[#A4877B] text-white shadow-xs rounded-md transition-all transform active:scale-95 disabled:opacity-50"
            >
              {isVisualizing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              Visualize
            </button>
            <button 
              onClick={handleRunCode}
              disabled={isExecuting}
              className="flex items-center gap-1 px-3 py-1 text-[11px] font-bold bg-[#AB526B] hover:bg-[#8E3B53] text-white shadow-xs rounded-md transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
            >
              {isExecuting ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} className="fill-white" />}
              Run Code
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex-grow min-h-0 glass-card p-0.5 shadow-md relative group"
        >
          <CodeEditor code={code} setCode={setCode} language={language} />
        </motion.div>

        <AnimatePresence>
          {showTerminal && (
            <motion.div 
              initial={{ height: 0, opacity: 0, marginTop: -12 }}
              animate={{ height: 200, opacity: 1, marginTop: 0 }}
              exit={{ height: 0, opacity: 0, marginTop: -12 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="shrink-0 overflow-hidden relative"
            >
              <OutputTerminal isLoading={isExecuting} isError={isError} />
              
              <button 
                onClick={() => setShowTerminal(false)}
                className="absolute top-2 right-3 p-1 rounded bg-black/40 text-gray-400 hover:text-white hover:bg-[var(--color-nova-red)]/80 transition-colors z-20"
                title="Close Terminal"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="w-1/2 h-[calc(100vh-64px)]"
      >
        <VisualCanvas data={visualData} isVisualizing={isVisualizing} />
      </motion.div>
    </motion.div>
  );
};

export default Sandbox;
