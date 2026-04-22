'use client';

import Link from 'next/link';
import {
  Calendar,
  Megaphone,
  MessageCircle,
  ArrowRight,
  Users,
} from 'lucide-react';
import { EventCard } from '@/components/features/events/event-card';
import { AnnouncementCard } from '@/components/features/announcements/announcement-card';
import { useAnnouncements } from '@/lib/hooks/useAnnouncements';
import { useEvents } from '@/lib/hooks/useEvents';
import { MOSQUE_INFO } from '@/constants';

export default function CommunityPage() {
  const { data: announcementData, isLoading: announcementsLoading } = useAnnouncements({
    limit: 10,
    isActive: true,
  });
  const { data: eventData, isLoading: eventsLoading } = useEvents({ limit: 20 });

  const announcements = announcementData?.data ?? [];
  const events = (eventData?.data ?? [])
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">
            Masjid At-Taqwa
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4 max-w-2xl">
            Community Hub
          </h1>
          <p className="text-base text-neutral-500 max-w-2xl leading-relaxed">
            Upcoming events, the latest announcements, and the channels where our community stays
            connected between prayers.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-14">
        {/* Stay Connected — WhatsApp channels */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Stay Connected</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <a
              href={MOSQUE_INFO.social.whatsappGroup}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-neutral-200 bg-white p-6 hover:border-emerald-300 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                <MessageCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">
                WhatsApp Community Group
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed mb-3">
                Conversation and planning for active community members.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 group-hover:text-emerald-800">
                Join the group
                <ArrowRight className="h-3 w-3" />
              </span>
            </a>
            <a
              href={MOSQUE_INFO.social.whatsappChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-neutral-200 bg-white p-6 hover:border-emerald-300 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">
                WhatsApp Announcements Channel
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed mb-3">
                Read-only broadcast for masjid-wide announcements and reminders.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 group-hover:text-emerald-800">
                Follow the channel
                <ArrowRight className="h-3 w-3" />
              </span>
            </a>
          </div>
        </section>

        {/* Events */}
        <section id="events">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-900">Upcoming Events</h2>
            </div>
            <Link
              href="/events"
              className="text-xs font-medium text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
            >
              See all events
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {eventsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
            </div>
          ) : events.length > 0 ? (
            <div className="space-y-4">
              {events.slice(0, 5).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-10 text-center">
              <Calendar className="mx-auto mb-3 h-7 w-7 text-neutral-300" />
              <p className="text-sm text-neutral-600">No upcoming events right now.</p>
            </div>
          )}
        </section>

        {/* Announcements */}
        <section id="announcements">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <Megaphone className="h-4 w-4 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-900">Latest Announcements</h2>
            </div>
            <Link
              href="/announcements"
              className="text-xs font-medium text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
            >
              See all announcements
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {announcementsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
            </div>
          ) : announcements.length > 0 ? (
            <div className="space-y-4">
              {announcements.slice(0, 5).map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-10 text-center">
              <Megaphone className="mx-auto mb-3 h-7 w-7 text-neutral-300" />
              <p className="text-sm text-neutral-600">
                No announcements posted right now.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
