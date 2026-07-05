import React from 'react';
import { syllabus } from '../data/syllabus';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

export function CoursesPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 bg-slate-50 min-h-full">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Learning Path</h1>
        <p className="text-slate-600">Master professional English tailored for Software Engineering & Tech Leadership.</p>
      </header>

      <div className="space-y-12">
        {syllabus.map((course, idx) => (
          <div key={course.id} className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl shadow-sm border border-indigo-200">
                {idx + 1}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{course.title}</h2>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mt-1">
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md text-xs">{course.level}</span>
                  <span>{course.description}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-6 md:pl-16">
              {course.modules.map(module => (
                <div key={module.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-lg text-slate-800 mb-4">{module.title}</h3>
                  <div className="space-y-3">
                    {module.lessons.map((lesson, lIdx) => (
                      <Link 
                        key={lesson.id} 
                        to={`/lesson/${lesson.id}?title=${encodeURIComponent(lesson.title)}&type=${lesson.type}`}
                        className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${lIdx === 0 && idx === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                            {lIdx === 0 && idx === 0 ? <CheckCircle2 size={18} /> : <BookOpen size={18} />}
                          </div>
                          <span className="font-medium text-slate-700 group-hover:text-indigo-900 text-sm">{lesson.title}</span>
                        </div>
                        <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-500" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {idx < syllabus.length - 1 && (
              <div className="absolute left-6 top-16 bottom-[-3rem] w-0.5 bg-slate-200 -z-10" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
