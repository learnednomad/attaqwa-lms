/**
 * Prayer Times Page - SEO Optimized for Local Mosque Discovery
 * Comprehensive prayer time information with Islamic content optimization
 */

import { PrayerTimesWidget } from '@/components/features/prayer-times/prayer-times-widget';
import { QiblaCompass } from '@/components/features/prayer-times/QiblaCompass';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { generateSEOMetadata } from '@/lib/seo';
import { PrayerTimesStructuredData, BreadcrumbStructuredData, MosqueStructuredData } from '@/components/seo/StructuredData';
import type { Metadata } from 'next';
import { MOSQUE_INFO } from '@attaqwa/shared';
import { Clock, Compass, Calendar, MapPin } from 'lucide-react';

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

// Mock prayer times data - replace with actual API call
const mockPrayerTimes = {
  date: new Date().toISOString().split('T')[0],
  fajr: '4:32 AM',
  sunrise: '6:15 AM', 
  dhuhr: '1:15 PM',
  asr: '5:45 PM',
  maghrib: '8:20 PM',
  isha: '9:45 PM',
  qibla: 58.5,
};

// Prayer time descriptions for SEO and user education
const prayerDescriptions = {
  fajr: {
    name: 'Fajr (Dawn Prayer)',
    description: 'The first prayer of the day, performed before sunrise. A time for spiritual reflection and beginning the day with remembrance of Allah.',
    time: mockPrayerTimes.fajr,
  },
  dhuhr: {
    name: 'Dhuhr (Midday Prayer)', 
    description: 'The second prayer performed after the sun passes its zenith. A midday break for spiritual connection.',
    time: mockPrayerTimes.dhuhr,
  },
  asr: {
    name: 'Asr (Afternoon Prayer)',
    description: 'The third prayer of the day, performed in the afternoon. A time to pause and reconnect with faith.',
    time: mockPrayerTimes.asr,
  },
  maghrib: {
    name: 'Maghrib (Sunset Prayer)',
    description: 'The fourth prayer performed just after sunset. A time to be grateful for the day and reflect on Allah\'s blessings.',
    time: mockPrayerTimes.maghrib,
  },
  isha: {
    name: 'Isha (Night Prayer)',
    description: 'The fifth and final prayer of the day, performed after twilight. A peaceful end to the day with prayer and reflection.',
    time: mockPrayerTimes.isha,
  },
};

const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Prayer Times', url: '/prayer-times' }
];

export default function PrayerTimesPage() {
  const currentDate = new Date();
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <PrayerTimesStructuredData 
        prayerTimes={mockPrayerTimes} 
        date={mockPrayerTimes.date}
      />
      <BreadcrumbStructuredData items={breadcrumbs} />
      <MosqueStructuredData />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <header className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-islamic-navy-800 md:text-5xl">
            Daily Prayer Times
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-islamic-navy-600 md:text-xl">
            Find accurate Islamic prayer times for {MOSQUE_INFO.name}. 
            Join our community for daily prayers including Fajr, Dhuhr, Asr, Maghrib, and Isha.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-islamic-navy-500">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <time dateTime={currentDate.toISOString()}>
              {formatDate(currentDate)}
            </time>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Prayer Times Widget */}
          <div className="lg:col-span-2">
            <section aria-labelledby="prayer-times-today">
              <h2 id="prayer-times-today" className="mb-6 text-2xl font-bold text-islamic-navy-800">
                Today's Prayer Schedule
              </h2>
              <PrayerTimesWidget
                prayerTimes={mockPrayerTimes}
              />
            </section>

            <Separator className="my-8" />

            {/* Prayer Descriptions for SEO and Education */}
            <section aria-labelledby="prayer-information">
              <h2 id="prayer-information" className="mb-6 text-2xl font-bold text-islamic-navy-800">
                Islamic Prayer Information
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {Object.entries(prayerDescriptions).map(([key, prayer]) => (
                  <Card key={key} className="p-6">
                    <header className="mb-3 flex items-center gap-3">
                      <Clock className="h-5 w-5 text-islamic-green-600" aria-hidden="true" />
                      <div>
                        <h3 className="font-semibold text-islamic-navy-800">
                          {prayer.name}
                        </h3>
                        <time 
                          className="text-lg font-bold text-islamic-green-600"
                          dateTime={prayer.time}
                        >
                          {prayer.time}
                        </time>
                      </div>
                    </header>
                    <p className="text-sm text-islamic-navy-600">
                      {prayer.description}
                    </p>
                  </Card>
                ))}
              </div>
            </section>

            <Separator className="my-8" />

            {/* Jummah Prayer Information */}
            <section aria-labelledby="jummah-prayer">
              <h2 id="jummah-prayer" className="mb-4 text-2xl font-bold text-islamic-navy-800">
                Jummah (Friday Prayer)
              </h2>
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <Calendar className="mt-1 h-6 w-6 text-islamic-green-600" aria-hidden="true" />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-islamic-navy-800">
                      Friday Congregational Prayer
                    </h3>
                    <p className="mb-3 text-islamic-navy-600">
                      Join us every Friday for Jummah prayers, an essential weekly gathering 
                      for the Muslim community featuring khutbah (sermon) and congregational prayer.
                    </p>
                    <div className="mb-3">
                      <strong className="text-islamic-green-600">First Jummah:</strong> 12:30 PM<br />
                      <strong className="text-islamic-green-600">Second Jummah:</strong> 1:15 PM
                    </div>
                    <p className="text-sm text-islamic-navy-500">
                      Please arrive 15 minutes early. Parking available on-site and nearby locations.
                    </p>
                  </div>
                </div>
              </Card>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8" role="complementary">
            {/* Qibla Direction */}
            <section aria-labelledby="qibla-direction">
              <h3 id="qibla-direction" className="mb-4 text-lg font-semibold text-islamic-navy-800">
                Qibla Direction
              </h3>
              <Card className="p-6">
                <div className="text-center">
                  <Compass className="mx-auto mb-3 h-12 w-12 text-islamic-green-600" aria-hidden="true" />
                  <div className="mb-2">
                    <span className="text-2xl font-bold text-islamic-green-600">
                      {mockPrayerTimes.qibla}°
                    </span>
                  </div>
                  <p className="text-sm text-islamic-navy-600">
                    Northeast direction toward Mecca
                  </p>
                </div>
              </Card>
            </section>

            {/* Mosque Location */}
            <section aria-labelledby="mosque-location">
              <h3 id="mosque-location" className="mb-4 text-lg font-semibold text-islamic-navy-800">
                Mosque Location
              </h3>
              <Card className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 text-islamic-green-600" aria-hidden="true" />
                    <div>
                      <h4 className="font-semibold text-islamic-navy-800">
                        {MOSQUE_INFO.name}
                      </h4>
                      <address className="not-italic text-sm text-islamic-navy-600">
                        {MOSQUE_INFO.address}<br />
                        <a href={`tel:${MOSQUE_INFO.phone}`} className="text-islamic-green-600 hover:underline">
                          {MOSQUE_INFO.phone}
                        </a>
                      </address>
                    </div>
                  </div>
                  <p className="text-xs text-islamic-navy-500">
                    Easy parking available. Wheelchair accessible entrance.
                  </p>
                </div>
              </Card>
            </section>

            {/* Prayer Etiquette */}
            <section aria-labelledby="prayer-etiquette">
              <h3 id="prayer-etiquette" className="mb-4 text-lg font-semibold text-islamic-navy-800">
                Prayer Etiquette
              </h3>
              <Card className="p-6">
                <ul className="space-y-2 text-sm text-islamic-navy-600">
                  <li className="flex gap-2">
                    <span className="text-islamic-green-600">•</span>
                    Arrive early for community prayers
                  </li>
                  <li className="flex gap-2">
                    <span className="text-islamic-green-600">•</span>
                    Remove shoes before entering prayer hall
                  </li>
                  <li className="flex gap-2">
                    <span className="text-islamic-green-600">•</span>
                    Maintain silence during prayers
                  </li>
                  <li className="flex gap-2">
                    <span className="text-islamic-green-600">•</span>
                    Dress modestly and appropriately
                  </li>
                  <li className="flex gap-2">
                    <span className="text-islamic-green-600">•</span>
                    Turn off mobile devices
                  </li>
                </ul>
              </Card>
            </section>

            {/* Contact Information */}
            <section aria-labelledby="contact-info">
              <h3 id="contact-info" className="mb-4 text-lg font-semibold text-islamic-navy-800">
                Need Help?
              </h3>
              <Card className="p-6">
                <p className="mb-3 text-sm text-islamic-navy-600">
                  Questions about prayer times or community events?
                </p>
                <div className="space-y-2 text-sm">
                  <a 
                    href={`mailto:${MOSQUE_INFO.email}`} 
                    className="block text-islamic-green-600 hover:underline"
                  >
                    {MOSQUE_INFO.email}
                  </a>
                  <a 
                    href={`tel:${MOSQUE_INFO.phone}`} 
                    className="block text-islamic-green-600 hover:underline"
                  >
                    {MOSQUE_INFO.phone}
                  </a>
                </div>
              </Card>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}