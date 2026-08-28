import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Code2, Clock, Calendar } from 'lucide-react';

export default function HostDashboard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Form State
  const [orgName, setOrgName] = useState('My Organization');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [durationMins, setDurationMins] = useState(60);
  
  const [questions, setQuestions] = useState([
    { title: '', description: '', initialCode: '', testCases: [] }
  ]);

  const handleGenerateTests = async (index) => {
    setGenerating(true);
    try {
      const q = questions[index];
      const res = await fetch('http://localhost:5000/api/competitions/generate-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: q.description, solution: q.initialCode })
      });
      const data = await res.json();
      
      const newQs = [...questions];
      newQs[index].testCases = data.testCases;
      setQuestions(newQs);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const start = new Date(`${startDate}T${startTime}`);
      const end = new Date(start.getTime() + durationMins * 60000);

      const res = await fetch('http://localhost:5000/api/competitions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          hostOrg: orgName,
          startTime: start,
          endTime: end,
          questions
        })
      });

      if (res.ok) {
        navigate('/game');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-slate-200 font-sans p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl flex items-center mb-8">
        <button 
          onClick={() => navigate('/game')}
          className="bg-[#1A1A1A] p-3 rounded-xl hover:bg-[#252525] transition-colors border border-[#BCA297]/20 mr-6"
        >
          <ArrowLeft size={24} className="text-[#BCA297]" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Host a Competition</h1>
          <p className="text-slate-400 mt-1">Create a live coding assessment with AI-generated test cases.</p>
        </div>
      </div>

      <div className="w-full max-w-4xl bg-[#1A1A1A] border border-[#BCA297]/20 rounded-2xl p-8">
        {step === 1 ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#F4EBC3]">Step 1: Event Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-[#C5CEAE] mb-2 font-bold">Organization Name</label>
                <input 
                  type="text" 
                  value={orgName} 
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full bg-[#252525] border border-[#BCA297]/30 rounded-lg p-3 text-white focus:outline-none focus:border-[#C5CEAE]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#C5CEAE] mb-2 font-bold">Competition Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Weekly Algorithm Sprint"
                  className="w-full bg-[#252525] border border-[#BCA297]/30 rounded-lg p-3 text-white focus:outline-none focus:border-[#C5CEAE]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#C5CEAE] mb-2 font-bold flex items-center gap-2"><Calendar size={16}/> Start Date</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#252525] border border-[#BCA297]/30 rounded-lg p-3 text-white focus:outline-none focus:border-[#C5CEAE]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#C5CEAE] mb-2 font-bold flex items-center gap-2"><Clock size={16}/> Start Time</label>
                <input 
                  type="time" 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-[#252525] border border-[#BCA297]/30 rounded-lg p-3 text-white focus:outline-none focus:border-[#C5CEAE]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#C5CEAE] mb-2 font-bold flex items-center gap-2">Duration (Minutes)</label>
                <input 
                  type="number" 
                  value={durationMins} 
                  onChange={(e) => setDurationMins(parseInt(e.target.value))}
                  className="w-full bg-[#252525] border border-[#BCA297]/30 rounded-lg p-3 text-white focus:outline-none focus:border-[#C5CEAE]"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-8">
              <button 
                onClick={() => setStep(2)}
                disabled={!title || !startDate || !startTime}
                className="bg-[#C5CEAE] text-[#121212] font-bold py-3 px-8 rounded-lg hover:bg-[#F0E2A4] transition-colors disabled:opacity-50"
              >
                Next: Add Questions
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#F4EBC3]">Step 2: Questions & AI Generation</h2>
            
            {questions.map((q, i) => (
              <div key={i} className="bg-[#202020] border border-[#BCA297]/20 rounded-xl p-6 mb-6">
                <div className="mb-4">
                  <label className="block text-sm text-[#C5CEAE] mb-2 font-bold">Question Title</label>
                  <input 
                    type="text" 
                    value={q.title} 
                    onChange={(e) => {
                      const newQs = [...questions];
                      newQs[i].title = e.target.value;
                      setQuestions(newQs);
                    }}
                    className="w-full bg-[#121212] border border-[#333] rounded-lg p-3 text-white focus:outline-none focus:border-[#C5CEAE]"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-[#BCA297] mb-2 font-bold">Problem Description</label>
                    <textarea 
                      value={q.description} 
                      onChange={(e) => {
                        const newQs = [...questions];
                        newQs[i].description = e.target.value;
                        setQuestions(newQs);
                      }}
                      rows="6"
                      className="w-full bg-[#121212] border border-[#333] rounded-lg p-3 text-white focus:outline-none focus:border-[#BCA297] font-mono text-sm"
                      placeholder="Write the problem statement here..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#BCA297] mb-2 font-bold">Reference Solution (Code)</label>
                    <textarea 
                      value={q.initialCode} 
                      onChange={(e) => {
                        const newQs = [...questions];
                        newQs[i].initialCode = e.target.value;
                        setQuestions(newQs);
                      }}
                      rows="6"
                      className="w-full bg-[#121212] border border-[#333] rounded-lg p-3 text-[#F0E2A4] font-mono text-sm focus:outline-none focus:border-[#BCA297]"
                      placeholder="function solve(arr) { ... }"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#333]">
                  <div className="text-sm text-slate-400">
                    {q.testCases.length > 0 ? (
                      <span className="text-[#C5CEAE] font-bold">? {q.testCases.length} Test Cases Generated</span>
                    ) : (
                      "No test cases generated yet."
                    )}
                  </div>
                  <button 
                    onClick={() => handleGenerateTests(i)}
                    disabled={generating || !q.description}
                    className="flex items-center gap-2 bg-[#252525] border border-[#C5CEAE]/50 text-[#C5CEAE] font-bold py-2 px-4 rounded hover:bg-[#C5CEAE]/10 transition-colors disabled:opacity-50"
                  >
                    <Sparkles size={16} />
                    {generating ? 'AI Generating...' : 'Auto-Generate Tests'}
                  </button>
                </div>
              </div>
            ))}

            <button 
              onClick={() => setQuestions([...questions, { title: '', description: '', initialCode: '', testCases: [] }])}
              className="text-[#C5CEAE] font-bold text-sm hover:underline"
            >
              + Add Another Question
            </button>

            <div className="flex justify-between mt-8 border-t border-[#BCA297]/20 pt-6">
              <button 
                onClick={() => setStep(1)}
                className="text-slate-400 font-bold hover:text-white"
              >
                Back
              </button>
              <button 
                onClick={handleCreate}
                disabled={loading || questions.some(q => q.testCases.length === 0)}
                className="bg-[#AB526B] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#8e4257] transition-colors disabled:opacity-50 shadow-lg shadow-[#AB526B]/20"
              >
                {loading ? 'Creating...' : 'Publish Competition'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
