import { CalendarDownload } from '@/components/features/calendar/calendar-download';

import {
  Calendar as CalendarIcon,
  Download,
  FileText,
  Clock,
  Star,
  Moon,
  Sparkles,
  MapPin,
  Users,
  Archive,
  Smartphone,
  Printer,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Calendar } from '@/types';
import { generateSEOMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = generateSEOMetadata({
  title: "Islamic Calendar Downloads - Masjid At-Taqwa",
  description: "Download Islamic calendars including Ramadan schedules, prayer time tables, Hijri calendar dates, and important Islamic holidays. Free PDF downloads for the Muslim community.",
  keywords: [
    "islamic calendar",
    "ramadan calendar",
    "prayer time calendar",
    "hijri calendar",
    "islamic holidays",
    "eid dates",
    "hajj calendar",
    "ramadan schedule",
    "iftar times",
    "suhur times",
    "islamic calendar pdf",
    "muslim calendar"
  ],
  canonical: "/calendar",
  type: "website"
});

// Mock calendar data - replace with actual API calls
const mockCalendars: Calendar[] = [
  {
    id: '1',
    title: 'Ramadan Calendar 2025/1446',
    description: 'Complete Ramadan schedule with daily Suhur and Iftar times, prayer times, and special programs. Includes community Iftar dates and Taraweh prayer schedules.',
    fileUrl: '/calendars/ramadan-2025.pdf',
    fileName: 'ramadan-calendar-2025.pdf',
    fileSize: 2048576,
    year: 2025,
    isActive: true,
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-02-15'),
  },
  {
    id: '2',
    title: 'Annual Prayer Times 2025',
    description: 'Complete year-round prayer times for all five daily prayers including Fajr, Dhuhr, Asr, Maghrib, and Isha. Updated monthly for daylight saving adjustments.',
    fileUrl: '/calendars/prayer-times-2025.pdf',
    fileName: 'prayer-times-2025.pdf',
    fileSize: 1536000,
    year: 2025,
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: '3',
    title: 'Islamic Holidays & Events 2025',
    description: 'Important Islamic dates including Eid ul-Fitr, Eid ul-Adha, Mawlid an-Nabi, Ashura, and other significant occasions with community event details.',
    fileUrl: '/calendars/islamic-holidays-2025.pdf',
    fileName: 'islamic-holidays-2025.pdf',
    fileSize: 1024000,
    year: 2025,
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: '4',
    title: 'Hajj Calendar & Guide 2025',
    description: 'Comprehensive Hajj calendar with important dates, pilgrimage schedule, and preparation guide for community members planning to perform Hajj.',
    fileUrl: '/calendars/hajj-guide-2025.pdf',
    fileName: 'hajj-guide-2025.pdf',
    fileSize: 3072000,
    year: 2025,
    isActive: true,
    createdAt: new Date('2025-03-01'),
    updatedAt: new Date('2025-03-10'),
  },
  {
    id: '5',
    title: 'Community Events Calendar Q2 2025',
    description: 'Quarterly calendar featuring educational workshops, youth programs, family events, and special community gatherings from April to June 2025.',
    fileUrl: '/calendars/community-events-q2-2025.pdf',
    fileName: 'community-events-q2-2025.pdf',
    fileSize: 1792000,
    year: 2025,
    isActive: true,
    createdAt: new Date('2025-03-15'),
    updatedAt: new Date('2025-03-20'),
  },
  {
    id: '6',
    title: 'Ramadan Calendar 2024/1445 (Archive)',
    description: 'Previous year Ramadan calendar for reference. Includes actual Iftar times and community program records from Ramadan 1445.',
    fileUrl: '/calendars/ramadan-2024.pdf',
    fileName: 'ramadan-calendar-2024.pdf',
    fileSize: 1920000,
    year: 2024,
    isActive: false,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-15'),
  },
];

const currentCalendars = mockCalendars.filter(cal => cal.isActive && cal.year >= 2025);
const archivedCalendars = mockCalendars.filter(cal => !cal.isActive || cal.year < 2025);

const formatFileSize = (bytes: number): string => {
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(1)} MB`;
};

const getTotalSize = (calendars: Calendar[]): number => {
  return calendars.reduce((total, cal) => total + cal.fileSize, 0);
};

const categories = [
  {
    icon: Moon,
    title: 'Ramadan Calendars',
    description: 'Comprehensive Ramadan schedules with Suhur, Iftar, and prayer times',
    detail: 'Daily Ramadan schedules including community Iftar programs and Taraweh prayers.',
    iconBg: 'bg-islamic-green-100',
    iconColor: 'text-islamic-green-600',
    buttonLabel: 'View Ramadan Calendars',
  },
  {
    icon: Clock,
    title: 'Prayer Time Schedules',
    description: 'Annual and monthly prayer time tables for daily prayers',
    detail: 'Accurate prayer times for Fajr, Dhuhr, Asr, Maghrib, and Isha throughout the year.',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    buttonLabel: 'View Prayer Schedules',
  },
  {
    icon: Sparkles,
    title: 'Islamic Holidays',
    description: 'Important Islamic dates and religious observances',
    detail: 'Eid dates, Ashura, Mawlid, and other significant Islamic calendar events.',
    iconBg: 'bg-islamic-gold-100',
    iconColor: 'text-islamic-gold-600',
    buttonLabel: 'View Holiday Calendars',
  },
  {
    icon: MapPin,
    title: 'Hajj & Umrah',
    description: 'Pilgrimage calendars and preparation guides',
    detail: 'Hajj schedules, preparation timelines, and important pilgrimage dates.',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    buttonLabel: 'View Pilgrimage Calendars',
  },
  {
    icon: Users,
    title: 'Community Events',
    description: 'Local mosque events and community programs',
    detail: 'Educational workshops, youth programs, and community gatherings schedule.',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    buttonLabel: 'View Event Calendars',
  },
  {
    icon: CalendarIcon,
    title: 'Hijri Calendar',
    description: 'Islamic lunar calendar with Gregorian equivalents',
    detail: 'Full Hijri calendar with important Islamic months and date conversions.',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    buttonLabel: 'View Hijri Calendars',
  },
];

export default function CalendarPage() {
  const ramadanCalendar = currentCalendars.find(c => c.title.includes('Ramadan'));
  const secondaryFeatured = currentCalendars.filter(c => !c.title.includes('Ramadan')).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* ─── Section 1: Hero Banner ─── */}
      <section className="relative bg-immersive-dark overflow-hidden">
        <div className="islamic-pattern-overlay absolute inset-0 pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-20 md:pb-28 md:pt-28 lg:pb-32 lg:pt-32">
          <div className="flex flex-col items-center text-center">
            {/* Arabic bismillah */}
            <p className="mb-4 text-lg text-white/60 md:text-xl" style={{ fontFamily: "'Amiri', serif" }}>
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
            </p>

            {/* Headline */}
            <h1
              className="mb-4 text-4xl font-semibold text-white md:text-5xl lg:text-6xl"
              style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '-0.03em', lineHeight: 1.1 }}
            >
              Islamic Calendar Downloads
            </h1>

            {/* Subtitle */}
            <p className="mb-10 max-w-2xl text-base text-white/70 md:text-lg">
              Access comprehensive Islamic calendars including Ramadan schedules, prayer times,
              Hijri dates, and important Islamic holidays — free for our community.
            </p>

            {/* Glass stat pills */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: 'Calendars', value: String(currentCalendars.length) },
                { label: 'Total Size', value: formatFileSize(getTotalSize(currentCalendars)) },
                { label: 'Format', value: 'PDF' },
                { label: 'Year', value: '2025' },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-xl"
                >
                  <span className="text-sm font-semibold text-white">{stat.value}</span>
                  <span className="text-xs text-white/60">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade to white */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      <div className="mx-auto max-w-6xl px-4">
        {/* ─── Section 2: Featured Calendars ─── */}
        <div className="py-12 md:py-16">
          <header className="mb-8">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-islamic-gold-100">
                <Star className="h-5 w-5 text-islamic-gold-600" />
              </div>
              <h2 className="section-heading-gradient">Featured Calendars</h2>
            </div>
            <p className="text-islamic-navy-600">
              Most popular and essential Islamic calendars for the community.
            </p>
          </header>

          {/* Hero card — Ramadan (full-width horizontal) */}
          {ramadanCalendar && (
            <div className="relative mb-6">
              <div className="pointer-events-none absolute -right-2 -top-3 z-10 rounded-full bg-islamic-green-600 px-4 py-1 text-xs font-semibold text-white shadow-lg">
                Featured
              </div>
              <CalendarDownload
                calendar={ramadanCalendar}
                featured
                className="[&>div]:md:flex-row [&>div]:md:items-center [&>div]:md:justify-between [&_button]:md:w-auto [&_p.line-clamp-3]:md:max-w-lg"
              />
            </div>
          )}

          {/* Secondary featured grid */}
          <div className="grid gap-5 md:grid-cols-3">
            {secondaryFeatured.map(calendar => (
              <CalendarDownload key={calendar.id} calendar={calendar} featured />
            ))}
          </div>
        </div>

        {/* ─── Section 3: Calendar Categories ─── */}
        <div className="pb-12 md:pb-16">
          <header className="mb-8">
            <h2 className="section-heading-gradient mb-2">Calendar Categories</h2>
            <p className="text-islamic-navy-600">
              Browse calendars by type to find exactly what you need.
            </p>
          </header>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <div key={cat.title} className="card-event overflow-hidden">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.iconBg}`}>
                      <Icon className={`h-6 w-6 ${cat.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-islamic-navy-800">{cat.title}</h3>
                      <p className="text-xs text-islamic-navy-500">{cat.description}</p>
                    </div>
                  </div>
                  <p className="mb-4 text-sm text-islamic-navy-600">{cat.detail}</p>
                  <button className="btn-islamic-secondary w-full text-sm">
                    {cat.buttonLabel}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Section 4: All Available Calendars ─── */}
        <div className="pb-12 md:pb-16">
          <header className="mb-8">
            <h2 className="section-heading-gradient mb-2">All Available Calendars (2025)</h2>
            <p className="text-islamic-navy-600">
              Complete collection of current Islamic calendars available for download.
            </p>
          </header>

          <div className="card-announcement space-y-1 overflow-hidden">
            {currentCalendars.map((calendar, i) => (
              <CalendarDownload key={calendar.id} calendar={calendar} compact index={i} />
            ))}
          </div>
        </div>

        {/* ─── Section 5: How to Use ─── */}
        <div className="pb-12 md:pb-16">
          <div className="card-event relative overflow-hidden">
            {/* Subtle geometric overlay */}
            <div className="islamic-geometric-pattern pointer-events-none absolute inset-0 opacity-30" />

            <div className="relative">
              <h3
                className="mb-6 text-2xl font-semibold text-islamic-gold-800"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                How to Use Islamic Calendars
              </h3>

              <div className="grid gap-8 md:grid-cols-2">
                {/* Mobile */}
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-islamic-gold-200">
                      <Smartphone className="h-5 w-5 text-islamic-gold-800" />
                    </div>
                    <h4 className="font-semibold text-islamic-gold-800">On Mobile Devices</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-islamic-gold-700">
                    {[
                      'Download PDF files to your device',
                      'Save to your preferred calendar app',
                      'Set prayer time reminders',
                      'Share with family and friends',
                    ].map(item => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-islamic-gold-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Print */}
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-islamic-gold-200">
                      <Printer className="h-5 w-5 text-islamic-gold-800" />
                    </div>
                    <h4 className="font-semibold text-islamic-gold-800">For Print Use</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-islamic-gold-700">
                    {[
                      'Print at home or local print shop',
                      'High-quality PDF format for clear printing',
                      'Display in your home or office',
                      'Great for community bulletin boards',
                    ].map(item => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-islamic-gold-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Section 6: Archived Calendars ─── */}
        {archivedCalendars.length > 0 && (
          <div className="pb-12 md:pb-16">
            <header className="mb-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-islamic-navy-100">
                  <Archive className="h-5 w-5 text-islamic-navy-600" />
                </div>
                <h2 className="text-2xl font-bold text-islamic-navy-800">Archived Calendars</h2>
              </div>
              <p className="text-islamic-navy-600">
                Previous years&apos; calendars available for reference and historical purposes.
              </p>
            </header>

            <div className="space-y-1 rounded-2xl border-2 border-dashed border-islamic-navy-200 bg-islamic-navy-50/50 p-4 opacity-80">
              {archivedCalendars.map((calendar, i) => (
                <CalendarDownload key={calendar.id} calendar={calendar} compact archived index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── Section 7: Newsletter CTA ─── */}
      <div className="px-4 pb-16 md:pb-20">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-immersive-dark">
          <div className="islamic-pattern-overlay pointer-events-none absolute inset-0" />

          <div className="relative px-6 py-14 text-center md:px-12 md:py-20">
            {/* Arabic line */}
            <p className="mb-3 text-base text-white/60" style={{ fontFamily: "'Amiri', serif" }}>
              وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ
            </p>

            <h3
              className="mb-4 text-3xl font-semibold text-white md:text-4xl"
              style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '-0.02em' }}
            >
              Get Calendar Updates
            </h3>

            <p className="mx-auto mb-8 max-w-xl text-white/70">
              Subscribe to receive notifications when new Islamic calendars are available.
              Be the first to know about Ramadan schedules, prayer time updates, and special event calendars.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button className="btn-cta-primary flex items-center gap-2">
                Subscribe for Updates
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="btn-cta-outline">Request Custom Calendar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
