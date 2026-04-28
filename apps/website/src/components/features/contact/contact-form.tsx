'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, MessageSquare, Send, AlertCircle } from 'lucide-react';

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().max(40).optional().or(z.literal('')),
  subject: z.enum([
    'general',
    'prayer-times',
    'education',
    'nikah',
    'funeral',
    'counseling',
    'donations',
    'events',
    'other',
  ]),
  message: z.string().min(10, 'Please share at least a few sentences').max(5000),
  preferredContact: z.enum(['email', 'phone', 'either']),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const subjectOptions: Array<{ value: ContactFormValues['subject']; label: string }> = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'prayer-times', label: 'Prayer Times' },
  { value: 'education', label: 'Islamic Education' },
  { value: 'events', label: 'Events & Programs' },
  { value: 'donations', label: 'Donations & Zakat' },
  { value: 'counseling', label: 'Religious Counseling' },
  { value: 'nikah', label: 'Nikah (Marriage) Services' },
  { value: 'funeral', label: 'Janazah (Funeral) Services' },
  { value: 'other', label: 'Other' },
];

// Client component — call our own catch-all proxy on the website's origin.
// The proxy attaches STRAPI_API_TOKEN server-side so we never need the
// public URL baked into the bundle (and avoid the localhost:1337 fallback).
const API_BASE = '';

export function ContactForm() {
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
  } = useForm<ContactFormValues>({
    // Cast works around a type mismatch between @hookform/resolvers 3.10 and zod 3.25.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(contactSchema as any),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: 'general',
      message: '',
      preferredContact: 'email',
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitState({ status: 'submitting' });
    try {
      const response = await fetch(`${API_BASE}/api/v1/contact-inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: values.phone || undefined,
            subject: values.subject,
            message: values.message,
            preferredContact: values.preferredContact,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      setSubmitState({ status: 'success' });
      reset();
    } catch (err) {
      setSubmitState({
        status: 'error',
        message:
          err instanceof Error
            ? 'We could not send your message. Please try again in a moment or call the office directly.'
            : 'Something went wrong.',
      });
    }
  };

  if (submitState.status === 'success') {
    return (
      <div className="lg:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50/40 p-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-neutral-900 mb-2">
              JazakAllahu Khayran — we&apos;ve received your message.
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed mb-4">
              A member of our team will be in touch using your preferred contact method, usually
              within one business day. If your matter is time-sensitive, please call us directly.
            </p>
            <button
              type="button"
              onClick={() => setSubmitState({ status: 'idle' })}
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              Send another message
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
      className="lg:col-span-2 rounded-xl border border-neutral-200 bg-white p-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
          <MessageSquare className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Send Us a Message</h3>
          <p className="text-xs text-neutral-500">We&apos;ll get back to you as soon as possible</p>
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
              placeholder="Your first name"
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
              placeholder="Your last name"
              aria-invalid={errors.lastName ? 'true' : undefined}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
              {...register('lastName')}
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-rose-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-medium text-neutral-700 mb-1.5">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            placeholder="your.email@example.com"
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
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
            {...register('phone')}
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-xs font-medium text-neutral-700 mb-1.5">
            Subject *
          </label>
          <select
            id="subject"
            className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
            {...register('subject')}
          >
            {subjectOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-medium text-neutral-700 mb-1.5">
            Message *
          </label>
          <textarea
            id="message"
            placeholder="Please describe your inquiry or provide any additional details..."
            rows={5}
            aria-invalid={errors.message ? 'true' : undefined}
            className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 resize-none"
            {...register('message')}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-rose-600">{errors.message.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="preferred-contact" className="block text-xs font-medium text-neutral-700 mb-1.5">
            Preferred Contact Method
          </label>
          <select
            id="preferred-contact"
            className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
            {...register('preferredContact')}
          >
            <option value="email">Email</option>
            <option value="phone">Phone Call</option>
            <option value="either">Either Email or Phone</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || submitState.status === 'submitting'}
          className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors"
        >
          <Send className="h-3.5 w-3.5" />
          {isSubmitting || submitState.status === 'submitting' ? 'Sending…' : 'Send Message'}
        </button>

        <p className="text-xs text-neutral-400">
          * Required fields. We typically respond within 24 hours during business days.
        </p>
      </div>
    </form>
  );
}
