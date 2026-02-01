import { Clock, Users, BookOpen, Calendar, GraduationCap, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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

export default function EducationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-islamic-green-700 mb-4">Educational Programs</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Comprehensive Islamic education programs for all ages, from Quran memorization to adult studies, 
          fostering spiritual growth and Islamic knowledge in our community.
        </p>
      </div>

      {/* Featured Program - Tahfeedh */}
      <Card className="mb-8 border-islamic-green-200 bg-gradient-to-r from-islamic-green-50 to-white">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6 text-islamic-gold-600" />
            <div>
              <CardTitle className="text-2xl text-islamic-green-700">Featured Program</CardTitle>
              <p className="text-islamic-green-600">Tahfeedhul Qur'an - Quran Memorization</p>
            </div>
            <Badge className="ml-auto bg-islamic-gold-600">Premium Program</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-muted-foreground mb-4">
                Our flagship Quran memorization program with certified instructors and proven methodology. 
                Students receive individual attention and progress through structured levels.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-islamic-green-600" />
                  <span>Ages 6-18</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-islamic-green-600" />
                  <span>Mon-Fri, 4:00-6:00 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-islamic-green-600" />
                  <span>Certified Instructors</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-islamic-green-600" />
                  <span>Individual Assessment</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-islamic-green-700">Program Highlights:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Proper Tajweed instruction with certified teachers</li>
                <li>• Regular progress evaluations and parent meetings</li>
                <li>• Annual Hifz graduation ceremony</li>
                <li>• Small class sizes for individual attention</li>
                <li>• Flexible scheduling for different learning paces</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Programs Grid */}
      <div className="grid gap-8 mb-12">
        <h2 className="text-3xl font-bold text-islamic-green-700 text-center mb-8">All Educational Programs</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {educationalPrograms.map((program) => (
            <Card key={program.id} className="islamic-pattern border-islamic-green-100">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-islamic-green-700 mb-2">{program.name}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{program.ageGroup}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{program.schedule.split(',')[0]}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-islamic-green-300 text-islamic-green-700">
                    {program.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{program.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-islamic-green-700">Schedule:</span>
                    <p className="text-muted-foreground">{program.schedule}</p>
                  </div>
                  <div>
                    <span className="font-medium text-islamic-green-700">Instructor:</span>
                    <p className="text-muted-foreground">{program.instructor}</p>
                  </div>
                  {program.capacity && (
                    <div>
                      <span className="font-medium text-islamic-green-700">Capacity:</span>
                      <p className="text-muted-foreground">{program.capacity} students</p>
                    </div>
                  )}
                  {program.duration && (
                    <div>
                      <span className="font-medium text-islamic-green-700">Duration:</span>
                      <p className="text-muted-foreground">{program.duration}</p>
                    </div>
                  )}
                </div>

                <Separator />
                
                <div>
                  <h4 className="font-semibold text-islamic-green-700 mb-2">Program Features:</h4>
                  <div className="grid grid-cols-1 gap-1 text-sm">
                    {program.features.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-islamic-green-600 mt-0.5">•</span>
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                    {program.features.length > 4 && (
                      <div className="flex items-start gap-2">
                        <span className="text-islamic-green-600 mt-0.5">•</span>
                        <span className="text-muted-foreground">And {program.features.length - 4} more features...</span>
                      </div>
                    )}
                  </div>
                </div>

                {program.requirements && (
                  <div>
                    <h4 className="font-semibold text-islamic-green-700 mb-2">Requirements:</h4>
                    <div className="text-sm space-y-1">
                      {program.requirements.map((req, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-islamic-gold-600 mt-0.5">✓</span>
                          <span className="text-muted-foreground">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Weekly Schedule */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-islamic-green-700">
            <Calendar className="h-5 w-5" />
            Weekly Class Schedule
          </CardTitle>
          <p className="text-muted-foreground">
            Complete schedule of all educational programs throughout the week
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-islamic-green-200">
                  <th className="text-left font-semibold text-islamic-green-700 py-3">Day</th>
                  <th className="text-left font-semibold text-islamic-green-700 py-3">Time</th>
                  <th className="text-left font-semibold text-islamic-green-700 py-3">Program</th>
                  <th className="text-left font-semibold text-islamic-green-700 py-3">Instructor</th>
                  <th className="text-left font-semibold text-islamic-green-700 py-3">Age Group</th>
                </tr>
              </thead>
              <tbody>
                {weeklySchedule.map((schedule, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-islamic-green-50 transition-colors">
                    <td className="py-3 font-medium text-islamic-green-700">{schedule.day}</td>
                    <td className="py-3 text-muted-foreground">{schedule.time}</td>
                    <td className="py-3">{schedule.program}</td>
                    <td className="py-3 text-muted-foreground">{schedule.instructor}</td>
                    <td className="py-3">
                      <Badge variant="outline" className="border-islamic-green-300 text-islamic-green-700">
                        {schedule.ageGroup}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Registration Information */}
      <Card className="bg-islamic-gold-50 border-islamic-gold-200">
        <CardHeader>
          <CardTitle className="text-islamic-gold-800">Registration Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-islamic-gold-800 mb-2">How to Register:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Contact the masjid office during office hours</li>
                <li>• Speak with instructors after prayers</li>
                <li>• Register online through our website (coming soon)</li>
                <li>• Visit during program times to observe classes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-islamic-gold-800 mb-2">Contact Information:</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Phone:</strong> (404) 244-9577</p>
                <p><strong>Email:</strong> info@masjidattaqwaatlanta.org</p>
                <p><strong>Address:</strong> 1584 Rogers Lake Rd, Lithonia, GA 30058</p>
                <p><strong>Office Hours:</strong> Daily after prayers or by appointment</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="text-center">
            <p className="text-islamic-gold-800 font-medium">
              "And whoever fears Allah - He will make for him a way out and provide for him from where he does not expect."
            </p>
            <p className="text-sm text-muted-foreground mt-1">- Quran 65:2-3</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}