import React, { useMemo } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  Calendar,
  CheckSquare,
  Clock,
  Bell,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Timer,
  ChevronRight,
  Bot,
  MapPin,
  ExternalLink,
  Flame,
  Award,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    studentProfile,
    timetable,
    assignments,
    exams,
    notices,
    events,
    logClassAttendance,
    setAssignmentStatus,
    setActiveTab,
    overallAttendancePercentage,
    studySessions,
  } = useCampus();

  // Determine current day for timetable (default to Monday if weekend for rich demo)
  const currentDay = useMemo(() => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayIndex = new Date().getDay();
    const dayStr = dayNames[todayIndex];
    if (dayStr === 'Saturday' || dayStr === 'Sunday') {
      return 'Monday'; // Default to Monday so student sees full active classes
    }
    return dayStr;
  }, []);

  // Today's classes
  const todaysClasses = useMemo(() => {
    return timetable.filter(c => c.day === currentDay);
  }, [timetable, currentDay]);

  // Urgent pending assignments (due soonest)
  const pendingAssignments = useMemo(() => {
    return assignments
      .filter(a => a.status === 'Not Started' || a.status === 'In Progress')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 3);
  }, [assignments]);

  // Next upcoming exam
  const nextExam = useMemo(() => {
    return [...exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [exams]);

  // Urgent / latest notices
  const importantNotices = useMemo(() => {
    return notices.slice(0, 3);
  }, [notices]);

  // Days until next exam
  const daysUntilNextExam = useMemo(() => {
    if (!nextExam) return null;
    const diff = new Date(nextExam.date).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [nextExam]);

  // Total study minutes this week
  const totalStudyMinutes = useMemo(() => {
    return studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  }, [studySessions]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner: Enforce "Welcome back" only, no other person's name or photo */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Academic Session 2025–2026 · Term 1</span>
            </div>
            {/* STRICT REQUIREMENT: "Welcome back" only, no person's name or photo */}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Here is your campus schedule and academic priorities for today. Everything is synced with your student ID record.
            </p>
          </div>

          {/* Quick Metrics Bar on Hero */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block">
                Target CGPA
              </span>
              <span className="text-lg font-bold text-white font-mono">
                {studentProfile.cgpa.toFixed(2)}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block">
                Attendance
              </span>
              <span className="text-lg font-bold text-emerald-400 font-mono">
                {overallAttendancePercentage}%
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block">
                Credits
              </span>
              <span className="text-lg font-bold text-indigo-300 font-mono">
                {studentProfile.earnedCredits}/{studentProfile.totalDegreeCredits}
              </span>
            </div>
          </div>
        </div>

        {/* Ambient subtle glow background */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Classes */}
        <div
          onClick={() => setActiveTab('timetable')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Today's Lectures</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {todaysClasses.length}
            </span>
            <span className="text-xs text-slate-500">
              {currentDay}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
            <span>View daily schedule</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* Pending Assignments */}
        <div
          onClick={() => setActiveTab('assignments')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Pending Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {pendingAssignments.length}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Due shortly</span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
            <span>Open coursework</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* Next Exam Countdown */}
        <div
          onClick={() => setActiveTab('exams')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-rose-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Next Exam</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {daysUntilNextExam !== null ? `${daysUntilNextExam}d` : 'None'}
            </span>
            <span className="text-xs text-slate-500 truncate">
              {nextExam ? nextExam.courseCode : ''}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition">
            <span>Check exam seating</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* Study Hours Logged */}
        <div
          onClick={() => setActiveTab('planner')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Study Logged</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Timer className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {(totalStudyMinutes / 60).toFixed(1)}h
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">This week</span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
            <span>Focus timer & goals</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* Main Grid: Today's Schedule + Deadlines & Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Today's Classes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Classes Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  Today’s Class Timetable
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Showing sessions for {currentDay}
                </span>
              </div>
              <button
                onClick={() => setActiveTab('timetable')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Full Week</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {todaysClasses.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No classes scheduled for today. Enjoy your study time!
                </div>
              ) : (
                todaysClasses.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-14 shrink-0 text-center py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                        <span className="block text-xs font-mono font-bold leading-tight">
                          {item.startTime}
                        </span>
                        <span className="block text-[10px] text-slate-400 leading-tight">
                          {item.endTime}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            {item.courseCode}
                          </span>
                          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                            {item.courseName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {item.room}
                          </span>
                          <span>·</span>
                          <span>{item.type}</span>
                          <span>·</span>
                          <span>{item.credits} Credits</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => logClassAttendance(item.id, true)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition flex items-center gap-1 cursor-pointer"
                        title="Mark today as attended"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Present</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Assignments Quick Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-amber-500" />
                  Upcoming Assignments
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Priority coursework requiring attention
                </span>
              </div>
              <button
                onClick={() => setActiveTab('assignments')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>All Tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {pendingAssignments.map(asg => (
                <div
                  key={asg.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                        {asg.courseCode}
                      </span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {asg.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Due {asg.dueDate} ({asg.dueTime})</span>
                      <span>·</span>
                      <span
                        className={`font-semibold ${
                          asg.priority === 'High'
                            ? 'text-rose-500'
                            : asg.priority === 'Medium'
                            ? 'text-amber-500'
                            : 'text-slate-400'
                        }`}
                      >
                        {asg.priority} Priority
                      </span>
                      <span>·</span>
                      <span>Weightage {asg.weightage}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => setAssignmentStatus(asg.id, 'Submitted')}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-medium hover:bg-indigo-100 transition cursor-pointer"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Notices & Smart Assistant Section Preview */}
        <div className="space-y-6">
          {/* Smart AI Assistant Section (Future-Ready Agentic preview as requested) */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-50/70 to-slate-50 dark:from-indigo-950/30 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-900/60 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Smart AI Assistant
                  </h3>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                    Agentic Reasoning Engine
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300">
                Ready
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              CampusAI is architected to reason across your timetable, pending deadlines, and examination rules to construct prioritized schedules.
            </p>

            {/* Quick action query shortcuts */}
            <div className="space-y-1.5 mb-3">
              <button
                onClick={() => setActiveTab('assistant')}
                className="w-full text-left p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 transition text-[11px] text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
              >
                <span>"Prioritize this week's 3 assignments by weightage"</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
              <button
                onClick={() => setActiveTab('assistant')}
                className="w-full text-left p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 transition text-[11px] text-slate-700 dark:text-slate-300 flex items-center justify-between cursor-pointer"
              >
                <span>"Check safe absence margin for Distributed Systems"</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            <button
              onClick={() => setActiveTab('assistant')}
              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <span>Open Smart Assistant Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Exam Radar Widget */}
          {nextExam && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-500" />
                  Upcoming Assessment
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                  {daysUntilNextExam} Days Left
                </span>
              </div>

              <div className="space-y-1 mb-3">
                <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400 block">
                  {nextExam.courseCode} · {nextExam.examType}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {nextExam.courseName}
                </h4>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 pt-1">
                  <span>{nextExam.date}</span>
                  <span>·</span>
                  <span>{nextExam.hall}</span>
                </div>
              </div>

              {/* Readiness bar */}
              <div>
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                  <span>Syllabus Readiness</span>
                  <span className="font-mono font-semibold">{nextExam.readinessPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${nextExam.readinessPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Official Notices Bulletin Widget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-sky-500" />
                Campus Broadcasts
              </h3>
              <button
                onClick={() => setActiveTab('notices')}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {importantNotices.map(n => (
                <div
                  key={n.id}
                  onClick={() => setActiveTab('notices')}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {n.title}
                    </span>
                    {n.isUrgent && (
                      <span className="text-[9px] font-bold text-rose-500 uppercase shrink-0">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {n.summary}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                    <span>{n.department}</span>
                    <span>{n.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
