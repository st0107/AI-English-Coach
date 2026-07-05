import React from 'react';
import { User } from 'firebase/auth';
import { Briefcase, Video, Mic, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function InterviewPrepPage({ user }: { user: User }) {
  return (
    <div className="p-8 max-w-6xl mx-auto bg-slate-50 min-h-full">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <Briefcase className="text-indigo-600" />
          Interview Prep
        </h1>
        <p className="text-slate-600">Master your technical and behavioral interviews for FAANG and top tech companies.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
           <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 text-indigo-600">
             <Video size={32} />
           </div>
           <h3 className="text-lg font-bold text-slate-800 mb-2">Mock Interviews</h3>
           <p className="text-slate-500 text-sm mb-6">Simulate real video interviews with our Live AI Agent. Practice your delivery and handling pressure.</p>
           <Link to="/conversation" className="mt-auto px-6 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-xl hover:bg-indigo-100 transition-colors w-full">Start Mock Interview</Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
           <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 text-emerald-600">
             <Target size={32} />
           </div>
           <h3 className="text-lg font-bold text-slate-800 mb-2">STAR Method</h3>
           <p className="text-slate-500 text-sm mb-6">Learn to structure your behavioral answers perfectly using Situation, Task, Action, Result.</p>
           <Link to="/courses" className="mt-auto px-6 py-2 bg-emerald-50 text-emerald-700 font-medium rounded-xl hover:bg-emerald-100 transition-colors w-full">View Lessons</Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
           <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 text-orange-600">
             <Mic size={32} />
           </div>
           <h3 className="text-lg font-bold text-slate-800 mb-2">System Design Pitch</h3>
           <p className="text-slate-500 text-sm mb-6">Practice explaining complex architectures clearly and concisely.</p>
           <Link to="/conversation" className="mt-auto px-6 py-2 bg-orange-50 text-orange-700 font-medium rounded-xl hover:bg-orange-100 transition-colors w-full">Practice Pitch</Link>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-6">Common Questions Bank</h2>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <QuestionItem q="Tell me about yourself." type="Behavioral" />
        <QuestionItem q="Describe a time you disagreed with a colleague." type="Behavioral" />
        <QuestionItem q="How do you handle production incidents?" type="Technical / Process" />
        <QuestionItem q="Explain the trade-offs of microservices vs monoliths." type="System Design" />
        <QuestionItem q="What is your greatest weakness?" type="Behavioral" />
      </div>
    </div>
  );
}

function QuestionItem({ q, type }: { q: string, type: string }) {
  return (
    <div className="border-b border-slate-100 last:border-0 p-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{type}</div>
        <div className="font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">{q}</div>
      </div>
      <ArrowRight className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
    </div>
  );
}
