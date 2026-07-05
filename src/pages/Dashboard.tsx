import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Brain, Target, Trophy, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAccessToken } from '../lib/firebase';
import { User } from 'firebase/auth';
import { getUserProfile, createUserProfile, UserProfile } from '../services/db';

const data = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 68 },
  { name: 'Wed', score: 75 },
  { name: 'Thu', score: 72 },
  { name: 'Fri', score: 85 },
  { name: 'Sat', score: 88 },
  { name: 'Sun', score: 92 },
];

export function Dashboard({ user }: { user: User }) {
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        let p = await getUserProfile(user.uid);
        if (!p) {
          p = await createUserProfile(user.uid);
        }
        setProfile(p);
      } catch (err) {
        console.error("Failed to load user profile from Firestore:", err);
        // Fallback profile if Firestore is unavailable or rules block it
        setProfile({
          uid: user.uid,
          level: 'B2',
          xp: 4250,
          streak: 12,
          lastActive: new Date().toISOString(),
          fluencyScore: 92,
          wordsLearned: 842,
          speakingTimeMinutes: 720
        });
      }
    };
    loadProfile();
  }, [user]);

  const handleSyncTasks = async () => {
    const token = await getAccessToken();
    if (!token) {
      alert("Please sign in again to sync tasks.");
      return;
    }

    setSyncing(true);
    try {
      const task = {
        title: 'Complete English Lesson: Corporate Meetings',
        notes: 'Practice professional disagreement in the AI English Coach.'
      };

      const res = await fetch('https://tasks.googleapis.com/tasks/v1/lists/@default/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
      });

      if (res.ok) {
        setSynced(true);
        setTimeout(() => setSynced(false), 3000);
      } else {
        throw new Error('Failed to create task');
      }
    } catch (err) {
      console.error(err);
      alert('Error syncing to Google Tasks');
    } finally {
      setSyncing(false);
    }
  };

  if (!profile) {
    return <div className="p-8">Loading profile...</div>;
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50">
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-slate-800">Dashboard</h1>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">Level {profile.level}</span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-orange-500 font-bold">🔥 {profile.streak}</span>
            <span className="text-sm text-slate-500">Day Streak</span>
          </div>
          <button 
            onClick={handleSyncTasks}
            disabled={syncing || synced}
            className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            {synced ? <CheckCircle2 className="h-4 w-4" /> : <Target className="h-4 w-4" />}
            {synced ? 'Synced to Tasks' : syncing ? 'Syncing...' : 'Add Reminder'}
          </button>
        </div>
      </header>

      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Fluency Score" value={profile.fluencyScore} subtitle="Current Evaluation" icon={Brain} color="indigo" />
          <StatCard title="Words Learned" value={profile.wordsLearned} subtitle="Total mastery" icon={Target} color="emerald" />
          <StatCard title="Speaking Time" value={`${profile.speakingTimeMinutes}m`} subtitle="Practice time" icon={Clock} color="indigo" />
          <StatCard title="XP Earned" value={profile.xp.toLocaleString()} subtitle="Total experience" icon={Trophy} color="orange" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-6">Learning Progress</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Next Actions */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-800">Recommended for you</h2>
            
            <ActionCard 
              title="Corporate Interview Prep" 
              desc="Practice answering behavioral questions." 
              to="/conversation" 
              icon={Mic}
            />
            <ActionCard 
              title="Advanced Grammar" 
              desc="Master the present perfect tense." 
              to="/lesson" 
              icon={BookOpen}
            />
            <ActionCard 
              title="Daily Chat" 
              desc="Discuss your day with the AI tutor." 
              to="/chat" 
              icon={MessageSquare}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }: any) {
  const colors = {
    indigo: 'bg-indigo-100 text-indigo-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };
  
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-start gap-4 transition-transform hover:-translate-y-1 duration-300 shadow-sm">
      <div className={`p-3 rounded-xl ${colors[color as keyof typeof colors]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <div className="text-slate-500 text-sm font-medium mb-1">{title}</div>
        <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
        <div className="text-xs text-slate-500">{subtitle}</div>
      </div>
    </div>
  );
}

function ActionCard({ title, desc, to, icon: Icon }: any) {
  return (
    <Link to={to} className="group block bg-white border border-slate-200 p-5 rounded-2xl hover:border-slate-300 transition-colors shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
      </div>
      <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </Link>
  );
}

import { Mic, BookOpen, MessageSquare } from 'lucide-react';
