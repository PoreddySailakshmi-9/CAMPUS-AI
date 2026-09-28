import React, { useState, useMemo } from 'react';
import { useCampus } from '../context/CampusContext';
import { TimetableClass, DayOfWeek, ClassType } from '../types/campus';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Filter,
  UserCheck,
  X,
  BookOpen,
} from 'lucide-react';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const TimetableView: React.FC = () => {
  const { timetable, addClass, updateClass, deleteClass, logClassAttendance } = useCampus();

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<TimetableClass | null>(null);

  // Form states
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [type, setType] = useState<ClassType>('Lecture');
  const [day, setDay] = useState<DayOfWeek>('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [room, setRoom] = useState('');
  const [instructorTitle, setInstructorTitle] = useState('');
  const [credits, setCredits] = useState(3);

  const openAddModal = () => {
    setEditingClass(null);
    setCourseCode('');
    setCourseName('');
    setType('Lecture');
    setDay(selectedDay);
    setStartTime('09:00');
    setEndTime('10:30');
    setRoom('Lecture Hall 201');
    setInstructorTitle('Faculty in Computing');
    setCredits(3);
    setIsModalOpen(true);
  };

  const openEditModal = (c: TimetableClass) => {
    setEditingClass(c);
    setCourseCode(c.courseCode);
    setCourseName(c.courseName);
    setType(c.type);
    setDay(c.day);
    setStartTime(c.startTime);
    setEndTime(c.endTime);
    setRoom(c.room);
    setInstructorTitle(c.instructorTitle);
    setCredits(c.credits);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim() || !courseName.trim()) return;

    if (editingClass) {
      updateClass(editingClass.id, {
        courseCode: courseCode.trim().toUpperCase(),
        courseName: courseName.trim(),
        type,
        day,
        startTime,
        endTime,
        room: room.trim(),
        instructorTitle: instructorTitle.trim(),
        credits: Number(credits),
      });
    } else {
      addClass({
        courseCode: courseCode.trim().toUpperCase(),
        courseName: courseName.trim(),
        type,
        day,
        startTime,
        endTime,
        room: room.trim(),
        instructorTitle: instructorTitle.trim(),
        credits: Number(credits),
        attendedSessions: 0,
        totalSessions: 0,
        color: type === 'Lab' ? 'blue' : type === 'Lecture' ? 'emerald' : 'rose',
      });
    }
    setIsModalOpen(false);
  };

  // Filtered classes
  const filteredClasses = useMemo(() => {
    return timetable.filter(c => {
      const matchType = filterType === 'All' || c.type === filterType;
      const matchSearch =
        c.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.room.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [timetable, filterType, searchQuery]);

  const classesForDay = useMemo(() => {
    return filteredClasses
      .filter(c => c.day === selectedDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [filteredClasses, selectedDay]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Class Timetable & Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Weekly lecture schedules, laboratory sessions, room locations, and attendance check-in.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Day / Week segmented toggle */}
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center text-xs">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                viewMode === 'day'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Day View
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Week Grid
            </button>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class</span>
          </button>
        </div>
      </div>

      {/* Filter and Day Selector Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-4">
        {/* Day selector buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {DAYS.map(d => {
            const count = timetable.filter(c => c.day === d).length;
            const isSelected = selectedDay === d;

            return (
              <button
                key={d}
                onClick={() => {
                  setSelectedDay(d);
                  setViewMode('day');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                <span>{d}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-indigo-700 text-indigo-100'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Type:
            </span>
            {['All', 'Lecture', 'Lab', 'Tutorial', 'Seminar'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  filterType === t
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search code, course, room..."
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content: Day View or Week Grid */}
      {viewMode === 'day' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>Schedule for {selectedDay} ({classesForDay.length} sessions)</span>
            <span>Institutional 75% Attendance Track</span>
          </div>

          {classesForDay.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500">
              <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">No classes scheduled for {selectedDay}</p>
              <p className="text-xs text-slate-400 mt-1">
                You can add a lecture or lab session using the "Add Class" button above.
              </p>
            </div>
          ) : (
            classesForDay.map(item => {
              const attendanceRate =
                item.totalSessions > 0
                  ? Math.round((item.attendedSessions / item.totalSessions) * 100)
                  : 100;

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Time slot badge */}
                    <div className="w-20 text-center py-2 px-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                      <span className="block font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                        {item.startTime}
                      </span>
                      <span className="block text-[11px] text-slate-400 mt-0.5 font-mono">
                        {item.endTime}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {item.courseCode}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {item.courseName}
                        </h3>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {item.type}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {item.room}
                        </span>
                        <span>·</span>
                        <span>{item.instructorTitle}</span>
                        <span>·</span>
                        <span>{item.credits} Credits</span>
                      </div>

                      {/* Attendance indicator */}
                      <div className="flex items-center gap-2 pt-1 text-[11px]">
                        <span className="text-slate-400">Attendance:</span>
                        <span
                          className={`font-mono font-bold ${
                            attendanceRate >= 75 ? 'text-emerald-500' : 'text-rose-500'
                          }`}
                        >
                          {attendanceRate}% ({item.attendedSessions}/{item.totalSessions} sessions)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => logClassAttendance(item.id, true)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition flex items-center gap-1 cursor-pointer"
                      title="Mark as present"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Present</span>
                    </button>
                    <button
                      onClick={() => logClassAttendance(item.id, false)}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 transition flex items-center gap-1 cursor-pointer"
                      title="Mark as absent"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Absent</span>
                    </button>
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="Edit class details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteClass(item.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                      title="Remove class"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Week Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAYS.slice(0, 5).map(dayName => {
            const dayClasses = filteredClasses
              .filter(c => c.day === dayName)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <div
                key={dayName}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    {dayName}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {dayClasses.length} Sessions
                  </span>
                </div>

                <div className="space-y-2">
                  {dayClasses.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">No sessions</p>
                  ) : (
                    dayClasses.map(c => (
                      <div
                        key={c.id}
                        className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 text-xs space-y-1 hover:border-slate-300 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {c.courseCode}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {c.startTime} - {c.endTime}
                          </span>
                        </div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {c.courseName}
                        </p>
                        <div className="text-[10px] text-slate-400 flex items-center justify-between">
                          <span>{c.room}</span>
                          <span>{c.type}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {editingClass ? 'Edit Timetable Session' : 'Add New Timetable Session'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={courseCode}
                    onChange={e => setCourseCode(e.target.value)}
                    placeholder="e.g. CS301"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Session Type
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as ClassType)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Lab</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="Seminar">Seminar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  value={courseName}
                  onChange={e => setCourseName(e.target.value)}
                  placeholder="e.g. Distributed Systems & Microservices"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Day
                  </label>
                  <select
                    value={day}
                    onChange={e => setDay(e.target.value as DayOfWeek)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    {DAYS.map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Room / Hall
                  </label>
                  <input
                    type="text"
                    value={room}
                    onChange={e => setRoom(e.target.value)}
                    placeholder="e.g. Hall 302 (Computing Wing)"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Credits
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={credits}
                    onChange={e => setCredits(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Instructor Designation
                </label>
                <input
                  type="text"
                  value={instructorTitle}
                  onChange={e => setInstructorTitle(e.target.value)}
                  placeholder="e.g. Prof. Chair of Distributed Systems"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  {editingClass ? 'Save Changes' : 'Create Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
