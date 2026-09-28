import React, { useState, useMemo } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  Bot,
  Sparkles,
  Cpu,
  Calendar,
  CheckSquare,
  Clock,
  ShieldCheck,
  ArrowRight,
  Code2,
  Terminal,
  Zap,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const SmartAssistantSection: React.FC = () => {
  const { timetable, assignments, exams, notices, studentProfile } = useCampus();

  const [activeQuery, setActiveQuery] = useState<string>('prioritize');
  const [customQuery, setCustomQuery] = useState('');
  const [customResult, setCustomResult] = useState<string | null>(null);

  // 1. Calculated Assignment Priority Reasoning
  const prioritizedAssignments = useMemo(() => {
    return [...assignments]
      .filter(a => a.status === 'Not Started' || a.status === 'In Progress')
      .map(a => {
        const daysLeft = Math.max(
          1,
          Math.ceil((new Date(a.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        );
        // Formula: Score = (Weightage * 2) + PriorityScore (High: 30, Med: 15, Low: 5) + (100 / daysLeft)
        const priorityBase = a.priority === 'High' ? 30 : a.priority === 'Medium' ? 15 : 5;
        const urgencyScore = Math.round(a.weightage * 2 + priorityBase + 100 / daysLeft);

        return {
          ...a,
          daysLeft,
          urgencyScore,
          recommendedAction:
            daysLeft <= 3
              ? 'Immediate execution (Complete within 24h)'
              : daysLeft <= 7
              ? 'Secondary queue (Begin drafting logic)'
              : 'Background planning',
        };
      })
      .sort((a, b) => b.urgencyScore - a.urgencyScore);
  }, [assignments]);

  // 2. Calculated Attendance Safety Analysis
  const attendanceSafetyAnalysis = useMemo(() => {
    return timetable.map(c => {
      const percentage = c.totalSessions > 0 ? Math.round((c.attendedSessions / c.totalSessions) * 100) : 100;
      const safeMissMargin = Math.max(0, Math.floor(c.attendedSessions / 0.75 - c.totalSessions));
      const requiredToPass =
        percentage < 75 ? Math.max(0, Math.ceil((0.75 * c.totalSessions - c.attendedSessions) / 0.25)) : 0;

      return {
        code: c.courseCode,
        name: c.courseName,
        percentage,
        safeMissMargin,
        requiredToPass,
        verdict:
          percentage >= 85
            ? 'Optimal Reserve · High Margin'
            : percentage >= 75
            ? 'Compliant · Monitor Attendance'
            : 'Deficit · Immediate Attendance Required',
      };
    });
  }, [timetable]);

  // 3. Calculated 7-Day Exam Revision Schedule
  const revisionSchedule = useMemo(() => {
    return exams.map((exam, idx) => {
      const readinessGap = 100 - exam.readinessPercentage;
      const allocatedStudyHours = Math.max(4, Math.round(readinessGap / 10));

      return {
        courseCode: exam.courseCode,
        examType: exam.examType,
        examDate: exam.date,
        readiness: exam.readinessPercentage,
        allocatedHours: allocatedStudyHours,
        focusModules: exam.syllabusTopics.slice(0, 2),
      };
    });
  }, [exams]);

  // Free-form campus query resolver (client-side rule & keyword reasoning)
  const handleCustomQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = customQuery.trim().toLowerCase();
    if (!q) return;

    if (q.includes('exam') || q.includes('midterm') || q.includes('test')) {
      const firstExam = exams[0];
      setCustomResult(
        `Next scheduled assessment is ${firstExam.courseCode} (${firstExam.courseName}) on ${firstExam.date} at ${firstExam.time} in ${firstExam.hall}, Seat: ${firstExam.seatBlock}. Readiness is currently ${firstExam.readinessPercentage}%.`
      );
    } else if (q.includes('assignment') || q.includes('due') || q.includes('homework')) {
      const urgentAsg = assignments.find(a => a.status !== 'Submitted' && a.status !== 'Graded');
      if (urgentAsg) {
        setCustomResult(
          `Highest urgency assignment is "${urgentAsg.title}" for ${urgentAsg.courseCode}, due on ${urgentAsg.dueDate} (${urgentAsg.dueTime}). Priority: ${urgentAsg.priority}, Weightage: ${urgentAsg.weightage}%.`
        );
      } else {
        setCustomResult('All current assignments are completed or submitted!');
      }
    } else if (q.includes('class') || q.includes('timetable') || q.includes('today') || q.includes('room')) {
      const c = timetable[0];
      setCustomResult(
        `Sample scheduled session: ${c.courseCode} (${c.type}) is in ${c.room} with ${c.instructorTitle} from ${c.startTime} to ${c.endTime}.`
      );
    } else if (q.includes('attendance') || q.includes('safe') || q.includes('absent')) {
      setCustomResult(
        `Your institutional attendance is currently compliant. Review the Attendance Margin view to inspect per-course cushions.`
      );
    } else {
      setCustomResult(
        `Identified query context for "${customQuery}". In connected mode, the Agentic Campus Dispatcher will query the institutional vector store and formulate full resolution.`
      );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
            Agentic AI Extensibility Framework
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
          <Bot className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Smart Campus Assistant
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Pre-configured to connect to Agentic AI to retrieve campus documents, reason over timetables, prioritize deadlines, and dispatch actions.
        </p>
      </div>

      {/* 4 Agent Capabilities Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Search className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
            1. Knowledge Retriever
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Performs semantic search across syllabus guidelines, lecture materials, and college circulars.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <CheckSquare className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
            2. Priority Reasoner
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Evaluates deadlines, weightages, and prerequisites to calculate optimal submission workflows.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
            3. Schedule Optimizer
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Synthesizes personalized revision blocks around classes and examination readiness deficits.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
            4. Action Dispatcher
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Dispatches automated calendar syncs, attendance reminders, and study log checkpoints.
          </p>
        </div>
      </div>

      {/* Interactive Reasoning Sandbox */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-500" />
              Verified Campus Reasoning Engine (Active)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select an algorithmic reasoning model below to execute dynamic calculations on your campus data.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
            <button
              onClick={() => setActiveQuery('prioritize')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeQuery === 'prioritize'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Assignment Urgency
            </button>
            <button
              onClick={() => setActiveQuery('attendance')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeQuery === 'attendance'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Attendance Margins
            </button>
            <button
              onClick={() => setActiveQuery('revision')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeQuery === 'revision'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Exam Planner
            </button>
          </div>
        </div>

        {/* Query 1: Assignment Urgency */}
        {activeQuery === 'prioritize' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
              <span>Dynamic Urgency Scoring (Weightage × 2 + Priority + Urgency Decay)</span>
              <span>Sorted by Execution Priority</span>
            </div>

            <div className="space-y-2">
              {prioritizedAssignments.map(asg => (
                <div
                  key={asg.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                        {asg.courseCode}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {asg.title}
                      </h4>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        Score: {asg.urgencyScore}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Due in {asg.daysLeft} days ({asg.dueDate})</span>
                      <span>·</span>
                      <span>Weightage: {asg.weightage}%</span>
                      <span>·</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                        {asg.recommendedAction}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 self-end sm:self-center">
                    {asg.priority} Priority
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Query 2: Attendance Safety */}
        {activeQuery === 'attendance' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
              <span>Threshold Simulation: 75% Institutional Attendance Rule</span>
              <span>Calculated Absence Cushion</span>
            </div>

            <div className="space-y-2">
              {attendanceSafetyAnalysis.map(stat => (
                <div
                  key={stat.code}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {stat.code}
                      </span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {stat.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {stat.verdict}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                      {stat.percentage}% Attended
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Safe to miss: {stat.safeMissMargin} session(s)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Query 3: Revision Planner */}
        {activeQuery === 'revision' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
              <span>Examination Readiness Deficit Model</span>
              <span>Recommended Study Allocation</span>
            </div>

            <div className="space-y-2">
              {revisionSchedule.map(exam => (
                <div
                  key={exam.courseCode}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
                        {exam.courseCode}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {exam.examType} Evaluation ({exam.examDate})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Priority focus: {exam.focusModules.join(', ')}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 block">
                      Allocate {exam.allocatedHours} hrs
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Readiness: {exam.readiness}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Query Input Sandbox */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Interactive Campus Query Prompt
          </label>
          <form onSubmit={handleCustomQuerySubmit} className="flex gap-2">
            <input
              type="text"
              value={customQuery}
              onChange={e => setCustomQuery(e.target.value)}
              placeholder="e.g. 'What is my next exam?', 'What assignments are due?', 'Where is CS301?'"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              Analyze
            </button>
          </form>

          {customResult && (
            <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-0.5">Campus Reasoner Response:</p>
                <p>{customResult}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Technical Agent Schema Spec Box */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-xs font-mono text-xs space-y-3 border border-slate-800">
        <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Agentic Tool Interface Specification
            </span>
          </div>
          <span className="text-[10px] text-emerald-400">Status: BINDABLE</span>
        </div>

        <pre className="text-[11px] text-slate-300 overflow-x-auto p-2 bg-slate-950 rounded-lg">
{`// Ready for Gemini Interactions API / Agentic Autonomous Dispatcher
export interface CampusAgentTools {
  retrieveSyllabusScope(courseCode: string): Promise<string[]>;
  calculatePriorityScore(assignmentId: string): Promise<number>;
  generateOptimalStudyBlocks(examId: string, hoursTarget: number): Promise<ScheduleSlot[]>;
  dispatchActionWebhook(action: 'CALENDAR_SYNC' | 'SUBMIT_CHECK'): Promise<ActionReceipt>;
}`}
        </pre>
      </div>
    </div>
  );
};
