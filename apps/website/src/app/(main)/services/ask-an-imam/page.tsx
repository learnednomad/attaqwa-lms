import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Users, Phone, Mail } from 'lucide-react';
import { AskAnImamForm } from '@/components/features/ask-an-imam/ask-an-imam-form';
import { MOSQUE_INFO } from '@/constants';

export const metadata: Metadata = {
  title: 'Ask an Imam | Masjid At-Taqwa',
  description:
    'Submit Islamic jurisprudence, halal/haram, and lifestyle questions to the imams and ustadhas at Masjid At-Taqwa. Available in English, Bengali, and Arabic.',
};

const routingNotes = [
  {
    title: 'Brothers & general questions',
    description:
      'Fiqh, Halal/Haram, worship, and Aqeedah questions answered by Imam Mohammad Zahirul Islam and Ustadh Abdullah Khan.',
    icon: BookOpen,
    contacts: [
      { label: 'Imam Mohammad Islam', value: '(678) 896-9257', href: 'tel:6788969257' },
      { label: 'Ustadh Abdullah Khan', value: '(470) 731-1314', href: 'tel:4707311314' },
    ],
  },
  {
    title: 'Sisters\' questions',
    description:
      'Questions from sisters can be routed directly to Ustadha Labibah Islam for a more comfortable channel.',
    icon: Users,
    contacts: [
      { label: 'Ustadha Labibah Islam', value: '(404) 936-7123', href: 'tel:4049367123' },
    ],
  },
];

export default function AskAnImamPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-neutral-100">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 hover:text-emerald-800 mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Services
          </Link>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">
            Islamic Legal & Religious Consultation
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            Ask an Imam
          </h1>
          <p className="text-base text-neutral-500 max-w-2xl leading-relaxed">
            Submit your question on Islamic jurisprudence (Fiqh), rulings, and everyday Islamic
            lifestyle matters. Our imams answer in English, Bengali, and Arabic.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Routing guidance */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">How questions are routed</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {routingNotes.map((block) => {
              const IconComponent = block.icon;
              return (
                <div
                  key={block.title}
                  className="rounded-xl border border-neutral-200 bg-white p-6"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                    <IconComponent className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-2">{block.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                    {block.description}
                  </p>
                  <div className="space-y-1.5">
                    {block.contacts.map((contact) => (
                      <a
                        key={contact.label}
                        href={contact.href}
                        className="flex items-center gap-2 text-xs text-emerald-700 hover:text-emerald-800"
                      >
                        <Phone className="h-3 w-3" />
                        <span className="font-medium">{contact.label}</span>
                        <span className="text-neutral-500">· {contact.value}</span>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Form */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Submit a question</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>
          <AskAnImamForm />
        </section>

        {/* Footer card */}
        <section>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6">
            <h3 className="text-sm font-semibold text-neutral-900 mb-2">
              Prefer to speak directly?
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed mb-4">
              Some topics are better discussed in person or over the phone, especially
              time-sensitive family or ritual matters. Reach out anytime.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a
                href={`tel:${MOSQUE_INFO.adminPhone.replace(/\D/g, '')}`}
                className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800"
              >
                <Phone className="h-3.5 w-3.5" />
                <span className="font-medium">{MOSQUE_INFO.adminPhone}</span>
              </a>
              <a
                href={`mailto:${MOSQUE_INFO.primaryEmail}`}
                className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800"
              >
                <Mail className="h-3.5 w-3.5" />
                <span className="font-medium">{MOSQUE_INFO.primaryEmail}</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
