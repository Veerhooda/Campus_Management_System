import React, { useState, useEffect, useCallback } from 'react';
import { fileService, timetableService } from '../../services';
import { FileRecord } from '../../services/data';

interface Subject {
  id: string;
  name: string;
  code: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const NotesUpload: React.FC = () => {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fileService.getMyFiles(1, 50);
      setFiles(result.data || []);
    } catch (err) {
      console.error('Failed to load files:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFiles();

    // Load subjects from teacher's timetable
    const loadSubjects = async () => {
      try {
        const slots = await timetableService.getTeacherTimetable();
        const uniqueSubjects = new Map<string, Subject>();
        slots.forEach(slot => {
          if (slot.subject && slot.subjectId) {
            uniqueSubjects.set(slot.subjectId, { id: slot.subjectId, ...slot.subject });
          }
        });
        setSubjects(Array.from(uniqueSubjects.values()));
      } catch (err) {
        console.error('Failed to load subjects:', err);
      }
    };
    loadSubjects();
  }, [loadFiles]);

  const handleUpload = async (fileToUpload: File) => {
    try {
      setUploading(true);
      setError('');
      await fileService.upload(fileToUpload, selectedSubject || undefined);
      setSuccessMsg(`"${fileToUpload.name}" uploaded successfully!`);
      setTimeout(() => setSuccessMsg(''), 3000);
      await loadFiles();
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this file?')) return;
    try {
      await fileService.delete(id);
      setFiles(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete file.');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Success toast */}
      {successMsg && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
          <span className="material-symbols-outlined">check_circle</span>
          {successMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-4xl">upload_file</span>
            Upload Notes
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Share study materials with your students</p>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Upload New File</h3>

        {/* Subject selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Subject (optional)
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full md:w-80 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">No subject (general)</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
            ))}
          </select>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
            dragOver
              ? 'border-primary bg-primary/5'
              : 'border-slate-300 dark:border-slate-600 hover:border-primary/50'
          } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <span className="material-symbols-outlined text-5xl text-slate-400 mb-3 block">
            {uploading ? 'autorenew' : 'cloud_upload'}
          </span>
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            {uploading ? 'Uploading...' : 'Drag & drop a file here, or'}
          </p>
          {!uploading && (
            <label className="inline-block cursor-pointer px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Browse Files
              <input type="file" className="hidden" onChange={handleFileInput} />
            </label>
          )}
          {uploading && (
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          )}
          <p className="text-xs text-slate-400 mt-3">Max file size: 50MB • PDF, DOCX, PPTX, images, etc.</p>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">error</span>
            {error}
          </p>
        )}
      </div>

      {/* My Files */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">My Uploaded Files</h3>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-slate-100 dark:bg-slate-800 h-16 rounded-lg" />
            ))}
          </div>
        ) : files.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-2 block">folder_open</span>
            <p className="text-slate-500 dark:text-slate-400">No files uploaded yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {files.map(file => (
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
                    {file.subject && (
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                        {file.subject.name}
                      </span>
                    )}
                    <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                  title="Delete"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesUpload;
