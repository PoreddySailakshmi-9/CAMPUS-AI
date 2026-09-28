import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { Exam } from '../types/campus';
import {
  Clock,
  Plus,
  Trash2,
  Edit2,
  MapPin,
  Calendar,
  AlertCircle,
  FileCheck,
  X,
  ShieldAlert,
} from 'lucide-react';

export const ExamsView: React.FC = () => {
  const { exams, addExam, updateExam, deleteExam, updateExamReadiness } = useCampus();

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  // Form states
  const [courseCode, setCourseCode] = useState('CS301');
  const [courseName, setCourseName] = useState('Distributed Systems & Microservices');
  const [examType, setExamType] = useState<Exam['examType']>('Midterm');
  const [date, setDate] = useState('2026-10-18');
  const [time, setTime] = useState('09:30 AM - 12:30 PM');
  const [hall, setHall] = useState('Grand Examination Hall 1');
  const [seatBlock, setSeatBlock] = useState('Row D · Desk 14');
  const [weightage, setWeightage] = useState(30);
  const [readinessPercentage, setReadinessPercentage] = useState(70);
  const [topicsInput, setTopicsInput] = useState('Clock synchronization, Consensus & Raft, 2PC vs 3PC');

  const openAddModal = () => {
    setEditingExam(null);
    setCourseCode('CS301');
    setCourseName('Distributed Systems & Microservices');
    setExamType('Midterm');
    setDate('2026-10-18');
    setTime('09:30 AM - 12:30 PM');
    setHall('Grand Examination Hall 1');
    setSeatBlock('Row D · Desk 14');
    setWeightage(30);
    setReadinessPercentage(70);
    setTopicsInput('Clock synchronization, Consensus & Raft, 2PC vs 3PC');
    setIsModalOpen(true);
  };

  const openEditModal = (e: Exam) => {
    setEditingExam(e);
    setCourseCode(e.courseCode);
    setCourseName(e.courseName);
    setExamType(e.examType);
    setDate(e.date);
    setTime(e.time);
    setHall(e.hall);
    setSeatBlock(e.seatBlock);
    setWeightage(e.weightage);
    setReadinessPercentage(e.readinessPercentage);
    setTopicsInput(e.syllabusTopics.join(', '));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const syllabusTopics = topicsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (editingExam) {
      updateExam(editingExam.id, {
        courseCode: courseCode.trim().toUpperCase(),
        courseName: courseName.trim(),
        examType,
        date,
        time,
        hall: hall.trim(),
        seatBlock: seatBlock.trim(),
        weightage: Number(weightage),
        readinessPercentage: Number(readinessPercentage),
        syllabusTopics,
      });
    } else {
      addExam({
        courseCode: courseCode.trim().toUpperCase(),
        courseName: courseName.trim(),
        examType,
        date,
        time,
        hall: hall.trim(),
        seatBlock: seatBlock.trim(),
        weightage: Number(weightage),
        readinessPercentage: Number(readinessPercentage),
        syllabusTopics,
      });
    }
    setIsModalOpen(false);
  };

  const calculateDaysLeft = (examDateStr: string) => {
    const diff = new Date(examDateStr).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-rose-500" />
            Exams & Assessment Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Midterm & final evaluations, seating allotments, syllabus readiness, and countdowns.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Assessment</span>
        </button>
      </div>

      {/* Guidelines Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 dark:text-amber-200 space-y-0.5">
          <p className="font-bold">Institutional Examination Protocols</p>
          <p className="text-amber-800/90 dark:text-amber-300/80">
            Entry to examination halls requires physical verification of your official Student ID card.
            Arrive 15 minutes before scheduled start time. Scientific calculators permitted per syllabus spec.
          </p>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {exams.map(exam => {
          const daysLeft = calculateDaysLeft(exam.date);

          return (
            <div
              key={exam.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between space-y-4"
            >
              {/* Card top */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
                      {exam.courseCode}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                      {exam.examType}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(exam)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                      title="Edit exam"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteExam(exam.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Delete exam"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {exam.courseName}
                </h3>

                {/* Date & Time pill */}
                <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {exam.date}
                    </span>
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                      {daysLeft === 0 ? 'Today!' : `${daysLeft} Days Left`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {exam.time}
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Weight: {exam.weightage}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {exam.hall}
                    </span>
                    <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
                      {exam.seatBlock}
                    </span>
                  </div>
                </div>

                {/* Syllabus Modules list */}
                {exam.syllabusTopics && exam.syllabusTopics.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Syllabus Coverage
                    </span>
                    <ul className="space-y-1">
                      {exam.syllabusTopics.map((topic, i) => (
                        <li
                          key={i}
                          className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5"
                        >
                          <FileCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Readiness Slider */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1.5">
                  <span className="font-semibold">Preparation Readiness</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {exam.readinessPercentage}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={exam.readinessPercentage}
                  onChange={e => updateExamReadiness(exam.id, Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Exam Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {editingExam ? 'Edit Examination' : 'Schedule Assessment'}
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
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Assessment Type
                  </label>
                  <select
                    value={examType}
                    onChange={e => setExamType(e.target.value as Exam['examType'])}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    <option value="Midterm">Midterm Examination</option>
                    <option value="Final">Final Examination</option>
                    <option value="Lab Practical">Lab Practical</option>
                    <option value="Quiz">Graded Quiz</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  value={courseName}
                  onChange={e => setCourseName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Time Window
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    placeholder="e.g. 09:30 AM - 12:30 PM"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Exam Hall
                  </label>
                  <input
                    type="text"
                    value={hall}
                    onChange={e => setHall(e.target.value)}
                    placeholder="Hall 404"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Seat Block
                  </label>
                  <input
                    type="text"
                    value={seatBlock}
                    onChange={e => setSeatBlock(e.target.value)}
                    placeholder="Row B · Desk 08"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Weightage (%)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={weightage}
                    onChange={e => setWeightage(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Syllabus Topics (comma-separated)
                </label>
                <input
                  type="text"
                  value={topicsInput}
                  onChange={e => setTopicsInput(e.target.value)}
                  placeholder="e.g. Distributed algorithms, Paxos, Chandy-Lamport"
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
                  {editingExam ? 'Save Changes' : 'Schedule Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
