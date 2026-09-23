import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';

import ResponsiveVisualizerShell from '../../components/visualizer/ResponsiveVisualizerShell';
import VisualizerPlaybackBar from '../../components/visualizer/VisualizerPlaybackBar';
import QuickCornerCard from '../../components/visualizer/QuickCornerCard';
import { STRING_ALGORITHMS } from './StringHub';

import { CODE_SNIPPETS } from './string/constants/stringSnippets';
import { INTUITIONS } from './string/constants/stringIntuitions';
import {
  generateKmpSteps,
  generateRabinKarpSteps,
  generateBoyerMooreSteps,
  generatePalindromeSteps,
  generateZAlgoSteps,
  generateLevenshteinSteps,
  generateLcsSteps,
  generateAnagramSteps,
  generateRleSteps,
  generateReverseWordsSteps,
  generateIsomorphicSteps,
  generateParenthesesSteps
} from './string/generators/stringStepGenerators';
import { getStringHUDInfo } from './string/utils/stringHUD';

import StringControlsPanel from './string/components/StringControlsPanel';
import StringRightPanel from './string/components/StringRightPanel';
import StringCanvasView from './string/views/StringCanvasView';

// Web Audio Sound Synthesizer
const playSynthTone = (type = 'match', isMuted = false) => {
  if (isMuted || typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'match') {
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === 'mismatch') {
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.15);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === 'found') {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.26);
    } else {
      osc.frequency.setValueAtTime(380, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.09);
    }
  } catch (e) {}
};

export default function StringVisualizer() {
  const { algoId } = useParams();
  const navigate = useNavigate();

  const currentAlgoId = useMemo(() => {
    const valid = STRING_ALGORITHMS.find(a => a.id === algoId);
    return valid ? valid.id : 'kmp';
  }, [algoId]);

  const currentAlgo = useMemo(() => {
    return STRING_ALGORITHMS.find(a => a.id === currentAlgoId) || STRING_ALGORITHMS[0];
  }, [currentAlgoId]);

  // Customizable String Inputs
  const [textInput, setTextInput] = useState('ABABDABACDABABCABAB');
  const [patternInput, setPatternInput] = useState('ABABCABAB');
  const [secondTextInput, setSecondTextInput] = useState('sitting');

  const [isMuted, setIsMuted] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

  // Playback state
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef(null);

  // Preset configuration according to algorithm
  useEffect(() => {
    if (currentAlgoId === 'kmp') {
      setTextInput('ABABDABACDABABCABAB');
      setPatternInput('ABABCABAB');
    } else if (currentAlgoId === 'rabin_karp') {
      setTextInput('GEEKS FOR GEEKS');
      setPatternInput('GEEK');
    } else if (currentAlgoId === 'boyer_moore') {
      setTextInput('FINDINAHAYSTACKNEEDLE');
      setPatternInput('NEEDLE');
    } else if (currentAlgoId === 'longest_palindrome') {
      setTextInput('babad');
    } else if (currentAlgoId === 'z_algorithm') {
      setTextInput('aabzaa');
      setPatternInput('aa');
    } else if (currentAlgoId === 'levenshtein') {
      setTextInput('kitten');
      setSecondTextInput('sitting');
    } else if (currentAlgoId === 'lcs') {
      setTextInput('AGGTAB');
      setSecondTextInput('GXTXAYB');
    } else if (currentAlgoId === 'anagram_search') {
      setTextInput('cbaebabacd');
      setPatternInput('abc');
    } else if (currentAlgoId === 'run_length') {
      setTextInput('WWWWWWAAAAAABBBCCCC');
    } else if (currentAlgoId === 'reverse_words') {
      setTextInput('the sky is blue');
    } else if (currentAlgoId === 'isomorphic') {
      setTextInput('egg');
      setSecondTextInput('add');
    } else if (currentAlgoId === 'valid_parentheses') {
      setTextInput('{[()]}');
    }
  }, [currentAlgoId]);

  // Step computation
  const computeSteps = () => {
    let generated = [];
    if (currentAlgoId === 'kmp') {
      generated = generateKmpSteps(textInput, patternInput);
    } else if (currentAlgoId === 'rabin_karp') {
      generated = generateRabinKarpSteps(textInput, patternInput);
    } else if (currentAlgoId === 'boyer_moore') {
      generated = generateBoyerMooreSteps(textInput, patternInput);
    } else if (currentAlgoId === 'longest_palindrome') {
      generated = generatePalindromeSteps(textInput);
    } else if (currentAlgoId === 'z_algorithm') {
      generated = generateZAlgoSteps(textInput, patternInput);
    } else if (currentAlgoId === 'levenshtein') {
      generated = generateLevenshteinSteps(textInput, secondTextInput);
    } else if (currentAlgoId === 'lcs') {
      generated = generateLcsSteps(textInput, secondTextInput);
    } else if (currentAlgoId === 'anagram_search') {
      generated = generateAnagramSteps(textInput, patternInput);
    } else if (currentAlgoId === 'run_length') {
      generated = generateRleSteps(textInput);
    } else if (currentAlgoId === 'reverse_words') {
      generated = generateReverseWordsSteps(textInput);
    } else if (currentAlgoId === 'isomorphic') {
      generated = generateIsomorphicSteps(textInput, secondTextInput);
    } else if (currentAlgoId === 'valid_parentheses') {
      generated = generateParenthesesSteps(textInput);
    }
    setSteps(generated);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    computeSteps();
  }, [currentAlgoId, textInput, patternInput, secondTextInput]);

  // Ticker loop
  useEffect(() => {
    if (isPlaying) {
      const delay = Math.max(180, Math.round(1500 / speed));
      timerRef.current = setTimeout(() => {
        if (currentStepIdx < steps.length - 1) {
          const nextIdx = currentStepIdx + 1;
          setCurrentStepIdx(nextIdx);
          playSynthTone('char', isMuted);
        } else {
          setIsPlaying(false);
          playSynthTone('found', isMuted);
        }
      }, delay);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIdx, steps.length, speed, isMuted]);

  const step = steps[currentStepIdx] || {};

  // Playback Handlers (Matches VisualizerPlaybackBar props exactly!)
  const handlePlay = () => {
    if (steps.length === 0) computeSteps();
    if (currentStepIdx >= steps.length - 1) {
      setCurrentStepIdx(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
      playSynthTone('char', isMuted);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
      playSynthTone('char', isMuted);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  // Quick Preset Helper
  const applyPreset = (t, p = '', s2 = '') => {
    setTextInput(t);
    if (p) setPatternInput(p);
    if (s2) setSecondTextInput(s2);
    playSynthTone('char', isMuted);
  };

  // RENDER CANVASES ACCORDING TO ALGORITHM WITH EDUCATIONAL ALIGNMENT

  const trackedVariables = useMemo(() => {
    const vars = [];
    
    if (currentAlgoId === 'kmp') {
      vars.push({
        name: 't (text index)',
        value: step.tIdx !== undefined ? `${step.tIdx} ('${textInput[step.tIdx] ?? ''}')` : '-',
        type: 'Index',
        role: 'Current scanner index in Text',
        isChanged: true
      });
      vars.push({
        name: 'p (pattern index)',
        value: step.pIdx !== undefined ? `${step.pIdx} ('${patternInput[step.pIdx] ?? ''}')` : '-',
        type: 'Index',
        role: 'Current index in Pattern',
        isChanged: true
      });
      if (step.pIdx > 0 && step.lps) {
        vars.push({
          name: 'LPS[p-1]',
          value: step.lps[step.pIdx - 1] ?? 0,
          type: 'Lookup',
          role: 'Fallback jump length on mismatch'
        });
      }
      vars.push({
        name: 'matchesFound',
        value: step.matches ? step.matches.length : 0,
        type: 'Count',
        role: 'Full pattern matches found'
      });
    } else if (currentAlgoId === 'rabin_karp') {
      vars.push({
        name: 'windowStart',
        value: step.windowStart ?? 0,
        type: 'Index',
        role: 'Left boundary of text sliding frame',
        isChanged: true
      });
      vars.push({
        name: 'windowString',
        value: `"${textInput.substring(step.windowStart ?? 0, (step.windowStart ?? 0) + patternInput.length)}"`,
        type: 'String',
        role: 'Current M-character text window'
      });
      vars.push({
        name: 'wHash (Window)',
        value: step.wHash ?? 0,
        type: 'Hash',
        role: 'Rolling hash code of current window',
        isChanged: true
      });
      vars.push({
        name: 'pHash (Pattern)',
        value: step.pHash ?? 0,
        type: 'Hash',
        role: 'Fixed hash code of target pattern'
      });
      vars.push({
        name: 'hashMatch',
        value: step.hashMatch ? 'TRUE (Hashes Match!)' : 'FALSE',
        type: 'Boolean',
        role: 'Whether window and pattern hashes match'
      });
    } else if (currentAlgoId === 'longest_palindrome') {
      vars.push({
        name: 'left (wing)',
        value: step.currL !== undefined ? `${step.currL} ('${textInput[step.currL] ?? ''}')` : '-',
        type: 'Index',
        role: 'Left expansion pointer',
        isChanged: true
      });
      vars.push({
        name: 'right (wing)',
        value: step.currR !== undefined ? `${step.currR} ('${textInput[step.currR] ?? ''}')` : '-',
        type: 'Index',
        role: 'Right expansion pointer',
        isChanged: true
      });
      vars.push({
        name: 'currentSpan',
        value: (step.currR !== undefined && step.currL !== undefined) ? `${step.currR - step.currL + 1} chars` : '-',
        type: 'Length',
        role: 'Length of currently expanded palindrome'
      });
      vars.push({
        name: 'longest',
        value: `"${step.longest || textInput[0] || ''}" (${(step.longest || textInput[0] || '').length})`,
        type: 'Result',
        role: 'Best palindrome discovered so far'
      });
    } else if (currentAlgoId === 'levenshtein' || currentAlgoId === 'lcs') {
      vars.push({
        name: 'i (row)',
        value: step.activeI !== undefined ? `${step.activeI} ('${textInput[step.activeI - 1] ?? 'ε'}')` : '-',
        type: 'Index',
        role: 'Current char index in String 1'
      });
      vars.push({
        name: 'j (col)',
        value: step.activeJ !== undefined ? `${step.activeJ} ('${secondTextInput[step.activeJ - 1] ?? 'ε'}')` : '-',
        type: 'Index',
        role: 'Current char index in String 2'
      });
      if (step.dp && step.activeI !== undefined && step.activeJ !== undefined && step.dp[step.activeI]) {
        vars.push({
          name: 'dp[i][j]',
          value: step.dp[step.activeI][step.activeJ],
          type: 'Cost',
          role: 'Optimal cost for subproblem',
          isChanged: true
        });
      }
    } else {
      if (step.currentIdx !== undefined || step.idx !== undefined) {
        vars.push({
          name: 'index',
          value: step.currentIdx ?? step.idx,
          type: 'Index',
          role: 'Character pointer position',
          isChanged: true
        });
      }
      if (step.stack) {
        vars.push({
          name: 'stackSize',
          value: step.stack.length,
          type: 'Stack',
          role: 'Number of open parentheses in stack'
        });
      }
      vars.push({
        name: 'textLength',
        value: textInput.length,
        type: 'Number',
        role: 'Length of input string'
      });
    }

    return vars;
  }, [currentAlgoId, step, textInput, patternInput, secondTextInput]);

  // Code Statement for Dry Run trace
  const currentCodeStatement = useMemo(() => {
    if (currentAlgoId === 'kmp') {
      if (step.status?.includes('Match:')) return 'if (pattern[p] === text[t]) { p++; t++; }';
      if (step.status?.includes('Mismatch:')) return 'if (p !== 0) p = lps[p - 1]; else t++;';
      if (step.phase === 'lps') return 'lps[i] = len;';
      return 'while (t < text.length) { ... }';
    }
    if (currentAlgoId === 'rabin_karp') {
      if (step.hashMatch) return 'if (wHash === pHash) verifyCharacters();';
      return 'wHash = ((wHash - outChar * d) * 256 + inChar) % q;';
    }
    if (currentAlgoId === 'longest_palindrome') {
      return 'while (l >= 0 && r < n && s[l] === s[r]) { l--; r++; }';
    }
    if (currentAlgoId === 'levenshtein') {
      return 'dp[i][j] = min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+cost);';
    }
    return 'processNextCharacter();';
  }, [currentAlgoId, step]);


  return (
    <ResponsiveVisualizerShell
      title={currentAlgo.name}
      category="String Algorithms"
      headerRight={
        <div className="flex items-center gap-3">
          <select
            value={currentAlgoId}
            onChange={(e) => navigate(`/visualizer/string/${e.target.value}`)}
            className="bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] text-[#2D1F23] dark:text-[#F4EBC3] text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-mono"
          >
            {STRING_ALGORITHMS.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-[#5C4E49] border border-[#EBE0D3] dark:border-[#5C4E49] text-[#2D1F23] dark:text-[#F0E2A4] hover:text-white"
            title={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
          <Link
            to="/visualizer/string"
            className="text-xs px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-mono transition-colors"
          >
            All Algorithms
          </Link>
        </div>
      }
      cornerCard={
        <QuickCornerCard
          title="Quick String Input"
          searchInput={{
            label: "Pattern to Find",
            value: patternInput,
            onChange: setPatternInput,
            onSearch: () => { computeSteps(); setIsPlaying(true); },
            placeholder: "Pattern..."
          }}
          addInput={{
            label: "Main Text String",
            value: textInput,
            onChange: setTextInput,
            onAdd: () => { computeSteps(); setIsPlaying(true); },
            placeholder: "Enter text..."
          }}
          customActions={
            <div className="flex items-center gap-1.5 w-full pt-1">
              <button
                onClick={() => {
                  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                  const randStr = Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * 26)]).join('');
                  setTextInput(randStr);
                }}
                className="flex-1 py-1 rounded-xl bg-gray-100 dark:bg-[#423834] hover:bg-gray-200 dark:hover:bg-[#5C4E49] text-[10px] font-mono font-bold text-gray-700 dark:text-[#F0E2A4] transition-colors flex items-center justify-center gap-1"
                title="Randomize Text"
              >
                <span>🎲 Random</span>
              </button>
              <button
                onClick={() => {
                  computeSteps();
                  setIsPlaying(true);
                }}
                className="flex-1 py-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-[10px] font-mono font-bold text-white transition-colors flex items-center justify-center gap-1 shadow-sm"
                title="Execute Algorithm"
              >
                <span>▶ Run</span>
              </button>
            </div>
          }
        />
      }
      controls={
        <div className="flex flex-col gap-3.5 w-full">
          <StringControlsPanel
            currentAlgoId={currentAlgoId}
            textInput={textInput}
            setTextInput={setTextInput}
            patternInput={patternInput}
            setPatternInput={setPatternInput}
            secondTextInput={secondTextInput}
            setSecondTextInput={setSecondTextInput}
            handleApplyCustom={() => { computeSteps(); setIsPlaying(true); }}
            handleRandomize={() => {
              const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
              const randStr = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * 26)]).join('');
              setTextInput(randStr);
            }}
            ALGO_PRESETS={{}}
            applyPreset={applyPreset}
          />
        </div>
      }
      playback={
        <VisualizerPlaybackBar
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onStepForward={handleStepForward}
          onStepBackward={handleStepBackward}
          onReset={handleReset}
          speed={speed}
          onSpeedChange={setSpeed}
          currentStep={currentStepIdx}
          totalSteps={steps.length}
          stepDescription={step.status || ''}
          isVoiceEnabled={isVoiceEnabled}
          onToggleVoice={() => setIsVoiceEnabled(!isVoiceEnabled)}
        />
      }
      rightPanel={
        <StringRightPanel
          currentAlgo={currentAlgo}
          currentAlgoId={currentAlgoId}
          currentStepIdx={currentStepIdx}
          steps={steps}
          step={step}
          textInput={textInput}
          patternInput={patternInput}
          secondTextInput={secondTextInput}
          trackedVariables={trackedVariables}
          currentCodeStatement={currentCodeStatement}
          isVoiceEnabled={isVoiceEnabled}
          onToggleVoice={() => setIsVoiceEnabled(!isVoiceEnabled)}
        />
      }
    >
      <StringCanvasView
        currentAlgoId={currentAlgoId}
        step={step}
        currentStepIdx={currentStepIdx}
        steps={steps}
        textInput={textInput}
        patternInput={patternInput}
        secondTextInput={secondTextInput}
      />
    </ResponsiveVisualizerShell>
  );
}
