import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  CreditCard,
  GraduationCap,
  ShieldCheck,
  QrCode,
  Download,
  Upload,
  RotateCcw,
  Sun,
  Moon,
  Mail,
  Building,
  Calendar,
  Award,
  KeyRound,
  Check,
  Copy,
} from 'lucide-react';

interface ProfileViewProps {
  onOpenSwitchLogin: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenSwitchLogin }) => {
  const {
    studentProfile,
    updateStudentProfile,
    isDark,
    toggleTheme,
    resetToDefaultData,
    timetable,
    assignments,
    exams,
    notices,
    events,
    resources,
    studySessions,
  } = useCampus();

  const [copied, setCopied] = useState(false);
  const [degreeInput, setDegreeInput] = useState(studentProfile.degree);
  const [majorInput, setMajorInput] = useState(studentProfile.major);
  const [deptInput, setDeptInput] = useState(studentProfile.department);
  const [emailInput, setEmailInput] = useState(studentProfile.officialEmail);
  const [libraryInput, setLibraryInput] = useState(studentProfile.libraryCardNo);
  const [branchInput, setBranchInput] = useState(studentProfile.campusBranch);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(studentProfile.studentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile({
      degree: degreeInput,
      major: majorInput,
      department: deptInput,
      officialEmail: emailInput,
      libraryCardNo: libraryInput,
      campusBranch: branchInput,
    });
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const handleExportBackup = () => {
    const backupData = {
      profile: studentProfile,
      timetable,
      assignments,
      exams,
      notices,
      events,
      resources,
      studySessions,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CampusAI_Student_${studentProfile.studentId}_backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-indigo-500" />
            Digital Student ID & Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Authenticated institutional credentials, digital campus card, and system data preferences.
          </p>
        </div>

        <button
          onClick={onOpenSwitchLogin}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition cursor-pointer self-start sm:self-auto border border-slate-200 dark:border-slate-700"
        >
          <KeyRound className="w-4 h-4" />
          <span>Switch Student ID</span>
        </button>
      </div>

      {/* Digital Smart Card Display (NO human photo, NO fake person name) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-2xl border border-indigo-500/30">
        {/* Holographic accent glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-white">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 block">
                    CampusAI Official Card
                  </span>
                  <span className="text-xs font-semibold text-slate-200">
                    Institutional Identity Credential
                  </span>
                </div>
              </div>

              {/* Verified badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Active · Enrolled</span>
              </div>
            </div>

            {/* Smart EMV Chip simulation & Student ID */}
            <div className="pt-2">
              <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-300 via-amber-200 to-yellow-400 border border-amber-400/50 mb-3 shadow-inner flex items-center justify-center">
                <div className="w-7 h-5 border border-amber-600/40 rounded-sm" />
              </div>

              <div className="flex items-baseline gap-3">
                <span className="font-mono text-2xl sm:text-3xl font-extrabold tracking-wider text-white">
                  {studentProfile.studentId}
                </span>
                <button
                  onClick={handleCopyId}
                  className="p-1 rounded text-slate-400 hover:text-white transition"
                  title="Copy Student ID"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-xs text-indigo-200 font-medium mt-1">
                {studentProfile.degree} — {studentProfile.major}
              </p>
            </div>

            {/* Meta row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 border-t border-white/10 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Academic Session
                </span>
                <span className="font-mono text-slate-200">{studentProfile.academicYear}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Current Term
                </span>
                <span className="font-mono text-slate-200">
                  Semester {studentProfile.currentSemester} (Honours)
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Library Code
                </span>
                <span className="font-mono text-slate-200">{studentProfile.libraryCardNo}</span>
              </div>
            </div>
          </div>

          {/* Right: QR Code and Barcode simulator */}
          <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shrink-0 self-center md:self-auto space-y-2">
            <div className="w-28 h-28 bg-white p-2 rounded-xl flex items-center justify-center shadow-md">
              <QrCode className="w-full h-full text-slate-900" />
            </div>
            <span className="font-mono text-[10px] text-slate-300">
              NFC · TAP AT TURNS
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile Information */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-500" />
            Academic Enrollment Details
          </h2>
          {savedNotification && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Profile updated
            </span>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Degree Program
              </label>
              <input
                type="text"
                value={degreeInput}
                onChange={e => setDegreeInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Major Discipline
              </label>
              <input
                type="text"
                value={majorInput}
                onChange={e => setMajorInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Faculty / Department
            </label>
            <input
              type="text"
              value={deptInput}
              onChange={e => setDeptInput(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Official Campus Email
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Library Card Barcode
              </label>
              <input
                type="text"
                value={libraryInput}
                onChange={e => setLibraryInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Campus Quadrangle
              </label>
              <input
                type="text"
                value={branchInput}
                onChange={e => setBranchInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              Update Academic Credentials
            </button>
          </div>
        </form>
      </div>

      {/* System Settings & Data Management */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Appearance & Interface */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Interface Theme
          </h3>
          <p className="text-xs text-slate-500">
            Switch between light and high-contrast dark mode for low-light library study sessions.
          </p>

          <button
            onClick={toggleTheme}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-xs font-semibold transition cursor-pointer"
          >
            <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
              {isDark ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>{isDark ? 'Dark Mode (Active)' : 'Light Mode (Active)'}</span>
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 text-[11px]">Toggle</span>
          </button>
        </div>

        {/* Data Backup & Factory Reset */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Data Portability & State
          </h3>
          <p className="text-xs text-slate-500">
            Export a certified JSON archive of all coursework, sessions, and timetables or reset demo state.
          </p>

          <div className="flex gap-2">
            <button
              onClick={handleExportBackup}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Reset all student data to factory institutional demo defaults?')) {
                  resetToDefaultData();
                }
              }}
              className="py-2 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
