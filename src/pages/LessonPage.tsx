import React, { useState, useEffect } from 'react';
import { BookOpen, Headphones, Play, Target, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { User } from 'firebase/auth';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import { addXP, saveVocabWord } from '../services/db';

interface LessonData {
  objectives: string[];
  introduction: string;
  conceptExplanation: string;
  vocabulary: { word: string; meaning: string; example: string; ipa: string }[];
  grammarPoint: { topic: string; explanation: string; example: string };
  practiceText: string;
  quiz: { question: string; options: string[]; correctAnswerIndex: number; explanation: string }[];
}

export function LessonPage({ user }: { user: User }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const title = searchParams.get('title') || 'General Practice';
  const type = searchParams.get('type') || 'mixed';
  
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [generatingAudio, setGeneratingAudio] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch('/api/generate-lesson', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, type, context: 'Software Engineering and Corporate Environment' })
        });
        const data = await res.json();
        setLessonData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [title, type]);

  const handleGenerateAudio = async (text: string) => {
    setGeneratingAudio(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      const data = await response.json();
      if (data.audio) {
        setAudioUrl(`data:audio/wav;base64,${data.audio}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingAudio(false);
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

  const handleQuizSubmit = async () => {
    setShowResults(true);
    let correct = 0;
    lessonData?.quiz.forEach((q, i) => {
      if (quizAnswers[i] === q.correctAnswerIndex) correct++;
    });
    
    if (correct > 0) {
      await addXP(user.uid, correct * 50);
    }
    
    // Save vocab to user's DB
    if (lessonData?.vocabulary) {
      for (const v of lessonData.vocabulary) {
        await saveVocabWord(user.uid, v.word, v.meaning);
      }
    }
  };

  if (loading || !lessonData) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
          <h2 className="text-xl font-semibold text-slate-800">Generating personalized lesson...</h2>
          <p className="text-slate-500">Tailoring content for {title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-slate-50 min-h-full">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/courses')} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowRight className="h-6 w-6 text-slate-600 rotate-180" />
        </button>
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 shadow-sm">
          <BookOpen className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">{title}</h1>
          <p className="text-slate-500 capitalize">{type} Focus</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
              <Target className="h-5 w-5 text-indigo-600" />
              Introduction
            </h2>
            <div className="markdown-body text-slate-600 text-lg mb-6">
              <Markdown>{lessonData.introduction}</Markdown>
            </div>
            
            <h3 className="font-semibold text-slate-800 mb-2">Key Concepts</h3>
            <div className="markdown-body text-slate-600 bg-slate-50 p-5 rounded-xl border border-slate-100 mb-6">
              <Markdown>{lessonData.conceptExplanation}</Markdown>
            </div>

            {lessonData.grammarPoint && (
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl mb-6">
                <h3 className="font-bold text-emerald-800 mb-2">Grammar Focus: {lessonData.grammarPoint.topic}</h3>
                <p className="text-emerald-700 mb-3">{lessonData.grammarPoint.explanation}</p>
                <div className="p-3 bg-white rounded-lg text-emerald-900 font-medium italic border border-emerald-100">
                  "{lessonData.grammarPoint.example}"
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-4">Practice Text</h3>
              <div className="markdown-body text-slate-600 mb-6 text-lg">
                <Markdown>{lessonData.practiceText}</Markdown>
              </div>
              
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3 text-slate-600">
                  <Headphones className="h-5 w-5" />
                  <span className="text-sm font-medium">Listen to Native Pronunciation</span>
                </div>
                
                {!audioUrl ? (
                  <button 
                    onClick={() => handleGenerateAudio(lessonData.practiceText)}
                    disabled={generatingAudio}
                    className="px-4 py-2 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 shadow-sm"
                  >
                    {generatingAudio ? <Loader2 className="animate-spin w-4 h-4" /> : 'Generate Audio'}
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
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-slate-800">Knowledge Check</h2>
            <div className="space-y-8">
              {lessonData.quiz.map((q, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="font-semibold text-slate-700 text-lg">{idx + 1}. {q.question}</h3>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      let btnClass = "p-4 border rounded-xl cursor-pointer transition-colors w-full text-left font-medium text-slate-700 ";
                      
                      if (showResults) {
                        if (optIdx === q.correctAnswerIndex) {
                          btnClass += "border-emerald-500 bg-emerald-50 text-emerald-800";
                        } else if (quizAnswers[idx] === optIdx) {
                          btnClass += "border-red-500 bg-red-50 text-red-800";
                        } else {
                          btnClass += "border-slate-200 opacity-50";
                        }
                      } else {
                        btnClass += quizAnswers[idx] === optIdx 
                          ? "border-indigo-600 bg-indigo-50 text-indigo-900" 
                          : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50";
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={showResults}
                          onClick={() => setQuizAnswers(prev => ({ ...prev, [idx]: optIdx }))}
                          className={btnClass}
                        >
                          <div className="flex justify-between items-center">
                            <span>{opt}</span>
                            {showResults && optIdx === q.correctAnswerIndex && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {showResults && (
                    <div className="mt-2 p-3 bg-slate-50 text-slate-600 rounded-lg text-sm border border-slate-100">
                      <span className="font-semibold">Explanation: </span> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!showResults && Object.keys(quizAnswers).length === lessonData.quiz.length && (
              <button 
                onClick={handleQuizSubmit}
                className="mt-8 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Submit Answers
              </button>
            )}
            {showResults && (
               <button 
               onClick={() => navigate('/courses')}
               className="mt-8 w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm"
             >
               Return to Courses
             </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-8">
            <h3 className="font-bold mb-4 text-slate-800 uppercase tracking-wider text-xs flex items-center justify-between">
              Target Vocabulary
              <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-[10px]">Will be saved</span>
            </h3>
            <div className="space-y-4">
              {lessonData.vocabulary.map((v, idx) => (
                <div key={idx} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-slate-800">{v.word}</span>
                    <span className="text-xs text-indigo-600 font-mono bg-indigo-50 px-1 rounded">{v.ipa}</span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium mb-1">{v.meaning}</p>
                  <p className="text-xs text-slate-500 italic">"{v.example}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
