import React, { useState } from 'react';
import { BookOpen, Headphones, Play, Target, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function LessonPage() {
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const lessonText = "Welcome to the corporate meeting module. Today we will focus on how to professionally disagree with a colleague. Instead of saying 'you are wrong', it is better to say 'I understand your point, but I have a slightly different perspective.'";

  const handleGenerateAudio = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: lessonText })
      });
      
      const data = await response.json();
      if (data.audio) {
        setAudioUrl(`data:audio/wav;base64,${data.audio}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      audio.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-slate-50 min-h-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 shadow-sm">
          <BookOpen className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Corporate Meetings</h1>
          <p className="text-slate-500">Unit 3 • Professional Disagreement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
              <Target className="h-5 w-5 text-indigo-600" />
              Lesson Overview
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              {lessonText}
            </p>

            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-500">
                <Headphones className="h-5 w-5" />
                <span className="text-sm font-medium">Listen to the pronunciation</span>
              </div>
              
              {!audioUrl ? (
                <button 
                  onClick={handleGenerateAudio}
                  disabled={loading}
                  className="px-4 py-2 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
                >
                  {loading ? 'Generating...' : 'Generate Audio'}
                </button>
              ) : (
                <button 
                  onClick={togglePlay}
                  disabled={isPlaying}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Play className="h-4 w-4" />
                  {isPlaying ? 'Playing...' : 'Play Audio'}
                </button>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-semibold mb-6 text-slate-800">Practice Quiz</h2>
            <div className="space-y-4">
              <div className="p-4 border border-slate-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 cursor-pointer transition-colors text-slate-700">
                A) You are wrong.
              </div>
              <div className="p-4 border border-indigo-600 bg-indigo-50 rounded-xl cursor-pointer transition-colors flex justify-between items-center text-indigo-900 font-medium">
                B) I understand your point, but I have a different perspective.
                <CheckCircle2 className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="p-4 border border-slate-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 cursor-pointer transition-colors text-slate-700">
                C) That is a bad idea.
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4 text-slate-800 uppercase tracking-wider text-xs">Vocabulary</h3>
            <div className="space-y-3">
              <VocabWord word="Perspective" type="noun" desc="A particular attitude toward or way of regarding something." />
              <VocabWord word="Disagree" type="verb" desc="Have or express a different opinion." />
              <VocabWord word="Colleague" type="noun" desc="A person with whom one works." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VocabWord({ word, type, desc }: any) {
  return (
    <div className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-semibold text-slate-800">{word}</span>
        <span className="text-xs text-indigo-600 italic font-medium">{type}</span>
      </div>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
