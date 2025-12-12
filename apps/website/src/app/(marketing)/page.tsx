"use client";

import { generatePrayerTimesStructuredData, generateEventStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Suspense, useState, useEffect } from 'react';

// Core UI components
import { Button } from '@/components/ui/button';

// Essential icons
import { Clock, Calendar, BookOpen, ArrowRight, Moon, Sparkles, Star, Activity, CheckCircle, Zap, Users, Download, Megaphone } from 'lucide-react';

// Section Header component
import { SectionHeader } from '@/components/ui/section-header';

// Types
import type { Announcement, Event, Calendar as CalendarType, DailyPrayerTimes } from '@/types';

// New immersive components
import { ImmersiveHero } from '@/components/features/hero/immersive-hero';
import { FloatingHeader } from '@/components/layout/floating-header';

// Performance-optimized dynamic component loading
const AnnouncementCard = dynamic(() => import('@/components/features/announcements/announcement-card').then(mod => ({ default: mod.AnnouncementCard })), {
  loading: () => <div className="animate-pulse h-32 bg-islamic-green/10 rounded-xl border border-islamic-green/20 flex items-center justify-center"><div className="text-islamic-green-600 text-sm">Loading announcement...</div></div>,
  ssr: true
});

const EventCard = dynamic(() => import('@/components/features/events/event-card').then(mod => ({ default: mod.EventCard })), {
  loading: () => <div className="animate-pulse h-28 bg-islamic-gold/10 rounded-xl border border-islamic-gold/20 flex items-center justify-center"><div className="text-islamic-gold-600 text-sm">Loading event...</div></div>,
  ssr: true
});

const CalendarDownload = dynamic(() => import('@/components/features/calendar/calendar-download').then(mod => ({ default: mod.CalendarDownload })), {
  loading: () => <div className="animate-pulse h-24 bg-islamic-navy/10 rounded-xl border border-islamic-navy/20 flex items-center justify-center"><div className="text-islamic-navy-600 text-sm">Loading calendar...</div></div>,
  ssr: true
});

const PrayerTimesWidget = dynamic(() => import('@/components/features/prayer-times/prayer-times-widget').then(mod => ({ default: mod.PrayerTimesWidget })), {
  loading: () => (
    <div className="animate-pulse h-96 bg-gradient-to-br from-islamic-green-50 to-islamic-gold-50 rounded-xl border border-islamic-green/20 flex items-center justify-center p-6">
      <div className="text-center space-y-2">
        <div className="text-islamic-green-600 font-medium">Loading Prayer Times...</div>
        <div className="text-xs text-islamic-navy-500">Please wait while we fetch today&apos;s prayer schedule</div>
      </div>
    </div>
  )
});

import { IslamicServicesGrid } from '@/components/features/islamic-services/islamic-services-grid';
import { MosquePrayerTimesSection } from '@/components/features/prayer-times/mosque-prayer-times-section';

// Mock data
const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Eid ul-Fitr Sunday March 30, 2025',
    content: '<p>Insha\'Allah Eid will be on Sunday March 30, 2025. <strong>Zakat ul Fitr $10/person</strong> and should be paid prior to Eid ul Fitr Salah.</p><p>As always, 1st Salah, we will be praying outside in the parking lot. 2nd Salah will be inside the masjid.</p><ul><li><strong>1st Salah:</strong> 8:30am</li><li><strong>2nd Salah:</strong> 9:30am</li><li>We are humbly requesting everyone to come in a group instead of individual cars due to limited parking space</li><li>Please follow the direction of our volunteer brothers for parking</li></ul>',
    date: new Date('2025-03-30'),
    time: '8:30 AM & 9:30 AM',
    isActive: true,
    isArchived: false,
    createdAt: new Date('2025-03-15'),
    updatedAt: new Date('2025-03-20'),
  },
  {
    id: '2',
    title: 'Eid-Al-Adha Friday June 6th, 2025',
    content: '<p>Insha\'Allah Eid-Al-Adha will be on Friday June 6th, 2025.</p><p>As always, 1st Salah, we will be praying outside in the parking lot. 2nd Salah will be inside the masjid.</p><ul><li><strong>1st Salah:</strong> 8:00am</li><li><strong>2nd Salah:</strong> 9:00am</li><li>We are humbly requesting everyone to come in a group instead of individual cars due to limited parking space</li><li>Please follow the direction of our volunteer brothers for parking</li></ul>',
    date: new Date('2025-06-06'),
    time: '8:00 AM & 9:00 AM',
    isActive: true,
    isArchived: false,
    createdAt: new Date('2025-03-15'),
    updatedAt: new Date('2025-03-20'),
  },
  {
    id: '3',
    title: 'Ramadan Mubarak - Tarawee and Daily Programs',
    content: '<p><strong>RAMADAN MUBARAK!!!</strong> InshaAllah, we will have our 1st Tarawee tonight after Isha and it will be 20 rakhat.</p><ul><li>Daily brief tafseer and dua will start before maghrib</li><li>Daily Tahajjud will start at 4:45am</li><li>Community iftar will be served throughout the month of ramadan</li><li><strong>Tarawee Prayer:</strong> 20 rakhat after Isha prayer</li></ul>',
    date: new Date('2025-02-28'),
    time: 'After Isha & 4:45 AM',
    isActive: true,
    isArchived: false,
    createdAt: new Date('2025-02-20'),
    updatedAt: new Date('2025-02-25'),
  },
];

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Eid ul-Fitr 2025',
    description: 'Celebrate the end of Ramadan with our community. Multiple prayer times available with outdoor arrangements.',
    date: new Date('2025-03-30'),
    startTime: '8:30 AM',
    endTime: '11:00 AM',
    location: 'Masjid At-Taqwa',
    isIndoor: true,
    isOutdoor: true,
    prayerTimes: [
      { name: '1st Prayer', time: '8:30 AM', location: 'Parking Lot (Outdoor)' },
      { name: '2nd Prayer', time: '9:30 AM', location: 'Inside Masjid' },
    ],
    zakatInfo: {
      amount: 10,
      currency: 'USD',
      description: 'per person',
    },
    isActive: true,
    createdAt: new Date('2025-03-01'),
    updatedAt: new Date('2025-03-15'),
  },
  {
    id: '2',
    title: 'Eid-Al-Adha 2025',
    description: 'Join us for Eid-Al-Adha prayers and celebration. Multiple prayer times with outdoor and indoor arrangements.',
    date: new Date('2025-06-06'),
    startTime: '8:00 AM',
    endTime: '10:30 AM',
    location: 'Masjid At-Taqwa',
    isIndoor: true,
    isOutdoor: true,
    prayerTimes: [
      { name: '1st Prayer', time: '8:00 AM', location: 'Parking Lot (Outdoor)' },
      { name: '2nd Prayer', time: '9:00 AM', location: 'Inside Masjid' },
    ],
    isActive: true,
    createdAt: new Date('2025-03-01'),
    updatedAt: new Date('2025-03-15'),
  },
  {
    id: '3',
    title: 'Hifz Graduation 2025',
    description: 'Celebrating the achievement of students who have completed memorization of the Holy Quran.',
    date: new Date('2025-06-15'),
    startTime: '6:00 PM',
    endTime: '8:00 PM',
    location: 'Masjid At-Taqwa',
    isIndoor: true,
    isOutdoor: false,
    isActive: true,
    createdAt: new Date('2025-03-01'),
    updatedAt: new Date('2025-03-15'),
  },
];

const mockPrayerTimes: DailyPrayerTimes = {
  date: '2025-08-26',
  fajr: '5:41 AM',
  sunrise: '7:07 AM',
  dhuhr: '1:40 PM',
  asr: '5:19 PM',
  maghrib: '8:15 PM',
  isha: '9:34 PM',
  qibla: 58.5,
  iqama: {
    fajr: '6:15 AM',
    dhuhr: '2:00 PM',
    asr: '6:30 PM',
    maghrib: '+5 min',
    isha: '10:00 PM',
  },
  jummah: ['2:00 PM', '2:30 PM'],
};

export default function Home() {
  // Structured data generation with error handling
  let prayerTimesStructuredData = null;
  let eventsStructuredData: any[] = [];
  let breadcrumbStructuredData = null;

  try {
    prayerTimesStructuredData = generatePrayerTimesStructuredData(mockPrayerTimes, mockPrayerTimes.date);
  } catch (error) {
    console.warn('Failed to generate prayer times structured data:', error);
  }

  try {
    eventsStructuredData = mockEvents.map(event => generateEventStructuredData(event));
  } catch (error) {
    console.warn('Failed to generate events structured data:', error);
  }

  try {
    breadcrumbStructuredData = generateBreadcrumbStructuredData([
      { name: 'Home', url: '/' }
    ]);
  } catch (error) {
    console.warn('Failed to generate breadcrumb structured data:', error);
  }

  return (
    <>
      {/* Structured Data for SEO */}
      {prayerTimesStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(prayerTimesStructuredData),
          }}
        />
      )}
      {eventsStructuredData.map((eventData, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(eventData),
          }}
        />
      ))}
      {breadcrumbStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbStructuredData),
          }}
        />
      )}

      {/* Floating Header - Overlays hero */}
      <FloatingHeader />

      {/* Immersive Hero Section */}
      <ImmersiveHero />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Prayer Times Section */}
        <section className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <MosquePrayerTimesSection location="Doraville, Georgia" prayerTimes={mockPrayerTimes} />
        </section>

        {/* Islamic Services Grid */}
        <section className="mt-12 md:mt-16 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <IslamicServicesGrid />
        </section>

        {/* Main content grid */}
        <div className="mt-12 md:mt-16 grid gap-8 lg:grid-cols-3">
          {/* Main Content Column */}
          <article className="lg:col-span-2 space-y-12">
            {/* Announcements Section */}
            <section aria-labelledby="announcements-heading">
              <SectionHeader
                icon={<Megaphone className="w-5 h-5" />}
                title="Community Announcements"
                subtitle="Latest updates from Masjid At-Taqwa"
                viewAllHref="/announcements"
                accentColor="emerald"
              />

              <div className="space-y-4">
                {mockAnnouncements.slice(0, 1).map((announcement) => (
                  <Suspense key={announcement.id} fallback={<div className="animate-pulse h-24 bg-gray-100 rounded-lg" />}>
                    <AnnouncementCard announcement={announcement} />
                  </Suspense>
                ))}
              </div>
            </section>

            {/* Events Section */}
            <section aria-labelledby="events-heading">
              <SectionHeader
                icon={<Calendar className="w-5 h-5" />}
                title="Upcoming Events"
                subtitle="Join our vibrant community gatherings"
                viewAllHref="/events"
                accentColor="amber"
              />

              <div className="space-y-4">
                {mockEvents.slice(0, 1).map((event) => (
                  <Suspense key={event.id} fallback={<div className="animate-pulse h-32 bg-gray-100 rounded-lg" />}>
                    <EventCard event={event} />
                  </Suspense>
                ))}
              </div>
            </section>
          </article>

          {/* Sidebar */}
          <aside className="space-y-8 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            {/* Prayer Times Widget */}
            <section className="rounded-xl overflow-hidden bg-gradient-to-br from-islamic-green-50 via-white to-islamic-gold-50/30 p-1 shadow-xl shadow-islamic-green/10">
              <div className="bg-white rounded-lg">
                <Suspense fallback={<div className="animate-pulse h-96 bg-islamic-green/10" />}>
                  <PrayerTimesWidget prayerTimes={mockPrayerTimes} currentPrayer="dhuhr" />
                </Suspense>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="rounded-xl overflow-hidden bg-gradient-to-br from-white via-islamic-navy-50/30 to-islamic-gold-50/20 border border-islamic-navy/10 shadow-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-6 w-6 text-islamic-navy-600" />
                <h3 className="font-bold text-lg text-islamic-navy-800">Quick Actions</h3>
              </div>

              <nav className="space-y-3">
                <Link href="/donate" className="block">
                  <Button className="w-full justify-start gap-3 border border-islamic-green/20 bg-gradient-to-r from-islamic-green-50 to-transparent hover:from-islamic-green-100" variant="outline">
                    <span className="text-lg">💚</span>
                    <span className="text-islamic-navy-700 font-medium">Make a Donation</span>
                  </Button>
                </Link>

                <Link href="/contact" className="block">
                  <Button className="w-full justify-start gap-3 border border-islamic-navy/20 bg-gradient-to-r from-islamic-navy-50 to-transparent hover:from-islamic-navy-100" variant="outline">
                    <span className="text-lg">📧</span>
                    <span className="text-islamic-navy-700 font-medium">Contact Us</span>
                  </Button>
                </Link>

                <Link href="/education" className="block">
                  <Button className="w-full justify-start gap-3 border border-islamic-green/20 bg-gradient-to-r from-islamic-green-50 to-transparent hover:from-islamic-green-100" variant="outline">
                    <span className="text-lg">📚</span>
                    <span className="text-islamic-navy-700 font-medium">Islamic Education</span>
                  </Button>
                </Link>
              </nav>
            </section>

            {/* Islamic Resources */}
            <section className="rounded-xl overflow-hidden bg-gradient-to-br from-white via-islamic-navy-50/30 to-islamic-green-50/20 border border-islamic-navy/10 shadow-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-6 w-6 text-islamic-green-600" />
                <h3 className="font-bold text-lg text-islamic-green-700">Islamic Resources</h3>
              </div>

              <nav className="space-y-3">
                <Link href="/resources/quran-study" className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-islamic-green-50 to-transparent border border-islamic-green/10 hover:border-islamic-green/30 transition-all duration-300 group">
                  <span className="text-lg">📖</span>
                  <span className="text-sm font-medium text-islamic-navy-700 group-hover:text-islamic-green-700">Quran Study & Tafsir</span>
                  <ArrowRight className="h-3 w-3 ml-auto text-islamic-green-600 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>

                <Link href="/resources/hadith-collections" className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-islamic-navy-50 to-transparent border border-islamic-navy/10 hover:border-islamic-navy/30 transition-all duration-300 group">
                  <span className="text-lg">📚</span>
                  <span className="text-sm font-medium text-islamic-navy-700 group-hover:text-islamic-navy-800">Hadith Collections</span>
                  <ArrowRight className="h-3 w-3 ml-auto text-islamic-navy-600 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>

                <Link href="/resources/qibla-direction" className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-islamic-gold-50 to-transparent border border-islamic-gold/10 hover:border-islamic-gold/30 transition-all duration-300 group">
                  <span className="text-lg">🧭</span>
                  <span className="text-sm font-medium text-islamic-navy-700 group-hover:text-islamic-gold-700">Qibla Direction</span>
                  <ArrowRight className="h-3 w-3 ml-auto text-islamic-gold-600 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              </nav>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}
