import React, { useState } from 'react';
import { Code2, ChevronDown, ChevronUp, Eye } from 'lucide-react';

/**
 * Universal interactive code inspector with line-by-line sync and variable watches.
 */
export default function CodeInspector({
  codeSnippets = {},
  activeLine = -1,
  variables = {},
  title = "Algorithm Logic",
  defaultExpanded = true,
  className = ''
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  // Available languages
  const availableLangs = Object.keys(codeSnippets).length > 0 
    ? Object.keys(codeSnippets) 
    : ['javascript'];

  const [selectedLang, setSelectedLang] = useState(availableLangs[0] || 'javascript');

  const rawCode = codeSnippets[selectedLang] || [];
  const lines = Array.isArray(rawCode) ? rawCode : String(rawCode).split('\n');

  const hasVariables = variables && Object.keys(variables).length > 0;

  return (
    <div className={`w-full bg-white/95 dark:bg-[#161616]/95 backdrop-blur-md border border-[#EBE0D3] dark:border-[#2E2E2E] rounded-xl overflow-hidden shadow-xs flex flex-col transition-all duration-300 ${className}`}>
      
      {/* Header Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-3 py-2 bg-gray-50/80 dark:bg-[#1F1F1F] border-b border-[#EBE0D3] dark:border-[#2A2A2A] cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-[#252525] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Code2 size={14} className="text-[#BC4A54]" />
          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{title}</span>
          {activeLine >= 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-300 dark:border-emerald-800">
              L:{activeLine + 1}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher Chips */}
          {availableLangs.length > 1 && (
            <div 
              className="flex items-center gap-1 bg-gray-200/70 dark:bg-[#2A2A2A] p-0.5 rounded-md"
              onClick={(e) => e.stopPropagation()}
            >
              {availableLangs.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase transition-all ${
                    selectedLang === lang
                      ? 'bg-white dark:bg-[#141414] text-[#BC4A54] shadow-xs'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}

          {isExpanded ? (
            <ChevronUp size={14} className="text-gray-400" />
          ) : (
            <ChevronDown size={14} className="text-gray-400" />
          )}
        </div>
      </div>

      {/* Expanded Code & Variable View */}
      {isExpanded && (
        <div className="flex flex-col text-xs font-mono">
          
          {/* Code Lines Display */}
          <div className="max-h-48 overflow-y-auto bg-gray-900 text-gray-200 p-2.5 flex flex-col gap-0.5 text-[11px] leading-relaxed">
            {lines.map((line, idx) => {
              const isCurrent = activeLine === idx;
              return (
                <div
                  key={idx}
                  className={`flex items-start px-1.5 py-0.5 rounded transition-colors duration-150 ${
                    isCurrent 
                      ? 'bg-[#BC4A54]/30 border-l-2 border-[#BC4A54] text-white font-bold' 
                      : 'hover:bg-white/5 opacity-85'
                  }`}
                >
                  <span className="w-6 shrink-0 text-gray-500 select-none text-[10px] text-right pr-2">
                    {idx + 1}
                  </span>
                  <span className="whitespace-pre flex-1 overflow-x-auto">
                    {line}
                  </span>
                  {isCurrent && (
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1 self-center" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Live Variable Watcher Section */}
          {hasVariables && (
            <div className="p-2.5 bg-gray-50 dark:bg-[#1A1A1A] border-t border-[#EBE0D3] dark:border-[#2A2A2A] flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                <Eye size={11} className="text-[#BC4A54]" />
                <span>Variable Watcher</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {Object.entries(variables).map(([name, val]) => (
                  <div 
                    key={name}
                    className="flex items-center justify-between bg-white dark:bg-[#222] px-2 py-1 rounded border border-gray-200 dark:border-[#333] text-[11px]"
                  >
                    <span className="text-gray-500 dark:text-gray-400 font-semibold">{name}:</span>
                    <span className="font-bold text-[#BC4A54] dark:text-[#D3DFC8]">
                      {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
