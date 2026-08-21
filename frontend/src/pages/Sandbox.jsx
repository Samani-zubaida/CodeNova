import React, { useState } from 'react';
import axios from 'axios';
import { Play, Eye, Settings, Loader2, Code2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
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
  
  const [visualData, setVisualData] = useState(null);
  const [isVisualizing, setIsVisualizing] = useState(false);
  
  const { setExecutionOutput } = useAppStore();

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(DEFAULT_CODE[newLang]);
  };

  const handleRunCode = async () => {
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
      className="flex h-full p-6 gap-6 overflow-hidden"
    >
      <div className="flex flex-col w-1/2 gap-6 h-[calc(100vh-100px)]">
        
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex items-center justify-between glass-card p-3 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center bg-[var(--color-nova-red)]/10 p-2 rounded-lg text-[var(--color-nova-red)]">
              <Code2 size={20} />
            </div>
            <div className="relative">
              <select 
                value={language} 
                onChange={handleLanguageChange}
                className="appearance-none bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg pl-4 pr-10 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-nova-red)]/50 transition-all cursor-pointer"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-[var(--color-nova-red)] hover:bg-[var(--color-nova-red)]/10 rounded-lg transition-all">
              <Settings size={18} />
            </button>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleVisualize}
              disabled={isVisualizing}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-gradient-to-r from-[var(--color-nova-brown)] to-[#a88a7c] hover:brightness-110 text-white shadow-md shadow-[var(--color-nova-brown)]/30 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
              {isVisualizing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              Visualize
            </button>
            <button 
              onClick={handleRunCode}
              disabled={isExecuting}
              className="flex items-center gap-2 px-6 py-2 text-sm font-bold bg-gradient-to-r from-[var(--color-nova-red)] to-[#C86B85] text-white shadow-lg shadow-[var(--color-nova-red)]/40 hover:shadow-[var(--color-nova-red)]/60 rounded-lg transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0 disabled:active:scale-100"
            >
              {isExecuting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} className="fill-white" />}
              Run Code
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex-grow min-h-0 glass-card p-1 shadow-xl relative group"
        >
          <CodeEditor code={code} setCode={setCode} language={language} />
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="h-56 shrink-0"
        >
          <OutputTerminal isLoading={isExecuting} isError={isError} />
        </motion.div>
      </div>

      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="w-1/2 h-[calc(100vh-100px)]"
      >
        <VisualCanvas data={visualData} isVisualizing={isVisualizing} />
      </motion.div>
    </motion.div>
  );
};

export default Sandbox;
