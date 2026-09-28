import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  Search,
  Moon,
  Sun,
  Bell,
  CheckCircle,
  Menu,
  GraduationCap,
  Sparkles,
  Shield,
  Layers,
  ExternalLink,
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar }) => {
  const {
    isDark,
    toggleTheme,
    setSearchModalOpen,
    studentProfile,
    unreadNoticesCount,
    notices,
    setActiveTab,
  } = useCampus();

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Today formatted
  const todayStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            aria-label="Open sidebar menu"
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-lg text-slate-900 dark:text-slate-50">
                  Campus<span className="text-indigo-600 dark:text-indigo-400">AI</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  v2.6
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Search trigger bar */}
        <div className="flex-1 max-w-md mx-2 hidden sm:block">
          <button
            onClick={() => setSearchModalOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 text-slate-500 dark:text-slate-400 text-xs transition cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search classes, assignments, exams, notices...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search icon */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="sm:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Academic Date & Term indicator */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 pr-3">
            <span>{todayStr}</span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Term 1 · Week 7</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(prev => !prev)}
              aria-label="Notifications"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadNoticesCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
              )}
            </button>

            {notificationsOpen && (
              <div
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Campus Broadcasts ({unreadNoticesCount} unread)
                  </span>
                  <button
                    onClick={() => {
                      setActiveTab('notices');
                      setNotificationsOpen(false);
                    }}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1"
                  >
                    View All
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                  {notices.slice(0, 4).map(notice => (
                    <div
                      key={notice.id}
                      onClick={() => {
                        setActiveTab('notices');
                        setNotificationsOpen(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                          {notice.title}
                        </span>
                        {notice.isUrgent && (
                          <span className="text-[10px] font-bold text-rose-500 uppercase shrink-0">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                        {notice.summary}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {notice.department} · {notice.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Student ID badge button (NO human photo, NO person name) */}
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer group"
            title="View Student Identity & Profile"
          >
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-mono text-[10px] font-bold shadow-xs">
              ID
            </div>
            <div className="text-left hidden xs:block">
              <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                {studentProfile.studentId}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
