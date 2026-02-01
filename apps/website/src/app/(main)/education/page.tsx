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
  capacity?: number;
  duration?: string;
  requirements?: string[];
}

interface ClassSchedule {
  day: string;
  time: string;
  program: string;
  instructor: string;
  ageGroup: string;
}

const educationalPrograms: EducationalProgram[] = [
  {
    id: 'tahfeedh',
    name: 'Tahfeedhul Qur\'an (Quran Memorization)',
    description: 'Comprehensive Quran memorization program with proper Tajweed and understanding. Students progress through structured levels with individual attention.',
    ageGroup: 'Ages 6-18',
    schedule: 'Monday-Friday, 4:00-6:00 PM',
    instructor: 'Imam Mohammad Zahirul Islam & Hafez Abdullah Khan',
    level: 'Beginner to Advanced',
    features: [
      'Individual assessment and personalized learning plan',
      'Proper Tajweed instruction',
      'Understanding of Quranic meanings',
      'Regular progress evaluation',
      'Annual Hifz graduation ceremony',
      'Small class sizes for individual attention'
    ],
    capacity: 25,
    duration: '3-7 years (varies by student)',
    requirements: ['Basic Arabic reading ability', 'Commitment to daily practice', 'Parental support']
  },
  {
    id: 'weekend-school',
    name: 'Weekend Islamic School',
    description: 'Comprehensive Islamic education covering Quran, Hadith, Fiqh, Islamic history, and Arabic language for children and teenagers.',
    ageGroup: 'Ages 5-16',
    schedule: 'Saturday & Sunday, 10:00 AM-1:00 PM',
    instructor: 'Multiple qualified teachers',
    level: 'Age-appropriate levels',
    features: [
      'Age-graded curriculum',
      'Quran recitation with Tajweed',
      'Islamic studies and character development',
      'Arabic language instruction',
      'Islamic history and biography',
      'Interactive learning activities'
    ],
    capacity: 80,
    duration: 'Ongoing academic year program',
    requirements: ['Regular attendance', 'Homework completion', 'Respectful behavior']
  },
  {
    id: 'adult-classes',
    name: 'Adult Islamic Education',
    description: 'Evening classes for adults covering various Islamic sciences, Quran study, and practical Islamic knowledge.',
    ageGroup: 'Adults 18+',
    schedule: 'Tuesday & Thursday, 7:30-9:00 PM',
    instructor: 'Imam Mohammad Zahirul Islam',
    level: 'All levels welcome',
    features: [
      'Quran study with translation and tafseer',
      'Hadith studies',
      'Islamic jurisprudence (Fiqh)',
      'Islamic history and civilization',
      'Contemporary Islamic issues',
      'Discussion-based learning'
    ],
    capacity: 40,
    duration: 'Ongoing with seasonal topics',
    requirements: ['Interest in learning', 'Respectful participation']
  },
  {
    id: 'arabic-language',
    name: 'Arabic Language Classes',
    description: 'Structured Arabic language program from basic to advanced levels, focusing on reading, writing, and understanding.',
    ageGroup: 'Ages 8+ and Adults',
    schedule: 'Wednesday, 6:00-7:30 PM',
    instructor: 'Hafez Abdullah Khan',
    level: 'Beginner to Intermediate',
    features: [
      'Arabic alphabet and writing',
      'Grammar and vocabulary',
      'Reading comprehension',
      'Speaking and pronunciation',
      'Quranic Arabic focus',
      'Interactive teaching methods'
    ],
    capacity: 20,
    duration: '2-year program with levels',
    requirements: ['Regular attendance', 'Practice homework', 'Textbook purchase']
  },
  {
    id: 'youth-programs',
    name: 'Youth Islamic Programs',
    description: 'Engaging programs for teenagers focusing on Islamic identity, contemporary issues, and leadership development.',
    ageGroup: 'Ages 13-18',
    schedule: 'Friday, 7:00-8:30 PM (after Maghrib)',
    instructor: 'Youth coordinators and guest speakers',
    level: 'Teen-focused',
    features: [
      'Islamic identity and values',
      'Contemporary Muslim issues',
      'Leadership development',
      'Community service projects',
      'Peer discussions and mentoring',
      'Special events and trips'
    ],
    capacity: 30,
    duration: 'Ongoing with seasonal activities',
    requirements: ['Commitment to program values', 'Parental permission for activities']
  },
  {
    id: 'sisters-classes',
    name: 'Sisters\' Study Circles',
    description: 'Weekly study circles for Muslim women covering Quran, Islamic sciences, and contemporary women\'s issues in Islam.',
    ageGroup: 'Adult Women',
    schedule: 'Sunday, 11:00 AM-12:30 PM',
    instructor: 'Qualified female instructors',
    level: 'All levels',
    features: [
      'Women-only learning environment',
      'Quran study and reflection',
      'Islamic parenting guidance',
      'Contemporary women\'s issues',
      'Sisterhood and community building',
      'Childcare provided during classes'
    ],
    capacity: 25,
    duration: 'Ongoing weekly sessions',
    requirements: ['Respectful participation', 'Islamic dress code']
  }
];

const weeklySchedule: ClassSchedule[] = [
  { day: 'Monday', time: '4:00-6:00 PM', program: 'Tahfeedh Program', instructor: 'Imam Mohammad', ageGroup: '6-18' },
  { day: 'Tuesday', time: '7:30-9:00 PM', program: 'Adult Islamic Studies', instructor: 'Imam Mohammad', ageGroup: 'Adults' },
  { day: 'Wednesday', time: '6:00-7:30 PM', program: 'Arabic Language', instructor: 'Hafez Abdullah', ageGroup: '8+ & Adults' },
  { day: 'Thursday', time: '7:30-9:00 PM', program: 'Adult Islamic Studies', instructor: 'Imam Mohammad', ageGroup: 'Adults' },
  { day: 'Friday', time: '4:00-6:00 PM', program: 'Tahfeedh Program', instructor: 'Multiple Instructors', ageGroup: '6-18' },
  { day: 'Friday', time: '7:00-8:30 PM', program: 'Youth Programs', instructor: 'Youth Coordinators', ageGroup: '13-18' },
  { day: 'Saturday', time: '10:00 AM-1:00 PM', program: 'Weekend School', instructor: 'Multiple Teachers', ageGroup: '5-16' },
  { day: 'Sunday', time: '10:00 AM-1:00 PM', program: 'Weekend School', instructor: 'Multiple Teachers', ageGroup: '5-16' },
  { day: 'Sunday', time: '11:00 AM-12:30 PM', program: 'Sisters\' Study Circle', instructor: 'Female Instructors', ageGroup: 'Adult Women' },
];

const stats = [
  { label: 'Programs', value: '6', icon: BookOpen },
  { label: 'Students', value: '200+', icon: Users },
  { label: 'Weekly Classes', value: '9', icon: Calendar },
  { label: 'Instructors', value: '10+', icon: GraduationCap },
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
                    <span>Ages 6-18</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <Clock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Mon-Fri, 4:00-6:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <GraduationCap className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Certified Instructors</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <BookOpen className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Individual Assessment</span>
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
                  {program.capacity && (
                    <div>
                      <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wide">Capacity</p>
                      <p className="text-xs text-neutral-700">{program.capacity} students</p>
                    </div>
                  )}
                  {program.duration && (
                    <div>
                      <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wide">Duration</p>
                      <p className="text-xs text-neutral-700">{program.duration}</p>
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
                    <th className="text-left text-[10px] font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">Age Group</th>
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
                          {schedule.ageGroup}
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
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <Phone className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <a href="tel:4042449577" className="text-emerald-600">(404) 244-9577</a>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <Mail className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <a href="mailto:info@masjidattaqwaatlanta.org" className="text-emerald-600">info@masjidattaqwaatlanta.org</a>
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
