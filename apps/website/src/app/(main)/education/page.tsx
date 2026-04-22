import { Clock, Users, BookOpen, Calendar, GraduationCap, Star, Check, Phone, Mail, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Educational Programs | Masjid At-Taqwa',
  description: 'Comprehensive Islamic education programs including Tahfeedhul Qur\'an, weekend classes, adult education, and children\'s programs at Masjid At-Taqwa.',
};

interface EducationalProgram {
  id: string;
  name: string;
  description: string;
  ageGroup: string;
  schedule: string;
  instructor: string;
  level: string;
  features: string[];
  language?: string;
  tuition?: string;
  format?: string;
  requirements?: string[];
}

interface ClassSchedule {
  day: string;
  time: string;
  program: string;
  instructor: string;
  group: 'Brothers' | 'Sisters' | 'Both' | 'Brothers only';
}

const educationalPrograms: EducationalProgram[] = [
  {
    id: 'tahfeedh',
    name: 'Tahfeedhul Qur\'an — Qur\'an Memorization (Full-time)',
    description: 'Our full-time weekday Qur\'an memorization program for homeschool students. Classes go beyond memorization to build the morals and values of the Qur\'an alongside Islamic Studies including Arabic, Hadith, Du\'a memorization, Seerah, and Fiqh.',
    ageGroup: 'Ages 6+',
    schedule: 'Monday–Thursday, 7:30 AM – 12:00 PM (class hours vary by DST and between boys and girls)',
    instructor: 'Imam Mohammad Zahirul Islam, Ustadh Abdullah Khan, Ustadha Siddiqa Islam, Ustadha Labibah Islam',
    level: 'Assessment-based; beginner to advanced',
    language: 'Arabic, English, Bengali',
    tuition: '$100–$150 / month (depending on class)',
    format: 'In-person at the masjid',
    features: [
      'Tajweed, Makhaarij, and Tilaawah standards',
      'Regular progress reports and evaluations',
      'Arabic, Hadith, Du\'a, Seerah, and Fiqh integrated',
      'Annual graduation ceremony and certification upon completion',
      'Separate schedules for brothers and sisters'
    ],
    requirements: ['Homeschool-compatible daytime availability', 'Commitment to daily practice', 'Parental support']
  },
  {
    id: 'weekend',
    name: 'Weekend Class (Qur\'an & Islamic Studies)',
    description: 'A two-hour weekend program before Salatul Dhuhr designed to grow Muslim youth\'s knowledge of Islam and their identity as Muslims.',
    ageGroup: 'Ages 6+',
    schedule: 'Saturday & Sunday, 12:00 PM – 2:00 PM (time varies by DST)',
    instructor: 'Ustadh Abdullah Khan (brothers), Ustadha Labibah Islam (sisters)',
    level: 'Age-appropriate tiers',
    language: 'English',
    tuition: 'Quarterly — $150 first child · $125 second · $100 third+',
    format: 'In-person at the masjid',
    features: [
      'Qur\'an recitation and understanding',
      'Islamic Studies curriculum',
      'Separate classes for brothers and sisters',
      'Quarterly reporting'
    ],
    requirements: ['Regular attendance', 'Homework completion', 'Respectful behavior']
  },
  {
    id: 'adult-brothers',
    name: 'Adult Brothers — Qur\'an & Islamic Studies',
    description: 'Weekend morning class for adult brothers covering Qur\'an and Islamic Studies with Imam Mohammad Zahirul Islam.',
    ageGroup: 'Adult brothers',
    schedule: 'Saturday & Sunday, 9:00 AM – 11:00 AM',
    instructor: 'Imam Mohammad Zahirul Islam',
    level: 'All levels welcome',
    language: 'Bengali & English',
    format: 'In-person at the masjid',
    features: [
      'Tafseer-integrated Qur\'an study',
      'Islamic Studies across Fiqh, Hadith, and Seerah',
      'Discussion-based learning'
    ]
  },
  {
    id: 'adult-sisters',
    name: 'Adult Sisters — Qur\'an & Islamic Studies (Bengali)',
    description: 'Weekend evening class for adult sisters, taught in Bengali between Maghrib and Isha.',
    ageGroup: 'Adult sisters',
    schedule: 'Saturday & Sunday, Maghrib – Isha (time varies by DST)',
    instructor: 'Ustadha Salina Sultana',
    level: 'All levels welcome',
    language: 'Bengali',
    format: 'In-person at the masjid',
    features: [
      'Qur\'an study and reflection',
      'Islamic Studies with Bengali-speaking instructor',
      'Sisters-only environment',
      'Additional Arabic and English options — contact Ustadha Labibah Islam for details'
    ]
  },
  {
    id: 'daily-tafseer',
    name: 'Daily Qur\'anic Tafseer',
    description: 'Daily short Tafseer sitting before Salatul Isha with Imam Mohammad Zahirul Islam.',
    ageGroup: 'All ages',
    schedule: 'Every day, 30 minutes before Isha (time varies by DST)',
    instructor: 'Imam Mohammad Zahirul Islam',
    level: 'All levels',
    language: 'Bengali & English',
    format: 'In-person at the masjid',
    features: ['Short daily dose of Qur\'an study', 'Connects prayer to study', 'Open to all community members']
  },
  {
    id: 'daily-hadith',
    name: 'Daily Hadith Reading',
    description: 'Daily Hadith reading after Salatul Fajr with Ustadh Abdullah Khan.',
    ageGroup: 'All ages',
    schedule: 'Every day, after Fajr (time varies by DST)',
    instructor: 'Ustadh Abdullah Khan',
    level: 'All levels',
    language: 'English',
    format: 'In-person at the masjid',
    features: ['Short daily Hadith sitting', 'Strengthens morning routine', 'Open to all community members']
  },
  {
    id: 'after-school',
    name: 'After-School Program — Aqwam Academy (Boys only)',
    description: 'Online after-school Qur\'an studies for boys ages 7+ run by Aqwam Academy and taught by Ustadh Abdullah Khan via Zoom.',
    ageGroup: 'Boys ages 7+',
    schedule: 'Monday, Tuesday, and Thursday, 5:00 PM – 7:00 PM',
    instructor: 'Ustadh Abdullah Khan',
    level: 'All levels',
    language: 'English',
    format: 'Online via Zoom',
    features: ['Qur\'an studies tailored for after-school hours', 'Small group instruction', 'Boys-only environment']
  },
  {
    id: 'adult-quran-brothers',
    name: 'Adult Qur\'an Class — Aqwam Academy (Brothers only)',
    description: 'In-person adult Qur\'an class run by Aqwam Academy for brothers between Maghrib and Isha on Fridays and Saturdays.',
    ageGroup: 'Adult brothers',
    schedule: 'Friday & Saturday, Maghrib – Isha (refer to prayer schedule)',
    instructor: 'Ustadh Abdullah Khan',
    level: 'All levels',
    language: 'English',
    format: 'In-person at Masjid At-Taqwa',
    features: ['Focused Qur\'an study for working adults', 'Brothers-only environment']
  },
  {
    id: 'homeschooling',
    name: 'Homeschooling Program',
    description: 'Parents and guardians may pair our Tahfeedh program with any homeschool curriculum of their choice, provided it does not contradict or interfere with the student\'s Qur\'anic studies and schedule.',
    ageGroup: 'Tahfeedh students',
    schedule: 'Parent-directed',
    instructor: 'Parent/Guardian',
    level: 'Family-led',
    format: 'At home, aligned with masjid program',
    features: ['Flexibility for families', 'Designed to complement Tahfeedh schedule']
  }
];

const weeklySchedule: ClassSchedule[] = [
  { day: 'Mon–Thurs', time: '7:30 AM – 2:00 PM', program: 'Tahfeedhul Qur\'an Class', instructor: 'I. Mohammad Islam, U. Abdullah Khan, U. Siddiqa Islam, U. Labibah Islam', group: 'Both' },
  { day: 'Sat–Sun', time: '12:00 PM – 2:00 PM', program: 'Weekend Class', instructor: 'U. Abdullah Khan, U. Labibah Islam', group: 'Both' },
  { day: 'Sat–Sun', time: '9:00 AM – 11:00 AM', program: 'Brothers Adult Classes', instructor: 'I. Mohammad Islam', group: 'Brothers' },
  { day: 'Sat–Sun', time: 'Maghrib – Isha', program: 'Sisters Adult Class (Bengali)', instructor: 'U. Salina Sultana', group: 'Sisters' },
  { day: 'All week', time: '30 min before Isha', program: 'Daily Tafseer', instructor: 'I. Mohammad Islam', group: 'Both' },
  { day: 'All week', time: 'After Fajr', program: 'Daily Hadith', instructor: 'U. Abdullah Khan', group: 'Both' },
  { day: 'Mon, Tue, Thu', time: '5:00 PM – 7:00 PM', program: 'After-School Program (online)', instructor: 'U. Abdullah Khan', group: 'Brothers only' },
  { day: 'Fri–Sat', time: 'Maghrib – Isha', program: 'Adults Qur\'an Class', instructor: 'U. Abdullah Khan', group: 'Brothers only' }
];

const stats = [
  { label: 'Active Programs', value: '9', icon: BookOpen },
  { label: 'Lead Instructors', value: '5', icon: GraduationCap },
  { label: 'Weekly Classes', value: '8', icon: Calendar },
  { label: 'Languages', value: 'Ar · En · Bn', icon: Users },
];

export default function EducationPage() {
  const tahfeedh = educationalPrograms.find(p => p.id === 'tahfeedh')!;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">
            Masjid At-Taqwa
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            Educational Programs
          </h1>
          <p className="text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Comprehensive Islamic education programs for all ages, from Quran memorization
            to adult studies, fostering spiritual growth and Islamic knowledge in our community.
          </p>
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

        {/* Featured Program */}
        <section className="pb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Featured Program</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <Star className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-900">
                    Tahfeedhul Qur&apos;an - Quran Memorization
                  </h3>
                  <span className="text-[10px] font-medium text-amber-700 border border-amber-200 bg-amber-50 rounded-full px-2 py-0.5">
                    Premium Program
                  </span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                  Our flagship Quran memorization program with certified instructors and proven methodology.
                  Students receive individual attention and progress through structured levels.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <Users className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Ages 6+</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <Clock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Mon–Thurs, 7:30 AM – 12:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <GraduationCap className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Tuition $100–$150/mo</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <BookOpen className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Arabic · English · Bengali</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-900 mb-3">Program Highlights</h4>
                <ul className="space-y-1.5">
                  {[
                    'Proper Tajweed instruction with certified teachers',
                    'Regular progress evaluations and parent meetings',
                    'Annual Hifz graduation ceremony',
                    'Small class sizes for individual attention',
                    'Flexible scheduling for different learning paces',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-neutral-600">
                      <div className="w-1 h-1 bg-emerald-400 rounded-full shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* All Programs */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">All Educational Programs</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {educationalPrograms.map((program) => (
              <div key={program.id} className="rounded-xl border border-neutral-200 bg-white p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-neutral-900 pr-3">{program.name}</h3>
                  <span className="text-[10px] font-medium text-emerald-700 border border-emerald-200 bg-emerald-50 rounded-full px-2 py-0.5 whitespace-nowrap shrink-0">
                    {program.level}
                  </span>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <Users className="h-3 w-3" />
                    <span>{program.ageGroup}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <Clock className="h-3 w-3" />
                    <span>{program.schedule.split(',')[0]}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-500 leading-relaxed mb-4">{program.description}</p>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wide">Schedule</p>
                    <p className="text-xs text-neutral-700">{program.schedule}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wide">Instructor</p>
                    <p className="text-xs text-neutral-700">{program.instructor}</p>
                  </div>
                  {program.language && (
                    <div>
                      <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wide">Language</p>
                      <p className="text-xs text-neutral-700">{program.language}</p>
                    </div>
                  )}
                  {program.format && (
                    <div>
                      <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wide">Format</p>
                      <p className="text-xs text-neutral-700">{program.format}</p>
                    </div>
                  )}
                  {program.tuition && (
                    <div className="col-span-2">
                      <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wide">Tuition</p>
                      <p className="text-xs text-neutral-700">{program.tuition}</p>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-neutral-100 mb-4" />

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-[10px] font-semibold text-neutral-900 uppercase tracking-wide mb-2">Program Features</h4>
                  <ul className="space-y-1">
                    {program.features.slice(0, 4).map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-xs text-neutral-600">
                        <div className="w-1 h-1 bg-emerald-400 rounded-full shrink-0 mt-1.5" />
                        {feature}
                      </li>
                    ))}
                    {program.features.length > 4 && (
                      <li className="text-xs text-neutral-400">
                        +{program.features.length - 4} more features
                      </li>
                    )}
                  </ul>
                </div>

                {/* Requirements */}
                {program.requirements && (
                  <div>
                    <h4 className="text-[10px] font-semibold text-neutral-900 uppercase tracking-wide mb-2">Requirements</h4>
                    <ul className="space-y-1">
                      {program.requirements.map((req) => (
                        <li key={req} className="flex items-start gap-2 text-xs text-neutral-600">
                          <Check className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Weekly Schedule */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Weekly Class Schedule</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50/50">
                    <th className="text-left text-[10px] font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Day</th>
                    <th className="text-left text-[10px] font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Time</th>
                    <th className="text-left text-[10px] font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Program</th>
                    <th className="text-left text-[10px] font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Instructor</th>
                    <th className="text-left text-[10px] font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Group</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklySchedule.map((schedule, index) => (
                    <tr key={index} className="border-b border-neutral-100 last:border-0">
                      <td className="px-4 py-3 text-xs font-medium text-neutral-900">{schedule.day}</td>
                      <td className="px-4 py-3 text-xs text-neutral-500 font-mono">{schedule.time}</td>
                      <td className="px-4 py-3 text-xs text-neutral-700">{schedule.program}</td>
                      <td className="px-4 py-3 text-xs text-neutral-500">{schedule.instructor}</td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-medium text-emerald-700 border border-emerald-200 bg-emerald-50 rounded-full px-2 py-0.5">
                          {schedule.group}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Registration CTA */}
        <section className="pb-20">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6 sm:p-8">
            <h3 className="text-base font-semibold text-neutral-900 mb-1">
              Registration Information
            </h3>
            <p className="text-sm text-neutral-500 mb-6">
              Enroll in any of our programs — new students are welcome throughout the year.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wide mb-3">How to Register</h4>
                <ul className="space-y-2">
                  {[
                    'Contact the masjid office during office hours',
                    'Speak with instructors after prayers',
                    'Register online through our website (coming soon)',
                    'Visit during program times to observe classes',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-neutral-600">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wide mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-xs text-neutral-600">
                    <Phone className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <a href="tel:4707311314" className="text-emerald-600 block">(470) 731-1314 — Brothers</a>
                      <a href="tel:4049367123" className="text-emerald-600 block">(404) 936-7123 — Sisters</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <Mail className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <a href="mailto:Attaqwa.du@gmail.com" className="text-emerald-600">Attaqwa.du@gmail.com</a>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-neutral-600">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>2674 Woodwin Rd, Doraville, GA 30360</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <Clock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Daily after prayers or by appointment</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-neutral-200 my-6" />

            <p className="text-center text-sm text-neutral-600 italic">
              &ldquo;And whoever fears Allah - He will make for him a way out and provide for him from where he does not expect.&rdquo;
            </p>
            <p className="text-center text-xs text-neutral-400 mt-1">Quran 65:2-3</p>
          </div>
        </section>
      </div>
    </div>
  );
}
