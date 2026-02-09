"use client";

import { generatePrayerTimesStructuredData, generateEventStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Essential icons
import { Calendar, Megaphone } from 'lucide-react';

// Section Header component
import { SectionHeader } from '@/components/ui/section-header';

// Types
import type { Announcement, Event, DailyPrayerTimes } from '@/types';

// Data hooks
import { useTodayPrayerTimes } from '@/lib/hooks/usePrayerTimes';
import { useAnnouncements } from '@/lib/hooks/useAnnouncements';
import { useEvents } from '@/lib/hooks/useEvents';

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

import { IslamicServicesGrid } from '@/components/features/islamic-services/islamic-services-grid';
import { MosquePrayerTimesSection } from '@/components/features/prayer-times/mosque-prayer-times-section';

// Fallback data for when APIs are unavailable
const fallbackAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Welcome to Masjid At-Taqwa',
    content: '<p>Stay connected with our community for the latest announcements, prayer schedule changes, and upcoming events.</p>',
    category: 'general',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const fallbackEvents: Event[] = [
  {
    id: '1',
    title: 'Jummah Prayer',
    description: 'Join us every Friday for Jummah prayers with khutbah and congregational prayer.',
    date: new Date().toISOString(),
    startTime: '12:30 PM',
    endTime: '2:00 PM',
    location: 'Masjid At-Taqwa',
    isIndoor: true,
    category: 'community',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function Home() {
  // Fetch real data from APIs
  const { data: prayerTimesData } = useTodayPrayerTimes();
  const { data: announcementsData } = useAnnouncements({ limit: 3, isActive: true });
  const { data: eventsData } = useEvents({ limit: 3, isActive: true });

  // Use real data or fallbacks
  const announcements = announcementsData?.data?.length
    ? announcementsData.data
    : fallbackAnnouncements;

  const events = eventsData?.data?.length
    ? eventsData.data
    : fallbackEvents;

  // Structured data generation with error handling
  let prayerTimesStructuredData = null;
  let eventsStructuredData: any[] = [];
  let breadcrumbStructuredData = null;

  if (prayerTimesData) {
    try {
      prayerTimesStructuredData = generatePrayerTimesStructuredData(prayerTimesData, prayerTimesData.date);
    } catch (error) {
      console.warn('Failed to generate prayer times structured data:', error);
    }
  }

  try {
    eventsStructuredData = events.map(event => generateEventStructuredData(event));
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
      <ImmersiveHero prayerTimes={prayerTimesData} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Hadith of the Day - Image+Hadith */}
        {prayerTimesData && (
          <section>
            <MosquePrayerTimesSection location="Doraville, Georgia" prayerTimes={prayerTimesData} />
          </section>
        )}

        {/* Islamic Services Grid */}
        <section className="mt-12 md:mt-16">
          <IslamicServicesGrid />
        </section>

        {/* Announcements & Events */}
        <div className="mt-12 md:mt-16 grid gap-6 lg:gap-8 lg:grid-cols-2">
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
              {announcements.slice(0, 1).map((announcement) => (
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
              {events.slice(0, 1).map((event) => (
                <Suspense key={event.id} fallback={<div className="animate-pulse h-32 bg-gray-100 rounded-lg" />}>
                  <EventCard event={event} />
                </Suspense>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
