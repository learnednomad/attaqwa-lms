/**
 * Prayer Times Page - SEO Optimized for Local Mosque Discovery
 */

import { generateSEOMetadata } from '@/lib/seo';
import { PrayerTimesContent } from '@/components/features/prayer-times/PrayerTimesContent';
import type { Metadata } from 'next';

export const metadata: Metadata = generateSEOMetadata({
  title: "Daily Prayer Times & Schedule - Masjid At-Taqwa",
  description: "Find accurate daily prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) for Masjid At-Taqwa. Get today's prayer schedule, Qibla direction, and Islamic prayer information for our local Muslim community.",
  keywords: [
    'prayer times today',
    'salah times',
    'fajr time',
    'dhuhr time',
    'asr time',
    'maghrib time',
    'isha time',
    'daily prayer schedule',
    'mosque prayer times',
    'islamic prayer times',
    'qibla direction',
    'adhan times',
    'muslim prayer schedule',
    'local mosque prayers',
    'masjid prayer times'
  ],
  category: 'PRAYER',
  canonical: '/prayer-times',
  type: 'article',
});

export default function PrayerTimesPage() {
  return <PrayerTimesContent />;
}
