import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, CheckCircle2, AlertCircle, TerminalSquare, BookOpen, Tag, Code2, XCircle, Star, Trophy } from 'lucide-react';
import Editor from '@monaco-editor/react';
import useAppStore from "../store/useAppStore.js"

import AESVisualizer from '../visualizers/crypto/AESVisualizer';
import CaesarVisualizer from '../visualizers/crypto/CaesarCipherVisualizer';
import RSAVisualizer from '../visualizers/crypto/RSAVisualizer';


export default function QuizRunner({ subject, levelId, competitionData, onBack, onLevelComplete }) {
  const addXP = useAppStore(state => state.addXP);
  const unlockNextLevel = useAppStore(state => state.unlockNextLevel);
  const addCompletedLevel = useAppStore(state => state.addCompletedLevel);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const user = useAppStore(state => state.user);
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [codeValue, setCodeValue] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // AI Hint State
  const [hintText, setHintText] = useState(null);
  const [isHintLoading, setIsHintLoading] = useState(false);
  
  const startTimeRef = useRef(Date.now());
  
  // Gamification State
  const [earnedXP, setEarnedXP] = useState(0);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false); // track if they failed a question already

  useEffect(() => {
    if (competitionData) {
      // Map competition questions to the QuizRunner format
      const mappedQs = competitionData.questions.map(q => ({
        ...q,
        type: 'code-editor',
        question: q.title,
        explanation: q.description
      }));
      setQuestions(mappedQs);
      if (mappedQs.length > 0) {
        setCodeValue(mappedQs[0].initialCode || '');
      }
      setLoading(false);
    } else {
      fetch(`http://localhost:5000/api/levels/${subject}/${levelId}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch level data');
          return res.json();
        })
        .then(data => {
          setQuestions(data);
          if (data[0]?.type === 'code-editor') {
            setCodeValue(data[0].initialCode || '');
          }
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [subject, levelId, competitionData]);

  const currentQ = questions[currentIndex];

  const handleSubmit = () => {
    if (currentQ.type === 'multiple-choice' || currentQ.type === 'visualization-identify') {
      if (selectedOption === currentQ.answer) {
        setFeedback({ success: true, text: 'Accepted' });
        setShowExplanation(true);
        if (!hasAttempted) {
          setEarnedXP(prev => prev + 10);
        }
      } else {
        setFeedback({ success: false, text: 'Wrong Answer' });
        setHasAttempted(true);
      }
    } else if (currentQ.type === 'code-editor') {
      let allPassed = true;
      const results = [];

      try {
        const wrappedCode = `
          ${codeValue}
          return typeof ${codeValue.match(/function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)/)?.[1] || 'solution'} === 'function' 
            ? ${codeValue.match(/function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)/)?.[1] || 'solution'} 
            : null;
        `;
        
        const userFunc = new Function(wrappedCode)();

        if (typeof userFunc !== 'function') {
          throw new Error('Could not parse a valid function from your code.');
        }

        currentQ.testCases.forEach((tc, idx) => {
          try {
            const argsClone = JSON.parse(JSON.stringify(tc.args));
            const actual = userFunc(...argsClone);
            const passed = JSON.stringify(actual) === JSON.stringify(tc.expected);
            
            results.push({
              caseNum: idx + 1,
              passed,
              input: JSON.stringify(tc.args),
              expected: JSON.stringify(tc.expected),
              actual: actual !== undefined ? JSON.stringify(actual) : 'undefined'
            });

            if (!passed) allPassed = false;
          } catch (e) {
            allPassed = false;
            results.push({
              caseNum: idx + 1,
              passed: false,
              input: JSON.stringify(tc.args),
              expected: JSON.stringify(tc.expected),
              actual: `Runtime Error: ${e.message}`
            });
          }
        });

        setTestResults(results);

        if (allPassed) {
          setFeedback({ success: true, text: 'Accepted! All test cases passed.' });
          setShowExplanation(true);
          if (!hasAttempted) {
            setEarnedXP(prev => prev + 50);
          }
        } else {
          setFeedback({ success: false, text: 'Wrong Answer. Some test cases failed.' });
          setHasAttempted(true);
        }

      } catch (err) {
        setFeedback({ success: false, text: `Syntax/Compilation Error: ${err.message}` });
        setTestResults([]);
        setHasAttempted(true);
      }
    }
  };

  const fetchHint = async () => {
    setIsHintLoading(true);
    setHintText(null);
    try {
      const currentQ = questions[currentIndex];
      const res = await fetch('http://localhost:5000/api/ai/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user ? user.username : 'Guest',
          questionText: currentQ.question,
          options: currentQ.options || []
        })
      });
      const data = await res.json();
      if (data.success) {
        setHintText(data.hint);
        // deduct from local global state if possible, though backend did it
        // for visual sync we might dispatch an action to useAppStore later
      } else {
        setHintText(`Error: ${data.error}`);
      }
    } catch (err) {
      setHintText('Failed to fetch hint.');
    } finally {
      setIsHintLoading(false);
    }
  };

  const nextQuestion = () => {
    setFeedback(null);
    setSelectedOption(null);
    setShowExplanation(false);
    setTestResults([]);
    setHasAttempted(false);
    
    if (currentIndex < questions.length - 1) {
      const nextQ = questions[currentIndex + 1];
      if (competitionData) nextQ.type = 'code-editor';
      if (nextQ.type === 'code-editor') {
        setCodeValue(nextQ.initialCode || '');
      }
      setCurrentIndex(prev => prev + 1);
    } else {
        // Level Complete!
        addXP(earnedXP); // Dispatch to global store
        if (!competitionData) {
          unlockNextLevel(subject);
          addCompletedLevel({ subject, levelId, title: `${subject.toUpperCase()} Lvl ${levelId}`, date: new Date().toLocaleDateString() });
          
          // Award Badge if they got some XP
          if (earnedXP > 0) {
            fetch(`http://localhost:5000/api/users/award-badge`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                username: user ? user.username : 'Guest', 
                badgeId: `${subject}-level-${levelId}`,
                badgeName: `${subject.toUpperCase()} Master Level ${levelId}`
              })
            }).catch(e => console.error("Badge award failed:", e));
          }
        }
        setIsLevelComplete(true);
        if (competitionData) {
          fetch(`http://localhost:5000/api/competitions/${competitionData._id}/submit-score`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              username: user ? user.username : 'Guest', 
              score: earnedXP,
              timeTakenMs: Date.now() - startTimeRef.current
            })
          });
        }
      }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#FDFBF7] dark:bg-[#121212] transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#BC4A54]"></div>
      </div>
    );
  }

  if (error || !currentQ) {
    return <div className="text-red-400 p-8 bg-[#FDFBF7] dark:bg-[#121212] transition-colors duration-300 h-screen">Error: {error}</div>;
  }

  if (isLevelComplete) {
    return (
      <div className="w-full min-h-screen bg-[#FDFBF7] dark:bg-[#121212] transition-colors duration-300 flex items-center justify-center font-sans text-gray-900 dark:text-gray-100 p-8">
        <div className="bg-white dark:bg-[#1A1A1A] border border-[#EBE0D3] dark:border-[#333] p-12 rounded-3xl shadow-2xl flex flex-col items-center max-w-lg w-full text-center">
          <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6 border border-yellow-500/50">
            <Trophy size={48} className="text-yellow-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Level Complete!</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">Outstanding work! You mastered these concepts.</p>
          
          <div className="bg-[#FDFBF7] dark:bg-[#252525] w-full rounded-2xl p-6 border border-[#EBE0D3] dark:border-[#333] flex flex-col items-center mb-8">
            <span className="text-gray-500 dark:text-gray-400 font-semibold mb-2 uppercase tracking-widest text-sm">XP Earned</span>
            <div className="flex items-center gap-3 text-5xl font-black text-yellow-400">
              <Star size={40} className="fill-yellow-400" />
              +{earnedXP}
            </div>
          </div>

          <button 
            onClick={onLevelComplete}
            className="w-full py-4 rounded-xl font-bold bg-[#BC4A54] hover:bg-[#a03e48] text-white transition-all text-lg shadow-lg shadow-[#BC4A54]/20"
          >
            Return to Academy
          </button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'Easy': return 'text-teal-400 bg-teal-400/10 border-teal-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-500 dark:text-gray-400 bg-[#FDFBF7] dark:bg-[#252525] border-[#EBE0D3] dark:border-[#333]';
    }
  };

  return (
    <div className="w-full h-screen bg-[#FDFBF7] dark:bg-[#121212] transition-colors duration-300 flex flex-col font-sans text-gray-900 dark:text-gray-100">
      
      {/* Top Navbar */}
      <div className="h-14 border-b border-[#EBE0D3] dark:border-[#333] bg-white dark:bg-[#1A1A1A] flex items-center px-2 md:px-4 justify-between shrink-0">
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={onBack} className="text-gray-500 dark:text-gray-400 hover:text-white transition-colors p-2">
            <ArrowLeft size={20} />
          </button>
          <div className="hidden md:block h-4 w-px bg-[#EBE0D3] dark:bg-[#333]"></div>
          <span className="font-semibold flex items-center gap-2 text-sm md:text-base">
            <TerminalSquare size={16} md:size={18} className="text-[#BC4A54] hidden md:block" />
            <span className="truncate max-w-[120px] md:max-w-none">Prob {currentIndex + 1}</span> <span className="text-gray-500 dark:text-gray-400 font-normal">/ {questions.length}</span>
          </span>
        </div>
        
        {/* Session XP */}
        <div className="flex items-center gap-2 text-yellow-400 font-bold bg-[#FDFBF7] dark:bg-[#252525] px-3 py-1.5 rounded-lg border border-[#EBE0D3] dark:border-[#333]">
          <Star size={16} className="fill-yellow-400" /> +{earnedXP} XP
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        
        {/* LEFT PANE: Description & Test Results */}
        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-[#EBE0D3] dark:border-[#333] bg-white dark:bg-[#1A1A1A] flex flex-col lg:overflow-y-auto shrink-0">
          
          <div className="p-6 border-b border-[#EBE0D3] dark:border-[#333] flex items-center gap-3 bg-[#FDFBF7] dark:bg-[#252525]/20">
            <BookOpen size={20} className="text-gray-500 dark:text-gray-400" />
            <h2 className="text-xl font-bold text-white">Description</h2>
          </div>

          <div className="p-8 flex-1">
            <h1 className="text-2xl font-bold text-white mb-4">{currentIndex + 1}. {currentQ.question}</h1>
            
            <div className="flex items-center gap-3 mb-8">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(currentQ.difficulty)}`}>
                {currentQ.difficulty || 'Medium'}
              </span>
              
              {currentQ.topicTags?.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#FDFBF7] dark:bg-[#252525] text-gray-700 dark:text-gray-300 border border-[#EBE0D3] dark:border-[#333]">
                  <Tag size={12} /> {tag}
                </span>
              ))}
            </div>

            <div className="prose prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              <p>{currentQ.description || currentQ.question}</p>
            </div>

            {/* AI Hint Section */}
            <div className="mt-8 border-t border-[#EBE0D3] dark:border-[#333]/50 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Star size={18} className="text-yellow-400" /> AI Assistant
                </h3>
                <button 
                  onClick={fetchHint}
                  disabled={isHintLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg transition-all disabled:opacity-50"
                >
                  <Star size={16} /> 
                  {isHintLoading ? 'Generating...' : 'Get Hint (50 XP)'}
                </button>
              </div>
              {hintText && (
                <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-xl text-purple-200">
                  <p className="whitespace-pre-wrap">{hintText}</p>
                </div>
              )}
            </div>

            {/* Test Results Section (LeetCode Style) */}
            {testResults.length > 0 && (
              <div className="mt-12">
                <h3 className="text-lg font-bold text-white mb-4">Test Cases</h3>
                <div className="flex flex-col gap-4">
                  {testResults.map((res, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${res.passed ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                      <div className="flex items-center gap-2 font-bold mb-3">
                        {res.passed ? <CheckCircle2 size={18} className="text-green-400" /> : <XCircle size={18} className="text-red-400" />}
                        <span className={res.passed ? 'text-green-400' : 'text-red-400'}>Test Case {res.caseNum}</span>
                      </div>
                      <div className="space-y-2 text-sm font-mono">
                        <div className="flex"><span className="w-24 text-gray-500 dark:text-gray-400">Input:</span><span className="text-gray-700 dark:text-gray-300">{res.input}</span></div>
                        <div className="flex"><span className="w-24 text-gray-500 dark:text-gray-400">Expected:</span><span className="text-gray-700 dark:text-gray-300">{res.expected}</span></div>
                        <div className="flex"><span className="w-24 text-gray-500 dark:text-gray-400">Output:</span><span className={res.passed ? 'text-green-400' : 'text-red-400'}>{res.actual}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Explanation Section (Revealed on Success) */}
            {showExplanation && (
              <div className="mt-12 p-6 bg-blue-500/10 border border-[#BC4A54]/30 rounded-xl mb-12">
                <h3 className="text-[#BC4A54] font-bold mb-2 flex items-center gap-2">
                  <CheckCircle2 size={18} /> Official Solution Explanation
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                  {currentQ.explanation || 'No detailed explanation provided for this problem.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Editor / Interaction */}
        <div className="w-full lg:w-1/2 flex flex-col bg-[#FDFBF7] dark:bg-[#121212] transition-colors duration-300 min-h-[500px] lg:min-h-0 shrink-0">
          
          <div className="p-4 border-b border-[#EBE0D3] dark:border-[#333] flex items-center gap-3 bg-white dark:bg-[#1A1A1A]">
            <Code2 size={18} className="text-gray-500 dark:text-gray-400" />
            <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              {currentQ.type === 'code-editor' ? 'Code Editor (JavaScript)' : currentQ.type === 'visualization-identify' ? 'Identify the Visualization' : 'Multiple Choice Selection'}
            </span>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            
              {currentQ.type === 'visualization-identify' && (
                <div className="flex flex-col gap-6">
                  <div className="bg-black/50 rounded-xl p-4 border border-[#EBE0D3] dark:border-[#333] h-[300px] overflow-hidden flex items-center justify-center">
                    <div className="scale-[0.5] w-[200%] h-[200%] transform-origin-top-left pointer-events-none">
                       {currentQ.visualizer === 'AESVisualizer' && <AESVisualizer />}
                       {currentQ.visualizer === 'CaesarVisualizer' && <CaesarVisualizer />}
                       {currentQ.visualizer === 'RSAVisualizer' && <RSAVisualizer />}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {currentQ.options.map((opt, idx) => (
                      <button
                        key={idx}
                        disabled={showExplanation}
                        onClick={() => setSelectedOption(idx)}
                        className={`p-3 text-sm rounded-xl text-left font-medium transition-all border ${
                          selectedOption === idx 
                            ? 'bg-blue-500/10 border-[#BC4A54] text-[#BC4A54]' 
                            : 'bg-white dark:bg-[#1A1A1A] border-[#EBE0D3] dark:border-[#333] text-gray-700 dark:text-gray-300 hover:border-slate-500'
                        } ${showExplanation ? 'opacity-75 cursor-default' : ''}`}
                      >
                        <span className="inline-block w-6 text-gray-500 dark:text-gray-400 font-mono">{String.fromCharCode(65 + idx)}.</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentQ.type === 'multiple-choice' && (
              <div className="flex flex-col gap-4 max-w-lg mx-auto mt-8">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    disabled={showExplanation}
                    onClick={() => setSelectedOption(idx)}
                    className={`p-4 rounded-xl text-left font-medium transition-all border ${
                      selectedOption === idx 
                        ? 'bg-blue-500/10 border-[#BC4A54] text-[#BC4A54]' 
                        : 'bg-white dark:bg-[#1A1A1A] border-[#EBE0D3] dark:border-[#333] text-gray-700 dark:text-gray-300 hover:border-slate-500'
                    } ${showExplanation ? 'opacity-75 cursor-default' : ''}`}
                  >
                    <span className="inline-block w-8 text-gray-500 dark:text-gray-400 font-mono">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {currentQ.type === 'code-editor' && (
              <div className="w-full h-full rounded-xl overflow-hidden border border-[#EBE0D3] dark:border-[#333] shadow-inner relative group">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  theme="vs-dark"
                  value={codeValue}
                  onChange={(val) => !showExplanation && setCodeValue(val)}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    scrollBeyondLastLine: false,
                    padding: { top: 24 },
                    readOnly: showExplanation
                  }}
                />
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="h-16 border-t border-[#EBE0D3] dark:border-[#333] bg-white dark:bg-[#1A1A1A] flex items-center justify-between px-6 shrink-0">
            
            {/* Feedback Result */}
            <div className="flex items-center">
              {feedback && (
                <div className={`font-semibold flex items-center gap-2 ${feedback.success ? 'text-green-400' : 'text-red-400'}`}>
                  {feedback.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  {feedback.text}
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              {showExplanation ? (
                <button 
                  onClick={nextQuestion}
                  className="px-6 py-2 rounded-lg font-semibold bg-green-600 hover:bg-green-500 text-white transition-colors flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(22,163,74,0.4)]"
                >
                  {currentIndex < questions.length - 1 ? 'Next Challenge' : 'Complete Level'} <ArrowLeft size={16} className="rotate-180" />
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={(currentQ.type === 'multiple-choice' || currentQ.type === 'visualization-identify') && selectedOption === null}
                  className="px-6 py-2 rounded-lg font-semibold bg-slate-200 hover:bg-white text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                >
                  <Play size={16} fill="currentColor" /> {currentQ.type === 'code-editor' ? 'Run Code & Submit' : 'Submit Answer'}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

