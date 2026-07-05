import React, { useState } from 'react';
import { Send, Edit3, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { User } from 'firebase/auth';

export function WritingCoachPage({ user }: { user: User }) {
  const [input, setInput] = useState('');
  const [context, setContext] = useState('Email to a manager reporting a blocker');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  const handleEvaluate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('/api/evaluate-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, context })
      });
      const data = await response.json();
      setFeedback(data);
    } catch (err) {
      console.error(err);
      alert("Failed to evaluate writing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto bg-slate-50 min-h-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <Edit3 className="text-indigo-600" />
          Writing Coach
        </h1>
        <p className="text-slate-600">Perfect your professional emails, slack messages, and documentation.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Context / Scenario</label>
            <input 
              type="text" 
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow mb-6"
              placeholder="e.g. Code review comment, Daily standup update..."
            />

            <label className="block text-sm font-semibold text-slate-700 mb-2">Your Text</label>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-64 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow resize-none"
              placeholder="Write your draft here..."
            />

            <button 
              onClick={handleEvaluate}
              disabled={loading || !input.trim()}
              className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              {loading ? 'Analyzing...' : 'Evaluate & Improve'}
            </button>
          </div>
        </div>

        <div>
          {feedback ? (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wider mb-1">Overall Score</h3>
                  <div className="text-4xl font-bold text-slate-900">{feedback.score}<span className="text-xl text-slate-400">/10</span></div>
                </div>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${feedback.score >= 8 ? 'bg-emerald-100 text-emerald-600' : feedback.score >= 5 ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
                  {feedback.score >= 8 ? 'A' : feedback.score >= 5 ? 'B' : 'C'}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Sparkles className="text-indigo-600" size={18} />
                  Improved Version
                </h3>
                <div className="p-4 bg-indigo-50 text-indigo-900 rounded-xl font-medium leading-relaxed border border-indigo-100">
                  {feedback.improvedVersion}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-semibold text-slate-800">Detailed Feedback</h3>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="font-medium text-slate-700 block mb-1">Grammar</span>
                    <p className="text-slate-600">{feedback.grammarFeedback}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700 block mb-1">Vocabulary</span>
                    <p className="text-slate-600">{feedback.vocabularyFeedback}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-700 block mb-1">Tone & Style</span>
                    <p className="text-slate-600">{feedback.toneFeedback}</p>
                  </div>
                </div>
              </div>

              {feedback.keyMistakes && feedback.keyMistakes.length > 0 && (
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100 space-y-4">
                  <h3 className="font-semibold text-red-800 flex items-center gap-2">
                    <AlertCircle size={18} />
                    Key Mistakes to Avoid
                  </h3>
                  <ul className="list-disc pl-5 text-sm text-red-700 space-y-2">
                    {feedback.keyMistakes.map((m: string, i: number) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-slate-200 border-dashed">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Edit3 className="text-slate-400" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Awaiting your text</h3>
              <p className="text-slate-500 max-w-sm">Write a draft and get instant, AI-powered feedback on your grammar, vocabulary, and professional tone.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
