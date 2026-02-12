import React, { useState, useEffect } from 'react';
import { fileService } from '../../services';
import { FileRecord } from '../../services/data';

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const Notes: React.FC = () => {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadFiles = async () => {
      try {
        setLoading(true);
        const result = await fileService.getAll(1, 100);
        setFiles(result.data || []);
      } catch (err) {
        console.error('Failed to load notes:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFiles();
  }, []);

  const filteredFiles = files.filter(f => {
    const query = searchQuery.toLowerCase();
    return (
      f.originalName.toLowerCase().includes(query) ||
      f.subject?.name?.toLowerCase().includes(query) ||
      f.uploadedBy?.user?.firstName?.toLowerCase().includes(query) ||
      f.uploadedBy?.user?.lastName?.toLowerCase().includes(query)
    );
  });

  // Group by subject
  const grouped = filteredFiles.reduce((acc, file) => {
    const key = file.subject?.name || 'General';
    if (!acc[key]) acc[key] = [];
    acc[key].push(file);
    return acc;
  }, {} as Record<string, FileRecord[]>);

  const handleDownload = (file: FileRecord) => {
    const url = fileService.getDownloadUrl(file.id);
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-4xl">library_books</span>
          Study Materials
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Download notes and materials shared by your faculty</p>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by file name, subject, or faculty..."
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-blue-500">description</span>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Total Files</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{files.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-green-500">folder</span>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Subjects</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{Object.keys(grouped).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hidden md:block">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-purple-500">cloud_download</span>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Total Size</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {formatFileSize(files.reduce((sum, f) => sum + f.sizeBytes, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-slate-100 dark:bg-slate-800 h-20 rounded-xl" />
          ))}
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-3 block">folder_open</span>
          <h3 className="text-lg font-bold text-slate-600 dark:text-slate-400">No materials available yet</h3>
          <p className="text-slate-500 dark:text-slate-500 mt-1">Your faculty will upload study materials here</p>
        </div>
      ) : (
        Object.entries(grouped).map(([subject, subjectFiles]) => (
          <div key={subject} className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">folder</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{subject}</h3>
              <span className="ml-auto text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                {subjectFiles.length} file{subjectFiles.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {subjectFiles.map(file => (
                <div key={file.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-blue-500">
                      {file.mimeType?.includes('pdf') ? 'picture_as_pdf' :
                       file.mimeType?.includes('image') ? 'image' :
                       file.mimeType?.includes('presentation') || file.mimeType?.includes('pptx') ? 'slideshow' :
                       'description'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{file.originalName}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{formatFileSize(file.sizeBytes)}</span>
                      {file.uploadedBy?.user && (
                        <span>by {file.uploadedBy.user.firstName} {file.uploadedBy.user.lastName}</span>
                      )}
                      <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(file)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium text-sm hover:bg-primary/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Notes;
