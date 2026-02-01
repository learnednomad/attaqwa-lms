/**
 * Lesson Form Component
 * Reusable form for creating and editing lessons with multiple content types
 */

'use client';

import { FileText, FileVideo, Headphones, HelpCircle, Plus, Sparkles, Trash2, Upload, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Lesson, LessonType, QuizQuestion } from '@attaqwa/shared-types';

export interface LessonFormProps {
  initialData?: Partial<Lesson>;
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
  const [formData, setFormData] = useState<LessonFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'article',
    duration: initialData?.duration || 10,
    order: initialData?.order || 1,
    isRequired: initialData?.isRequired || false,
    content: (typeof initialData?.content === 'string' ? {} : initialData?.content) || {},
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LessonFormData, string>>>({});

  const lessonTypes: { value: LessonType; label: string; icon: any }[] = [
    { value: 'video', label: 'Video Lesson', icon: FileVideo },
    { value: 'audio', label: 'Audio Lesson', icon: Headphones },
    { value: 'article', label: 'Article', icon: FileText },
    { value: 'quiz', label: 'Quiz', icon: HelpCircle },
    { value: 'interactive', label: 'Interactive', icon: Sparkles },
  ];

  const handleInputChange = (
    field: keyof LessonFormData,
    value: string | boolean | number | LessonType | LessonContent
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleContentChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      content: { ...prev.content, [field]: value },
    }));
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
            <label className="mb-1.5 block text-sm font-medium text-charcoal-700">
              Description
              <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Brief description of what students will learn..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                errors.description ? 'border-red-500' : 'border-charcoal-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description}</p>
            )}
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

            <div className="flex items-end">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isRequired}
                  onChange={(e) => handleInputChange('isRequired', e.target.checked)}
                  className="h-4 w-4 rounded border-charcoal-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-charcoal-900">
                  Required Lesson
                </span>
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

        <div className="grid gap-3 md:grid-cols-5">
          {lessonTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = formData.type === type.value;

            return (
              <button
                key={type.value}
                type="button"
                onClick={() => handleInputChange('type', type.value)}
                className={`flex flex-col items-center space-y-2 rounded-lg border-2 p-4 transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-charcoal-200 bg-white text-charcoal-600 hover:border-charcoal-300'
                }`}
              >
                <Icon className="h-8 w-8" />
                <span className="text-sm font-medium">{type.label}</span>
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

// Video Content Editor
function VideoContentEditor({
  content,
  onChange,
}: {
  content: LessonContent;
  onChange: (field: string, value: any) => void;
}) {
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange('videoFile', file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload mode toggle */}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => setUploadMode('url')}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            uploadMode === 'url'
              ? 'bg-primary-500 text-white'
              : 'bg-charcoal-100 text-charcoal-700'
          }`}
        >
          Video URL
        </button>
        <button
          type="button"
          onClick={() => setUploadMode('file')}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            uploadMode === 'file'
              ? 'bg-primary-500 text-white'
              : 'bg-charcoal-100 text-charcoal-700'
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
        <div className="rounded-lg border-2 border-dashed border-charcoal-300 p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-charcoal-400" />
          <p className="mt-2 text-sm text-charcoal-600">Upload video file</p>
          <p className="mt-1 text-xs text-charcoal-500">MP4, WebM up to 500MB</p>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            className="mt-4"
          />
          {content.videoFile && (
            <p className="mt-2 text-sm text-green-600">
              Selected: {content.videoFile.name}
            </p>
          )}
        </div>
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange('audioFile', file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => setUploadMode('url')}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            uploadMode === 'url'
              ? 'bg-primary-500 text-white'
              : 'bg-charcoal-100 text-charcoal-700'
          }`}
        >
          Audio URL
        </button>
        <button
          type="button"
          onClick={() => setUploadMode('file')}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            uploadMode === 'file'
              ? 'bg-primary-500 text-white'
              : 'bg-charcoal-100 text-charcoal-700'
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
        <div className="rounded-lg border-2 border-dashed border-charcoal-300 p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-charcoal-400" />
          <p className="mt-2 text-sm text-charcoal-600">Upload audio file</p>
          <p className="mt-1 text-xs text-charcoal-500">MP3, WAV, OGG up to 100MB</p>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="mt-4"
          />
          {content.audioFile && (
            <p className="mt-2 text-sm text-green-600">
              Selected: {content.audioFile.name}
            </p>
          )}
        </div>
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

                <div className="grid gap-3 md:grid-cols-2">
                  {(Array.isArray(question.options) ? question.options : []).map((option, optIndex) => (
                    <Input
                      key={optIndex}
                      label={`Option ${optIndex + 1}`}
                      placeholder={`Answer option ${optIndex + 1}`}
                      value={option}
                      onChange={(e) => {
                        const currentOptions = Array.isArray(question.options) ? question.options : [];
                        const newOptions = [...currentOptions];
                        newOptions[optIndex] = e.target.value;
                        updateQuestion(index, 'options', newOptions);
                      }}
                    />
                  ))}
                </div>

                <Input
                  label="Correct Answer"
                  placeholder="Enter the correct answer exactly as shown in options"
                  value={question.correctAnswer}
                  onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                />

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
