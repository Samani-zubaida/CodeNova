import React from 'react';
import Editor from '@monaco-editor/react';
import useAppStore from '../../store/useAppStore';

const CodeEditor = ({ code, setCode, language }) => {
  const { theme } = useAppStore();

  const handleEditorChange = (value) => {
    setCode(value);
  };

  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-inner group-hover:ring-2 group-hover:ring-[var(--color-nova-red)]/30 transition-all duration-300">
      <Editor
        height="100%"
        language={language}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        value={code}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 15,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          padding: { top: 24, bottom: 24 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          lineNumbersMinChars: 4,
          renderLineHighlight: "all",
          scrollbar: {
            useShadows: false,
            verticalHasArrows: false,
            horizontalHasArrows: false,
            verticalScrollbarSize: 8,
          }
        }}
      />
    </div>
  );
};

export default CodeEditor;
