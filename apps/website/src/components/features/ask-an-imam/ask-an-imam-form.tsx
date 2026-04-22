'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, MessageCircleQuestion, Send, AlertCircle } from 'lucide-react';

const legalSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().max(40).optional().or(z.literal('')),
  category: z.enum([
    'fiqh',
    'halal-haram',
    'family',
    'business',
    'ritual',
    'aqeedah',
    'other',
  ]),
  audience: z.enum(['brothers', 'sisters', 'either']),
  language: z.enum(['english', 'bengali', 'arabic']),
  question: z.string().min(15, 'Please share a bit more so we can answer accurately').max(5000),
});

type LegalFormValues = z.infer<typeof legalSchema>;

const categoryOptions: Array<{ value: LegalFormValues['category']; label: string }> = [
  { value: 'fiqh', label: 'Islamic Jurisprudence (Fiqh)' },
  { value: 'halal-haram', label: 'Halal / Haram guidance' },
  { value: 'family', label: 'Family, marriage, or parenting' },
  { value: 'business', label: 'Business or finance (Muamalat)' },
  { value: 'ritual', label: 'Rituals & worship (Ibadah)' },
  { value: 'aqeedah', label: 'Aqeedah / Islamic belief' },
  { value: 'other', label: 'Other' },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

export function AskAnImamForm() {
  const [submitState, setSubmitState] = useState<
    | { status: 'idle' }
    | { status: 'submitting' }
    | { status: 'success' }
    | { status: 'error'; message: string }
  >({ status: 'idle' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LegalFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(legalSchema as any),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      category: 'fiqh',
      audience: 'either',
      language: 'english',
      question: '',
    },
  });

  const onSubmit = async (values: LegalFormValues) => {
    setSubmitState({ status: 'submitting' });
    try {
      const response = await fetch(`${API_BASE}/api/v1/legal-inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: values.phone || undefined,
            category: values.category,
            audience: values.audience,
            language: values.language,
            question: values.question,
          },
        }),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      setSubmitState({ status: 'success' });
      reset();
    } catch (err) {
      setSubmitState({
        status: 'error',
        message:
          err instanceof Error
            ? 'We could not submit your question. Please try again or reach us by phone.'
            : 'Something went wrong.',
      });
    }
  };

  if (submitState.status === 'success') {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-neutral-900 mb-2">
              Your question has been received.
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed mb-4">
              An imam or ustadha will reach out to you by email in your chosen language. Responses
              may take a few business days — JazakAllahu Khayran for your patience.
            </p>
            <button
              type="button"
              onClick={() => setSubmitState({ status: 'idle' })}
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              Ask another question
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-xl border border-neutral-200 bg-white p-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
          <MessageCircleQuestion className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Submit your question</h3>
          <p className="text-xs text-neutral-500">
            Please be specific — the more context, the better the answer.
          </p>
        </div>
      </div>

      {submitState.status === 'error' && (
        <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50/60 p-4 flex gap-3">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-sm text-rose-700">{submitState.message}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-xs font-medium text-neutral-700 mb-1.5">
              First Name *
            </label>
            <input
              id="firstName"
              type="text"
              aria-invalid={errors.firstName ? 'true' : undefined}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-rose-600">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-xs font-medium text-neutral-700 mb-1.5">
              Last Name *
            </label>
            <input
              id="lastName"
              type="text"
              aria-invalid={errors.lastName ? 'true' : undefined}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
              {...register('lastName')}
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-rose-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-neutral-700 mb-1.5">
              Email *
            </label>
            <input
              id="email"
              type="email"
              aria-invalid={errors.email ? 'true' : undefined}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-xs font-medium text-neutral-700 mb-1.5">
              Phone (optional)
            </label>
            <input
              id="phone"
              type="tel"
              className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
              {...register('phone')}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="category" className="block text-xs font-medium text-neutral-700 mb-1.5">
              Category *
            </label>
            <select
              id="category"
              className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
              {...register('category')}
            >
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="audience" className="block text-xs font-medium text-neutral-700 mb-1.5">
              Route to *
            </label>
            <select
              id="audience"
              className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
              {...register('audience')}
            >
              <option value="either">Either</option>
              <option value="brothers">Brothers (Imams)</option>
              <option value="sisters">Sisters (Ustadha Labibah)</option>
            </select>
          </div>
          <div>
            <label htmlFor="language" className="block text-xs font-medium text-neutral-700 mb-1.5">
              Language *
            </label>
            <select
              id="language"
              className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
              {...register('language')}
            >
              <option value="english">English</option>
              <option value="bengali">Bengali</option>
              <option value="arabic">Arabic</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="question" className="block text-xs font-medium text-neutral-700 mb-1.5">
            Your Question *
          </label>
          <textarea
            id="question"
            rows={6}
            placeholder="Describe your situation and what guidance you're seeking. Avoid sharing any personally identifying information that isn't required."
            aria-invalid={errors.question ? 'true' : undefined}
            className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 resize-none"
            {...register('question')}
          />
          {errors.question && (
            <p className="mt-1 text-xs text-rose-600">{errors.question.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || submitState.status === 'submitting'}
          className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors"
        >
          <Send className="h-3.5 w-3.5" />
          {isSubmitting || submitState.status === 'submitting'
            ? 'Submitting…'
            : 'Submit Question'}
        </button>

        <p className="text-xs text-neutral-400">
          Answers are non-binding general guidance. For time-sensitive or personal situations,
          please meet with an imam in person.
        </p>
      </div>
    </form>
  );
}
