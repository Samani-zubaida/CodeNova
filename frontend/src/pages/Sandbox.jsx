import React, { useState } from 'react';
import axios from 'axios';
import { Play, Eye, Settings, Loader2 } from 'lucide-react';
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
  
  // Visualizer state
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
      // Connects to our backend proxy which connects to Piston API
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
    <div className="flex h-full p-4 gap-4 overflow-hidden">
      {/* Left Column: Editor & Terminal */}
      <div className="flex flex-col w-1/2 gap-4 h-[calc(100vh-80px)]">
        
        {/* Toolbar */}
        <div className="flex items-center justify-between bg-card p-2 rounded-md border border-border shadow-sm">
          <div className="flex items-center gap-2">
            <select 
              value={language} 
              onChange={handleLanguageChange}
              className="bg-transparent border border-input rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
            <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <Settings size={18} />
            </button>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleVisualize}
              disabled={isVisualizing}
              className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity rounded-md disabled:opacity-50"
            >
              {isVisualizing ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />}
              Visualize
            </button>
            <button 
              onClick={handleRunCode}
              disabled={isExecuting}
              className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity rounded-md disabled:opacity-50"
            >
              {isExecuting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
              Run
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-grow min-h-0">
          <CodeEditor code={code} setCode={setCode} language={language} />
        </div>

        {/* Terminal Output */}
        <div className="h-48 shrink-0">
          <OutputTerminal isLoading={isExecuting} isError={isError} />
        </div>
      </div>

      {/* Right Column: Visualizer */}
      <div className="w-1/2 h-[calc(100vh-80px)]">
        <VisualCanvas data={visualData} isVisualizing={isVisualizing} />
      </div>
    </div>
  );
};

export default Sandbox;
