import React from 'react';
import Editor from '@monaco-editor/react';
import useAppStore from '../../store/useAppStore';

const CodeEditor = ({ code, setCode, language }) => {
  const { theme } = useAppStore();

  const handleEditorChange = (value) => {
    setCode(value);
  };

  return (
    <div className="h-full w-full rounded-md overflow-hidden border border-border shadow-sm">
      <Editor
        height="100%"
        language={language}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        value={code}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          lineNumbersMinChars: 3,
        }}
      />
    </div>
  );
};

export default CodeEditor;
