/**
 * Edit Library Resource
 * Edit metadata, replace the file, or swap the cover image for an existing
 * resource.
 */

'use client';

import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LibraryForm, type LibraryFormValues } from '@/components/library/library-form';
import {
  getLibraryResource,
  updateLibraryResource,
  uploadLibraryMedia,
  type LibraryResource,
  type LibraryResourcePayload,
} from '@/lib/api/library';

function toFormValues(resource: LibraryResource): LibraryFormValues {
  return {
    title: resource.title,
    description: resource.description ?? '',
    category: resource.category,
    language: resource.language,
    author: resource.author ?? '',
    publishDate: resource.publishDate ?? '',
    isActive: resource.isActive,
    displayOrder: resource.displayOrder ?? 0,
    file: resource.file ?? null,
    coverImage: resource.coverImage ?? null,
  };
}

export default function EditLibraryResourcePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [resource, setResource] = useState<LibraryResource | null>(null);
  const [initialValues, setInitialValues] = useState<LibraryFormValues | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const id = params?.id;
    if (!id) return;
    let cancelled = false;

    (async () => {
      setIsFetching(true);
      setFetchError(null);
      try {
        const found = await getLibraryResource(id);
        if (cancelled) return;
        if (!found) {
          setFetchError('Resource not found');
          return;
        }
        setResource(found);
        setInitialValues(toFormValues(found));
      } catch (err) {
        console.error('Failed to load library resource:', err);
        if (!cancelled) setFetchError('Could not load this resource');
      } finally {
        if (!cancelled) setIsFetching(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [params?.id]);

  const handleSubmit = async (values: LibraryFormValues) => {
    if (!resource) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const payload: Partial<LibraryResourcePayload> = {
        title: values.title.trim(),
        description: values.description.trim() || undefined,
        category: values.category,
        language: values.language,
        author: values.author.trim() || undefined,
        publishDate: values.publishDate || undefined,
        isActive: values.isActive,
        displayOrder: values.displayOrder,
      };

      if (values.file instanceof File) {
        const uploadedFile = await uploadLibraryMedia(values.file);
        payload.file = uploadedFile.id;
      } else if (values.file === null) {
        payload.file = null;
      }

      if (values.coverImage instanceof File) {
        const uploadedCover = await uploadLibraryMedia(values.coverImage);
        payload.coverImage = uploadedCover.id;
      } else if (values.coverImage === null) {
        payload.coverImage = null;
      }

      const id = resource.documentId || resource.id;
      await updateLibraryResource(id, payload);
      router.push('/library');
    } catch (err) {
      console.error('Failed to update library resource:', err);
      setError(err instanceof Error ? err.message : 'Could not save changes');
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-3xl font-bold text-charcoal-900">Edit Library Resource</h1>
          <p className="mt-2 text-charcoal-600">
            Update metadata, replace the file, or hide this resource from the public library.
          </p>
        </div>
      </div>

      {fetchError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{fetchError}</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {isFetching ? (
        <div className="flex items-center justify-center rounded-lg border border-charcoal-200 bg-white py-16">
          <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary-500" />
          <span className="text-charcoal-500">Loading resource...</span>
        </div>
      ) : initialValues ? (
        <LibraryForm
          initialValues={initialValues}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
          onCancel={() => router.push('/library')}
          isLoading={isSubmitting}
        />
      ) : null}
    </div>
  );
}
