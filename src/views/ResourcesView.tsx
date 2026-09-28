import React, { useState, useMemo } from 'react';
import { useCampus } from '../context/CampusContext';
import { LearningResource } from '../types/campus';
import {
  BookOpen,
  Search,
  Bookmark,
  Download,
  Plus,
  Trash2,
  ExternalLink,
  FileText,
  FileCode,
  Archive,
  X,
  Filter,
} from 'lucide-react';

export const ResourcesView: React.FC = () => {
  const { resources, addResource, toggleResourceBookmark, deleteResource } = useCampus();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('CS301');
  const [courseName, setCourseName] = useState('Distributed Systems & Microservices');
  const [category, setCategory] = useState<LearningResource['category']>('Lecture Notes');
  const [fileFormat, setFileFormat] = useState<LearningResource['fileFormat']>('PDF');
  const [fileSize, setFileSize] = useState('5.4 MB');

  const categories = ['All', 'Lecture Notes', 'Lab Manual', 'Past Paper', 'Reference Code', 'Textbook'];

  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchSearch =
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === 'All' || res.category === selectedCategory;
      const matchBookmark = !onlyBookmarked || res.isBookmarked;

      return matchSearch && matchCategory && matchBookmark;
    });
  }, [resources, searchQuery, selectedCategory, onlyBookmarked]);

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addResource({
      title: title.trim(),
      courseCode: courseCode.trim().toUpperCase(),
      courseName: courseName.trim(),
      category,
      fileFormat,
      fileSize,
      downloadUrl: '#',
      uploadDate: new Date().toISOString().split('T')[0],
      isBookmarked: false,
    });
    setIsModalOpen(false);
  };

  const getFormatIcon = (format: LearningResource['fileFormat']) => {
    switch (format) {
      case 'PDF':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'GITHUB':
      case 'LINK':
        return <FileCode className="w-5 h-5 text-indigo-500" />;
      case 'ZIP':
        return <Archive className="w-5 h-5 text-amber-500" />;
      default:
        return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-emerald-500" />
            Learning Resources & Courseware
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Access certified course lecture slides, past examinations with solutions, and lab harnesses.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Material</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search materials, slides, past papers..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <button
            onClick={() => setOnlyBookmarked(prev => !prev)}
            className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              onlyBookmarked
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-current' : ''}`} />
            <span>Bookmarked Only</span>
          </button>
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

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map(res => (
          <div
            key={res.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  {getFormatIcon(res.fileFormat)}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleResourceBookmark(res.id)}
                    className="p-1 text-slate-400 hover:text-amber-500 transition"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        res.isBookmarked ? 'text-amber-500 fill-amber-500' : ''
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => deleteResource(res.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                  {res.courseCode} · {res.category}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
                  {res.title}
                </h3>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>{res.fileSize || 'Standard Document'}</span>
                <span>Uploaded {res.uploadDate}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => alert(`Simulating access to resource: ${res.title}`)}
                className="w-full py-1.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                {res.fileFormat === 'GITHUB' || res.fileFormat === 'LINK' ? (
                  <>
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open External Repo</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Material</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Resource Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Upload Learning Material
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Resource Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Tracing Slides & Lab 3 Guide"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
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
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as LearningResource['category'])}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    <option value="Lecture Notes">Lecture Notes</option>
                    <option value="Lab Manual">Lab Manual</option>
                    <option value="Past Paper">Past Paper</option>
                    <option value="Reference Code">Reference Code</option>
                    <option value="Textbook">Textbook</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Format
                  </label>
                  <select
                    value={fileFormat}
                    onChange={e => setFileFormat(e.target.value as LearningResource['fileFormat'])}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="ZIP">ZIP Archive</option>
                    <option value="DOCX">DOCX</option>
                    <option value="GITHUB">GitHub Repo</option>
                    <option value="LINK">External Link</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    File Size / Tag
                  </label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={e => setFileSize(e.target.value)}
                    placeholder="e.g. 12.4 MB"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
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
                  Add Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
