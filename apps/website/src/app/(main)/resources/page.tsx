import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Book, Compass, Calendar, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Islamic Resources | Masjid At-Taqwa',
  description: 'Access Quran study, authentic Hadith collections, Qibla direction, and Islamic calendar resources',
};

const resources = [
  {
    id: 'quran-study',
    title: 'Quran Study & Tafsir',
    description: 'Daily Ayah with complete Tafsir and contextual study of the Holy Quran',
    href: '/resources/quran-study',
    icon: '📖',
    iconComponent: BookOpen,
    gradient: 'from-islamic-green-500 to-islamic-green-600',
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
    icon: '📚',
    iconComponent: Book,
    gradient: 'from-islamic-navy-500 to-islamic-navy-600',
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
    icon: '🧭',
    iconComponent: Compass,
    gradient: 'from-islamic-gold-500 to-islamic-gold-600',
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
    icon: '📅',
    iconComponent: Calendar,
    gradient: 'from-islamic-green-600 to-islamic-navy-500',
    features: [
      'Live Hijri date',
      'Islamic events',
      'Sacred months',
      'Moon phases'
    ]
  }
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-green-50 via-white to-islamic-gold-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-islamic-navy-800 mb-4">
            📚 Islamic Resources
          </h1>
          <p className="text-xl text-islamic-navy-600 max-w-3xl mx-auto">
            Access authentic Islamic knowledge, tools, and guidance for your spiritual journey
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="bg-islamic-green-50 border-islamic-green-200">
            <CardContent className="py-4 text-center">
              <p className="text-3xl font-bold text-islamic-green-600">6,236</p>
              <p className="text-sm text-islamic-navy-600">Quran Verses</p>
            </CardContent>
          </Card>
          <Card className="bg-islamic-navy-50 border-islamic-navy-200">
            <CardContent className="py-4 text-center">
              <p className="text-3xl font-bold text-islamic-navy-600">7,000+</p>
              <p className="text-sm text-islamic-navy-600">Sahih Hadiths</p>
            </CardContent>
          </Card>
          <Card className="bg-islamic-gold-50 border-islamic-gold-200">
            <CardContent className="py-4 text-center">
              <p className="text-3xl font-bold text-islamic-gold-600">360°</p>
              <p className="text-sm text-islamic-navy-600">Qibla Compass</p>
            </CardContent>
          </Card>
          <Card className="bg-islamic-green-50 border-islamic-green-200">
            <CardContent className="py-4 text-center">
              <p className="text-3xl font-bold text-islamic-green-600">1445</p>
              <p className="text-sm text-islamic-navy-600">Hijri Year</p>
            </CardContent>
          </Card>
        </div>

        {/* Resources Grid - Simple clickable cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {resources.map((resource) => (
            <Link 
              key={resource.id} 
              href={resource.href}
              className="block"
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-islamic-green-400 bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{resource.icon}</span>
                      <div>
                        <CardTitle className="text-xl text-islamic-navy-800">
                          {resource.title}
                        </CardTitle>
                        <CardDescription className="text-islamic-navy-600 mt-1">
                          {resource.description}
                        </CardDescription>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-islamic-green-600 mt-2" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {resource.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-islamic-navy-700">
                        <div className="w-1.5 h-1.5 bg-islamic-green-500 rounded-full flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Additional Resources Section */}
        <Card className="bg-gradient-to-r from-islamic-green-100 to-islamic-gold-100 border-0">
          <CardHeader>
            <CardTitle className="text-2xl text-islamic-navy-800">
              More Resources Coming Soon
            </CardTitle>
            <CardDescription className="text-islamic-navy-600">
              We're continuously adding new resources to support your Islamic learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/80 p-4 rounded-lg">
                <h3 className="font-semibold text-islamic-navy-800 mb-2">🎓 Islamic Courses</h3>
                <p className="text-sm text-islamic-navy-600">
                  Structured learning programs for all levels
                </p>
              </div>
              <div className="bg-white/80 p-4 rounded-lg">
                <h3 className="font-semibold text-islamic-navy-800 mb-2">📝 Dua Collections</h3>
                <p className="text-sm text-islamic-navy-600">
                  Daily supplications and prayers
                </p>
              </div>
              <div className="bg-white/80 p-4 rounded-lg">
                <h3 className="font-semibold text-islamic-navy-800 mb-2">🎧 Audio Library</h3>
                <p className="text-sm text-islamic-navy-600">
                  Lectures, recitations, and nasheed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Attribution */}
        <Card className="mt-8 bg-white/80">
          <CardContent className="py-4">
            <p className="text-center text-sm text-islamic-navy-600">
              Powered by authentic Islamic APIs: Sunnah.com • Al-Quran Cloud • Aladhan
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}