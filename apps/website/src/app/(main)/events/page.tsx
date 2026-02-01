import { EventCard } from '@/components/features/events/event-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Event } from '@/types';
import { generateSEOMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = generateSEOMetadata({
  title: "Islamic Events & Activities - Masjid At-Taqwa",
  description: "Join our Islamic community events including Eid prayers, Ramadan programs, educational workshops, family gatherings, and special religious observances. View upcoming events and register to participate.",
  keywords: [
    "islamic events",
    "eid prayers",
    "ramadan activities",
    "islamic workshops",
    "community events",
    "mosque programs",
    "islamic education",
    "family events",
    "religious ceremonies",
    "jummah programs"
  ],
  canonical: "/events",
  type: "website"
});

// Mock events data - replace with actual API calls
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Eid ul-Fitr 2025 Celebration',
    description: 'Celebrate the end of Ramadan with our community. Multiple prayer times available with outdoor arrangements for families.',
    date: new Date('2025-03-30'),
    startTime: '8:00 AM',
    endTime: '11:00 AM',
    location: 'Masjid At-Taqwa Main Hall & Outdoor Area',
    isIndoor: true,
    isOutdoor: true,
    prayerTimes: [
      { name: '1st Eid Prayer', time: '8:00 AM', location: 'Main Hall' },
      { name: '2nd Eid Prayer', time: '9:30 AM', location: 'Outdoor Area' },
    ],
    zakatInfo: {
      amount: 10,
      currency: 'USD',
      description: 'per person (Zakat ul-Fitr)',
    },
    isActive: true,
    createdAt: new Date('2025-03-01'),
    updatedAt: new Date('2025-03-15'),
  },
  {
    id: '2',
    title: 'Ramadan Taraweh Prayers',
    description: 'Join us for daily Taraweh prayers throughout the blessed month of Ramadan. Special recitations and community atmosphere.',
    date: new Date('2025-02-28'),
    startTime: '9:00 PM',
    endTime: '10:30 PM',
    location: 'Main Prayer Hall',
    isIndoor: true,
    isOutdoor: false,
    isActive: true,
    createdAt: new Date('2025-02-20'),
    updatedAt: new Date('2025-02-25'),
  },
  {
    id: '3',
    title: 'Islamic Studies Workshop Series',
    description: 'Monthly educational workshop covering Quran, Hadith, Fiqh, and Islamic history. Suitable for all ages and knowledge levels.',
    date: new Date('2025-08-15'),
    startTime: '2:00 PM',
    endTime: '4:00 PM',
    location: 'Education Center',
    isIndoor: true,
    isOutdoor: false,
    isActive: true,
    createdAt: new Date('2025-08-01'),
    updatedAt: new Date('2025-08-10'),
  },
  {
    id: '4',
    title: 'Community Iftar Gathering',
    description: 'Break your fast with the community during Ramadan. Free communal Iftar with traditional foods and fellowship.',
    date: new Date('2025-03-15'),
    startTime: '7:30 PM',
    endTime: '9:00 PM',
    location: 'Community Hall',
    isIndoor: true,
    isOutdoor: false,
    isActive: true,
    createdAt: new Date('2025-03-01'),
    updatedAt: new Date('2025-03-10'),
  },
];

const upcomingEvents = mockEvents.filter(event => event.date >= new Date()).sort((a, b) => a.date.getTime() - b.date.getTime());
const pastEvents = mockEvents.filter(event => event.date < new Date()).sort((a, b) => b.date.getTime() - a.date.getTime());

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-islamic-navy-800 md:text-4xl">
          Islamic Events & Activities
        </h1>
        <p className="text-lg text-islamic-navy-600 max-w-3xl">
          Join our vibrant Islamic community for spiritual gatherings, educational programs, 
          and celebrations throughout the year. From Eid prayers to weekly workshops, 
          there's always something meaningful happening at Masjid At-Taqwa.
        </p>
      </header>

      {/* Event Statistics */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Calendar className="h-8 w-8 text-islamic-green-600" />
            <div>
              <p className="text-2xl font-bold text-islamic-navy-800">{upcomingEvents.length}</p>
              <p className="text-sm text-islamic-navy-600">Upcoming Events</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="h-8 w-8 text-islamic-green-600" />
            <div>
              <p className="text-2xl font-bold text-islamic-navy-800">Weekly</p>
              <p className="text-sm text-islamic-navy-600">Regular Programs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Users className="h-8 w-8 text-islamic-green-600" />
            <div>
              <p className="text-2xl font-bold text-islamic-navy-800">200+</p>
              <p className="text-sm text-islamic-navy-600">Community Members</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <MapPin className="h-8 w-8 text-islamic-green-600" />
            <div>
              <p className="text-2xl font-bold text-islamic-navy-800">5</p>
              <p className="text-sm text-islamic-navy-600">Event Venues</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <section className="mb-12">
        <header className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-islamic-navy-800">
            Upcoming Events
          </h2>
          <p className="text-islamic-navy-600">
            Don't miss these upcoming Islamic community events and programs.
          </p>
        </header>
        
        {upcomingEvents.length > 0 ? (
          <div className="grid gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-islamic-navy-400" />
              <h3 className="mb-2 text-lg font-semibold text-islamic-navy-800">
                No Upcoming Events
              </h3>
              <p className="text-islamic-navy-600">
                Check back soon for new events and programs.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Event Categories */}
      <section className="mb-12">
        <header className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-islamic-navy-800">
            Event Categories
          </h2>
          <p className="text-islamic-navy-600">
            Explore different types of events and programs we offer.
          </p>
        </header>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🕌</span>
                Religious Observances
              </CardTitle>
              <CardDescription>
                Eid prayers, Ramadan programs, and special Islamic holidays
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Religious Events
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                Educational Programs
              </CardTitle>
              <CardDescription>
                Islamic studies, Quran classes, and knowledge workshops
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Educational Events
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">👨‍👩‍👧‍👦</span>
                Family Events
              </CardTitle>
              <CardDescription>
                Community gatherings, youth programs, and family activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Family Events
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Past Events */}
      {pastEvents.length > 0 && (
        <section>
          <header className="mb-6">
            <h2 className="mb-2 text-2xl font-bold text-islamic-navy-800">
              Recent Past Events
            </h2>
            <p className="text-islamic-navy-600">
              Take a look at our recent community events and programs.
            </p>
          </header>
          
          <div className="grid gap-6">
            {pastEvents.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="mt-12">
        <Card className="bg-islamic-green-50 border-islamic-green-200">
          <CardContent className="p-8 text-center">
            <h3 className="mb-4 text-2xl font-bold text-islamic-green-800">
              Stay Connected with Our Community
            </h3>
            <p className="mb-6 text-islamic-green-700">
              Subscribe to our newsletter to receive updates about upcoming events, 
              special programs, and important community announcements.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-islamic-green-600 hover:bg-islamic-green-700">
                Subscribe to Updates
              </Button>
              <Button size="lg" variant="outline" className="border-islamic-green-600 text-islamic-green-600 hover:bg-islamic-green-600 hover:text-white">
                Contact Event Coordinator
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}