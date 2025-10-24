'use client';

import { useAnnouncements } from '@/lib/hooks/useAnnouncements';
import { useEvents } from '@/lib/hooks/useEvents';
import { useTodayPrayerTimes } from '@/lib/hooks/usePrayerTimes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Megaphone, 
  Calendar, 
  Clock, 
  Users,
  TrendingUp,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { formatTime } from '@attaqwa/shared';

export default function AdminDashboard() {
  const { data: announcements } = useAnnouncements({ limit: 5, isActive: true });
  const { data: upcomingEvents } = useEvents({ upcoming: true, limit: 5 });
  const { data: prayerTimes } = useTodayPrayerTimes(42.3601, -71.0589); // Boston coordinates

  const stats = [
    {
      title: 'Total Announcements',
      value: announcements?.pagination.total || 0,
      icon: Megaphone,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Upcoming Events',
      value: upcomingEvents?.pagination.total || 0,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Active Users',
      value: '42', // Mock data
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Monthly Growth',
      value: '+12%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to the admin dashboard. Here's an overview of your mosque's digital presence.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Prayer Times */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Today's Prayer Times</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {prayerTimes?.data ? (
              <div className="space-y-3">
                {Object.entries(prayerTimes.data)
                  .filter(([key]) => key !== 'date' && key !== 'qibla')
                  .map(([prayer, time]) => (
                    <div key={prayer} className="flex justify-between items-center">
                      <span className="capitalize font-medium text-gray-700">
                        {prayer}
                      </span>
                      <span className="font-mono text-islamic-green-600">
                        {formatTime(time as string)}
                      </span>
                    </div>
                  ))}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Qibla Direction</span>
                    <span className="font-mono text-islamic-green-600">
                      {prayerTimes.data.qibla}°
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-islamic-green-600"></div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Megaphone className="w-5 h-5" />
              <span>Recent Announcements</span>
            </CardTitle>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/announcements">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {announcements?.data ? (
              <div className="space-y-4">
                {announcements.data.slice(0, 3).map((announcement) => (
                  <div key={announcement.id} className="border-l-4 border-islamic-green-500 pl-4">
                    <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {announcement.content.substring(0, 100)}...
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-islamic-green-600"></div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Upcoming Events</span>
            </CardTitle>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/events">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {upcomingEvents?.data ? (
              <div className="space-y-4">
                {upcomingEvents.data.slice(0, 3).map((event) => (
                  <div key={event.id} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      {event.startTime && <span>{formatTime(event.startTime)}</span>}
                      {event.location && <span>{event.location}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-islamic-green-600"></div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/admin/announcements/new">
                <Megaphone className="w-4 h-4 mr-2" />
                Create Announcement
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/admin/events/new">
                <Calendar className="w-4 h-4 mr-2" />
                Create Event
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/admin/users">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}