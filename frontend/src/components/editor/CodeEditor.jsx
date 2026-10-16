import React, { useCallback } from 'react';
import Editor from '@monaco-editor/react';
import useAppStore from '../../store/useAppStore';

const CodeEditor = ({ code, setCode, language }) => {
  const { theme } = useAppStore();

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleBeforeMount = useCallback((monaco) => {
    // 1. Code Nova Premium Dark Theme (Tailored to Code Nova deep wine & charcoal palette)
    monaco.editor.defineTheme('codenova-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'FB7185', fontStyle: 'bold' },
        { token: 'keyword.control', foreground: 'FB7185', fontStyle: 'bold' },
        { token: 'storage', foreground: 'F43F5E', fontStyle: 'bold' },
        { token: 'storage.type', foreground: 'C084FC', fontStyle: 'bold' },
        { token: 'string', foreground: '34D399' },
        { token: 'string.escape', foreground: '6EE7B7' },
        { token: 'number', foreground: 'FBBF24' },
        { token: 'type', foreground: 'A78BFA', fontStyle: 'bold' },
        { token: 'type.identifier', foreground: 'A78BFA' },
        { token: 'class', foreground: 'C084FC', fontStyle: 'bold' },
        { token: 'function', foreground: '38BDF8' },
        { token: 'identifier', foreground: 'F4EBC3' },
        { token: 'variable', foreground: 'F4EBC3' },
        { token: 'variable.parameter', foreground: 'E2E8F0' },
        { token: 'comment', foreground: '94A3B8', fontStyle: 'italic' },
        { token: 'operator', foreground: 'F472B6' },
        { token: 'delimiter', foreground: 'CBD5E1' },
        { token: 'delimiter.bracket', foreground: '38BDF8' },
      ],
      colors: {
        'editor.background': '#1A1218',
        'editor.foreground': '#F4EBC3',
        'editorLineNumber.foreground': '#7D6A74',
        'editorLineNumber.activeForeground': '#38BDF8',
        'editor.lineHighlightBackground': '#251923',
        'editor.lineHighlightBorder': '#3D2836',
        'editor.selectionBackground': '#0EA5E940',
        'editor.inactiveSelectionBackground': '#0EA5E920',
        'editorCursor.foreground': '#38BDF8',
        'editorWhitespace.foreground': '#382633',
        'editorIndentGuide.background': '#2E1F2A',
        'editorIndentGuide.activeBackground': '#0EA5E960',
        'editorGutter.background': '#160F14',
      }
    });

    // 2. Code Nova Premium Light Theme (High contrast, crisp warm ivory surface)
    monaco.editor.defineTheme('codenova-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'BE185D', fontStyle: 'bold' },
        { token: 'keyword.control', foreground: 'BE185D', fontStyle: 'bold' },
        { token: 'storage', foreground: 'BE185D', fontStyle: 'bold' },
        { token: 'storage.type', foreground: '6D28D9', fontStyle: 'bold' },
        { token: 'string', foreground: '059669' },
        { token: 'string.escape', foreground: '047857' },
        { token: 'number', foreground: 'D97706' },
        { token: 'type', foreground: '6D28D9', fontStyle: 'bold' },
        { token: 'type.identifier', foreground: '6D28D9' },
        { token: 'class', foreground: '7C3AED', fontStyle: 'bold' },
        { token: 'function', foreground: '0284C7' },
        { token: 'identifier', foreground: '1E293B' },
        { token: 'variable', foreground: '1E293B' },
        { token: 'variable.parameter', foreground: '334155' },
        { token: 'comment', foreground: '64748B', fontStyle: 'italic' },
        { token: 'operator', foreground: '9D174D' },
        { token: 'delimiter', foreground: '475569' },
        { token: 'delimiter.bracket', foreground: '0284C7' },
      ],
      colors: {
        'editor.background': '#FAF8F5',
        'editor.foreground': '#1E141B',
        'editorLineNumber.foreground': '#9E8D84',
        'editorLineNumber.activeForeground': '#0284C7',
        'editor.lineHighlightBackground': '#F0E8DC70',
        'editor.lineHighlightBorder': '#E5D8C8',
        'editor.selectionBackground': '#0284C728',
        'editor.inactiveSelectionBackground': '#0284C715',
        'editorCursor.foreground': '#0284C7',
        'editorWhitespace.foreground': '#E5DDD4',
        'editorIndentGuide.background': '#E8DFD5',
        'editorIndentGuide.activeBackground': '#0284C750',
        'editorGutter.background': '#F4EFEA',
      }
    });

    // 3. Code Nova Warm Sepia Theme (Golden parchment background)
    monaco.editor.defineTheme('codenova-warm', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '9F1239', fontStyle: 'bold' },
        { token: 'keyword.control', foreground: '9F1239', fontStyle: 'bold' },
        { token: 'storage', foreground: '9F1239', fontStyle: 'bold' },
        { token: 'storage.type', foreground: '7E22CE', fontStyle: 'bold' },
        { token: 'string', foreground: '15803D' },
        { token: 'string.escape', foreground: '166534' },
        { token: 'number', foreground: 'B45309' },
        { token: 'type', foreground: '7E22CE', fontStyle: 'bold' },
        { token: 'type.identifier', foreground: '7E22CE' },
        { token: 'class', foreground: '6B21A8', fontStyle: 'bold' },
        { token: 'function', foreground: '0369A1' },
        { token: 'identifier', foreground: '2D1F23' },
        { token: 'variable', foreground: '2D1F23' },
        { token: 'variable.parameter', foreground: '443336' },
        { token: 'comment', foreground: '78716C', fontStyle: 'italic' },
        { token: 'operator', foreground: '9F1239' },
        { token: 'delimiter', foreground: '57534E' },
        { token: 'delimiter.bracket', foreground: '0369A1' },
      ],
      colors: {
        'editor.background': '#F5EDE1',
        'editor.foreground': '#2D1F23',
        'editorLineNumber.foreground': '#9E8D81',
        'editorLineNumber.activeForeground': '#0369A1',
        'editor.lineHighlightBackground': '#EADBCA80',
        'editor.lineHighlightBorder': '#DCCBB7',
        'editor.selectionBackground': '#0369A128',
        'editor.inactiveSelectionBackground': '#0369A115',
        'editorCursor.foreground': '#0369A1',
        'editorWhitespace.foreground': '#DFCFBE',
        'editorIndentGuide.background': '#DFCFBE',
        'editorIndentGuide.activeBackground': '#0369A150',
        'editorGutter.background': '#EFE4D4',
      }
    });
  }, []);

  const activeTheme = theme === 'dark' ? 'codenova-dark' : theme === 'warm' ? 'codenova-warm' : 'codenova-light';

  return (
    <div className="h-full w-full rounded-[12px] overflow-hidden shadow-inner border border-[#E8DFD5] dark:border-[#4D3640] group-hover:border-sky-500/40 dark:group-hover:border-sky-500/40 transition-all duration-300">
      <Editor
        height="100%"
        language={language}
        theme={activeTheme}
        beforeMount={handleBeforeMount}
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
            verticalScrollbarSize: 7,
            horizontalScrollbarSize: 7,
          }
        }}
      />
    </div>
  );
};

export default CodeEditor;
