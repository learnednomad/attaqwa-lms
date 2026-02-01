/**
 * Prayer Times Page - SEO Optimized for Local Mosque Discovery
 */

import { PrayerTimesWidget } from '@/components/features/prayer-times/prayer-times-widget';
import { generateSEOMetadata } from '@/lib/seo';
import { PrayerTimesStructuredData, BreadcrumbStructuredData, MosqueStructuredData } from '@/components/seo/StructuredData';
import type { Metadata } from 'next';
import { MOSQUE_INFO } from '@attaqwa/shared';
import { Clock, Compass, Calendar, MapPin, Phone, Mail, BookOpen, Check } from 'lucide-react';

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

const mockPrayerTimes = {
  date: new Date().toISOString().split('T')[0],
  fajr: '4:32 AM',
  sunrise: '6:15 AM',
  dhuhr: '1:15 PM',
  asr: '5:45 PM',
  maghrib: '8:20 PM',
  isha: '9:45 PM',
  qibla: 58.5,
  iqama: {
    fajr: '5:00 AM',
    dhuhr: '1:30 PM',
    asr: '6:00 PM',
    maghrib: '8:25 PM',
    isha: '10:00 PM',
  },
  jummah: ['12:30 PM', '1:15 PM'],
};

const prayerDescriptions = [
  {
    key: 'fajr',
    name: 'Fajr (Dawn Prayer)',
    time: mockPrayerTimes.fajr,
    description: 'The first prayer of the day, performed before sunrise. A time for spiritual reflection and beginning the day with remembrance of Allah.',
  },
  {
    key: 'dhuhr',
    name: 'Dhuhr (Midday Prayer)',
    time: mockPrayerTimes.dhuhr,
    description: 'The second prayer performed after the sun passes its zenith. A midday break for spiritual connection.',
  },
  {
    key: 'asr',
    name: 'Asr (Afternoon Prayer)',
    time: mockPrayerTimes.asr,
    description: 'The third prayer of the day, performed in the afternoon. A time to pause and reconnect with faith.',
  },
  {
    key: 'maghrib',
    name: 'Maghrib (Sunset Prayer)',
    time: mockPrayerTimes.maghrib,
    description: 'The fourth prayer performed just after sunset. A time to be grateful for the day and reflect on Allah\'s blessings.',
  },
  {
    key: 'isha',
    name: 'Isha (Night Prayer)',
    time: mockPrayerTimes.isha,
    description: 'The fifth and final prayer of the day, performed after twilight. A peaceful end to the day with prayer and reflection.',
  },
];

const etiquetteItems = [
  'Arrive early for community prayers',
  'Remove shoes before entering prayer hall',
  'Maintain silence during prayers',
  'Dress modestly and appropriately',
  'Turn off mobile devices',
];

const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Prayer Times', url: '/prayer-times' }
];

const stats = [
  { label: 'Daily Prayers', value: '5', icon: Clock },
  { label: 'Qibla Direction', value: `${mockPrayerTimes.qibla}°`, icon: Compass },
  { label: 'Jummah Services', value: '2', icon: Calendar },
  { label: 'Location', value: 'Doraville, GA', icon: MapPin },
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
      <PrayerTimesStructuredData
        prayerTimes={mockPrayerTimes}
        date={mockPrayerTimes.date}
      />
      <BreadcrumbStructuredData items={breadcrumbs} />
      <MosqueStructuredData />

      <div className="min-h-screen bg-white">
        {/* Header */}
        <section className="border-b border-neutral-100">
          <div className="max-w-5xl mx-auto px-6 py-16 text-center">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">
              Masjid At-Taqwa
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
              Daily Prayer Times
            </h1>
            <p className="text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed">
              Find accurate Islamic prayer times for {MOSQUE_INFO.name}.
              Join our community for daily prayers including Fajr, Dhuhr, Asr, Maghrib, and Isha.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-400">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              <time dateTime={currentDate.toISOString()}>
                {formatDate(currentDate)}
              </time>
            </div>
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

          <div className="grid gap-8 lg:grid-cols-3 pb-16">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Prayer Times Widget */}
              <section aria-labelledby="prayer-times-today">
                <div className="flex items-center gap-3 mb-6">
                  <h2 id="prayer-times-today" className="text-xl font-semibold text-neutral-900">
                    Today&apos;s Prayer Schedule
                  </h2>
                  <div className="flex-1 h-px bg-neutral-100" />
                </div>
                <PrayerTimesWidget prayerTimes={mockPrayerTimes} />
              </section>

              {/* Prayer Descriptions */}
              <section aria-labelledby="prayer-information">
                <div className="flex items-center gap-3 mb-6">
                  <h2 id="prayer-information" className="text-xl font-semibold text-neutral-900">
                    Islamic Prayer Information
                  </h2>
                  <div className="flex-1 h-px bg-neutral-100" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {prayerDescriptions.map((prayer) => (
                    <div key={prayer.key} className="rounded-xl border border-neutral-200 bg-white p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-neutral-600" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-neutral-900">
                            {prayer.name}
                          </h3>
                          <time
                            className="text-sm font-bold text-emerald-600"
                            dateTime={prayer.time}
                          >
                            {prayer.time}
                          </time>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        {prayer.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Jummah Prayer Information */}
              <section aria-labelledby="jummah-prayer">
                <div className="flex items-center gap-3 mb-6">
                  <h2 id="jummah-prayer" className="text-xl font-semibold text-neutral-900">
                    Jummah (Friday Prayer)
                  </h2>
                  <div className="flex-1 h-px bg-neutral-100" />
                </div>
                <div className="rounded-xl border border-neutral-200 bg-white p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                      <Calendar className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 mb-2">
                        Friday Congregational Prayer
                      </h3>
                      <p className="text-sm text-neutral-500 leading-relaxed mb-3">
                        Join us every Friday for Jummah prayers, an essential weekly gathering
                        for the Muslim community featuring khutbah (sermon) and congregational prayer.
                      </p>
                      <div className="flex gap-4 mb-3">
                        <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-center">
                          <p className="text-[10px] text-neutral-500 uppercase tracking-wide">First Jummah</p>
                          <p className="text-sm font-bold text-neutral-900 font-mono">12:30 PM</p>
                        </div>
                        <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-center">
                          <p className="text-[10px] text-neutral-500 uppercase tracking-wide">Second Jummah</p>
                          <p className="text-sm font-bold text-neutral-900 font-mono">1:15 PM</p>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-400">
                        Please arrive 15 minutes early. Parking available on-site and nearby locations.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-5" role="complementary">
              {/* Qibla Direction */}
              <section aria-labelledby="qibla-direction">
                <div className="rounded-xl border border-neutral-200 bg-white p-5">
                  <h3 id="qibla-direction" className="text-sm font-semibold text-neutral-900 mb-4">
                    Qibla Direction
                  </h3>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-3">
                      <Compass className="h-8 w-8 text-emerald-600" aria-hidden="true" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900">
                      {mockPrayerTimes.qibla}&deg;
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Northeast direction toward Mecca
                    </p>
                  </div>
                </div>
              </section>

              {/* Mosque Location */}
              <section aria-labelledby="mosque-location">
                <div className="rounded-xl border border-neutral-200 bg-white p-5">
                  <h3 id="mosque-location" className="text-sm font-semibold text-neutral-900 mb-4">
                    Mosque Location
                  </h3>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-neutral-900">
                        {MOSQUE_INFO.name}
                      </h4>
                      <address className="not-italic text-xs text-neutral-500 mt-0.5">
                        {MOSQUE_INFO.address}<br />
                        <a href={`tel:${MOSQUE_INFO.phone}`} className="text-emerald-600">
                          {MOSQUE_INFO.phone}
                        </a>
                      </address>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400 mt-3">
                    Easy parking available. Wheelchair accessible entrance.
                  </p>
                </div>
              </section>

              {/* Prayer Etiquette */}
              <section aria-labelledby="prayer-etiquette">
                <div className="rounded-xl border border-neutral-200 bg-white p-5">
                  <h3 id="prayer-etiquette" className="text-sm font-semibold text-neutral-900 mb-4">
                    Prayer Etiquette
                  </h3>
                  <ul className="space-y-2">
                    {etiquetteItems.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-neutral-600">
                        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Need Help */}
              <section aria-labelledby="contact-info">
                <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5">
                  <h3 id="contact-info" className="text-sm font-semibold text-neutral-900 mb-3">
                    Need Help?
                  </h3>
                  <p className="text-xs text-neutral-500 mb-3">
                    Questions about prayer times or community events?
                  </p>
                  <div className="space-y-2">
                    <a
                      href={`mailto:${MOSQUE_INFO.email}`}
                      className="flex items-center gap-2 text-xs text-emerald-600"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {MOSQUE_INFO.email}
                    </a>
                    <a
                      href={`tel:${MOSQUE_INFO.phone}`}
                      className="flex items-center gap-2 text-xs text-emerald-600"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {MOSQUE_INFO.phone}
                    </a>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
