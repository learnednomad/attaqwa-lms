import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, GraduationCap, Clock, Award, Volume2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quran Learning | Masjid At-Taqwa',
  description: 'Quran recitation, Hifz program, and Islamic education classes for all ages',
};

export default function QuranLearningPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-green-50 via-white to-islamic-gold-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-islamic-navy-800 mb-4">
            Quran Learning Center
          </h1>
          <p className="text-xl text-islamic-navy-600 max-w-3xl mx-auto">
            Comprehensive Quranic education with experienced teachers for students of all ages and levels
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Quran Recitation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Learn proper Tajweed rules and beautiful recitation with certified instructors.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Award className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Hifz Program</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Complete Quran memorization program with experienced Huffaz and regular revision.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <GraduationCap className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Islamic Studies</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comprehensive Islamic education including Fiqh, Hadith, and Seerah studies.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Class Schedule */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Weekly Class Schedule</CardTitle>
            <CardDescription>Join our regular classes throughout the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Program</th>
                    <th className="text-left py-2 px-4">Age Group</th>
                    <th className="text-left py-2 px-4">Days</th>
                    <th className="text-left py-2 px-4">Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-semibold">Beginners Qaida</td>
                    <td className="py-3 px-4">5-8 years</td>
                    <td className="py-3 px-4">Mon, Wed, Fri</td>
                    <td className="py-3 px-4">4:00 PM - 5:00 PM</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-semibold">Quran Reading</td>
                    <td className="py-3 px-4">9-12 years</td>
                    <td className="py-3 px-4">Tue, Thu, Sat</td>
                    <td className="py-3 px-4">4:30 PM - 6:00 PM</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-semibold">Teen Tajweed</td>
                    <td className="py-3 px-4">13-17 years</td>
                    <td className="py-3 px-4">Mon, Wed</td>
                    <td className="py-3 px-4">6:00 PM - 7:30 PM</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-semibold">Adult Classes</td>
                    <td className="py-3 px-4">18+ years</td>
                    <td className="py-3 px-4">Tue, Thu</td>
                    <td className="py-3 px-4">7:30 PM - 9:00 PM</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-semibold">Sisters Circle</td>
                    <td className="py-3 px-4">Women Only</td>
                    <td className="py-3 px-4">Saturday</td>
                    <td className="py-3 px-4">10:00 AM - 12:00 PM</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">Weekend Hifz</td>
                    <td className="py-3 px-4">All Ages</td>
                    <td className="py-3 px-4">Sat & Sun</td>
                    <td className="py-3 px-4">8:00 AM - 12:00 PM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Special Programs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Summer Intensive Program</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-islamic-navy-600 mb-4">
                8-week intensive Quran program during summer break with daily classes and activities.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-islamic-green-600" />
                  <span className="text-sm">Duration: June - July</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-islamic-green-600" />
                  <span className="text-sm">Ages: 6-16 years</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-islamic-green-600" />
                  <span className="text-sm">Focus: Memorization & Tajweed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">One-on-One Tutoring</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-islamic-navy-600 mb-4">
                Personalized Quran instruction tailored to individual learning pace and goals.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-islamic-green-600" />
                  <span className="text-sm">Flexible scheduling</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-islamic-green-600" />
                  <span className="text-sm">All ages welcome</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-islamic-green-600" />
                  <span className="text-sm">Online & in-person options</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Why Learn With Us?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-islamic-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Certified Teachers</h3>
                  <p className="text-sm text-islamic-navy-600">Qualified instructors with Ijazah in Quran recitation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-islamic-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Small Class Sizes</h3>
                  <p className="text-sm text-islamic-navy-600">Maximum 10 students per class for personalized attention</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-islamic-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Structured Curriculum</h3>
                  <p className="text-sm text-islamic-navy-600">Progressive learning path from basics to advanced</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-islamic-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Flexible Timings</h3>
                  <p className="text-sm text-islamic-navy-600">Multiple class times to suit your schedule</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-islamic-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Certificate Program</h3>
                  <p className="text-sm text-islamic-navy-600">Recognition upon completion of each level</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Volume2 className="w-5 h-5 text-islamic-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Annual Competition</h3>
                  <p className="text-sm text-islamic-navy-600">Quran recitation competition with prizes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}