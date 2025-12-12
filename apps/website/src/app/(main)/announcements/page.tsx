import { AnnouncementCard } from '@/components/features/announcements/announcement-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Calendar, Clock, Archive, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Announcement } from '@/types';
import { generateSEOMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = generateSEOMetadata({
  title: "Community Announcements - Masjid At-Taqwa",
  description: "Stay updated with the latest mosque announcements, community news, prayer schedule changes, Islamic events, and important information for our Muslim community.",
  keywords: [
    "mosque announcements",
    "islamic community news",
    "prayer schedule updates",
    "ramadan announcements",
    "eid notifications",
    "community notices",
    "islamic events",
    "mosque updates",
    "community information",
    "muslim news"
  ],
  canonical: "/announcements",
  type: "website"
});

// Mock announcements data - replace with actual API calls
const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Eid ul-Fitr 2025 Prayer Arrangements',
    content: '<p>Assalamu Alaikum, dear community members,</p><p>We are pleased to announce the arrangements for <strong>Eid ul-Fitr 2025</strong> celebrations:</p><ul><li><strong>First Prayer:</strong> 8:00 AM in the Main Prayer Hall</li><li><strong>Second Prayer:</strong> 9:30 AM in the Outdoor Area</li><li><strong>Community Lunch:</strong> Following the second prayer</li><li><strong>Parking:</strong> Available at nearby locations</li></ul><p>Please bring your prayer rugs and arrive early. May Allah accept our fasting and prayers during this blessed month.</p><p><em>Eid Mubarak in advance!</em></p>',
    date: new Date('2025-03-30'),
    time: '8:00 AM & 9:30 AM',
    isActive: true,
    isArchived: false,
    createdAt: new Date('2025-03-15'),
    updatedAt: new Date('2025-03-20'),
  },
  {
    id: '2',
    title: 'Ramadan Taraweh Prayer Schedule',
    content: '<p>During the blessed month of Ramadan, we will be conducting <strong>Taraweh prayers</strong> every evening after Isha prayer.</p><p><strong>Schedule:</strong></p><ul><li><strong>Time:</strong> Starting at 9:00 PM daily</li><li><strong>Duration:</strong> Approximately 1 hour 30 minutes</li><li><strong>Location:</strong> Main Prayer Hall</li></ul><p>We encourage all community members to join us for these special prayers. The Imam will be reciting beautiful portions of the Quran each night.</p>',
    date: new Date('2025-02-28'),
    time: '9:00 PM',
    isActive: true,
    isArchived: false,
    createdAt: new Date('2025-02-20'),
    updatedAt: new Date('2025-02-25'),
  },
  {
    id: '3',
    title: 'Masjid Renovation Project Update',
    content: '<p>Alhamdulillah, we are pleased to update you on the progress of our masjid renovation project:</p><p><strong>Completed Work:</strong></p><ul><li>New prayer hall carpeting installation</li><li>LED lighting system upgrade</li><li>Sound system enhancement</li><li>Restroom facility improvements</li></ul><p><strong>Upcoming Phases:</strong></p><ul><li>Community hall expansion (Starting April 2025)</li><li>Parking lot improvements (May 2025)</li><li>Minaret restoration (Summer 2025)</li></ul><p>JazakAllahu khair to all community members who have contributed to this project. May Allah reward your generosity.</p>',
    date: new Date('2025-03-10'),
    isActive: true,
    isArchived: false,
    createdAt: new Date('2025-03-05'),
    updatedAt: new Date('2025-03-08'),
  },
  {
    id: '4',
    title: 'Islamic Education Program Registration Open',
    content: '<p>Registration is now open for our <strong>Spring 2025 Islamic Education Program</strong>:</p><p><strong>Available Classes:</strong></p><ul><li><strong>Quran Recitation:</strong> Beginner to Advanced levels</li><li><strong>Islamic Studies:</strong> Age-appropriate curriculum</li><li><strong>Arabic Language:</strong> Reading and writing fundamentals</li><li><strong>Youth Programs:</strong> Character building and Islamic values</li></ul><p><strong>Registration Details:</strong></p><ul><li><strong>Registration Period:</strong> March 1-31, 2025</li><li><strong>Classes Begin:</strong> April 15, 2025</li><li><strong>Contact:</strong> education@attaqwa.org or visit the office</li></ul>',
    date: new Date('2025-03-01'),
    isActive: true,
    isArchived: false,
    createdAt: new Date('2025-02-25'),
    updatedAt: new Date('2025-03-01'),
  },
  {
    id: '5',
    title: 'Community Iftar Program - Volunteers Needed',
    content: '<p>As we prepare for the blessed month of Ramadan, we are organizing daily <strong>Community Iftar</strong> programs.</p><p><strong>Volunteer Opportunities:</strong></p><ul><li>Food preparation and cooking</li><li>Setup and cleanup coordination</li><li>Serving and hospitality</li><li>Childcare assistance</li></ul><p><strong>Iftar Schedule:</strong></p><ul><li><strong>Daily:</strong> Throughout Ramadan</li><li><strong>Time:</strong> 30 minutes before Maghrib</li><li><strong>Capacity:</strong> 200+ community members</li></ul><p>To volunteer or sponsor an Iftar, please contact our coordinator at community@attaqwa.org</p>',
    date: new Date('2025-02-15'),
    isActive: true,
    isArchived: false,
    createdAt: new Date('2025-02-10'),
    updatedAt: new Date('2025-02-12'),
  },
  {
    id: '6',
    title: 'Winter Prayer Time Schedule Adjustment',
    content: '<p>Due to daylight saving time changes, please note the updated prayer times effective immediately:</p><p><strong>Updated Schedule:</strong></p><ul><li><strong>Fajr:</strong> 5:45 AM</li><li><strong>Sunrise:</strong> 7:15 AM</li><li><strong>Dhuhr:</strong> 12:30 PM</li><li><strong>Asr:</strong> 3:45 PM</li><li><strong>Maghrib:</strong> 6:15 PM</li><li><strong>Isha:</strong> 7:30 PM</li></ul><p>These times will remain in effect until further notice. Please check our prayer time display or website for daily updates.</p>',
    date: new Date('2025-01-15'),
    isActive: false,
    isArchived: true,
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-12'),
  },
];

const activeAnnouncements = mockAnnouncements.filter(ann => ann.isActive && !ann.isArchived);
const archivedAnnouncements = mockAnnouncements.filter(ann => ann.isArchived);

export default function AnnouncementsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-islamic-navy-800 md:text-4xl">
          Community Announcements
        </h1>
        <p className="text-lg text-islamic-navy-600 max-w-3xl">
          Stay informed with the latest news, updates, and important information 
          from Masjid At-Taqwa. From prayer schedule changes to community events, 
          find everything you need to know here.
        </p>
      </header>

      {/* Announcement Statistics */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Megaphone className="h-8 w-8 text-islamic-green-600" />
            <div>
              <p className="text-2xl font-bold text-islamic-navy-800">{activeAnnouncements.length}</p>
              <p className="text-sm text-islamic-navy-600">Active Announcements</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Calendar className="h-8 w-8 text-islamic-green-600" />
            <div>
              <p className="text-2xl font-bold text-islamic-navy-800">Weekly</p>
              <p className="text-sm text-islamic-navy-600">Update Frequency</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="h-8 w-8 text-islamic-green-600" />
            <div>
              <p className="text-2xl font-bold text-islamic-navy-800">Today</p>
              <p className="text-sm text-islamic-navy-600">Last Updated</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Archive className="h-8 w-8 text-islamic-green-600" />
            <div>
              <p className="text-2xl font-bold text-islamic-navy-800">{archivedAnnouncements.length}</p>
              <p className="text-sm text-islamic-navy-600">Archived Items</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search Announcements</CardTitle>
            <CardDescription>
              Find specific announcements by title or content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-islamic-navy-400" />
                  <Input 
                    placeholder="Search announcements..." 
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline">
                Filter
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary">All</Badge>
              <Badge variant="outline">Prayer Schedule</Badge>
              <Badge variant="outline">Events</Badge>
              <Badge variant="outline">Ramadan</Badge>
              <Badge variant="outline">Education</Badge>
              <Badge variant="outline">Community</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Announcements */}
      <section className="mb-12">
        <header className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-islamic-navy-800 flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-islamic-green-600" />
            Current Announcements
          </h2>
          <p className="text-islamic-navy-600">
            Important and recent updates from our Islamic community.
          </p>
        </header>
        
        {activeAnnouncements.length > 0 ? (
          <div className="space-y-6">
            {activeAnnouncements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Megaphone className="mx-auto mb-4 h-12 w-12 text-islamic-navy-400" />
              <h3 className="mb-2 text-lg font-semibold text-islamic-navy-800">
                No Current Announcements
              </h3>
              <p className="text-islamic-navy-600">
                Check back soon for community updates and important information.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Announcement Categories */}
      <section className="mb-12">
        <header className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-islamic-navy-800">
            Announcement Categories
          </h2>
          <p className="text-islamic-navy-600">
            Browse announcements by category to find what interests you most.
          </p>
        </header>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🕌</span>
                Prayer & Worship
              </CardTitle>
              <CardDescription>
                Prayer time changes, special services, and worship announcements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Prayer Announcements
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📅</span>
                Events & Programs
              </CardTitle>
              <CardDescription>
                Upcoming events, programs, and community activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Event Announcements
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                Education & Learning
              </CardTitle>
              <CardDescription>
                Islamic education programs, classes, and learning opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Education Announcements
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🏗️</span>
                Facility Updates
              </CardTitle>
              <CardDescription>
                Construction, renovation, and facility improvement announcements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Facility Updates
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🤝</span>
                Community Support
              </CardTitle>
              <CardDescription>
                Volunteer opportunities, fundraising, and community initiatives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Community Updates
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🌙</span>
                Islamic Calendar
              </CardTitle>
              <CardDescription>
                Ramadan, Eid, Hajj, and other Islamic calendar announcements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Calendar Updates
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="mb-12">
        <Card className="bg-islamic-green-50 border-islamic-green-200">
          <CardContent className="p-8">
            <h3 className="mb-4 text-2xl font-bold text-islamic-green-800">
              Stay Updated with Email Notifications
            </h3>
            <p className="mb-6 text-islamic-green-700">
              Subscribe to receive important announcements directly in your email. 
              Never miss critical updates about prayer times, events, or community news.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <Input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="border-islamic-green-300 focus:border-islamic-green-500"
                />
              </div>
              <Button className="bg-islamic-green-600 hover:bg-islamic-green-700">
                Subscribe to Updates
              </Button>
            </div>
            <p className="mt-3 text-sm text-islamic-green-600">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Archived Announcements */}
      {archivedAnnouncements.length > 0 && (
        <section>
          <header className="mb-6">
            <h2 className="mb-2 text-2xl font-bold text-islamic-navy-800 flex items-center gap-2">
              <Archive className="h-6 w-6 text-islamic-navy-400" />
              Archived Announcements
            </h2>
            <p className="text-islamic-navy-600">
              Previous announcements for reference and historical purposes.
            </p>
          </header>
          
          <div className="space-y-4">
            {archivedAnnouncements.slice(0, 3).map((announcement) => (
              <div key={announcement.id} className="opacity-75">
                <AnnouncementCard announcement={announcement} />
              </div>
            ))}
          </div>
          
          {archivedAnnouncements.length > 3 && (
            <div className="mt-6 text-center">
              <Button variant="outline">
                View More Archived Announcements
              </Button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}