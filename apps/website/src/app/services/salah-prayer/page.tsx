import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar, MapPin, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Salah & Prayer Services | Masjid At-Taqwa',
  description: 'Daily prayer services, Jummah prayers, and spiritual guidance at Masjid At-Taqwa',
};

export default function SalahPrayerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-green-50 via-white to-islamic-gold-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-islamic-navy-800 mb-4">
            Salah & Prayer Services
          </h1>
          <p className="text-xl text-islamic-navy-600 max-w-3xl mx-auto">
            Join us for daily prayers, Jummah services, and spiritual guidance in our welcoming community
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Clock className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Daily Prayers</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Five daily prayers held in congregation with experienced Imams leading each prayer.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calendar className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Jummah Prayer</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Weekly Friday prayer with inspiring Khutbah (sermon) addressing contemporary issues.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Tarawih Prayers</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Special night prayers during Ramadan with complete Quran recitation throughout the month.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Prayer Times Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Prayer Times Today</CardTitle>
            <CardDescription>Updated daily based on local calculation methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-islamic-green-50 rounded-lg">
                <h3 className="font-semibold text-islamic-navy-700">Fajr</h3>
                <p className="text-lg font-bold text-islamic-green-600">4:21 AM</p>
              </div>
              <div className="text-center p-4 bg-islamic-green-50 rounded-lg">
                <h3 className="font-semibold text-islamic-navy-700">Dhuhr</h3>
                <p className="text-lg font-bold text-islamic-green-600">12:31 PM</p>
              </div>
              <div className="text-center p-4 bg-islamic-green-50 rounded-lg">
                <h3 className="font-semibold text-islamic-navy-700">Asr</h3>
                <p className="text-lg font-bold text-islamic-green-600">3:53 PM</p>
              </div>
              <div className="text-center p-4 bg-islamic-green-50 rounded-lg">
                <h3 className="font-semibold text-islamic-navy-700">Maghrib</h3>
                <p className="text-lg font-bold text-islamic-green-600">6:36 PM</p>
              </div>
              <div className="text-center p-4 bg-islamic-green-50 rounded-lg">
                <h3 className="font-semibold text-islamic-navy-700">Isha</h3>
                <p className="text-lg font-bold text-islamic-green-600">8:21 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Prayer Facilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-islamic-green-600 mt-1" />
              <div>
                <h3 className="font-semibold">Main Prayer Hall</h3>
                <p className="text-islamic-navy-600">Spacious prayer area accommodating 500+ worshippers</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-islamic-green-600 mt-1" />
              <div>
                <h3 className="font-semibold">Women's Prayer Area</h3>
                <p className="text-islamic-navy-600">Dedicated prayer space with separate entrance and facilities</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-islamic-green-600 mt-1" />
              <div>
                <h3 className="font-semibold">Wudu Facilities</h3>
                <p className="text-islamic-navy-600">Clean and modern ablution areas for men and women</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}