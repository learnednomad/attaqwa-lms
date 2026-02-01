import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Moon, Clock, Users, UtensilsCrossed, BookOpen, Heart, Calendar, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ramadan Services | Masjid At-Taqwa',
  description: 'Tarawee prayers, community Iftar, Tahajjud, Quran recitation, and Ramadan programs at Masjid At-Taqwa',
};

const ramadanPrograms = [
  {
    icon: Moon,
    title: 'Tarawee Prayer',
    description: '20 rakhat Tarawee prayers held every night after Isha. Complete Quran recitation throughout the month led by our Huffaz.',
    time: 'After Isha Prayer',
  },
  {
    icon: Clock,
    title: 'Tahajjud Prayer',
    description: 'Late night prayers for those seeking extra closeness to Allah during the blessed month.',
    time: '4:45 AM Daily',
  },
  {
    icon: UtensilsCrossed,
    title: 'Community Iftar',
    description: 'Free community Iftar served daily throughout the month of Ramadan. All are welcome to break their fast together.',
    time: 'At Maghrib Daily',
  },
  {
    icon: BookOpen,
    title: 'Daily Tafseer & Dua',
    description: 'Brief Tafseer of the Quran and collective dua session before Maghrib every day.',
    time: 'Before Maghrib',
  },
  {
    icon: Users,
    title: 'Itikaf',
    description: 'Spiritual retreat during the last 10 nights of Ramadan. Limited spaces available — register early.',
    time: 'Last 10 Nights',
  },
  {
    icon: Heart,
    title: 'Zakat ul-Fitr',
    description: '$10 per person, to be paid before Eid ul-Fitr Salah. Ensure the needy can also celebrate Eid.',
    time: 'Before Eid Salah',
  },
];

export default function RamadanServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-navy-50 via-white to-islamic-gold-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Link */}
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-islamic-navy-600 hover:text-islamic-green-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-islamic-navy-100 mb-6">
            <Moon className="w-8 h-8 text-islamic-navy-700" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-islamic-navy-800 mb-4">
            Ramadan Services
          </h1>
          <p className="text-xl text-islamic-navy-600 max-w-3xl mx-auto">
            Join our community for a spiritually enriching Ramadan with nightly Tarawee, daily Iftar, Tahajjud, and special programs throughout the blessed month
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {ramadanPrograms.map((program) => (
            <Card key={program.title} className="hover:shadow-lg transition-shadow border-islamic-navy-100">
              <CardHeader>
                <program.icon className="w-8 h-8 text-islamic-green-600 mb-2" />
                <CardTitle>{program.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-islamic-green-600 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {program.time}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {program.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ramadan Schedule */}
        <Card className="mb-12 border-islamic-gold-200">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Calendar className="w-6 h-6 text-islamic-gold-600" />
              Daily Ramadan Schedule
            </CardTitle>
            <CardDescription>Typical daily schedule during the blessed month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 bg-islamic-navy-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-islamic-green-500" />
                <div>
                  <h3 className="font-semibold text-islamic-navy-700">Tahajjud</h3>
                  <p className="text-sm text-islamic-navy-500">4:45 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-islamic-navy-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-islamic-green-500" />
                <div>
                  <h3 className="font-semibold text-islamic-navy-700">Suhoor Ends / Fajr Adhan</h3>
                  <p className="text-sm text-islamic-navy-500">See daily prayer times</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-islamic-navy-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-islamic-green-500" />
                <div>
                  <h3 className="font-semibold text-islamic-navy-700">Tafseer & Dua</h3>
                  <p className="text-sm text-islamic-navy-500">Before Maghrib</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-islamic-gold-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-islamic-gold-500" />
                <div>
                  <h3 className="font-semibold text-islamic-navy-700">Iftar</h3>
                  <p className="text-sm text-islamic-navy-500">At Maghrib</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-islamic-navy-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-islamic-green-500" />
                <div>
                  <h3 className="font-semibold text-islamic-navy-700">Isha Prayer</h3>
                  <p className="text-sm text-islamic-navy-500">See daily prayer times</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-islamic-navy-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-islamic-green-500" />
                <div>
                  <h3 className="font-semibold text-islamic-navy-700">Tarawee (20 Rakhat)</h3>
                  <p className="text-sm text-islamic-navy-500">After Isha</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="border-islamic-green-200">
          <CardHeader>
            <CardTitle className="text-2xl">Important Reminders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-islamic-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Community Iftar</h3>
                <p className="text-islamic-navy-600">Iftar is served daily throughout Ramadan. Volunteers are always welcome to help with preparation and serving.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-islamic-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Zakat ul-Fitr</h3>
                <p className="text-islamic-navy-600">$10 per person must be paid before Eid ul-Fitr Salah. You can pay at the masjid office or during any prayer.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-islamic-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Parking</h3>
                <p className="text-islamic-navy-600">Due to increased attendance during Ramadan, please carpool when possible and follow volunteer directions for parking.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-islamic-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Children</h3>
                <p className="text-islamic-navy-600">Please supervise children during Tarawee prayers. A dedicated children&apos;s area is available.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
