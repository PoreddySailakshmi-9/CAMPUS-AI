import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { GraduationCap, ArrowRight, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginWithStudentId, studentProfile, updateStudentProfile } = useCampus();
  const [studentIdInput, setStudentIdInput] = useState(studentProfile.studentId || 'STU-2026-9041');
  const [departmentInput, setDepartmentInput] = useState(studentProfile.department || 'Faculty of Computing & Information Systems');
  const [semesterInput, setSemesterInput] = useState(studentProfile.currentSemester || 6);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentIdInput.trim()) return;
    loginWithStudentId(studentIdInput.trim());
    updateStudentProfile({
      department: departmentInput,
      currentSemester: Number(semesterInput),
      officialEmail: `${studentIdInput.toLowerCase().replace(/[^a-z0-9]/g, '')}@campus.edu`,
    });
    if (onClose) onClose();
  };

  const handleQuickDemo = (id: string, dept: string, sem: number) => {
    setStudentIdInput(id);
    setDepartmentInput(dept);
    setSemesterInput(sem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 relative">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 mb-3 shadow-inner">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            CampusAI Student Portal
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Authenticate using your official Student Identity credentials
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Student ID Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={studentIdInput}
                onChange={e => setStudentIdInput(e.target.value.toUpperCase())}
                placeholder="e.g. STU-2026-9041"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-400 transition"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Format: Standard matriculation code or alphanumeric ID
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Department / Faculty
            </label>
            <select
              value={departmentInput}
              onChange={e => setDepartmentInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-400 transition"
            >
              <option value="Faculty of Computing & Information Systems">Faculty of Computing & Information Systems</option>
              <option value="Department of Electrical & Electronic Engineering">Department of Electrical & Electronic Engineering</option>
              <option value="Department of Mechanical & Robotics Sciences">Department of Mechanical & Robotics Sciences</option>
              <option value="School of Mathematical & Computational Sciences">School of Mathematical & Computational Sciences</option>
              <option value="Faculty of Biomedical Engineering">Faculty of Biomedical Engineering</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Current Semester
              </label>
              <select
                value={semesterInput}
                onChange={e => setSemesterInput(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-400 transition"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Campus Realm
              </label>
              <div className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 h-[42px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">Main Quad · Verified</span>
              </div>
            </div>
          </div>

          {/* Quick presets */}
          <div className="pt-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-2">
              Quick demo IDs:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('STU-2026-9041', 'Faculty of Computing & Information Systems', 6)}
                className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                STU-2026-9041 (Sem 6)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('STU-2026-3814', 'Department of Electrical & Electronic Engineering', 4)}
                className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                STU-2026-3814 (Sem 4)
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm transition shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <span>Access Student Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Integrated Single Sign-On for campus systems</span>
        </div>
      </div>
    </div>
  );
};
