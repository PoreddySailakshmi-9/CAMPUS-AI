import React, { useState, useMemo } from 'react';
import { useCampus } from '../context/CampusContext';
import { Assignment, AssignmentStatus, Priority } from '../types/campus';
import {
  CheckSquare,
  Plus,
  Bookmark,
  Calendar,
  Clock,
  Trash2,
  Edit2,
  CheckCircle,
  Filter,
  Check,
  Search,
  X,
  Layers,
  List,
} from 'lucide-react';

const STATUS_COLUMNS: AssignmentStatus[] = ['Not Started', 'In Progress', 'Submitted', 'Graded'];

export const AssignmentsView: React.FC = () => {
  const {
    assignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    toggleAssignmentBookmark,
    setAssignmentStatus,
    toggleTaskChecklist,
  } = useCampus();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('CS301');
  const [courseName, setCourseName] = useState('Distributed Systems & Microservices');
  const [dueDate, setDueDate] = useState('2026-10-15');
  const [dueTime, setDueTime] = useState('23:59');
  const [priority, setPriority] = useState<Priority>('High');
  const [status, setStatus] = useState<AssignmentStatus>('Not Started');
  const [weightage, setWeightage] = useState(15);
  const [description, setDescription] = useState('');

  // Unique courses for filter
  const uniqueCourses = useMemo(() => {
    return Array.from(new Set(assignments.map(a => a.courseCode)));
  }, [assignments]);

  const openAddModal = () => {
    setEditingAssignment(null);
    setTitle('');
    setCourseCode('CS301');
    setCourseName('Distributed Systems & Microservices');
    setDueDate('2026-10-20');
    setDueTime('23:59');
    setPriority('High');
    setStatus('In Progress');
    setWeightage(15);
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (a: Assignment) => {
    setEditingAssignment(a);
    setTitle(a.title);
    setCourseCode(a.courseCode);
    setCourseName(a.courseName);
    setDueDate(a.dueDate);
    setDueTime(a.dueTime);
    setPriority(a.priority);
    setStatus(a.status);
    setWeightage(a.weightage);
    setDescription(a.description);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingAssignment) {
      updateAssignment(editingAssignment.id, {
        title: title.trim(),
        courseCode: courseCode.trim().toUpperCase(),
        courseName: courseName.trim(),
        dueDate,
        dueTime,
        priority,
        status,
        weightage: Number(weightage),
        description: description.trim(),
      });
    } else {
      addAssignment({
        title: title.trim(),
        courseCode: courseCode.trim().toUpperCase(),
        courseName: courseName.trim(),
        dueDate,
        dueTime,
        priority,
        status,
        weightage: Number(weightage),
        description: description.trim(),
        isBookmarked: false,
        tasks: [
          { id: `t-${Date.now()}-1`, text: 'Initial research & literature review', completed: false },
          { id: `t-${Date.now()}-2`, text: 'Code implementation & local verification', completed: false },
          { id: `t-${Date.now()}-3`, text: 'Documentation & final submission check', completed: false },
        ],
      });
    }
    setIsModalOpen(false);
  };

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter(a => {
      const matchSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCourse = selectedCourse === 'All' || a.courseCode === selectedCourse;
      const matchPriority = selectedPriority === 'All' || a.priority === selectedPriority;
      const matchBookmark = !onlyBookmarked || a.isBookmarked;

      return matchSearch && matchCourse && matchPriority && matchBookmark;
    });
  }, [assignments, searchQuery, selectedCourse, selectedPriority, onlyBookmarked]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-amber-500" />
            Coursework & Assignments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track lab reports, algorithmic implementations, mid-term papers, and subtask milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Kanban / List segmented control */}
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Assignment</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search assignment or topic..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Course filter */}
          <div>
            <select
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="All">All Courses</option>
              {uniqueCourses.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Priority filter */}
          <div>
            <select
              value={selectedPriority}
              onChange={e => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Bookmarks toggle */}
          <div className="flex items-center">
            <button
              onClick={() => setOnlyBookmarked(prev => !prev)}
              className={`w-full py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                onlyBookmarked
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-current' : ''}`} />
              <span>Bookmarked Only</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main View: Kanban vs List */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {STATUS_COLUMNS.map(colStatus => {
            const colAssignments = filteredAssignments.filter(a => a.status === colStatus);

            return (
              <div
                key={colStatus}
                className="bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 flex flex-col min-h-[500px]"
              >
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      {colStatus}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {colAssignments.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colAssignments.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs italic">
                      No assignments
                    </div>
                  ) : (
                    colAssignments.map(asg => {
                      const completedTasks = asg.tasks?.filter(t => t.completed).length || 0;
                      const totalTasks = asg.tasks?.length || 0;

                      return (
                        <div
                          key={asg.id}
                          className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3.5 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition space-y-2.5"
                        >
                          {/* Header tags */}
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                              {asg.courseCode}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => toggleAssignmentBookmark(asg.id)}
                                className="text-slate-400 hover:text-amber-500 transition"
                              >
                                <Bookmark
                                  className={`w-3.5 h-3.5 ${
                                    asg.isBookmarked ? 'text-amber-500 fill-amber-500' : ''
                                  }`}
                                />
                              </button>
                              <button
                                onClick={() => openEditModal(asg)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteAssignment(asg.id)}
                                className="text-slate-400 hover:text-rose-500 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Title & Desc */}
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                              {asg.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                              {asg.description}
                            </p>
                          </div>

                          {/* Subtasks checklist */}
                          {asg.tasks && asg.tasks.length > 0 && (
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1">
                              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                                <span>Checklist Milestones</span>
                                <span>
                                  {completedTasks}/{totalTasks}
                                </span>
                              </div>
                              {asg.tasks.map(task => (
                                <button
                                  key={task.id}
                                  onClick={() => toggleTaskChecklist(asg.id, task.id)}
                                  className="w-full text-left flex items-start gap-1.5 group cursor-pointer"
                                >
                                  <div
                                    className={`w-3.5 h-3.5 mt-0.5 rounded border flex items-center justify-center shrink-0 transition ${
                                      task.completed
                                        ? 'bg-emerald-500 border-emerald-500 text-white'
                                        : 'border-slate-300 dark:border-slate-600 group-hover:border-slate-400'
                                    }`}
                                  >
                                    {task.completed && <Check className="w-2.5 h-2.5" />}
                                  </div>
                                  <span
                                    className={`text-[11px] leading-tight transition ${
                                      task.completed
                                        ? 'line-through text-slate-400 dark:text-slate-500'
                                        : 'text-slate-700 dark:text-slate-300'
                                    }`}
                                  >
                                    {task.text}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Footer with meta & status changer */}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                            <span className="flex items-center gap-1 font-mono">
                              <Calendar className="w-3 h-3" />
                              {asg.dueDate}
                            </span>
                            <span
                              className={`font-semibold ${
                                asg.priority === 'High'
                                  ? 'text-rose-500'
                                  : asg.priority === 'Medium'
                                  ? 'text-amber-500'
                                  : 'text-slate-400'
                              }`}
                            >
                              {asg.priority}
                            </span>
                          </div>

                          {/* Quick status select */}
                          <div className="pt-1">
                            <select
                              value={asg.status}
                              onChange={e =>
                                setAssignmentStatus(asg.id, e.target.value as AssignmentStatus)
                              }
                              className="w-full px-2 py-1 text-[11px] rounded bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                            >
                              {STATUS_COLUMNS.map(s => (
                                <option key={s} value={s}>
                                  Status: {s}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredAssignments.map(asg => (
              <div
                key={asg.id}
                className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {asg.courseCode}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                      {asg.title}
                    </h3>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        asg.status === 'Graded'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : asg.status === 'Submitted'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : asg.status === 'In Progress'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {asg.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">{asg.description}</p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                    <span>Due: {asg.dueDate} ({asg.dueTime})</span>
                    <span>·</span>
                    <span>Weightage: {asg.weightage}%</span>
                    {asg.grade && (
                      <>
                        <span>·</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          Grade: {asg.grade}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAssignmentBookmark(asg.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-amber-500 transition"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        asg.isBookmarked ? 'text-amber-500 fill-amber-500' : ''
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => openEditModal(asg)}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteAssignment(asg.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {editingAssignment ? 'Edit Assignment' : 'Add Course Assignment'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Raft Consensus Protocol Implementation"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                />
              </div>

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
                    Weightage (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={weightage}
                    onChange={e => setWeightage(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Due Time
                  </label>
                  <input
                    type="time"
                    value={dueTime}
                    onChange={e => setDueTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as AssignmentStatus)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    {STATUS_COLUMNS.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Description & Deliverable Requirements
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Outline the core deliverables, submission format, and constraints..."
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
                  {editingAssignment ? 'Save Changes' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
