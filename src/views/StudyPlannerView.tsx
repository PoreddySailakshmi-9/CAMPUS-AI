import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Plus,
  Flame,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const StudyPlannerView: React.FC = () => {
  const {
    studySessions,
    logStudySession,
    weeklyStudyGoalHours,
    setWeeklyStudyGoalHours,
    timetable,
  } = useCampus();

  // Pomodoro states
  const [timerMode, setTimerMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // 25 mins
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Quick log session form
  const [logCourse, setLogCourse] = useState('CS301');
  const [logDuration, setLogDuration] = useState(45);
  const [logTopics, setLogTopics] = useState('');
  const [logRating, setLogRating] = useState<1 | 2 | 3 | 4 | 5>(4);

  // Play audio chime via Web Audio API
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch {
      // AudioContext unavailable or blocked
    }
  };

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            playBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, soundEnabled]);

  const switchMode = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false);
    setTimerMode(mode);
    if (mode === 'focus') setTimeLeft(25 * 60);
    else if (mode === 'shortBreak') setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (timerMode === 'focus') setTimeLeft(25 * 60);
    else if (timerMode === 'shortBreak') setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Unique course codes
  const uniqueCourses = useMemo(() => {
    return Array.from(new Set(timetable.map(t => t.courseCode)));
  }, [timetable]);

  // Total study minutes this week
  const totalMinutes = useMemo(() => {
    return studySessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  }, [studySessions]);

  const totalHours = (totalMinutes / 60).toFixed(1);
  const goalProgress = Math.min(100, Math.round(((totalMinutes / 60) / weeklyStudyGoalHours) * 100));

  // Study distribution by course
  const courseDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    studySessions.forEach(s => {
      map[s.courseCode] = (map[s.courseCode] || 0) + s.durationMinutes;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [studySessions]);

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logTopics.trim()) return;

    logStudySession({
      date: new Date().toISOString().split('T')[0],
      courseCode: logCourse,
      durationMinutes: Number(logDuration),
      topicsCovered: logTopics.trim(),
      focusRating: logRating,
    });
    setLogTopics('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Timer className="w-6 h-6 text-indigo-500" />
            Study Planner & Focus Mode
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Built-in Pomodoro cycles, weekly revision targets, and verified subject hour tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(prev => !prev)}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer"
            title={soundEnabled ? 'Mute chimes' : 'Enable chimes'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Main Grid: Pomodoro Clock + Weekly Goal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pomodoro Clock Box */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col items-center justify-center text-center">
          {/* Mode Switcher */}
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center text-xs font-semibold mb-8">
            <button
              onClick={() => switchMode('focus')}
              className={`px-4 py-1.5 rounded-lg transition cursor-pointer ${
                timerMode === 'focus'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Focus Block (25m)
            </button>
            <button
              onClick={() => switchMode('shortBreak')}
              className={`px-4 py-1.5 rounded-lg transition cursor-pointer ${
                timerMode === 'shortBreak'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Short Break (5m)
            </button>
            <button
              onClick={() => switchMode('longBreak')}
              className={`px-4 py-1.5 rounded-lg transition cursor-pointer ${
                timerMode === 'longBreak'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Long Break (15m)
            </button>
          </div>

          {/* Clock Display */}
          <div className="relative my-4">
            <div className="font-mono text-6xl sm:text-8xl font-black tracking-tight text-slate-900 dark:text-slate-50 select-none">
              {formattedTime}
            </div>
            <p className="text-xs uppercase tracking-widest text-slate-400 mt-2 font-bold">
              {isRunning ? 'Session Active · Stay Focused' : 'Paused / Ready'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-8">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition cursor-pointer"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Pause Session</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Focus Session</span>
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekly Study Goal Progress */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                Weekly Target
              </span>
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {goalProgress}% Complete
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                  {totalHours}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  / {weeklyStudyGoalHours} Hours Goal
                </span>
              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${goalProgress}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                {Number(totalHours) >= weeklyStudyGoalHours
                  ? 'Goal reached for this week! Keep the momentum.'
                  : `${(weeklyStudyGoalHours - Number(totalHours)).toFixed(1)} hours remaining to hit target.`}
              </p>
            </div>
          </div>

          {/* Adjust Target Hours */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Adjust Weekly Target (Hours)
            </label>
            <div className="flex items-center gap-2">
              {[15, 20, 25, 30].map(h => (
                <button
                  key={h}
                  onClick={() => setWeeklyStudyGoalHours(h)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                    weeklyStudyGoalHours === h
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>

          {/* Subject Distribution */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Time Distribution by Subject
            </span>
            <div className="space-y-1.5">
              {courseDistribution.map(([code, mins]) => (
                <div key={code} className="flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {code}
                  </span>
                  <span className="text-slate-500 font-mono">
                    {(mins / 60).toFixed(1)} hrs
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Study Session Logger & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Logger form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-600" />
            Log Completed Study Session
          </h3>

          <form onSubmit={handleLogSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Course
                </label>
                <select
                  value={logCourse}
                  onChange={e => setLogCourse(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  {uniqueCourses.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Duration (Mins)
                </label>
                <input
                  type="number"
                  min="10"
                  max="360"
                  value={logDuration}
                  onChange={e => setLogDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Topics Revised
              </label>
              <textarea
                value={logTopics}
                onChange={e => setLogTopics(e.target.value)}
                placeholder="e.g. Practiced B+ tree leaf splits and read chapter 4..."
                required
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Focus Quality Rating (1 - 5)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setLogRating(rating as 1 | 2 | 3 | 4 | 5)}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg border transition ${
                      logRating >= rating
                        ? 'bg-amber-500 border-amber-500 text-white'
                        : 'border-slate-200 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    ★ {rating}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              Record Study Session
            </button>
          </form>
        </div>

        {/* Study History list */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              Verified Study Log History ({studySessions.length})
            </h3>
            <span className="text-xs text-slate-400">Chronological Record</span>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {studySessions.map(session => (
              <div
                key={session.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {session.courseCode}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {session.date}
                    </span>
                    <span className="text-[10px] font-semibold text-amber-500">
                      {'★'.repeat(session.focusRating)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    {session.topicsCovered}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 block">
                    {session.durationMinutes} mins
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {(session.durationMinutes / 60).toFixed(1)} hrs
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
