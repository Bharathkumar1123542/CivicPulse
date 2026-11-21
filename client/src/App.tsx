import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { IssuesProvider } from './context/IssuesContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CommandPalette } from './components/CommandPalette';

// Pages
import { LandingPage } from './pages/LandingPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { IssueDetailsPage } from './pages/IssueDetailsPage';
import { ExploreMapPage } from './pages/ExploreMapPage';
import { AuthorityDashboard } from './pages/AuthorityDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

export const MainApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [activeReportId, setActiveReportId] = useState<string>('CP-2026-1041');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Navigation handler
  const handleNavigate = (tab: string, param?: any) => {
    if (tab === 'details' && param) {
      setActiveReportId(param);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans selection:bg-orange-500 selection:text-white relative transition-colors duration-200">
      {/* Modern Navigation Bar with Spotlight search */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'landing' && <LandingPage onNavigate={handleNavigate} />}
        {currentTab === 'citizen' && <CitizenDashboard onNavigate={handleNavigate} />}
        {currentTab === 'report' && <ReportIssuePage onNavigate={handleNavigate} />}
        {currentTab === 'details' && (
          <IssueDetailsPage reportId={activeReportId} onNavigate={handleNavigate} />
        )}
        {currentTab === 'map' && <ExploreMapPage onNavigate={handleNavigate} />}
        {currentTab === 'officer' && <AuthorityDashboard onNavigate={handleNavigate} />}
        {currentTab === 'admin' && <AdminDashboard onNavigate={handleNavigate} />}
      </main>

      {/* Spotlight Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Universal Footer with accreditation */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <IssuesProvider>
          <NotificationProvider>
            <MainApp />
          </NotificationProvider>
        </IssuesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
