import React from 'react';
import { useCampus, NavTab } from '../context/CampusContext';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Clock,
  Timer,
  Bell,
  Sparkles,
  BookOpen,
  TrendingUp,
  CreditCard,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Bot,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    pendingAssignmentsCount,
    unreadNoticesCount,
    overallAttendancePercentage,
    logout,
  } = useCampus();

  const navItems: {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'timetable', label: 'Class Timetable', icon: Calendar },
    {
      id: 'assignments',
      label: 'Assignments',
      icon: CheckSquare,
      badge: pendingAssignmentsCount,
      badgeColor: 'bg-amber-500 text-white',
    },
    { id: 'exams', label: 'Exams & Schedule', icon: Clock },
    { id: 'planner', label: 'Study Planner', icon: Timer },
    {
      id: 'notices',
      label: 'College Notices',
      icon: Bell,
      badge: unreadNoticesCount,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'events', label: 'Campus Events', icon: Sparkles },
    { id: 'resources', label: 'Learning Resources', icon: BookOpen },
    { id: 'progress', label: 'Progress & GPA', icon: TrendingUp },
    { id: 'profile', label: 'Student Profile', icon: CreditCard },
    { id: 'assistant', label: 'Smart AI Assistant', icon: Bot },
  ];

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  const attendanceColor =
    overallAttendancePercentage >= 80
      ? 'text-emerald-500'
      : overallAttendancePercentage >= 75
      ? 'text-amber-500'
      : 'text-rose-500';

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 z-40 h-[100dvh] md:h-[calc(100vh-4rem)] w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-4 transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Navigation list */}
        <div className="overflow-y-auto space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Campus Navigation
          </div>

          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer group ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-900/60'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition ${
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          item.badgeColor || 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom card: Attendance safety indicator & Switch ID */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Attendance
              </span>
              <span className={`font-mono font-bold ${attendanceColor}`}>
                {overallAttendancePercentage}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  overallAttendancePercentage >= 80
                    ? 'bg-emerald-500'
                    : overallAttendancePercentage >= 75
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, overallAttendancePercentage)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5">
              {overallAttendancePercentage >= 75
                ? 'Above institutional 75% threshold'
                : 'Warning: Under 75% threshold'}
            </p>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Switch Student ID / Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
