import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Book, Compass, Calendar, ChevronRight, GraduationCap, FileText, Headphones } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Islamic Resources | Masjid At-Taqwa',
  description: 'Access Quran study, authentic Hadith collections, Qibla direction, and Islamic calendar resources',
};

const stats = [
  { label: 'Quran Verses', value: '6,236' },
  { label: 'Sahih Hadiths', value: '7,000+' },
  { label: 'Qibla Compass', value: '360\u00B0' },
  { label: 'Hijri Year', value: '1445' },
];

const resources = [
  {
    id: 'quran-study',
    title: 'Quran Study & Tafsir',
    description: 'Daily Ayah with complete Tafsir and contextual study of the Holy Quran',
    href: '/resources/quran-study',
    icon: BookOpen,
    features: [
      'Ayah of the Day with Tafsir',
      'Surah Al-Baqarah contextual groups',
      'Audio recitation',
      'Translation and explanation'
    ]
  },
  {
    id: 'hadith-collections',
    title: 'Hadith Collections',
    description: 'Authentic narrations from Sahih Bukhari, Muslim, and other verified sources',
    href: '/resources/hadith-collections',
    icon: Book,
    features: [
      'Only Sahih (authentic) Hadiths',
      'Six major collections',
      'Arabic with translations',
      'Daily Hadith feature'
    ]
  },
  {
    id: 'qibla-direction',
    title: 'Qibla Direction',
    description: 'Find the accurate direction to the Holy Kaaba for your prayers',
    href: '/resources/qibla-direction',
    icon: Compass,
    features: [
      'Real-time compass',
      'Location detection',
      'Distance to Kaaba',
      'Visual guidance'
    ]
  },
  {
    id: 'islamic-calendar',
    title: 'Islamic Calendar',
    description: 'Hijri calendar with important Islamic dates, events, and observances',
    href: '/resources/islamic-calendar',
    icon: Calendar,
    features: [
      'Live Hijri date',
      'Islamic events',
      'Sacred months',
      'Moon phases'
    ]
  }
];

const comingSoon = [
  { title: 'Islamic Courses', description: 'Structured learning programs for all levels', icon: GraduationCap },
  { title: 'Dua Collections', description: 'Daily supplications and prayers', icon: FileText },
  { title: 'Audio Library', description: 'Lectures, recitations, and nasheed', icon: Headphones },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">
            Masjid At-Taqwa
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            Islamic Resources
          </h1>
          <p className="text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Access authentic Islamic knowledge, tools, and guidance for your spiritual journey
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        {/* Stats */}
        <section className="py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-neutral-200 bg-white p-5 text-center">
                <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                <p className="text-xs text-neutral-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Resources */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Explore Resources</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {resources.map((resource) => {
              const IconComponent = resource.icon;
              return (
                <Link
                  key={resource.id}
                  href={resource.href}
                  className="block rounded-xl border border-neutral-200 bg-white p-6 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                        <IconComponent className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-900">
                          {resource.title}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                          {resource.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-300 shrink-0 mt-0.5" />
                  </div>

                  <ul className="space-y-1.5 ml-[52px]">
                    {resource.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-xs text-neutral-600">
                        <div className="w-1 h-1 bg-emerald-400 rounded-full shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Coming Soon */}
        <section className="pb-16">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6 sm:p-8">
            <h3 className="text-base font-semibold text-neutral-900 mb-1">
              More Resources Coming Soon
            </h3>
            <p className="text-sm text-neutral-500 mb-6">
              We&apos;re continuously adding new resources to support your Islamic learning journey
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              {comingSoon.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.title} className="rounded-lg border border-neutral-200 bg-white p-4">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-7 h-7 rounded-md bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                        <IconComponent className="h-3.5 w-3.5 text-neutral-500" />
                      </div>
                      <h4 className="text-sm font-medium text-neutral-900">{item.title}</h4>
                    </div>
                    <p className="text-xs text-neutral-500">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Attribution */}
        <section className="pb-20">
          <p className="text-center text-xs text-neutral-400">
            Powered by authentic Islamic APIs: Sunnah.com &bull; Al-Quran Cloud &bull; Aladhan
          </p>
        </section>
      </div>
    </div>
  );
}
