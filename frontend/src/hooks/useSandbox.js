import { useState, useEffect, useCallback } from 'react';
import useAppStore from '../store/useAppStore';
import { useAuth } from '../context/AuthContext';
import * as sandboxService from '../services/sandboxService';
import { extractErrorMessage } from '../utils/formatters';

export const DEFAULT_CODE = {
  javascript: 'const arr = [10, 20, 30, 40, 50];\n\nfor (let i = 0; i < arr.length; i++) {\n  console.log(arr[i]);\n}',
  python: 'arr = [10, 20, 30, 40, 50]\n\nfor val in arr:\n    print(val)',
  cpp: '#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> arr = {10, 20, 30, 40, 50};\n    \n    for (int i = 0; i < arr.size(); i++) {\n        std::cout << arr[i] << "\\n";\n    }\n    \n    return 0;\n}',
  java: 'public class Main {\n    public static void main(String[] args) {\n        int[] arr = {10, 20, 30, 40, 50};\n        \n        for (int i = 0; i < arr.length; i++) {\n            System.out.println(arr[i]);\n        }\n    }\n}',
};

/**
 * Custom Hook: useSandbox
 * Encapsulates code editing, execution orchestration, terminal states,
 * and AI visualization/analysis using sandboxService.
 */
export function useSandbox(initialLanguage = 'javascript') {
  const [language, setLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(DEFAULT_CODE[initialLanguage] || DEFAULT_CODE.javascript);
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
  const { requireAuth } = useAuth();

  const handleLanguageChange = useCallback((e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(DEFAULT_CODE[newLang] || '');
    setShowTerminal(false);
  }, []);

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
      const data = await sandboxService.executeCode({ language, code });
      const { run } = data;
      if (run.stderr) {
        setIsError(true);
        setExecutionOutput(run.stderr);
      } else {
        setExecutionOutput(run.stdout || 'Execution finished with no output.');
      }
    } catch (error) {
      setIsError(true);
      if (error.response?.status === 401) {
        setExecutionOutput('Authentication required: Please log in to execute code in the sandbox.');
        requireAuth(null, { from: '/sandbox', message: 'Please log in first to access this feature.' });
      } else {
        setExecutionOutput(`Error executing code: ${extractErrorMessage(error)}`);
      }
    } finally {
      setIsExecuting(false);
    }
  }, [code, language, requireAuth, setExecutionOutput]);

  const handleAnalyze = useCallback(async () => {
    // Enforce authentication gate
    if (!requireAuth(null, { from: '/sandbox', message: 'Please log in first to access this feature.' })) {
      return;
    }

    setMobileTab('analysis');
    setIsAnalyzing(true);
    setAnalysisData(null);

    try {
      const data = await sandboxService.visualizeCode({ code, language });
      setAnalysisData(data.analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
      if (error.response?.status === 401) {
        setAnalysisData({ error: 'Authentication required. Please log in first.' });
        requireAuth(null, { from: '/sandbox', message: 'Please log in first to access this feature.' });
      } else {
        setAnalysisData({ error: extractErrorMessage(error, 'Failed to generate code analysis.') });
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [code, language, requireAuth]);

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

    const handleMouseUp = () => {
      setIsDraggingTerminal(false);
    };

    if (isDraggingTerminal) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingTerminal]);

  // Drag to resize logic for Left Panel (Horizontal)
  const startSidebarDrag = (e) => {
    e.preventDefault();
    setIsDraggingSidebar(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingSidebar) return;
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth > 25 && newWidth < 75) {
        setLeftPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingSidebar(false);
    };

    if (isDraggingSidebar) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSidebar]);

  return {
    language,
    setLanguage,
    code,
    setCode,
    isExecuting,
    isError,
    showTerminal,
    setShowTerminal,
    mobileTab,
    setMobileTab,
    terminalHeight,
    leftPanelWidth,
    isDraggingTerminal,
    isDraggingSidebar,
    analysisData,
    isAnalyzing,
    handleLanguageChange,
    handleRunCode,
    handleAnalyze,
    startTerminalDrag,
    startSidebarDrag,
  };
}

export default useSandbox;
