import React from 'react';
import { FileText, Key, Sparkles, Shuffle, Zap } from 'lucide-react';

export default function StringControlsPanel({
  currentAlgoId,
  textInput,
  setTextInput,
  patternInput,
  setPatternInput,
  secondTextInput,
  setSecondTextInput,
  handleApplyCustom,
  handleRandomize,
  ALGO_PRESETS,
  applyPreset = () => {}
}) {
  return (
    <div className="flex flex-col gap-3.5 w-full">
      {/* USER INTERACTION BAR: CUSTOM STRING & PATTERN INPUTS */}
      <div className="flex flex-col gap-3 p-3.5 bg-white dark:bg-[#423834]/80 rounded-2xl border border-[#EBE0D3] dark:border-[#5C4E49] shadow-md">
        
        {/* Row 1: Inputs and Compute button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Main String Input */}
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              {currentAlgoId === 'levenshtein' || currentAlgoId === 'lcs' || currentAlgoId === 'isomorphic' ? 'Word 1:' : currentAlgoId === 'reverse_words' ? 'Sentence:' : currentAlgoId === 'valid_parentheses' ? 'Brackets:' : 'Main String:'}
            </span>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="flex-1 bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg px-3 py-1.5 text-xs font-mono text-[#2D1F23] dark:text-[#F4EBC3] focus:outline-none focus:border-cyan-500 shadow-inner"
              placeholder="Type any custom string..."
            />
            <span className="text-[10px] font-mono text-slate-500 bg-gray-100 dark:bg-[#5C4E49] px-1.5 py-0.5 rounded">
              {textInput.length} chars
            </span>
          </div>

          {/* Second Input for Pattern or Word 2 */}
          {(currentAlgoId === 'kmp' || currentAlgoId === 'rabin_karp' || currentAlgoId === 'boyer_moore' || currentAlgoId === 'z_algorithm' || currentAlgoId === 'anagram_search') && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                <Key className="w-3.5 h-3.5" /> Pattern:
              </span>
              <input
                type="text"
                value={patternInput}
                onChange={(e) => setPatternInput(e.target.value)}
                className="w-36 bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg px-3 py-1.5 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500 shadow-inner"
                placeholder="Search pattern..."
              />
              <span className="text-[10px] font-mono text-slate-500 bg-gray-100 dark:bg-[#5C4E49] px-1.5 py-0.5 rounded">
                {patternInput.length}
              </span>
            </div>
          )}

          {(currentAlgoId === 'levenshtein' || currentAlgoId === 'lcs' || currentAlgoId === 'isomorphic') && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400">Word 2:</span>
              <input
                type="text"
                value={secondTextInput}
                onChange={(e) => setSecondTextInput(e.target.value)}
                className="w-36 bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] rounded-lg px-3 py-1.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 shadow-inner"
                placeholder="Second string..."
              />
            </div>
          )}

          <button
            onClick={handleApplyCustom}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <Zap className="w-3.5 h-3.5" /> Run Algorithm
          </button>
        </div>

        {/* Row 2: Quick Presets Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#EBE0D3] dark:border-[#5C4E49]/80">
          <span className="text-[11px] font-mono text-slate-500">Quick Presets:</span>
          {currentAlgoId === 'kmp' && (
            <>
              <button onClick={() => applyPreset('ABABDABACDABABCABAB', 'ABABCABAB')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">Default LPS</button>
              <button onClick={() => applyPreset('ATCGATCGAATCGATCG', 'AATC')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">DNA Sequence</button>
              <button onClick={() => applyPreset('AAAAABAAAAAB', 'AAAAB')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">Repeated Prefix</button>
            </>
          )}
          {currentAlgoId === 'rabin_karp' && (
            <>
              <button onClick={() => applyPreset('GEEKS FOR GEEKS', 'GEEK')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">Geeks</button>
              <button onClick={() => applyPreset('ALGOVERSE IS AWESOME', 'ALGO')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">Algoverse</button>
            </>
          )}
          {currentAlgoId === 'boyer_moore' && (
            <>
              <button onClick={() => applyPreset('FINDINAHAYSTACKNEEDLE', 'NEEDLE')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">Needle in Haystack</button>
              <button onClick={() => applyPreset('MICROPROCESSOR ARCHITECTURE', 'ROC')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">Microprocessor</button>
            </>
          )}
          {currentAlgoId === 'longest_palindrome' && (
            <>
              <button onClick={() => applyPreset('babad')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">babad</button>
              <button onClick={() => applyPreset('racecar')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">racecar</button>
              <button onClick={() => applyPreset('cbbd')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">cbbd</button>
              <button onClick={() => applyPreset('deified')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">deified</button>
            </>
          )}
          {currentAlgoId === 'levenshtein' && (
            <>
              <button onClick={() => applyPreset('kitten', '', 'sitting')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">kitten ➔ sitting</button>
              <button onClick={() => applyPreset('sunday', '', 'saturday')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">sunday ➔ saturday</button>
            </>
          )}
          {currentAlgoId === 'lcs' && (
            <>
              <button onClick={() => applyPreset('AGGTAB', '', 'GXTXAYB')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">AGGTAB vs GXTXAYB</button>
              <button onClick={() => applyPreset('ABCDE', '', 'ACE')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">ABCDE vs ACE</button>
            </>
          )}
          {currentAlgoId === 'valid_parentheses' && (
            <>
              <button onClick={() => applyPreset('{[()]}')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">Valid: &#123;[()]&#125;</button>
              <button onClick={() => applyPreset('()[]{}')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">Pairs: ()[]&#123;&#125;</button>
              <button onClick={() => applyPreset('(]')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">Invalid: (]</button>
              <button onClick={() => applyPreset('([)]')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">Crossed: ([)]</button>
            </>
          )}
          {currentAlgoId === 'run_length' && (
            <>
              <button onClick={() => applyPreset('WWWWWWAAAAAABBBCCCC')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">Run Heavy</button>
              <button onClick={() => applyPreset('AAABBAAAACCCC')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">Alternating</button>
            </>
          )}
          {currentAlgoId === 'reverse_words' && (
            <>
              <button onClick={() => applyPreset('the sky is blue')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">the sky is blue</button>
              <button onClick={() => applyPreset('algoverse makes dsa visual')} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#5C4E49] hover:bg-slate-700 text-[11px] font-mono text-[#2D1F23] dark:text-[#F0E2A4] border border-[#EBE0D3] dark:border-[#5C4E49]">algoverse makes dsa visual</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
