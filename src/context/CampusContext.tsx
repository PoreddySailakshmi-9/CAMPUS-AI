import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TimetableClass,
  Assignment,
  Exam,
  Notice,
  CampusEvent,
  LearningResource,
  StudySession,
  StudentProfile,
  AssignmentStatus,
} from '../types/campus';
import {
  initialStudentProfile,
  initialTimetable,
  initialAssignments,
  initialExams,
  initialNotices,
  initialEvents,
  initialResources,
  initialStudySessions,
} from '../data/mockData';

export type NavTab =
  | 'dashboard'
  | 'timetable'
  | 'assignments'
  | 'exams'
  | 'planner'
  | 'notices'
  | 'events'
  | 'resources'
  | 'progress'
  | 'profile'
  | 'assistant';

interface CampusContextType {
  // Theme
  isDark: boolean;
  toggleTheme: () => void;

  // Active view
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  // Search
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;

  // Student Profile
  studentProfile: StudentProfile;
  updateStudentProfile: (profile: Partial<StudentProfile>) => void;
  loginWithStudentId: (studentId: string) => void;
  isLoggedIn: boolean;
  logout: () => void;

  // Timetable
  timetable: TimetableClass[];
  addClass: (newClass: Omit<TimetableClass, 'id'>) => void;
  updateClass: (id: string, updated: Partial<TimetableClass>) => void;
  deleteClass: (id: string) => void;
  logClassAttendance: (id: string, attended: boolean) => void;

  // Assignments
  assignments: Assignment[];
  addAssignment: (asg: Omit<Assignment, 'id'>) => void;
  updateAssignment: (id: string, updated: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  toggleAssignmentBookmark: (id: string) => void;
  setAssignmentStatus: (id: string, status: AssignmentStatus) => void;
  toggleTaskChecklist: (assignmentId: string, taskId: string) => void;

  // Exams
  exams: Exam[];
  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateExam: (id: string, updated: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  updateExamReadiness: (id: string, readiness: number) => void;

  // Notices
  notices: Notice[];
  toggleNoticeRead: (id: string) => void;
  toggleNoticeBookmark: (id: string) => void;
  addNotice: (notice: Omit<Notice, 'id'>) => void;

  // Events
  events: CampusEvent[];
  toggleEventRsvp: (id: string) => void;
  toggleEventBookmark: (id: string) => void;
  addEvent: (event: Omit<CampusEvent, 'id'>) => void;

  // Resources
  resources: LearningResource[];
  addResource: (res: Omit<LearningResource, 'id'>) => void;
  toggleResourceBookmark: (id: string) => void;
  deleteResource: (id: string) => void;

  // Study Sessions & Focus
  studySessions: StudySession[];
  logStudySession: (session: Omit<StudySession, 'id'>) => void;
  weeklyStudyGoalHours: number;
  setWeeklyStudyGoalHours: (hours: number) => void;

  // Utilities
  resetToDefaultData: () => void;
  unreadNoticesCount: number;
  pendingAssignmentsCount: number;
  overallAttendancePercentage: number;
}

const CampusContext = createContext<CampusContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`campusai_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Error loading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`campusai_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

export const CampusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('campusai_theme');
      if (stored !== null) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('campusai_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('campusai_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  // Active navigation view
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);

  // Profile & Auth
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() =>
    loadFromStorage('profile', initialStudentProfile)
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() =>
    loadFromStorage('isLoggedIn', true)
  );

  const updateStudentProfile = (partial: Partial<StudentProfile>) => {
    setStudentProfile(prev => {
      const updated = { ...prev, ...partial };
      saveToStorage('profile', updated);
      return updated;
    });
  };

  const loginWithStudentId = (id: string) => {
    const cleanId = id.trim().toUpperCase() || 'STU-2026-9041';
    setStudentProfile(prev => {
      const updated = { ...prev, studentId: cleanId };
      saveToStorage('profile', updated);
      return updated;
    });
    setIsLoggedIn(true);
    saveToStorage('isLoggedIn', true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    saveToStorage('isLoggedIn', false);
  };

  // Timetable
  const [timetable, setTimetable] = useState<TimetableClass[]>(() =>
    loadFromStorage('timetable', initialTimetable)
  );
  const addClass = (newClass: Omit<TimetableClass, 'id'>) => {
    setTimetable(prev => {
      const created: TimetableClass = { ...newClass, id: `tt-${Date.now()}` };
      const updated = [...prev, created];
      saveToStorage('timetable', updated);
      return updated;
    });
  };
  const updateClass = (id: string, updated: Partial<TimetableClass>) => {
    setTimetable(prev => {
      const modified = prev.map(c => (c.id === id ? { ...c, ...updated } : c));
      saveToStorage('timetable', modified);
      return modified;
    });
  };
  const deleteClass = (id: string) => {
    setTimetable(prev => {
      const filtered = prev.filter(c => c.id !== id);
      saveToStorage('timetable', filtered);
      return filtered;
    });
  };
  const logClassAttendance = (id: string, attended: boolean) => {
    setTimetable(prev => {
      const modified = prev.map(c => {
        if (c.id === id) {
          const total = c.totalSessions + 1;
          const attendedCount = attended ? c.attendedSessions + 1 : c.attendedSessions;
          return { ...c, attendedSessions: attendedCount, totalSessions: total };
        }
        return c;
      });
      saveToStorage('timetable', modified);
      return modified;
    });
  };

  // Assignments
  const [assignments, setAssignments] = useState<Assignment[]>(() =>
    loadFromStorage('assignments', initialAssignments)
  );
  const addAssignment = (asg: Omit<Assignment, 'id'>) => {
    setAssignments(prev => {
      const created: Assignment = { ...asg, id: `asg-${Date.now()}` };
      const updated = [created, ...prev];
      saveToStorage('assignments', updated);
      return updated;
    });
  };
  const updateAssignment = (id: string, updated: Partial<Assignment>) => {
    setAssignments(prev => {
      const modified = prev.map(a => (a.id === id ? { ...a, ...updated } : a));
      saveToStorage('assignments', modified);
      return modified;
    });
  };
  const deleteAssignment = (id: string) => {
    setAssignments(prev => {
      const filtered = prev.filter(a => a.id !== id);
      saveToStorage('assignments', filtered);
      return filtered;
    });
  };
  const toggleAssignmentBookmark = (id: string) => {
    setAssignments(prev => {
      const modified = prev.map(a => (a.id === id ? { ...a, isBookmarked: !a.isBookmarked } : a));
      saveToStorage('assignments', modified);
      return modified;
    });
  };
  const setAssignmentStatus = (id: string, status: AssignmentStatus) => {
    setAssignments(prev => {
      const modified = prev.map(a => (a.id === id ? { ...a, status } : a));
      saveToStorage('assignments', modified);
      return modified;
    });
  };
  const toggleTaskChecklist = (assignmentId: string, taskId: string) => {
    setAssignments(prev => {
      const modified = prev.map(a => {
        if (a.id === assignmentId && a.tasks) {
          const updatedTasks = a.tasks.map(t =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          );
          return { ...a, tasks: updatedTasks };
        }
        return a;
      });
      saveToStorage('assignments', modified);
      return modified;
    });
  };

  // Exams
  const [exams, setExams] = useState<Exam[]>(() => loadFromStorage('exams', initialExams));
  const addExam = (exam: Omit<Exam, 'id'>) => {
    setExams(prev => {
      const created: Exam = { ...exam, id: `ex-${Date.now()}` };
      const updated = [...prev, created];
      saveToStorage('exams', updated);
      return updated;
    });
  };
  const updateExam = (id: string, updated: Partial<Exam>) => {
    setExams(prev => {
      const modified = prev.map(e => (e.id === id ? { ...e, ...updated } : e));
      saveToStorage('exams', modified);
      return modified;
    });
  };
  const deleteExam = (id: string) => {
    setExams(prev => {
      const filtered = prev.filter(e => e.id !== id);
      saveToStorage('exams', filtered);
      return filtered;
    });
  };
  const updateExamReadiness = (id: string, readiness: number) => {
    setExams(prev => {
      const modified = prev.map(e =>
        e.id === id ? { ...e, readinessPercentage: Math.min(100, Math.max(0, readiness)) } : e
      );
      saveToStorage('exams', modified);
      return modified;
    });
  };

  // Notices
  const [notices, setNotices] = useState<Notice[]>(() =>
    loadFromStorage('notices', initialNotices)
  );
  const toggleNoticeRead = (id: string) => {
    setNotices(prev => {
      const modified = prev.map(n => (n.id === id ? { ...n, isRead: !n.isRead } : n));
      saveToStorage('notices', modified);
      return modified;
    });
  };
  const toggleNoticeBookmark = (id: string) => {
    setNotices(prev => {
      const modified = prev.map(n => (n.id === id ? { ...n, isBookmarked: !n.isBookmarked } : n));
      saveToStorage('notices', modified);
      return modified;
    });
  };
  const addNotice = (notice: Omit<Notice, 'id'>) => {
    setNotices(prev => {
      const created: Notice = { ...notice, id: `not-${Date.now()}` };
      const updated = [created, ...prev];
      saveToStorage('notices', updated);
      return updated;
    });
  };

  // Events
  const [events, setEvents] = useState<CampusEvent[]>(() =>
    loadFromStorage('events', initialEvents)
  );
  const toggleEventRsvp = (id: string) => {
    setEvents(prev => {
      const modified = prev.map(ev => {
        if (ev.id === id) {
          const registered = !ev.isRegistered;
          return {
            ...ev,
            isRegistered: registered,
            registeredCount: registered ? ev.registeredCount + 1 : ev.registeredCount - 1,
          };
        }
        return ev;
      });
      saveToStorage('events', modified);
      return modified;
    });
  };
  const toggleEventBookmark = (id: string) => {
    setEvents(prev => {
      const modified = prev.map(ev => (ev.id === id ? { ...ev, isBookmarked: !ev.isBookmarked } : ev));
      saveToStorage('events', modified);
      return modified;
    });
  };
  const addEvent = (event: Omit<CampusEvent, 'id'>) => {
    setEvents(prev => {
      const created: CampusEvent = { ...event, id: `ev-${Date.now()}` };
      const updated = [created, ...prev];
      saveToStorage('events', updated);
      return updated;
    });
  };

  // Resources
  const [resources, setResources] = useState<LearningResource[]>(() =>
    loadFromStorage('resources', initialResources)
  );
  const addResource = (res: Omit<LearningResource, 'id'>) => {
    setResources(prev => {
      const created: LearningResource = { ...res, id: `res-${Date.now()}` };
      const updated = [created, ...prev];
      saveToStorage('resources', updated);
      return updated;
    });
  };
  const toggleResourceBookmark = (id: string) => {
    setResources(prev => {
      const modified = prev.map(r => (r.id === id ? { ...r, isBookmarked: !r.isBookmarked } : r));
      saveToStorage('resources', modified);
      return modified;
    });
  };
  const deleteResource = (id: string) => {
    setResources(prev => {
      const filtered = prev.filter(r => r.id !== id);
      saveToStorage('resources', filtered);
      return filtered;
    });
  };

  // Study Sessions
  const [studySessions, setStudySessions] = useState<StudySession[]>(() =>
    loadFromStorage('studySessions', initialStudySessions)
  );
  const [weeklyStudyGoalHours, setWeeklyStudyGoalHoursState] = useState<number>(() =>
    loadFromStorage('studyGoalHours', 20)
  );
  const setWeeklyStudyGoalHours = (hrs: number) => {
    setWeeklyStudyGoalHoursState(hrs);
    saveToStorage('studyGoalHours', hrs);
  };
  const logStudySession = (session: Omit<StudySession, 'id'>) => {
    setStudySessions(prev => {
      const created: StudySession = { ...session, id: `ss-${Date.now()}` };
      const updated = [created, ...prev];
      saveToStorage('studySessions', updated);
      return updated;
    });
  };

  // Reset to default
  const resetToDefaultData = () => {
    setStudentProfile(initialStudentProfile);
    setTimetable(initialTimetable);
    setAssignments(initialAssignments);
    setExams(initialExams);
    setNotices(initialNotices);
    setEvents(initialEvents);
    setResources(initialResources);
    setStudySessions(initialStudySessions);
    setWeeklyStudyGoalHoursState(20);
    saveToStorage('profile', initialStudentProfile);
    saveToStorage('timetable', initialTimetable);
    saveToStorage('assignments', initialAssignments);
    saveToStorage('exams', initialExams);
    saveToStorage('notices', initialNotices);
    saveToStorage('events', initialEvents);
    saveToStorage('resources', initialResources);
    saveToStorage('studySessions', initialStudySessions);
    saveToStorage('studyGoalHours', 20);
  };

  // Calculated metrics
  const unreadNoticesCount = notices.filter(n => !n.isRead).length;
  const pendingAssignmentsCount = assignments.filter(
    a => a.status === 'Not Started' || a.status === 'In Progress'
  ).length;

  const totalAttended = timetable.reduce((acc, c) => acc + c.attendedSessions, 0);
  const totalClasses = timetable.reduce((acc, c) => acc + c.totalSessions, 0);
  const overallAttendancePercentage = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 100;

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <CampusContext.Provider
      value={{
        isDark,
        toggleTheme,
        activeTab,
        setActiveTab,
        searchModalOpen,
        setSearchModalOpen,
        studentProfile,
        updateStudentProfile,
        loginWithStudentId,
        isLoggedIn,
        logout,
        timetable,
        addClass,
        updateClass,
        deleteClass,
        logClassAttendance,
        assignments,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        toggleAssignmentBookmark,
        setAssignmentStatus,
        toggleTaskChecklist,
        exams,
        addExam,
        updateExam,
        deleteExam,
        updateExamReadiness,
        notices,
        toggleNoticeRead,
        toggleNoticeBookmark,
        addNotice,
        events,
        toggleEventRsvp,
        toggleEventBookmark,
        addEvent,
        resources,
        addResource,
        toggleResourceBookmark,
        deleteResource,
        studySessions,
        logStudySession,
        weeklyStudyGoalHours,
        setWeeklyStudyGoalHours,
        resetToDefaultData,
        unreadNoticesCount,
        pendingAssignmentsCount,
        overallAttendancePercentage,
      }}
    >
      {children}
    </CampusContext.Provider>
  );
};

export const useCampus = (): CampusContextType => {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
};
