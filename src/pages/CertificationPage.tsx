import React from 'react';
import { Award, CheckCircle, Lock, Download, Star } from 'lucide-react';
import { User } from 'firebase/auth';
import { downloadCertificate } from '../lib/certificate';

interface CertificationPageProps {
  user: User;
}

export function CertificationPage({ user }: CertificationPageProps) {
  // Mock certification data. In a real app, this would be computed based on user progress or fetched from Firestore.
  const certificates = [
    {
      id: 'cert-0',
      title: 'B1 Daily Life English',
      description: 'Mastery in everyday conversations, socializing, and running errands.',
      progress: 0,
      earnedAt: null,
      icon: <CheckCircle className="w-12 h-12 text-teal-500" />,
      color: 'bg-teal-100',
    },
    {
      id: 'cert-1',
      title: 'B2 Tech English Foundation',
      description: 'Proficiency in daily standups, basic system design, and agile communication.',
      progress: 100,
      earnedAt: '2023-11-15',
      icon: <Award className="w-12 h-12 text-emerald-500" />,
      color: 'bg-emerald-100',
    },
    {
      id: 'cert-2',
      title: 'C1 FAANG Interview Master',
      description: 'Mastery in behavioral interviews, STAR method, and technical whiteboarding communication.',
      progress: 60,
      earnedAt: null,
      icon: <Star className="w-12 h-12 text-blue-500" />,
      color: 'bg-blue-100',
    },
    {
      id: 'cert-3',
      title: 'C1 Leadership & Corporate',
      description: 'Advanced skills in professional pushback, code review feedback, and meeting leadership.',
      progress: 20,
      earnedAt: null,
      icon: <CheckCircle className="w-12 h-12 text-purple-500" />,
      color: 'bg-purple-100',
    },
    {
      id: 'cert-4',
      title: 'C2 Advanced Tech Writer',
      description: 'Expertise in writing RFCs, technical documentation, and executive summaries.',
      progress: 0,
      earnedAt: null,
      icon: <CheckCircle className="w-12 h-12 text-orange-500" />,
      color: 'bg-orange-100',
    }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 bg-slate-50 min-h-full">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Certifications</h1>
        <p className="text-slate-600">Earn certificates by completing course tracks and passing assessments.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <div key={cert.id} className={`border rounded-2xl p-6 ${cert.earnedAt ? 'bg-white border-emerald-200 shadow-sm' : 'bg-white border-slate-200'}`}>
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${cert.earnedAt ? cert.color : 'bg-slate-100'}`}>
                {cert.earnedAt ? cert.icon : <Lock className="w-8 h-8 text-slate-400" />}
              </div>
              
              <div className="flex-1">
                <h3 className={`font-bold text-lg mb-1 ${cert.earnedAt ? 'text-slate-900' : 'text-slate-700'}`}>
                  {cert.title}
                </h3>
                <p className="text-sm text-slate-500 mb-4 h-10">
                  {cert.description}
                </p>

                {cert.earnedAt ? (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <div className="text-sm text-emerald-600 font-medium">
                      Earned on {new Date(cert.earnedAt).toLocaleDateString()}
                    </div>
                    <button 
                      onClick={() => downloadCertificate(user.displayName || 'Student Name', cert.title, cert.earnedAt!)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                      <span>Progress</span>
                      <span>{cert.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${cert.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
