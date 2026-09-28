import React, { useState, useMemo } from 'react';
import { useCampus } from '../context/CampusContext';
import { Notice } from '../types/campus';
import {
  Bell,
  Search,
  Bookmark,
  CheckCircle,
  AlertTriangle,
  Download,
  Filter,
  FileText,
  Calendar,
  Building2,
  Plus,
  X,
} from 'lucide-react';

export const CampusNoticesView: React.FC = () => {
  const { notices, toggleNoticeRead, toggleNoticeBookmark, addNotice } = useCampus();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // New notice modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Notice['category']>('Academic');
  const [department, setDepartment] = useState('Office of the Dean of Academics');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  const categories = ['All', 'Urgent', 'Examination', 'Academic', 'Placement', 'Library', 'Administration'];

  const filteredNotices = useMemo(() => {
    return notices.filter(n => {
      const matchSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory =
        selectedCategory === 'All' ||
        (selectedCategory === 'Urgent' ? n.isUrgent : n.category === selectedCategory);
      const matchBookmark = !onlyBookmarked || n.isBookmarked;

      return matchSearch && matchCategory && matchBookmark;
    });
  }, [notices, searchQuery, selectedCategory, onlyBookmarked]);

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    addNotice({
      title: title.trim(),
      category,
      department: department.trim(),
      date: new Date().toISOString().split('T')[0],
      summary: summary.trim(),
      content: content.trim() || summary.trim(),
      isUrgent,
      isRead: true,
      isBookmarked: false,
    });
    setIsModalOpen(false);
    setTitle('');
    setSummary('');
    setContent('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-sky-500" />
            College Notices & Circulars
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Official announcements, examination cell directives, and administrative bulletins.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Circular</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search circulars, department keywords..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyBookmarked(prev => !prev)}
              className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                onlyBookmarked
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-current' : ''}`} />
              <span>Bookmarked</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800 pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-3">
        {filteredNotices.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold">No campus notices found</p>
          </div>
        ) : (
          filteredNotices.map(notice => (
            <div
              key={notice.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 sm:p-5 shadow-xs transition hover:border-slate-300 dark:hover:border-slate-700 ${
                notice.isUrgent
                  ? 'border-rose-300/80 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {notice.isUrgent && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Urgent Broadcast
                      </span>
                    )}
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {notice.category}
                    </span>
                    {!notice.isRead && (
                      <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" title="Unread" />
                    )}
                  </div>

                  <h3
                    onClick={() => {
                      setSelectedNotice(notice);
                      toggleNoticeRead(notice.id);
                    }}
                    className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
                  >
                    {notice.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {notice.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {notice.department}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {notice.date}
                    </span>
                    {notice.attachmentName && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                          <FileText className="w-3.5 h-3.5" />
                          {notice.attachmentName}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Notice Actions */}
                <div className="flex items-center gap-2 self-end sm:self-start">
                  <button
                    onClick={() => toggleNoticeBookmark(notice.id)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                    title={notice.isBookmarked ? 'Remove bookmark' : 'Bookmark notice'}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        notice.isBookmarked ? 'text-amber-500 fill-amber-500' : ''
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedNotice(notice);
                      toggleNoticeRead(notice.id);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                  >
                    Read Full
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {selectedNotice.department} · {selectedNotice.date}
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {selectedNotice.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 italic">
              {selectedNotice.summary}
            </div>

            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
              <p>{selectedNotice.content}</p>
            </div>

            {selectedNotice.attachmentName && (
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {selectedNotice.attachmentName}
                  </span>
                </div>
                <button
                  onClick={() => alert(`Simulating download for: ${selectedNotice.attachmentName}`)}
                  className="px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px] hover:bg-indigo-100 flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold cursor-pointer"
              >
                Close Circular
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Notice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Publish Campus Notice
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Circular Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Schedule for Mid-Term Make-Up Lab Assessments"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as Notice['category'])}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Examination">Examination</option>
                    <option value="Placement">Placement</option>
                    <option value="Library">Library</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Executive Summary
                </label>
                <textarea
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  rows={2}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Full Detailed Content
                </label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="urgentCheck"
                  checked={isUrgent}
                  onChange={e => setIsUrgent(e.target.checked)}
                  className="rounded text-rose-600"
                />
                <label htmlFor="urgentCheck" className="text-xs font-medium text-rose-600 dark:text-rose-400">
                  Mark as High-Priority Urgent Notice
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
