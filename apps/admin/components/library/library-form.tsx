/**
 * Library Resource Form
 * Shared form used for create + edit. Handles PDF upload, cover image upload,
 * and persistence of the library-resource entity.
 */

'use client';

import { FileText, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  LIBRARY_CATEGORIES,
  LIBRARY_CATEGORY_LABELS,
  LIBRARY_LANGUAGES,
  LIBRARY_LANGUAGE_LABELS,
  type LibraryCategory,
  type LibraryLanguage,
  type LibraryMedia,
  resolveMediaUrl,
} from '@/lib/api/library';

const MAX_FILE_MB = 50;
const MAX_IMAGE_MB = 5;

export interface LibraryFormValues {
  title: string;
  description: string;
  category: LibraryCategory;
  language: LibraryLanguage;
  author: string;
  publishDate: string;
  isActive: boolean;
  displayOrder: number;
  /** Either a freshly picked File or the existing media record. */
  file: File | LibraryMedia | null;
  coverImage: File | LibraryMedia | null;
}

 interface LibraryFormProps {
  initialValues?: Partial<LibraryFormValues>;
  isLoading?: boolean;
  submitLabel: string;
  onSubmit: (values: LibraryFormValues) => Promise<void>;
  onCancel: () => void;
}

const DEFAULTS: LibraryFormValues = {
  title: '',
  description: '',
  category: 'books',
  language: 'english',
  author: '',
  publishDate: '',
  isActive: true,
  displayOrder: 0,
  file: null,
  coverImage: null,
};

function isFile(value: unknown): value is File {
  return typeof File !== 'undefined' && value instanceof File;
}

function formatSize(bytes?: number): string {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n.toFixed(n >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

export function LibraryForm({
  initialValues,
  isLoading = false,
  submitLabel,
  onSubmit,
  onCancel,
}: LibraryFormProps) {
  const [values, setValues] = useState<LibraryFormValues>({
    ...DEFAULTS,
    ...initialValues,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LibraryFormValues, string>>>({});
  const [coverPreview, setCoverPreview] = useState<string | null>(() => {
    const cover = initialValues?.coverImage;
    if (cover && !isFile(cover)) return resolveMediaUrl(cover.url) ?? null;
    return null;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const setField = <K extends keyof LibraryFormValues>(
    field: K,
    value: LibraryFormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (picked.size > MAX_FILE_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: `File must be less than ${MAX_FILE_MB}MB` }));
      return;
    }
    setField('file', picked);
  };

  const handleCoverPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (!picked.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, coverImage: 'Please choose an image' }));
      return;
    }
    if (picked.size > MAX_IMAGE_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, coverImage: `Image must be less than ${MAX_IMAGE_MB}MB` }));
      return;
    }
    setField('coverImage', picked);
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(picked);
  };

  const removeCover = () => {
    setField('coverImage', null);
    setCoverPreview(null);
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  const removeFile = () => {
    setField('file', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof LibraryFormValues, string>> = {};
    if (!values.title.trim()) next.title = 'Title is required';
    else if (values.title.trim().length < 3) next.title = 'Title must be at least 3 characters';
    if (values.description && values.description.length > 2000) {
      next.description = 'Description must be 2000 characters or fewer';
    }
    if (!values.file) next.file = 'Please choose a PDF or document to upload';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(values);
  };

  const currentFile = values.file;
  const fileLabel = (() => {
    if (!currentFile) return null;
    if (isFile(currentFile)) return { name: currentFile.name, size: formatSize(currentFile.size), isNew: true };
    return { name: currentFile.name ?? 'Existing file', size: formatSize(currentFile.size), isNew: false };
  })();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basics */}
      <section className="rounded-lg border border-charcoal-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-charcoal-900">Details</h2>
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="e.g., Ramadan Companion 2026"
            value={values.title}
            onChange={(e) => setField('title', e.target.value)}
            error={errors.title}
            required
          />

          <div>
            <label
              htmlFor="library-description"
              className="mb-1.5 block text-sm font-medium text-charcoal-700"
            >
              Description
            </label>
            <textarea
              id="library-description"
              rows={4}
              maxLength={2000}
              value={values.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder="Short summary shown on the public library page"
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                errors.description ? 'border-red-500' : 'border-charcoal-300'
              }`}
            />
            <div className="mt-1 flex justify-between">
              {errors.description ? (
                <p className="text-xs text-red-600">{errors.description}</p>
              ) : (
                <span className="text-xs text-charcoal-500">Up to 2000 characters</span>
              )}
              <span
                className={`text-xs ${
                  values.description.length > 1800 ? 'text-amber-600' : 'text-charcoal-400'
                }`}
              >
                {values.description.length}/2000
              </span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-charcoal-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={values.category}
                onChange={(e) => setField('category', e.target.value as LibraryCategory)}
                className="w-full rounded-lg border border-charcoal-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                {LIBRARY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {LIBRARY_CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-charcoal-700">
                Language <span className="text-red-500">*</span>
              </label>
              <select
                value={values.language}
                onChange={(e) => setField('language', e.target.value as LibraryLanguage)}
                className="w-full rounded-lg border border-charcoal-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                {LIBRARY_LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {LIBRARY_LANGUAGE_LABELS[l]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Author"
              placeholder="e.g., Masjid At-Taqwa Education Team"
              value={values.author}
              onChange={(e) => setField('author', e.target.value)}
            />
            <Input
              label="Publish Date"
              type="date"
              value={values.publishDate}
              onChange={(e) => setField('publishDate', e.target.value)}
              helperText="Used for sorting and display"
            />
          </div>

          <Input
            label="Display Order"
            type="number"
            value={values.displayOrder}
            onChange={(e) => setField('displayOrder', Number.parseInt(e.target.value, 10) || 0)}
            helperText="Lower numbers appear first. Ties fall back to publish date."
          />
        </div>
      </section>

      {/* File */}
      <section className="rounded-lg border border-charcoal-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-charcoal-900">File</h2>
        {fileLabel ? (
          <div className="flex items-center justify-between rounded-lg border border-charcoal-200 bg-charcoal-50 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-charcoal-900">
                  {fileLabel.name}
                </p>
                <p className="text-xs text-charcoal-500">
                  {fileLabel.size}
                  {fileLabel.isNew ? ' · Not uploaded yet' : ' · Currently attached'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="rounded-md p-1.5 text-charcoal-500 hover:bg-charcoal-100 hover:text-red-600"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer rounded-lg border-2 border-dashed border-charcoal-300 p-8 text-center transition-colors hover:border-primary-400 hover:bg-primary-50/30"
          >
            <Upload className="mx-auto h-10 w-10 text-charcoal-400" />
            <p className="mt-2 text-sm text-charcoal-600">
              Click to choose a PDF or document
            </p>
            <p className="mt-1 text-xs text-charcoal-500">
              PDF, DOCX, EPUB up to {MAX_FILE_MB}MB
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.epub,application/pdf"
          onChange={handleFilePick}
          className="sr-only"
        />
        {errors.file && (
          <p className="mt-2 text-xs text-red-600">{errors.file}</p>
        )}
      </section>

      {/* Cover image */}
      <section className="rounded-lg border border-charcoal-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-charcoal-900">
          Cover Image <span className="text-sm font-normal text-charcoal-500">(optional)</span>
        </h2>
        {coverPreview ? (
          <div className="relative">
            <div className="relative h-48 w-full overflow-hidden rounded-lg bg-charcoal-100">
              <Image
                src={coverPreview}
                alt="Cover preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <button
              type="button"
              onClick={removeCover}
              className="absolute right-2 top-2 rounded-full bg-red-600 p-2 text-white transition-colors hover:bg-red-700"
              aria-label="Remove cover image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => coverInputRef.current?.click()}
            className="cursor-pointer rounded-lg border-2 border-dashed border-charcoal-300 p-8 text-center transition-colors hover:border-primary-400 hover:bg-primary-50/30"
          >
            <Upload className="mx-auto h-10 w-10 text-charcoal-400" />
            <p className="mt-2 text-sm text-charcoal-600">
              Click to add a cover image
            </p>
            <p className="mt-1 text-xs text-charcoal-500">PNG, JPG up to {MAX_IMAGE_MB}MB</p>
          </div>
        )}
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverPick}
          className="sr-only"
        />
        {errors.coverImage && (
          <p className="mt-2 text-xs text-red-600">{errors.coverImage}</p>
        )}
      </section>

      {/* Visibility */}
      <section className="rounded-lg border border-charcoal-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-charcoal-900">Visibility</h2>
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-charcoal-200 p-4 transition-colors hover:bg-charcoal-50">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(e) => setField('isActive', e.target.checked)}
            className="h-[18px] w-[18px] rounded border-charcoal-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
          />
          <div>
            <p className="text-sm font-medium text-charcoal-900">Active</p>
            <p className="text-xs text-charcoal-600">
              When active, this resource appears on the public library page. Uncheck to hide it
              without deleting.
            </p>
          </div>
        </label>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-charcoal-200 pt-6">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
