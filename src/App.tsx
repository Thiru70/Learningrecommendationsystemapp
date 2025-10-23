import React, { useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { EnhancedOnboarding } from './components/EnhancedOnboarding';
import { Home } from './components/Home';
import { Dashboard } from './components/Dashboard';
import { Tasks } from './components/Tasks';
import { LearningPath } from './components/LearningPath';
import { Bookmarks } from './components/Bookmarks';
import { Profile } from './components/Profile';
import { AppSidebar } from './components/AppSidebar';
import { NotificationCenter } from './components/NotificationCenter';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { Toaster } from './components/ui/sonner';
import { Bell } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  // Check if user needs onboarding
  React.useEffect(() => {
    if (user && (user.interests.length === 0 || !user.skillLevel)) {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }
  }, [user]);

  // Not authenticated - show auth views
  if (!user) {
    if (authView === 'login') {
      return <Login onNavigateToSignup={() => setAuthView('signup')} />;
    }
    return <Signup onNavigateToLogin={() => setAuthView('login')} />;
  }

  // Authenticated but needs onboarding
  if (showOnboarding) {
    return (
      <EnhancedOnboarding onComplete={() => setShowOnboarding(false)} />
    );
  }

  // Main application with sidebar
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900">
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b dark:border-gray-800 p-4 flex items-center justify-between lg:justify-end">
            <div className="lg:hidden">
              <SidebarTrigger />
            </div>
            <NotificationCenter />
          </div>
          {currentPage === 'home' && <Home onNavigate={setCurrentPage} />}
          {currentPage === 'tasks' && <Tasks />}
          {currentPage === 'recommendations' && <Dashboard />}
          {currentPage === 'learning-path' && <LearningPath />}
          {currentPage === 'bookmarks' && <Bookmarks />}
          {currentPage === 'profile' && <Profile />}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}