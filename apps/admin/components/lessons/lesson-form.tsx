/**
 * Lesson Form Component
 * Reusable form for creating and editing lessons with multiple content types
 */

'use client';

import { FileText, FileVideo, Headphones, HelpCircle, Plus, Sparkles, Trash2, Upload, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
type LessonType = 'video' | 'audio' | 'article' | 'quiz' | 'interactive';

interface QuizQuestion {
  id: string;
  question: string;
  type: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
}

export interface LessonFormProps {
  initialData?: Record<string, unknown>;
  courseId: string;
  onSubmit: (data: LessonFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface LessonFormData {
  title: string;
  description: string;
  type: LessonType;
  duration: number;
  order: number;
  isRequired: boolean;
  content: LessonContent;
}

interface LessonContent {
  // Video content
  videoUrl?: string;
  videoFile?: File;
  videoTranscript?: string;

  // Audio content
  audioUrl?: string;
  audioFile?: File;
  audioTranscript?: string;

  // Article content
  articleBody?: string;
  articleImages?: string[];

  // Quiz content
  questions?: QuizQuestion[];
  passingScore?: number;
  timeLimit?: number;

  // Interactive content
  interactiveType?: string;
  interactiveData?: any;
}

export function LessonForm({
  initialData,
  courseId,
  onSubmit,
  onCancel,
  isLoading = false,
}: LessonFormProps) {
  // Map Strapi field names to form field names
  const mapLessonType = (t: unknown): LessonType => {
    const typeMap: Record<string, LessonType> = { reading: 'article', video: 'video', quiz: 'quiz', interactive: 'interactive', practice: 'interactive' };
    return typeMap[t as string] || 'article';
  };

  const [formData, setFormData] = useState<LessonFormData>({
    title: (initialData?.title as string) || '',
    description: (initialData?.description as string) || '',
    type: (initialData?.lesson_type ? mapLessonType(initialData.lesson_type) : (initialData?.type as LessonType)) || 'article',
    duration: (initialData?.duration_minutes as number) || (initialData?.duration as number) || 10,
    order: (initialData?.lesson_order as number) || (initialData?.order as number) || 1,
    isRequired: (initialData?.isRequired as boolean) || false,
    content: (typeof initialData?.content === 'string'
      ? { articleBody: initialData.content as string }
      : (initialData?.content as LessonContent)) || {},
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LessonFormData, string>>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const autosaveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const DRAFT_KEY = `lesson-draft-${courseId}`;

  // Restore draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved && !initialData) {
        const parsed = JSON.parse(saved);
        // Don't restore file objects (they can't be serialized)
        if (parsed.content) {
          delete parsed.content.videoFile;
          delete parsed.content.audioFile;
        }
        setFormData(parsed);
        setDraftRestored(true);
        setTimeout(() => setDraftRestored(false), 5000);
      }
    } catch {
      // Ignore parse errors
    }
  }, [courseId, DRAFT_KEY, initialData]);

  // Autosave every 30 seconds when dirty
  useEffect(() => {
    if (!isDirty) return;
    autosaveTimerRef.current = setInterval(() => {
      try {
        const toSave = { ...formData, content: { ...formData.content } };
        // Strip File objects before serializing
        delete toSave.content.videoFile;
        delete toSave.content.audioFile;
        localStorage.setItem(DRAFT_KEY, JSON.stringify(toSave));
      } catch {
        // Ignore storage errors
      }
    }, 30_000);
    return () => {
      if (autosaveTimerRef.current) clearInterval(autosaveTimerRef.current);
    };
  }, [isDirty, formData, DRAFT_KEY]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Clear draft on successful submit
  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    setIsDirty(false);
  }, [DRAFT_KEY]);

  const lessonTypes: { value: LessonType; label: string; description: string; icon: React.ComponentType<{ className?: string }>; disabled?: boolean }[] = [
    { value: 'video', label: 'Video Lesson', description: 'YouTube, Vimeo, or uploaded video', icon: FileVideo },
    { value: 'audio', label: 'Audio Lesson', description: 'Podcast, recitation, or lecture audio', icon: Headphones },
    { value: 'article', label: 'Reading / Article', description: 'Written content with rich formatting', icon: FileText },
    { value: 'quiz', label: 'Quiz', description: 'Multiple choice assessment', icon: HelpCircle },
    { value: 'interactive', label: 'Interactive', description: 'Coming soon', icon: Sparkles, disabled: true },
  ];

  const handleInputChange = (
    field: keyof LessonFormData,
    value: string | boolean | number | LessonType | LessonContent
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleContentChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      content: { ...prev.content, [field]: value },
    }));
    setIsDirty(true);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LessonFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Lesson title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.duration < 1) {
      newErrors.duration = 'Duration must be at least 1 minute';
    }

    // Type-specific validation
    if (formData.type === 'video' && !formData.content.videoUrl && !formData.content.videoFile) {
      newErrors.content = 'Video URL or file is required';
    }

    if (formData.type === 'audio' && !formData.content.audioUrl && !formData.content.audioFile) {
      newErrors.content = 'Audio URL or file is required';
    }

    if (formData.type === 'article' && !formData.content.articleBody?.trim()) {
      newErrors.content = 'Article content is required';
    }

    if (formData.type === 'quiz' && (!formData.content.questions || formData.content.questions.length === 0)) {
      newErrors.content = 'At least one quiz question is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    clearDraft();
    await onSubmit(formData);
  };

  const renderContentEditor = () => {
    switch (formData.type) {
      case 'video':
        return <VideoContentEditor content={formData.content} onChange={handleContentChange} />;
      case 'audio':
        return <AudioContentEditor content={formData.content} onChange={handleContentChange} />;
      case 'article':
        return <ArticleContentEditor content={formData.content} onChange={handleContentChange} />;
      case 'quiz':
        return <QuizContentEditor content={formData.content} onChange={handleContentChange} />;
      case 'interactive':
        return <InteractiveContentEditor content={formData.content} onChange={handleContentChange} />;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Draft Restored Banner */}
      {draftRestored && (
        <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-800">
            Draft restored from your last session.
          </p>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem(DRAFT_KEY);
              setFormData({
                title: '',
                description: '',
                type: 'article',
                duration: 10,
                order: 1,
                isRequired: false,
                content: {},
              });
              setDraftRestored(false);
              setIsDirty(false);
            }}
            className="text-sm font-medium text-amber-700 hover:text-amber-900"
          >
            Discard draft
          </button>
        </div>
      )}

      {/* Basic Information */}
      <div className="rounded-lg border border-charcoal-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-charcoal-900">
          Basic Information
        </h2>

        <div className="space-y-4">
          <Input
            label="Lesson Title"
            placeholder="e.g., Introduction to Tajweed Rules"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            error={errors.title}
            required
          />

          <div>
            <label htmlFor="lesson-description" className="mb-1.5 block text-sm font-medium text-charcoal-700">
              Description
              <span className="text-red-500">*</span>
            </label>
            <textarea
              id="lesson-description"
              placeholder="Brief description of what students will learn..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              maxLength={500}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                errors.description ? 'border-red-500' : 'border-charcoal-300'
              }`}
            />
            <div className="mt-1 flex justify-between">
              {errors.description ? (
                <p className="text-xs text-red-600">{errors.description}</p>
              ) : (
                <p className="text-xs text-charcoal-500">Describe what students will learn in 2-3 sentences</p>
              )}
              <span className={`text-xs ${formData.description.length > 450 ? 'text-amber-600' : 'text-charcoal-400'}`}>
                {formData.description.length}/500
              </span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Input
              label="Duration (minutes)"
              type="number"
              min="1"
              placeholder="10"
              value={formData.duration || ''}
              onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
              error={errors.duration}
              required
            />

            <Input
              label="Lesson Order"
              type="number"
              min="1"
              placeholder="1"
              value={formData.order || ''}
              onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 1)}
              helperText="Position in course sequence"
            />

            <div className="flex items-end pb-0.5">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-charcoal-200 px-3 py-2.5 transition-colors hover:bg-charcoal-50">
                <input
                  type="checkbox"
                  checked={formData.isRequired}
                  onChange={(e) => handleInputChange('isRequired', e.target.checked)}
                  className="h-[18px] w-[18px] rounded border-charcoal-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
                <div>
                  <span className="block text-sm font-medium text-charcoal-900">
                    Required Lesson
                  </span>
                  <span className="block text-xs text-charcoal-500">
                    Must complete to progress
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Type Selection */}
      <div className="rounded-lg border border-charcoal-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-charcoal-900">
          Lesson Type
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
          {lessonTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = formData.type === type.value;
            const isDisabled = type.disabled;

            return (
              <button
                key={type.value}
                type="button"
                disabled={isDisabled}
                onClick={() => !isDisabled && handleInputChange('type', type.value)}
                className={`flex flex-col items-center space-y-1.5 rounded-lg border-2 p-4 transition-all ${
                  isDisabled
                    ? 'cursor-not-allowed border-charcoal-100 bg-charcoal-50 text-charcoal-400'
                    : isSelected
                      ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                      : 'border-charcoal-200 bg-white text-charcoal-600 hover:border-charcoal-300 hover:shadow-sm'
                }`}
              >
                <Icon className="h-7 w-7" />
                <span className="text-sm font-medium">{type.label}</span>
                <span className={`text-[11px] leading-tight ${isDisabled ? 'text-charcoal-400' : 'text-charcoal-500'}`}>
                  {type.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Editor */}
      <div className="rounded-lg border border-charcoal-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-charcoal-900">
          Lesson Content
        </h2>

        {errors.content && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-800">{errors.content}</p>
          </div>
        )}

        {renderContentEditor()}
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-3 border-t border-charcoal-200 pt-6">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Lesson' : 'Create Lesson'}
        </Button>
      </div>
    </form>
  );
}

// Reusable File Dropzone Component
function FileDropzone({
  accept,
  maxSizeMB,
  fileTypes,
  file,
  onFileSelect,
  onFileClear,
}: {
  accept: string;
  maxSizeMB: number;
  fileTypes: string;
  file?: File;
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) onFileSelect(droppedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  if (file) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-primary-200 bg-primary-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
            <Upload className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-charcoal-900">{file.name}</p>
            <p className="text-xs text-charcoal-500">
              {(file.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onFileClear}
          className="rounded-lg p-2 text-charcoal-500 hover:bg-charcoal-100 hover:text-charcoal-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => fileInputRef.current?.click()}
      className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
        isDragOver
          ? 'border-primary-400 bg-primary-50/50'
          : 'border-charcoal-300 hover:border-charcoal-400 hover:bg-charcoal-50/50'
      }`}
    >
      <Upload className={`mx-auto h-12 w-12 ${isDragOver ? 'text-primary-500' : 'text-charcoal-400'}`} />
      <p className="mt-2 text-sm text-charcoal-600">
        Drag and drop or{' '}
        <span className="font-medium text-primary-600">browse</span>
      </p>
      <p className="mt-1 text-xs text-charcoal-500">
        {fileTypes} up to {maxSizeMB}MB
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFileSelect(f);
        }}
        className="sr-only"
      />
    </div>
  );
}

// Video Content Editor
function VideoContentEditor({
  content,
  onChange,
}: {
  content: LessonContent;
  onChange: (field: string, value: any) => void;
}) {
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');

  return (
    <div className="space-y-4">
      {/* Upload mode toggle */}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => setUploadMode('url')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            uploadMode === 'url'
              ? 'bg-primary-500 text-white'
              : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
          }`}
        >
          Video URL
        </button>
        <button
          type="button"
          onClick={() => setUploadMode('file')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            uploadMode === 'file'
              ? 'bg-primary-500 text-white'
              : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
          }`}
        >
          Upload File
        </button>
      </div>

      {uploadMode === 'url' ? (
        <Input
          label="Video URL"
          placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
          value={content.videoUrl || ''}
          onChange={(e) => onChange('videoUrl', e.target.value)}
          helperText="Supports YouTube, Vimeo, or direct video URLs"
        />
      ) : (
        <FileDropzone
          accept="video/*"
          maxSizeMB={500}
          fileTypes="MP4, WebM"
          file={content.videoFile}
          onFileSelect={(file) => onChange('videoFile', file)}
          onFileClear={() => onChange('videoFile', undefined)}
        />
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-charcoal-700">
          Video Transcript (Optional)
        </label>
        <textarea
          placeholder="Add transcript for accessibility and SEO..."
          value={content.videoTranscript || ''}
          onChange={(e) => onChange('videoTranscript', e.target.value)}
          rows={6}
          className="w-full rounded-lg border border-charcoal-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
      </div>
    </div>
  );
}

// Audio Content Editor
function AudioContentEditor({
  content,
  onChange,
}: {
  content: LessonContent;
  onChange: (field: string, value: any) => void;
}) {
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => setUploadMode('url')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            uploadMode === 'url'
              ? 'bg-primary-500 text-white'
              : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
          }`}
        >
          Audio URL
        </button>
        <button
          type="button"
          onClick={() => setUploadMode('file')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            uploadMode === 'file'
              ? 'bg-primary-500 text-white'
              : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
          }`}
        >
          Upload File
        </button>
      </div>

      {uploadMode === 'url' ? (
        <Input
          label="Audio URL"
          placeholder="https://example.com/audio.mp3"
          value={content.audioUrl || ''}
          onChange={(e) => onChange('audioUrl', e.target.value)}
          helperText="Direct link to audio file"
        />
      ) : (
        <FileDropzone
          accept="audio/*"
          maxSizeMB={100}
          fileTypes="MP3, WAV, OGG"
          file={content.audioFile}
          onFileSelect={(file) => onChange('audioFile', file)}
          onFileClear={() => onChange('audioFile', undefined)}
        />
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-charcoal-700">
          Audio Transcript (Optional)
        </label>
        <textarea
          placeholder="Add transcript for accessibility..."
          value={content.audioTranscript || ''}
          onChange={(e) => onChange('audioTranscript', e.target.value)}
          rows={6}
          className="w-full rounded-lg border border-charcoal-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
      </div>
    </div>
  );
}

// Article Content Editor
function ArticleContentEditor({
  content,
  onChange,
}: {
  content: LessonContent;
  onChange: (field: string, value: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-charcoal-700">
          Article Content
          <span className="text-red-500">*</span>
        </label>
        <textarea
          placeholder="Write your article content here... (Supports Markdown)"
          value={content.articleBody || ''}
          onChange={(e) => onChange('articleBody', e.target.value)}
          rows={15}
          className="w-full rounded-lg border border-charcoal-300 px-3 py-2 font-mono text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
        <p className="mt-1 text-xs text-charcoal-500">
          You can use Markdown formatting for headings, lists, bold, italic, etc.
        </p>
      </div>

      <div className="rounded-lg bg-charcoal-50 p-4">
        <p className="text-sm font-medium text-charcoal-700">Markdown Quick Reference:</p>
        <div className="mt-2 grid gap-2 text-xs text-charcoal-600 md:grid-cols-2">
          <div># Heading 1</div>
          <div>## Heading 2</div>
          <div>**bold text**</div>
          <div>*italic text*</div>
          <div>- Bullet list</div>
          <div>1. Numbered list</div>
          <div>[Link text](url)</div>
          <div>`code`</div>
        </div>
      </div>
    </div>
  );
}

// Quiz Content Editor
function QuizContentEditor({
  content,
  onChange,
}: {
  content: LessonContent;
  onChange: (field: string, value: any) => void;
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(content.questions || []);

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q_${Date.now()}`,
      question: '',
      type: 'multiple_choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      points: 10,
    };
    const updated = [...questions, newQuestion];
    setQuestions(updated);
    onChange('questions', updated);
  };

  const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
    onChange('questions', updated);
  };

  const removeQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
    onChange('questions', updated);
  };

  return (
    <div className="space-y-4">
      {/* Quiz Settings */}
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Passing Score (%)"
          type="number"
          min="0"
          max="100"
          placeholder="70"
          value={content.passingScore || ''}
          onChange={(e) => onChange('passingScore', parseInt(e.target.value) || 70)}
          helperText="Minimum score to pass"
        />
        <Input
          label="Time Limit (minutes)"
          type="number"
          min="0"
          placeholder="30"
          value={content.timeLimit || ''}
          onChange={(e) => onChange('timeLimit', parseInt(e.target.value) || 0)}
          helperText="0 = unlimited time"
        />
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-charcoal-900">
            Questions ({questions.length})
          </h3>
          <Button type="button" size="sm" onClick={addQuestion}>
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>

        {questions.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-charcoal-300 p-8 text-center">
            <HelpCircle className="mx-auto h-12 w-12 text-charcoal-400" />
            <p className="mt-2 text-sm text-charcoal-600">No questions yet</p>
            <p className="mt-1 text-xs text-charcoal-500">
              Click "Add Question" to create your first quiz question
            </p>
          </div>
        ) : (
          questions.map((question, index) => (
            <div
              key={question.id}
              className="rounded-lg border border-charcoal-200 bg-white p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-charcoal-700">
                  Question {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="rounded p-1 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <Input
                  label="Question"
                  placeholder="Enter your question..."
                  value={question.question}
                  onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                />

                <div>
                  <p className="mb-2 text-sm font-medium text-charcoal-700">
                    Answer Options
                    <span className="ml-2 text-xs font-normal text-charcoal-500">
                      Select the correct answer
                    </span>
                  </p>
                  <div className="space-y-2">
                    {(Array.isArray(question.options) ? question.options : []).map((option, optIndex) => {
                      const isCorrect = question.correctAnswer === option && option !== '';
                      return (
                        <div
                          key={optIndex}
                          className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                            isCorrect
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-charcoal-200 hover:border-charcoal-300'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => updateQuestion(index, 'correctAnswer', option)}
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                              isCorrect
                                ? 'border-primary-500 bg-primary-500'
                                : 'border-charcoal-300 hover:border-primary-400'
                            }`}
                            title={`Mark option ${optIndex + 1} as correct`}
                          >
                            {isCorrect && (
                              <div className="h-2 w-2 rounded-full bg-white" />
                            )}
                          </button>
                          <input
                            type="text"
                            placeholder={`Answer option ${optIndex + 1}`}
                            value={option}
                            onChange={(e) => {
                              const currentOptions = Array.isArray(question.options) ? question.options : [];
                              const newOptions = [...currentOptions];
                              const wasCorrect = question.correctAnswer === option;
                              newOptions[optIndex] = e.target.value;
                              updateQuestion(index, 'options', newOptions);
                              if (wasCorrect) {
                                updateQuestion(index, 'correctAnswer', e.target.value);
                              }
                            }}
                            className="flex-1 bg-transparent text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none"
                          />
                          <span className="shrink-0 text-xs text-charcoal-400">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {!question.correctAnswer && question.options.some(o => o.trim()) && (
                    <p className="mt-2 text-xs text-amber-600">
                      Please select one option as the correct answer
                    </p>
                  )}
                </div>

                <Input
                  label="Explanation (Optional)"
                  placeholder="Explain why this answer is correct..."
                  value={question.explanation || ''}
                  onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Interactive Content Editor
function InteractiveContentEditor({
  content,
  onChange,
}: {
  content: LessonContent;
  onChange: (field: string, value: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border-2 border-dashed border-charcoal-300 p-8 text-center">
        <Sparkles className="mx-auto h-12 w-12 text-charcoal-400" />
        <p className="mt-2 text-sm text-charcoal-600">
          Interactive content editor coming soon
        </p>
        <p className="mt-1 text-xs text-charcoal-500">
          This will support drag-and-drop activities, flashcards, and more
        </p>
      </div>
    </div>
  );
}
