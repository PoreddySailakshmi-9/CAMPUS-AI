/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CampusProvider, useCampus } from './context/CampusContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { LoginModal } from './components/LoginModal';

import { CampusAiChatWidget } from './components/CampusAiChatWidget';

// Views
import { DashboardView } from './views/DashboardView';
import { TimetableView } from './views/TimetableView';
import { AssignmentsView } from './views/AssignmentsView';
import { ExamsView } from './views/ExamsView';
import { StudyPlannerView } from './views/StudyPlannerView';
import { CampusNoticesView } from './views/CampusNoticesView';
import { CampusEventsView } from './views/CampusEventsView';
import { ResourcesView } from './views/ResourcesView';
import { ProgressView } from './views/ProgressView';
import { ProfileView } from './views/ProfileView';
import { SmartAssistantSection } from './views/SmartAssistantSection';

const MainContent: React.FC = () => {
  const { activeTab, isLoggedIn } = useCampus();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Render active tab view
  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'timetable':
        return <TimetableView />;
      case 'assignments':
        return <AssignmentsView />;
      case 'exams':
        return <ExamsView />;
      case 'planner':
        return <StudyPlannerView />;
      case 'notices':
        return <CampusNoticesView />;
      case 'events':
        return <CampusEventsView />;
      case 'resources':
        return <ResourcesView />;
      case 'progress':
        return <ProgressView />;
      case 'profile':
        return <ProfileView onOpenSwitchLogin={() => setLoginModalOpen(true)} />;
      case 'assistant':
        return <SmartAssistantSection />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navbar */}
      <Navbar onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)} />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Content Container */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderView()}

          {/* Institutional Portal Footer */}
          <footer className="mt-16 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">CampusAI</span>
              <span>·</span>
              <span>Digital Campus Academic Operating System</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Campus Security SSL/TLS</span>
              <span>·</span>
              <span>Single Sign-On Enforced</span>
              <span>·</span>
              <span>Autumn Term 2026</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Global Spotlight Search Modal (⌘K) */}
      <GlobalSearchModal />

      {/* Floating Live n8n Campus AI Chat Widget */}
      <CampusAiChatWidget />

      {/* Login / Profile Switcher Modal (shown if logged out or requested) */}
      <LoginModal
        isOpen={!isLoggedIn || loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <CampusProvider>
      <MainContent />
    </CampusProvider>
  );
}
