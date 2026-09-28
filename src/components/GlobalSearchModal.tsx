import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useCampus, NavTab } from '../context/CampusContext';
import {
  Search,
  X,
  Calendar,
  FileText,
  Clock,
  Bell,
  BookOpen,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    searchModalOpen,
    setSearchModalOpen,
    timetable,
    assignments,
    exams,
    notices,
    events,
    resources,
    setActiveTab,
  } = useCampus();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [searchModalOpen]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const matchedClasses = timetable.filter(
      c =>
        c.courseCode.toLowerCase().includes(q) ||
        c.courseName.toLowerCase().includes(q) ||
        c.room.toLowerCase().includes(q)
    );

    const matchedAssignments = assignments.filter(
      a =>
        a.title.toLowerCase().includes(q) ||
        a.courseCode.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
    );

    const matchedExams = exams.filter(
      e =>
        e.courseCode.toLowerCase().includes(q) ||
        e.courseName.toLowerCase().includes(q) ||
        e.hall.toLowerCase().includes(q)
    );

    const matchedNotices = notices.filter(
      n =>
        n.title.toLowerCase().includes(q) ||
        n.department.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q)
    );

    const matchedEvents = events.filter(
      ev =>
        ev.title.toLowerCase().includes(q) ||
        ev.category.toLowerCase().includes(q) ||
        ev.location.toLowerCase().includes(q)
    );

    const matchedResources = resources.filter(
      r =>
        r.title.toLowerCase().includes(q) ||
        r.courseCode.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );

    const totalCount =
      matchedClasses.length +
      matchedAssignments.length +
      matchedExams.length +
      matchedNotices.length +
      matchedEvents.length +
      matchedResources.length;

    return {
      classes: matchedClasses,
      assignments: matchedAssignments,
      exams: matchedExams,
      notices: matchedNotices,
      events: matchedEvents,
      resources: matchedResources,
      totalCount,
    };
  }, [query, timetable, assignments, exams, notices, events, resources]);

  if (!searchModalOpen) return null;

  const navigateTo = (tab: NavTab) => {
    setActiveTab(tab);
    setSearchModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setSearchModalOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search header input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search classes, assignments, exams, notices, library resources..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results area */}
        <div className="overflow-y-auto p-4 space-y-4">
          {!query && (
            <div className="py-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Quick Navigation Shortcuts
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-md mx-auto">
                <button
                  onClick={() => navigateTo('timetable')}
                  className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-left hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition text-xs font-medium flex items-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Timetable</span>
                </button>
                <button
                  onClick={() => navigateTo('assignments')}
                  className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-left hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition text-xs font-medium flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>Assignments</span>
                </button>
                <button
                  onClick={() => navigateTo('exams')}
                  className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-left hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition text-xs font-medium flex items-center gap-2"
                >
                  <Clock className="w-3.5 h-3.5 text-rose-500" />
                  <span>Exams</span>
                </button>
                <button
                  onClick={() => navigateTo('notices')}
                  className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-left hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition text-xs font-medium flex items-center gap-2"
                >
                  <Bell className="w-3.5 h-3.5 text-sky-500" />
                  <span>Notices</span>
                </button>
                <button
                  onClick={() => navigateTo('resources')}
                  className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-left hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition text-xs font-medium flex items-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Resources</span>
                </button>
                <button
                  onClick={() => navigateTo('profile')}
                  className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-left hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition text-xs font-medium flex items-center gap-2"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
                  <span>Student ID Card</span>
                </button>
              </div>
            </div>
          )}

          {searchResults && searchResults.totalCount === 0 && (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <p className="text-sm font-medium">No campus records found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching by course code (e.g. CS301), exam, notice, or keyword.</p>
            </div>
          )}

          {searchResults && searchResults.totalCount > 0 && (
            <div className="space-y-4">
              {/* Classes */}
              {searchResults.classes.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Courses & Timetable ({searchResults.classes.length})
                  </span>
                  <div className="mt-1 space-y-1">
                    {searchResults.classes.map(c => (
                      <button
                        key={c.id}
                        onClick={() => navigateTo('timetable')}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                            {c.courseCode}
                          </span>
                          <span className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                            {c.courseName}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {c.day} {c.startTime} · {c.room}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Assignments */}
              {searchResults.assignments.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Assignments ({searchResults.assignments.length})
                  </span>
                  <div className="mt-1 space-y-1">
                    {searchResults.assignments.map(a => (
                      <button
                        key={a.id}
                        onClick={() => navigateTo('assignments')}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                            {a.title}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {a.courseCode} · Due {a.dueDate} · {a.status}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Exams */}
              {searchResults.exams.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Exams ({searchResults.exams.length})
                  </span>
                  <div className="mt-1 space-y-1">
                    {searchResults.exams.map(e => (
                      <button
                        key={e.id}
                        onClick={() => navigateTo('exams')}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-semibold text-rose-500">
                            {e.courseCode}
                          </span>
                          <span className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                            {e.examType} — {e.courseName}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {e.date} · {e.hall}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notices */}
              {searchResults.notices.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    College Notices ({searchResults.notices.length})
                  </span>
                  <div className="mt-1 space-y-1">
                    {searchResults.notices.map(n => (
                      <button
                        key={n.id}
                        onClick={() => navigateTo('notices')}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="text-xs text-slate-800 dark:text-slate-200 font-medium truncate">
                            {n.title}
                          </span>
                          <span className="text-[11px] text-slate-400 shrink-0">
                            {n.department} · {n.date}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Resources */}
              {searchResults.resources.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Learning Resources ({searchResults.resources.length})
                  </span>
                  <div className="mt-1 space-y-1">
                    {searchResults.resources.map(r => (
                      <button
                        key={r.id}
                        onClick={() => navigateTo('resources')}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="font-mono text-xs font-semibold text-emerald-500 shrink-0">
                            {r.fileFormat}
                          </span>
                          <span className="text-xs text-slate-800 dark:text-slate-200 font-medium truncate">
                            {r.title}
                          </span>
                          <span className="text-[11px] text-slate-400 shrink-0">
                            {r.courseCode} · {r.category}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
