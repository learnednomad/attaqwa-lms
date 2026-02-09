'use client';

import { AnnouncementCard } from '@/components/features/announcements/announcement-card';
import { Megaphone, Calendar, Clock, Archive, Search, BookOpen, Heart, Building2, Moon } from 'lucide-react';
import { useAnnouncements } from '@/lib/hooks/useAnnouncements';
import { cn } from '@/lib/utils';

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
  const { data, isLoading } = useAnnouncements({ limit: 50 });

  const announcements = data?.data || [];
  const activeAnnouncements = announcements.filter(ann => ann.isActive);
  const archivedAnnouncements = announcements.filter(ann => !ann.isActive);

  const stats = [
    { label: 'Active Announcements', value: String(activeAnnouncements.length), icon: Megaphone },
    { label: 'Update Frequency', value: 'Weekly', icon: Calendar },
    { label: 'Last Updated', value: 'Today', icon: Clock },
    { label: 'Archived Items', value: String(archivedAnnouncements.length), icon: Archive },
  ];

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

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : activeAnnouncements.length > 0 ? (
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
