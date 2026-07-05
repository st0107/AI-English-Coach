import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { LessonPage } from "./pages/LessonPage";
import { VoiceConversation } from "./pages/VoiceConversation";
import { ChatbotPage } from "./pages/ChatbotPage";
import { AuthPage } from "./pages/AuthPage";
import { CoursesPage } from "./pages/CoursesPage";
import { WritingCoachPage } from "./pages/WritingCoachPage";
import { InterviewPrepPage } from "./pages/InterviewPrepPage";
import { Layout } from "./components/Layout";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./lib/firebase";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/lesson/:id" element={<LessonPage user={user} />} />
          <Route path="/conversation" element={<VoiceConversation user={user} />} />
          <Route path="/writing" element={<WritingCoachPage user={user} />} />
          <Route path="/interview" element={<InterviewPrepPage user={user} />} />
          <Route path="/chat" element={<ChatbotPage user={user} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
