import { AnnouncementCard } from '@/components/features/announcements/announcement-card';
import { Megaphone, Calendar, Clock, Archive, Search, BookOpen, Heart, Building2, Moon } from 'lucide-react';
import { Announcement } from '@/types';
import { generateSEOMetadata } from '@/lib/seo';
import { cn } from '@/lib/utils';
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

const stats = [
  { label: 'Active Announcements', value: String(activeAnnouncements.length), icon: Megaphone },
  { label: 'Update Frequency', value: 'Weekly', icon: Calendar },
  { label: 'Last Updated', value: 'Today', icon: Clock },
  { label: 'Archived Items', value: String(archivedAnnouncements.length), icon: Archive },
];

const filterTags = ['All', 'Prayer Schedule', 'Events', 'Ramadan', 'Education', 'Community'];

const categories = [
  { title: 'Prayer & Worship', description: 'Prayer time changes, special services, and worship announcements', icon: Calendar },
  { title: 'Events & Programs', description: 'Upcoming events, programs, and community activities', icon: Megaphone },
  { title: 'Education & Learning', description: 'Islamic education programs, classes, and learning opportunities', icon: BookOpen },
  { title: 'Facility Updates', description: 'Construction, renovation, and facility improvement announcements', icon: Building2 },
  { title: 'Community Support', description: 'Volunteer opportunities, fundraising, and community initiatives', icon: Heart },
  { title: 'Islamic Calendar', description: 'Ramadan, Eid, Hajj, and other Islamic calendar announcements', icon: Moon },
];

export default function AnnouncementsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">
            Masjid At-Taqwa
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4 max-w-2xl">
            Community Announcements
          </h1>
          <p className="text-base text-neutral-500 max-w-2xl leading-relaxed">
            Stay informed with the latest news, updates, and important information
            from Masjid At-Taqwa. From prayer schedule changes to community events,
            find everything you need to know here.
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
                <div
                  key={stat.label}
                  className="rounded-xl border border-neutral-200 bg-white p-5"
                >
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

        {/* Search & Filter */}
        <section className="pb-10">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search announcements..."
                  className="w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
                />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {filterTags.map((tag, i) => (
                <span
                  key={tag}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-medium cursor-pointer',
                    i === 0
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-neutral-200 text-neutral-600'
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Current Announcements */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Current Announcements</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          {activeAnnouncements.length > 0 ? (
            <div className="space-y-4">
              {activeAnnouncements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-12 text-center">
              <Megaphone className="mx-auto mb-3 h-8 w-8 text-neutral-300" />
              <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                No Current Announcements
              </h3>
              <p className="text-xs text-neutral-500">
                Check back soon for community updates and important information.
              </p>
            </div>
          )}
        </section>

        {/* Categories */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Browse by Category</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <div
                  key={cat.title}
                  className="rounded-xl border border-neutral-200 bg-white p-5"
                >
                  <div className="w-9 h-9 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-4">
                    <IconComponent className="h-4 w-4 text-neutral-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Newsletter */}
        <section className="pb-16">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-8 sm:p-10">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Stay Updated with Email Notifications
            </h3>
            <p className="text-sm text-neutral-500 max-w-xl mb-6 leading-relaxed">
              Subscribe to receive important announcements directly in your email.
              Never miss critical updates about prayer times, events, or community news.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
              />
              <button className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shrink-0">
                Subscribe to Updates
              </button>
            </div>
            <p className="mt-3 text-xs text-neutral-400">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </section>

        {/* Archived */}
        {archivedAnnouncements.length > 0 && (
          <section className="pb-20">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">Archived Announcements</h2>
              <div className="flex-1 h-px bg-neutral-100" />
            </div>

            <div className="space-y-4">
              {archivedAnnouncements.slice(0, 3).map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
