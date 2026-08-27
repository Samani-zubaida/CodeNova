import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, CheckCircle2 } from 'lucide-react';
import Editor from '@monaco-editor/react';

export default function QuizRunner({ subject, levelId, levelTitle, onBack, onLevelComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [codeValue, setCodeValue] = useState('');
  const [feedback, setFeedback] = useState(null);

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
        setFeedback({ success: true, text: 'Correct!' });
        setTimeout(nextQuestion, 1500);
      } else {
        setFeedback({ success: false, text: 'Incorrect. Try again.' });
      }
    } else if (currentQ.type === 'code-editor') {
      // Basic regex validation for prototype
      const regex = new RegExp(currentQ.validationRegex);
      if (regex.test(codeValue)) {
        setFeedback({ success: true, text: currentQ.successMessage || 'Tests Passed!' });
        setTimeout(nextQuestion, 2000);
      } else {
        setFeedback({ success: false, text: 'Compilation failed or logic incorrect.' });
      }
    }
  };

  const nextQuestion = () => {
    setFeedback(null);
    setSelectedOption(null);
    if (currentIndex < questions.length - 1) {
      const nextQ = questions[currentIndex + 1];
      if (nextQ.type === 'code-editor') {
        setCodeValue(nextQ.initialCode || '');
      }
      setCurrentIndex(prev => prev + 1);
    } else {
      // Level completed!
      onLevelComplete(levelId);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 p-8">Error: {error}</div>;
  }

  if (!currentQ) return null;

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-8">
        <button onClick={onBack} className="bg-slate-800 p-3 rounded-full hover:bg-slate-700 transition-colors border border-slate-700">
          <ArrowLeft size={24} className="text-white" />
        </button>
        <h2 className="text-2xl font-bold text-white">
          {levelTitle} - Challenge {currentIndex + 1} of {questions.length}
        </h2>
        
        {/* Progress Bar */}
        <div className="w-48 h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div 
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="w-full relative overflow-hidden bg-slate-800 border-2 border-slate-700 rounded-2xl shadow-2xl min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="absolute inset-0 p-8 flex flex-col"
          >
            <h3 className="text-xl text-slate-200 mb-6 font-semibold">{currentQ.question}</h3>

            {currentQ.type === 'multiple-choice' && (
              <div className="flex flex-col gap-4 flex-1">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedOption(idx)}
                    className={`p-4 rounded-xl text-left font-medium transition-all border-2 ${
                      selectedOption === idx 
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300 transform scale-[1.02]' 
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {currentQ.type === 'code-editor' && (
              <div className="flex-1 rounded-xl overflow-hidden border-2 border-slate-700 mb-4 h-64">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  theme="vs-dark"
                  value={codeValue}
                  onChange={(val) => setCodeValue(val)}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    padding: { top: 16 }
                  }}
                />
              </div>
            )}

            {/* Footer / Submission */}
            <div className="mt-auto pt-6 border-t border-slate-700 flex items-center justify-between">
              <div className="flex-1">
                {feedback && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className={`font-bold flex items-center gap-2 ${feedback.success ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {feedback.success && <CheckCircle2 size={20} />}
                    {feedback.text}
                  </motion.div>
                )}
              </div>
              
              <button 
                onClick={handleSubmit}
                disabled={feedback?.success || (currentQ.type === 'multiple-choice' && selectedOption === null)}
                className="px-8 py-3 rounded-xl font-bold bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2"
              >
                Run Code <Play size={18} fill="currentColor" />
              </button>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
