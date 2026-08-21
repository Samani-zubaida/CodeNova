import React from 'react';
import Editor from '@monaco-editor/react';
import useAppStore from '../../store/useAppStore';

const CodeEditor = ({ code, setCode, language }) => {
  const { theme } = useAppStore();

  const handleEditorChange = (value) => {
    setCode(value);
  };

  return (
    <div className="h-full w-full rounded-[10px] overflow-hidden shadow-inner group-hover:ring-1 group-hover:ring-[var(--color-nova-red)]/30 transition-all duration-300">
      <Editor
        height="100%"
        language={language}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        value={code}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          lineNumbersMinChars: 3,
          renderLineHighlight: "all",
          scrollbar: {
            useShadows: false,
            verticalHasArrows: false,
            horizontalHasArrows: false,
            verticalScrollbarSize: 6,
          }
        }}
      />
    </div>
  );
};

export default CodeEditor;
