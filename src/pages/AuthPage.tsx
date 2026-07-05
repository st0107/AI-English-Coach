import React, { useState } from 'react';
import { googleSignIn } from '../lib/firebase';
import { Sparkles, Brain, Mic, MessageSquare, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await googleSignIn();
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full space-y-8 relative">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-slate-900">AI English Coach</h2>
          <p className="text-slate-500">Master English with an intelligent tutor</p>
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                <Brain className="h-5 w-5 text-indigo-600" />
                <span>Personalized lesson paths</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                <Mic className="h-5 w-5 text-indigo-600" />
                <span>Real-time voice conversations</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                <MessageSquare className="h-5 w-5 text-indigo-600" />
                <span>Corporate & Interview Prep</span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button 
                onClick={handleLogin}
                disabled={loading}
                className="gsi-material-button w-full justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl h-12 relative overflow-hidden transition-colors shadow-sm"
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper flex items-center justify-center gap-3 h-full">
                  <div className="gsi-material-button-icon flex-shrink-0">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents font-medium">
                    {loading ? 'Signing in...' : 'Sign in with Google'}
                  </span>
                </div>
              </button>
              
              {error && (
                <p className="mt-4 text-sm text-red-600 text-center bg-red-50 py-2 rounded-lg border border-red-100">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
