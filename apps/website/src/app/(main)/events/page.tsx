'use client';

import { EventCard } from '@/components/features/events/event-card';
import { Calendar, Clock, MapPin, Users, BookOpen, Heart } from 'lucide-react';
import { useEvents } from '@/lib/hooks/useEvents';

const categories = [
  {
    title: 'Religious Observances',
    description: 'Eid prayers, Ramadan programs, and special Islamic holidays',
    icon: Calendar,
  },
  {
    title: 'Educational Programs',
    description: 'Islamic studies, Quran classes, and knowledge workshops',
    icon: BookOpen,
  },
  {
    title: 'Family Events',
    description: 'Community gatherings, youth programs, and family activities',
    icon: Heart,
  },
];

export default function EventsPage() {
  const { data, isLoading } = useEvents({ limit: 50 });

  const events = data?.data || [];
  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastEvents = events
    .filter(event => new Date(event.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const stats = [
    { label: 'Upcoming Events', value: String(upcomingEvents.length), icon: Calendar },
    { label: 'Regular Programs', value: 'Weekly', icon: Clock },
    { label: 'Community Members', value: '200+', icon: Users },
    { label: 'Event Venues', value: '5', icon: MapPin },
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
            Events & Activities
          </h1>
          <p className="text-base text-neutral-500 max-w-2xl leading-relaxed">
            Join our vibrant Islamic community for spiritual gatherings, educational programs,
            and celebrations throughout the year. From Eid prayers to weekly workshops,
            there&apos;s always something meaningful happening.
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

        {/* Upcoming Events */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Upcoming Events</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-12 text-center">
              <Calendar className="mx-auto mb-3 h-8 w-8 text-neutral-300" />
              <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                No Upcoming Events
              </h3>
              <p className="text-xs text-neutral-500">
                Check back soon for new events and programs.
              </p>
            </div>
          )}
        </section>

        {/* Event Categories */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Event Categories</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
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

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section className="pb-16">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">Recent Past Events</h2>
              <div className="flex-1 h-px bg-neutral-100" />
            </div>

            <div className="space-y-4">
              {pastEvents.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="pb-20">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-8 sm:p-10 text-center">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Stay Connected with Our Community
            </h3>
            <p className="text-sm text-neutral-500 max-w-xl mx-auto mb-6 leading-relaxed">
              Subscribe to our newsletter to receive updates about upcoming events,
              special programs, and important community announcements.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white"
              >
                Subscribe to Updates
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700"
              >
                Contact Event Coordinator
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
