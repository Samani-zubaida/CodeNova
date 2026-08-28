import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, CheckCircle2, AlertCircle, TerminalSquare, BookOpen, Tag } from 'lucide-react';
import Editor from '@monaco-editor/react';

export default function QuizRunner({ subject, levelId, onBack, onLevelComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [codeValue, setCodeValue] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
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
  }, [subject, levelId]);

  const currentQ = questions[currentIndex];

  const handleSubmit = () => {
    if (currentQ.type === 'multiple-choice') {
      if (selectedOption === currentQ.answer) {
        setFeedback({ success: true, text: 'Accepted' });
        setShowExplanation(true);
      } else {
        setFeedback({ success: false, text: 'Wrong Answer' });
      }
    } else if (currentQ.type === 'code-editor') {
      const regex = new RegExp(currentQ.validationRegex);
      if (regex.test(codeValue)) {
        setFeedback({ success: true, text: 'Accepted' });
        setShowExplanation(true);
      } else {
        setFeedback({ success: false, text: 'Compilation Error / Wrong Output' });
      }
    }
  };

  const nextQuestion = () => {
    setFeedback(null);
    setSelectedOption(null);
    setShowExplanation(false);
    
    if (currentIndex < questions.length - 1) {
      const nextQ = questions[currentIndex + 1];
      if (nextQ.type === 'code-editor') {
        setCodeValue(nextQ.initialCode || '');
      }
      setCurrentIndex(prev => prev + 1);
    } else {
      onLevelComplete();
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !currentQ) {
    return <div className="text-red-400 p-8 bg-[#0f172a] h-screen">Error: {error}</div>;
  }

  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'Easy': return 'text-teal-400 bg-teal-400/10 border-teal-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="w-full h-screen bg-[#0f172a] flex flex-col font-sans text-slate-200">
      
      {/* Top Navbar */}
      <div className="h-14 border-b border-slate-800 bg-[#1e293b] flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="h-4 w-px bg-slate-700"></div>
          <span className="font-semibold flex items-center gap-2">
            <TerminalSquare size={18} className="text-blue-400" />
            Problem {currentIndex + 1} <span className="text-slate-500 font-normal">/ {questions.length}</span>
          </span>
        </div>
        
        {/* Progress Dots */}
        <div className="flex gap-2">
          {questions.map((_, idx) => (
            <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentIndex ? 'bg-blue-500' : idx < currentIndex ? 'bg-green-500' : 'bg-slate-700'}`} />
          ))}
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANE: Description */}
        <div className="w-1/2 border-r border-slate-800 bg-[#1e293b] flex flex-col overflow-y-auto">
          
          <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-800/20">
            <BookOpen size={20} className="text-slate-400" />
            <h2 className="text-xl font-bold text-white">Description</h2>
          </div>

          <div className="p-8 flex-1">
            <h1 className="text-2xl font-bold text-white mb-4">{currentIndex + 1}. {currentQ.question}</h1>
            
            <div className="flex items-center gap-3 mb-8">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(currentQ.difficulty)}`}>
                {currentQ.difficulty || 'Medium'}
              </span>
              
              {currentQ.topicTags?.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  <Tag size={12} /> {tag}
                </span>
              ))}
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed">
              <p>{currentQ.description || currentQ.question}</p>
            </div>

            {/* Explanation Section (Revealed on Success) */}
            {showExplanation && (
              <div className="mt-12 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                  <CheckCircle2 size={18} /> Official Solution Explanation
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {currentQ.explanation || 'No detailed explanation provided for this problem.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Editor / Interaction */}
        <div className="w-1/2 flex flex-col bg-[#0f172a]">
          
          <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-[#1e293b]">
            <Code2 size={18} className="text-slate-400" />
            <span className="font-semibold text-sm text-slate-300">
              {currentQ.type === 'code-editor' ? 'Code Editor (JavaScript)' : 'Multiple Choice Selection'}
            </span>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {currentQ.type === 'multiple-choice' && (
              <div className="flex flex-col gap-4 max-w-lg mx-auto mt-8">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    disabled={showExplanation}
                    onClick={() => setSelectedOption(idx)}
                    className={`p-4 rounded-xl text-left font-medium transition-all border ${
                      selectedOption === idx 
                        ? 'bg-blue-500/10 border-blue-500 text-blue-400' 
                        : 'bg-[#1e293b] border-slate-700 text-slate-300 hover:border-slate-500'
                    } ${showExplanation ? 'opacity-75 cursor-default' : ''}`}
                  >
                    <span className="inline-block w-8 text-slate-500 font-mono">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {currentQ.type === 'code-editor' && (
              <div className="w-full h-full rounded-xl overflow-hidden border border-slate-700 shadow-inner">
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
          <div className="h-16 border-t border-slate-800 bg-[#1e293b] flex items-center justify-between px-6 shrink-0">
            
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
                  className="px-6 py-2 rounded-lg font-semibold bg-green-600 hover:bg-green-500 text-white transition-colors flex items-center gap-2 text-sm"
                >
                  Next Challenge <ArrowLeft size={16} className="rotate-180" />
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={currentQ.type === 'multiple-choice' && selectedOption === null}
                  className="px-6 py-2 rounded-lg font-semibold bg-slate-200 hover:bg-white text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm"
                >
                  <Play size={16} fill="currentColor" /> Submit Solution
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
