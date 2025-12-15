'use client';

import React, { useState } from 'react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Users, Star, CheckCircle2, Bell } from 'lucide-react';

const events = [
  {
    id: '1',
    title: 'Jummah Prayer & Khutbah',
    date: '2024-12-13',
    time: '1:00 PM - 2:00 PM',
    location: 'Main Prayer Hall',
    type: 'prayer',
    recurring: true,
    registered: true,
    attendees: 250,
    description: 'Weekly Friday prayer with sermon by Imam Mohammad.',
  },
  {
    id: '2',
    title: 'End of Semester Celebration',
    date: '2024-12-20',
    time: '6:00 PM - 9:00 PM',
    location: 'Community Center',
    type: 'social',
    recurring: false,
    registered: true,
    attendees: 85,
    description: 'Celebrate the end of Fall 2024 semester with dinner, awards, and entertainment.',
  },
  {
    id: '3',
    title: 'Quran Competition Finals',
    date: '2024-12-22',
    time: '10:00 AM - 4:00 PM',
    location: 'Main Prayer Hall',
    type: 'academic',
    recurring: false,
    registered: false,
    attendees: 120,
    description: 'Annual Quran recitation and memorization competition.',
  },
  {
    id: '4',
    title: 'Youth Halaqah',
    date: '2024-12-14',
    time: '7:00 PM - 8:30 PM',
    location: 'Youth Center',
    type: 'educational',
    recurring: true,
    registered: true,
    attendees: 35,
    description: 'Weekly youth study circle discussing contemporary Islamic topics.',
  },
  {
    id: '5',
    title: 'Sisters Book Club',
    date: '2024-12-15',
    time: '2:00 PM - 4:00 PM',
    location: 'Sisters Lounge',
    type: 'social',
    recurring: true,
    registered: false,
    attendees: 18,
    description: 'Monthly book discussion on Islamic literature.',
  },
  {
    id: '6',
    title: 'Career Networking Night',
    date: '2024-12-18',
    time: '6:30 PM - 8:30 PM',
    location: 'Conference Room A',
    type: 'professional',
    recurring: false,
    registered: false,
    attendees: 45,
    description: 'Connect with Muslim professionals in various industries.',
  },
  {
    id: '7',
    title: 'Winter Break Volunteer Day',
    date: '2024-12-23',
    time: '9:00 AM - 3:00 PM',
    location: 'Community Kitchen',
    type: 'volunteer',
    recurring: false,
    registered: false,
    attendees: 30,
    description: 'Help prepare and distribute meals for those in need.',
  },
];

const typeColors: Record<string, string> = {
  prayer: 'bg-emerald-100 text-emerald-700',
  social: 'bg-purple-100 text-purple-700',
  academic: 'bg-blue-100 text-blue-700',
  educational: 'bg-amber-100 text-amber-700',
  professional: 'bg-indigo-100 text-indigo-700',
  volunteer: 'bg-rose-100 text-rose-700',
};

export default function EventsPage() {
  const [filter, setFilter] = useState('all');

  const registeredEvents = events.filter(e => e.registered);
  const upcomingEvents = events.filter(e => !e.registered);

  const filteredEvents = filter === 'all'
    ? events
    : events.filter(e => e.type === filter);

  return (
    <StudentLayout title="Masjid Events" subtitle="Stay connected with community events">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{registeredEvents.length}</p>
                <p className="text-sm text-gray-500">Registered</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{events.length}</p>
                <p className="text-sm text-gray-500">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-gray-500">Attended</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Bell className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-gray-500">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="registered">My Events ({registeredEvents.length})</TabsTrigger>
          <TabsTrigger value="prayer">Prayer</TabsTrigger>
          <TabsTrigger value="educational">Educational</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="registered">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {registeredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prayer">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {events.filter(e => e.type === 'prayer').map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="educational">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {events.filter(e => e.type === 'educational' || e.type === 'academic').map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="social">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {events.filter(e => e.type === 'social' || e.type === 'professional' || e.type === 'volunteer').map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </StudentLayout>
  );
}

function EventCard({ event }: { event: typeof events[0] }) {
  const typeColors: Record<string, string> = {
    prayer: 'bg-emerald-100 text-emerald-700',
    social: 'bg-purple-100 text-purple-700',
    academic: 'bg-blue-100 text-blue-700',
    educational: 'bg-amber-100 text-amber-700',
    professional: 'bg-indigo-100 text-indigo-700',
    volunteer: 'bg-rose-100 text-rose-700',
  };

  return (
    <Card className={event.registered ? 'border-emerald-200' : ''}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900">{event.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={typeColors[event.type]}>
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </Badge>
              {event.recurring && (
                <Badge variant="outline" className="text-xs">Recurring</Badge>
              )}
            </div>
          </div>
          {event.registered && (
            <Badge className="bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Registered
            </Badge>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4">{event.description}</p>

        <div className="space-y-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{event.attendees} attending</span>
          </div>
        </div>

        <div className="flex gap-2">
          {event.registered ? (
            <>
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">View Details</Button>
              <Button variant="outline">Cancel</Button>
            </>
          ) : (
            <>
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">Register</Button>
              <Button variant="outline">Learn More</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
