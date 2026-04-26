/**
 * Create Library Resource
 * Upload a new PDF / document and add it to the public library.
 */

'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { LibraryForm, type LibraryFormValues } from '@/components/library/library-form';
import {
  createLibraryResource,
  uploadLibraryMedia,
  type LibraryResourcePayload,
} from '@/lib/api/library';

export default function CreateLibraryResourcePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: LibraryFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!(values.file instanceof File)) {
        throw new Error('A file is required');
      }

      const uploadedFile = await uploadLibraryMedia(values.file);

      let coverImageId: number | undefined;
      if (values.coverImage instanceof File) {
        const uploadedCover = await uploadLibraryMedia(values.coverImage);
        coverImageId = uploadedCover.id;
      }

      // Strapi requires a slug on the library-resource content type. Generate
      // one from the title with a timestamp suffix to keep it unique — mirrors
      // the pattern in apps/admin/app/(dashboard)/courses/new/page.tsx.
      const slug = values.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        + '-' + Date.now().toString(36);

      const payload: LibraryResourcePayload = {
        title: values.title.trim(),
        slug,
        description: values.description.trim() || undefined,
        category: values.category,
        language: values.language,
        author: values.author.trim() || undefined,
        publishDate: values.publishDate || undefined,
        isActive: values.isActive,
        displayOrder: values.displayOrder,
        file: uploadedFile.id,
        coverImage: coverImageId,
      };

      await createLibraryResource(payload);
      router.push('/library');
    } catch (err) {
      console.error('Failed to create library resource:', err);
      setError(err instanceof Error ? err.message : 'Could not save resource');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/library"
          className="rounded-lg p-2 text-charcoal-600 transition-colors hover:bg-charcoal-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">New Library Resource</h1>
          <p className="mt-2 text-charcoal-600">
            Upload a PDF or document to add to the public library page.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <LibraryForm
        submitLabel="Create Resource"
        onSubmit={handleSubmit}
        onCancel={() => router.push('/library')}
        isLoading={isLoading}
      />
    </div>
  );
}
