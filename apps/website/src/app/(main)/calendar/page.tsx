import { CalendarDownload } from '@/components/features/calendar/calendar-download';
import {
  Calendar as CalendarIcon,
  Download,
  FileText,
  Clock,
  Moon,
  MapPin,
  Users,
  Archive,
  Smartphone,
  Printer,
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

const stats = [
  { label: 'Calendars', value: String(currentCalendars.length), icon: CalendarIcon },
  { label: 'Total Size', value: formatFileSize(getTotalSize(currentCalendars)), icon: Download },
  { label: 'Format', value: 'PDF', icon: FileText },
  { label: 'Year', value: '2025', icon: Clock },
];

const categories = [
  { icon: Moon, title: 'Ramadan Calendars', description: 'Comprehensive Ramadan schedules with Suhur, Iftar, and prayer times' },
  { icon: Clock, title: 'Prayer Time Schedules', description: 'Annual and monthly prayer time tables for daily prayers' },
  { icon: CalendarIcon, title: 'Islamic Holidays', description: 'Important Islamic dates and religious observances' },
  { icon: MapPin, title: 'Hajj & Umrah', description: 'Pilgrimage calendars and preparation guides' },
  { icon: Users, title: 'Community Events', description: 'Local mosque events and community programs' },
  { icon: CalendarIcon, title: 'Hijri Calendar', description: 'Islamic lunar calendar with Gregorian equivalents' },
];

export default function CalendarPage() {
  const ramadanCalendar = currentCalendars.find(c => c.title.includes('Ramadan'));
  const secondaryFeatured = currentCalendars.filter(c => !c.title.includes('Ramadan')).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">
            Masjid At-Taqwa
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            Islamic Calendar Downloads
          </h1>
          <p className="text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Access comprehensive Islamic calendars including Ramadan schedules, prayer times,
            Hijri dates, and important Islamic holidays — free for our community.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        {/* Stats */}
        <section className="py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.label} className="rounded-xl border border-neutral-200 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      <IconComponent className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-neutral-900 leading-tight">{stat.value}</p>
                      <p className="text-xs text-neutral-500">{stat.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Featured Calendars */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Featured Calendars</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          {ramadanCalendar && (
            <div className="mb-5">
              <CalendarDownload calendar={ramadanCalendar} featured />
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-5">
            {secondaryFeatured.map(calendar => (
              <CalendarDownload key={calendar.id} calendar={calendar} featured />
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Calendar Categories</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <div key={cat.title} className="rounded-xl border border-neutral-200 bg-white p-5">
                  <div className="w-9 h-9 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-4">
                    <Icon className="h-4 w-4 text-neutral-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1">{cat.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">{cat.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* All Available Calendars */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">All Available Calendars (2025)</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
            {currentCalendars.map((calendar, i) => (
              <CalendarDownload key={calendar.id} calendar={calendar} compact index={i} />
            ))}
          </div>
        </section>

        {/* How to Use */}
        <section className="pb-16">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6 sm:p-8">
            <h3 className="text-base font-semibold text-neutral-900 mb-6">
              How to Use Islamic Calendars
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                    <Smartphone className="h-4 w-4 text-neutral-600" />
                  </div>
                  <h4 className="text-sm font-medium text-neutral-900">On Mobile Devices</h4>
                </div>
                <ul className="space-y-2">
                  {[
                    'Download PDF files to your device',
                    'Save to your preferred calendar app',
                    'Set prayer time reminders',
                    'Share with family and friends',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-neutral-600">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                    <Printer className="h-4 w-4 text-neutral-600" />
                  </div>
                  <h4 className="text-sm font-medium text-neutral-900">For Print Use</h4>
                </div>
                <ul className="space-y-2">
                  {[
                    'Print at home or local print shop',
                    'High-quality PDF format for clear printing',
                    'Display in your home or office',
                    'Great for community bulletin boards',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-neutral-600">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Archived */}
        {archivedCalendars.length > 0 && (
          <section className="pb-16">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">Archived Calendars</h2>
              <div className="flex-1 h-px bg-neutral-100" />
            </div>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 overflow-hidden">
              {archivedCalendars.map((calendar, i) => (
                <CalendarDownload key={calendar.id} calendar={calendar} compact archived index={i} />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="pb-20">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-8 sm:p-10 text-center">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Get Calendar Updates
            </h3>
            <p className="text-sm text-neutral-500 max-w-xl mx-auto mb-6 leading-relaxed">
              Subscribe to receive notifications when new Islamic calendars are available.
              Be the first to know about Ramadan schedules, prayer time updates, and special event calendars.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white"
              >
                Subscribe for Updates
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700"
              >
                Request Custom Calendar
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
