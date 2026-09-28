import React, { useState, useMemo } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  TrendingUp,
  Award,
  ShieldCheck,
  AlertTriangle,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Calculator,
  Layers,
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { studentProfile, updateStudentProfile, timetable, overallAttendancePercentage } = useCampus();

  // Simulated Grade Points for current courses
  const GRADE_SCALE: Record<string, number> = {
    'A+': 4.0,
    A: 4.0,
    'A-': 3.7,
    'B+': 3.3,
    B: 3.0,
    'B-': 2.7,
    'C+': 2.3,
    C: 2.0,
  };

  // Unique enrolled courses from timetable
  const uniqueEnrolledCourses = useMemo(() => {
    const map = new Map<string, { code: string; name: string; credits: number }>();
    timetable.forEach(c => {
      if (!map.has(c.courseCode)) {
        map.set(c.courseCode, {
          code: c.courseCode,
          name: c.courseName,
          credits: c.credits,
        });
      }
    });
    return Array.from(map.values());
  }, [timetable]);

  // Projected grade per course
  const [projectedGrades, setProjectedGrades] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    uniqueEnrolledCourses.forEach(c => {
      initial[c.code] = 'A';
    });
    return initial;
  });

  const handleGradeChange = (code: string, grade: string) => {
    setProjectedGrades(prev => ({ ...prev, [code]: grade }));
  };

  // Calculate simulated semester GPA
  const simulatedSemesterGpa = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;

    uniqueEnrolledCourses.forEach(c => {
      const g = projectedGrades[c.code] || 'A';
      const pts = GRADE_SCALE[g] || 4.0;
      totalPoints += pts * c.credits;
      totalCredits += c.credits;
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '3.85';
  }, [uniqueEnrolledCourses, projectedGrades]);

  // Projected cumulative CGPA
  const projectedCumulativeGpa = useMemo(() => {
    const currentCredits = studentProfile.earnedCredits;
    const currentGpa = studentProfile.cgpa;
    const currentPoints = currentCredits * currentGpa;

    let semPoints = 0;
    let semCredits = 0;
    uniqueEnrolledCourses.forEach(c => {
      const g = projectedGrades[c.code] || 'A';
      const pts = GRADE_SCALE[g] || 4.0;
      semPoints += pts * c.credits;
      semCredits += c.credits;
    });

    const newTotalCredits = currentCredits + semCredits;
    const newTotalPoints = currentPoints + semPoints;

    return newTotalCredits > 0 ? (newTotalPoints / newTotalCredits).toFixed(2) : currentGpa.toFixed(2);
  }, [studentProfile, uniqueEnrolledCourses, projectedGrades]);

  // Calculate attendance margins for each course
  const courseAttendanceStats = useMemo(() => {
    const map = new Map<string, { attended: number; total: number; name: string }>();

    timetable.forEach(c => {
      const current = map.get(c.courseCode) || { attended: 0, total: 0, name: c.courseName };
      map.set(c.courseCode, {
        attended: current.attended + c.attendedSessions,
        total: current.total + c.totalSessions,
        name: c.courseName,
      });
    });

    return Array.from(map.entries()).map(([code, stats]) => {
      const percentage = stats.total > 0 ? Math.round((stats.attended / stats.total) * 100) : 100;
      // How many can safely miss: (attended) / (total + x) >= 0.75 => x <= (attended / 0.75) - total
      const maxCanMiss = Math.max(0, Math.floor(stats.attended / 0.75 - stats.total));
      // If below 75%, how many to attend: (attended + y) / (total + y) >= 0.75 => y >= (0.75*total - attended) / 0.25
      const needToAttend =
        percentage < 75 ? Math.max(0, Math.ceil((0.75 * stats.total - stats.attended) / 0.25)) : 0;

      return {
        code,
        name: stats.name,
        attended: stats.attended,
        total: stats.total,
        percentage,
        maxCanMiss,
        needToAttend,
      };
    });
  }, [timetable]);

  const degreePercentage = Math.round(
    (studentProfile.earnedCredits / studentProfile.totalDegreeCredits) * 100
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
          <TrendingUp className="w-6 h-6 text-indigo-500" />
          Academic Progress & Performance Metrics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          CGPA trajectory simulation, institutional 75% attendance threshold monitoring, and credit audits.
        </p>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Cumulative GPA Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Current CGPA
            </span>
            <Award className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
              {studentProfile.cgpa.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 4.00 Max</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            Top 5% Cohort · First Class Honours Standing
          </p>
        </div>

        {/* Attendance Compliance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Campus Attendance
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
              {overallAttendancePercentage}%
            </span>
            <span className="text-xs text-slate-400">Average</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            Compliant with minimum 75% semester regulation
          </p>
        </div>

        {/* Degree Credits */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Degree Credits
            </span>
            <GraduationCap className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
              {studentProfile.earnedCredits}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              / {studentProfile.totalDegreeCredits} Total
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${degreePercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {degreePercentage}% curriculum completed (Semester {studentProfile.currentSemester} of 8)
          </p>
        </div>
      </div>

      {/* GPA Simulator Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-500" />
              Interactive Semester GPA Simulator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Adjust your target letter grades below to preview the impact on your Semester GPA and cumulative CGPA.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Simulated Term GPA
              </span>
              <span className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">
                {simulatedSemesterGpa}
              </span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 text-center">
              <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-300 block">
                Projected CGPA
              </span>
              <span className="text-sm font-bold font-mono text-indigo-700 dark:text-indigo-300">
                {projectedCumulativeGpa}
              </span>
            </div>
          </div>
        </div>

        {/* Grade adjustment table */}
        <div className="space-y-3">
          {uniqueEnrolledCourses.map(course => (
            <div
              key={course.code}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {course.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {course.name}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {course.credits} Credits · Autumn 2026 Core Module
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-medium">Target Grade:</span>
                <select
                  value={projectedGrades[course.code] || 'A'}
                  onChange={e => handleGradeChange(course.code, e.target.value)}
                  className="px-3 py-1.5 text-xs font-bold font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  {Object.keys(GRADE_SCALE).map(grade => (
                    <option key={grade} value={grade}>
                      {grade} ({GRADE_SCALE[grade].toFixed(1)})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Compliance & Safety Margin Tracker */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Course Attendance Compliance & Absence Margin Safety
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Institutional minimum is 75% attendance to qualify for semester final examinations.
          </p>
        </div>

        <div className="space-y-3">
          {courseAttendanceStats.map(stat => {
            const isSafe = stat.percentage >= 75;

            return (
              <div
                key={stat.code}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 mr-2">
                      {stat.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {stat.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        isSafe
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {stat.percentage}% Attended
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      ({stat.attended}/{stat.total} Sessions)
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stat.percentage >= 80
                        ? 'bg-emerald-500'
                        : stat.percentage >= 75
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, stat.percentage)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  {isSafe ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Safe margin: You can miss up to {stat.maxCanMiss} more session(s) while staying above 75%.
                    </span>
                  ) : (
                    <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Action required: Must attend next {stat.needToAttend} consecutive session(s) to reach 75%.
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
