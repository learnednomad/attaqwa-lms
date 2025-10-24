import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, Book, Users, Calendar, MapPin, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hajj & Umrah Services | Masjid At-Taqwa',
  description: 'Pilgrimage guidance, travel assistance, and spiritual preparation for Hajj and Umrah',
};

export default function HajjUmrahPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-green-50 via-white to-islamic-gold-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-islamic-navy-800 mb-4">
            Hajj & Umrah Services
          </h1>
          <p className="text-xl text-islamic-navy-600 max-w-3xl mx-auto">
            Complete pilgrimage guidance, travel assistance, and spiritual preparation for your journey to the Holy Land
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Book className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Educational Seminars</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comprehensive courses on Hajj and Umrah rituals, duas, and spiritual significance.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Plane className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Travel Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Organized group packages with experienced guides, accommodations, and transportation.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Group Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Join supportive groups with experienced pilgrims for guidance and companionship.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Programs */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Upcoming Programs</CardTitle>
            <CardDescription>Register early for our pilgrimage programs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-l-4 border-islamic-green-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-islamic-green-600" />
                  <h3 className="font-semibold text-lg">Hajj 2024 Package</h3>
                </div>
                <p className="text-islamic-navy-600 mb-2">June 14-24, 2024</p>
                <p className="text-sm">Complete Hajj package including visa, flights, accommodation in Makkah and Madinah, transportation, and guidance.</p>
              </div>
              
              <div className="border-l-4 border-islamic-gold-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-islamic-gold-600" />
                  <h3 className="font-semibold text-lg">Ramadan Umrah 2024</h3>
                </div>
                <p className="text-islamic-navy-600 mb-2">March 15-25, 2024</p>
                <p className="text-sm">Special Umrah package during the blessed month of Ramadan with Tarawih prayers in Masjid al-Haram.</p>
              </div>

              <div className="border-l-4 border-islamic-navy-500 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-islamic-navy-600" />
                  <h3 className="font-semibold text-lg">Winter Umrah Groups</h3>
                </div>
                <p className="text-islamic-navy-600 mb-2">December - February (Multiple Dates)</p>
                <p className="text-sm">Flexible Umrah packages during winter months with comfortable weather and smaller crowds.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preparation Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Spiritual Preparation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-islamic-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Pre-Hajj Workshops</h3>
                  <p className="text-sm text-islamic-navy-600">Monthly workshops on spiritual readiness and ritual preparation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-islamic-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Dua Memorization Classes</h3>
                  <p className="text-sm text-islamic-navy-600">Learn essential duas and supplications for your journey</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-islamic-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">One-on-One Consultation</h3>
                  <p className="text-sm text-islamic-navy-600">Personal guidance with experienced Hajj mentors</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Practical Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-islamic-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Visa Assistance</h3>
                  <p className="text-sm text-islamic-navy-600">Help with visa applications and documentation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-islamic-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Health & Vaccination</h3>
                  <p className="text-sm text-islamic-navy-600">Guidance on required vaccinations and health preparations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-islamic-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Packing Guidelines</h3>
                  <p className="text-sm text-islamic-navy-600">Comprehensive lists and tips for Ihram and travel essentials</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}