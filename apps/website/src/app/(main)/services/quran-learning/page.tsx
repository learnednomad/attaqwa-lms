import { Metadata } from 'next';
import { BookOpen, Users, GraduationCap, Clock, Award, Volume2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quran Learning | Masjid At-Taqwa',
  description: 'Quran recitation, Hifz program, and Islamic education classes for all ages',
};

export default function QuranLearningPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">Masjid At-Taqwa</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            Quran Learning Center
          </h1>
          <p className="text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Comprehensive Quranic education with experienced teachers for students of all ages and levels
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        {/* Programs Grid */}
        <section className="py-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Our Programs</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                <BookOpen className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Quran Recitation</h3>
              <p className="text-sm text-neutral-500">
                Learn proper Tajweed rules and beautiful recitation with certified instructors.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                <Award className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Hifz Program</h3>
              <p className="text-sm text-neutral-500">
                Complete Quran memorization program with experienced Huffaz and regular revision.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                <GraduationCap className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Islamic Studies</h3>
              <p className="text-sm text-neutral-500">
                Comprehensive Islamic education including Fiqh, Hadith, and Seerah studies.
              </p>
            </div>
          </div>
        </section>

        {/* Class Schedule */}
        <section className="pb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Weekly Class Schedule</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>
          <p className="text-sm text-neutral-500 mb-6">Join our regular classes throughout the week</p>
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-2 px-4 text-neutral-900 font-semibold">Program</th>
                    <th className="text-left py-2 px-4 text-neutral-900 font-semibold">Age Group</th>
                    <th className="text-left py-2 px-4 text-neutral-900 font-semibold">Days</th>
                    <th className="text-left py-2 px-4 text-neutral-900 font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-4 font-semibold text-neutral-900">Beginners Qaida</td>
                    <td className="py-3 px-4 text-neutral-600">5-8 years</td>
                    <td className="py-3 px-4 text-neutral-600">Mon, Wed, Fri</td>
                    <td className="py-3 px-4 text-neutral-600">4:00 PM - 5:00 PM</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-4 font-semibold text-neutral-900">Quran Reading</td>
                    <td className="py-3 px-4 text-neutral-600">9-12 years</td>
                    <td className="py-3 px-4 text-neutral-600">Tue, Thu, Sat</td>
                    <td className="py-3 px-4 text-neutral-600">4:30 PM - 6:00 PM</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-4 font-semibold text-neutral-900">Teen Tajweed</td>
                    <td className="py-3 px-4 text-neutral-600">13-17 years</td>
                    <td className="py-3 px-4 text-neutral-600">Mon, Wed</td>
                    <td className="py-3 px-4 text-neutral-600">6:00 PM - 7:30 PM</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-4 font-semibold text-neutral-900">Adult Classes</td>
                    <td className="py-3 px-4 text-neutral-600">18+ years</td>
                    <td className="py-3 px-4 text-neutral-600">Tue, Thu</td>
                    <td className="py-3 px-4 text-neutral-600">7:30 PM - 9:00 PM</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-4 font-semibold text-neutral-900">Sisters Circle</td>
                    <td className="py-3 px-4 text-neutral-600">Women Only</td>
                    <td className="py-3 px-4 text-neutral-600">Saturday</td>
                    <td className="py-3 px-4 text-neutral-600">10:00 AM - 12:00 PM</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-neutral-900">Weekend Hifz</td>
                    <td className="py-3 px-4 text-neutral-600">All Ages</td>
                    <td className="py-3 px-4 text-neutral-600">Sat & Sun</td>
                    <td className="py-3 px-4 text-neutral-600">8:00 AM - 12:00 PM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Special Programs */}
        <section className="pb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Special Programs</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">Summer Intensive Program</h3>
              <p className="text-neutral-600 mb-4">
                8-week intensive Quran program during summer break with daily classes and activities.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-neutral-600">Duration: June - July</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-neutral-600">Ages: 6-16 years</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-neutral-600">Focus: Memorization & Tajweed</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">One-on-One Tutoring</h3>
              <p className="text-neutral-600 mb-4">
                Personalized Quran instruction tailored to individual learning pace and goals.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-neutral-600">Flexible scheduling</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-neutral-600">All ages welcome</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-neutral-600">Online & in-person options</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="pb-20">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Why Learn With Us?</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Award className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Certified Teachers</h3>
                  <p className="text-sm text-neutral-500">Qualified instructors with Ijazah in Quran recitation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Small Class Sizes</h3>
                  <p className="text-sm text-neutral-500">Maximum 10 students per class for personalized attention</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Structured Curriculum</h3>
                  <p className="text-sm text-neutral-500">Progressive learning path from basics to advanced</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Flexible Timings</h3>
                  <p className="text-sm text-neutral-500">Multiple class times to suit your schedule</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Certificate Program</h3>
                  <p className="text-sm text-neutral-500">Recognition upon completion of each level</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Volume2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Annual Competition</h3>
                  <p className="text-sm text-neutral-500">Quran recitation competition with prizes</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
