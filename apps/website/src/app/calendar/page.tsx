import { CalendarDownload } from '@/components/features/calendar/calendar-download';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Download, FileText, Clock, Star } from 'lucide-react';
import { Calendar } from '@/types';
import { generateSEOMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = generateSEOMetadata({
  title: "Islamic Calendar Downloads - Masjid At-Taqwa",
  description: "Download Islamic calendars including Ramadan schedules, prayer time tables, Hijri calendar dates, and important Islamic holidays. Free PDF downloads for the Muslim community.",
  keywords: [
    "islamic calendar",
    "ramadan calendar",
    "prayer time calendar",
    "hijri calendar",
    "islamic holidays",
    "eid dates",
    "hajj calendar",
    "ramadan schedule",
    "iftar times",
    "suhur times",
    "islamic calendar pdf",
    "muslim calendar"
  ],
  canonical: "/calendar",
  type: "website"
});

// Mock calendar data - replace with actual API calls
const mockCalendars: Calendar[] = [
  {
    id: '1',
    title: 'Ramadan Calendar 2025/1446',
    description: 'Complete Ramadan schedule with daily Suhur and Iftar times, prayer times, and special programs. Includes community Iftar dates and Taraweh prayer schedules.',
    fileUrl: '/calendars/ramadan-2025.pdf',
    fileName: 'ramadan-calendar-2025.pdf',
    fileSize: 2048576, // 2MB
    year: 2025,
    isActive: true,
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-02-15'),
  },
  {
    id: '2',
    title: 'Annual Prayer Times 2025',
    description: 'Complete year-round prayer times for all five daily prayers including Fajr, Dhuhr, Asr, Maghrib, and Isha. Updated monthly for daylight saving adjustments.',
    fileUrl: '/calendars/prayer-times-2025.pdf',
    fileName: 'prayer-times-2025.pdf',
    fileSize: 1536000, // 1.5MB
    year: 2025,
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: '3',
    title: 'Islamic Holidays & Events 2025',
    description: 'Important Islamic dates including Eid ul-Fitr, Eid ul-Adha, Mawlid an-Nabi, Ashura, and other significant occasions with community event details.',
    fileUrl: '/calendars/islamic-holidays-2025.pdf',
    fileName: 'islamic-holidays-2025.pdf',
    fileSize: 1024000, // 1MB
    year: 2025,
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: '4',
    title: 'Hajj Calendar & Guide 2025',
    description: 'Comprehensive Hajj calendar with important dates, pilgrimage schedule, and preparation guide for community members planning to perform Hajj.',
    fileUrl: '/calendars/hajj-guide-2025.pdf',
    fileName: 'hajj-guide-2025.pdf',
    fileSize: 3072000, // 3MB
    year: 2025,
    isActive: true,
    createdAt: new Date('2025-03-01'),
    updatedAt: new Date('2025-03-10'),
  },
  {
    id: '5',
    title: 'Community Events Calendar Q2 2025',
    description: 'Quarterly calendar featuring educational workshops, youth programs, family events, and special community gatherings from April to June 2025.',
    fileUrl: '/calendars/community-events-q2-2025.pdf',
    fileName: 'community-events-q2-2025.pdf',
    fileSize: 1792000, // 1.75MB
    year: 2025,
    isActive: true,
    createdAt: new Date('2025-03-15'),
    updatedAt: new Date('2025-03-20'),
  },
  {
    id: '6',
    title: 'Ramadan Calendar 2024/1445 (Archive)',
    description: 'Previous year Ramadan calendar for reference. Includes actual Iftar times and community program records from Ramadan 1445.',
    fileUrl: '/calendars/ramadan-2024.pdf',
    fileName: 'ramadan-calendar-2024.pdf',
    fileSize: 1920000, // 1.9MB
    year: 2024,
    isActive: false,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-15'),
  },
];

const currentCalendars = mockCalendars.filter(cal => cal.isActive && cal.year >= 2025);
const archivedCalendars = mockCalendars.filter(cal => !cal.isActive || cal.year < 2025);

const formatFileSize = (bytes: number): string => {
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(1)} MB`;
};

const getTotalDownloads = (calendars: Calendar[]): number => {
  return calendars.reduce((total, cal) => total + cal.fileSize, 0);
};

export default function CalendarPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-islamic-navy-800 md:text-4xl">
          Islamic Calendar Downloads
        </h1>
        <p className="text-lg text-islamic-navy-600 max-w-3xl">
          Access comprehensive Islamic calendars including Ramadan schedules, prayer times, 
          Hijri dates, and important Islamic holidays. All calendars are available as 
          free PDF downloads for our community members.
        </p>
      </header>

      {/* Calendar Statistics */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <CalendarIcon className="h-8 w-8 text-islamic-green-600" />
            <div>
              <p className="text-2xl font-bold text-islamic-navy-800">{currentCalendars.length}</p>
              <p className="text-sm text-islamic-navy-600">Available Calendars</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Download className="h-8 w-8 text-islamic-green-600" />
            <div>
              <p className="text-2xl font-bold text-islamic-navy-800">{formatFileSize(getTotalDownloads(currentCalendars))}</p>
              <p className="text-sm text-islamic-navy-600">Total Download Size</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <FileText className="h-8 w-8 text-islamic-green-600" />
            <div>
              <p className="text-2xl font-bold text-islamic-navy-800">PDF</p>
              <p className="text-sm text-islamic-navy-600">File Format</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="h-8 w-8 text-islamic-green-600" />
            <div>
              <p className="text-2xl font-bold text-islamic-navy-800">2025</p>
              <p className="text-sm text-islamic-navy-600">Current Year</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Calendars */}
      <section className="mb-12">
        <header className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-islamic-navy-800 flex items-center gap-2">
            <Star className="h-6 w-6 text-islamic-gold-600" />
            Featured Calendars
          </h2>
          <p className="text-islamic-navy-600">
            Most popular and essential Islamic calendars for the community.
          </p>
        </header>
        
        <div className="grid gap-6 md:grid-cols-2">
          {currentCalendars.slice(0, 4).map((calendar) => (
            <div key={calendar.id} className="relative">
              {calendar.title.includes('Ramadan') && (
                <Badge className="absolute -top-2 -right-2 z-10 bg-islamic-green-600">
                  Featured
                </Badge>
              )}
              <CalendarDownload calendar={calendar} />
            </div>
          ))}
        </div>
      </section>

      {/* Calendar Categories */}
      <section className="mb-12">
        <header className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-islamic-navy-800">
            Calendar Categories
          </h2>
          <p className="text-islamic-navy-600">
            Browse calendars by type to find exactly what you need.
          </p>
        </header>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🌙</span>
                Ramadan Calendars
              </CardTitle>
              <CardDescription>
                Comprehensive Ramadan schedules with Suhur, Iftar, and prayer times
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-islamic-navy-600">
                Daily Ramadan schedules including community Iftar programs and Taraweh prayers.
              </p>
              <Button variant="outline" className="w-full">
                View Ramadan Calendars
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🕐</span>
                Prayer Time Schedules
              </CardTitle>
              <CardDescription>
                Annual and monthly prayer time tables for daily prayers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-islamic-navy-600">
                Accurate prayer times for Fajr, Dhuhr, Asr, Maghrib, and Isha throughout the year.
              </p>
              <Button variant="outline" className="w-full">
                View Prayer Schedules
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🎉</span>
                Islamic Holidays
              </CardTitle>
              <CardDescription>
                Important Islamic dates and religious observances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-islamic-navy-600">
                Eid dates, Ashura, Mawlid, and other significant Islamic calendar events.
              </p>
              <Button variant="outline" className="w-full">
                View Holiday Calendars
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🕋</span>
                Hajj & Umrah
              </CardTitle>
              <CardDescription>
                Pilgrimage calendars and preparation guides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-islamic-navy-600">
                Hajj schedules, preparation timelines, and important pilgrimage dates.
              </p>
              <Button variant="outline" className="w-full">
                View Pilgrimage Calendars
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">👥</span>
                Community Events
              </CardTitle>
              <CardDescription>
                Local mosque events and community programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-islamic-navy-600">
                Educational workshops, youth programs, and community gatherings schedule.
              </p>
              <Button variant="outline" className="w-full">
                View Event Calendars
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📅</span>
                Hijri Calendar
              </CardTitle>
              <CardDescription>
                Islamic lunar calendar with Gregorian equivalents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-islamic-navy-600">
                Full Hijri calendar with important Islamic months and date conversions.
              </p>
              <Button variant="outline" className="w-full">
                View Hijri Calendars
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* All Current Calendars */}
      <section className="mb-12">
        <header className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-islamic-navy-800">
            All Available Calendars (2025)
          </h2>
          <p className="text-islamic-navy-600">
            Complete collection of current Islamic calendars available for download.
          </p>
        </header>
        
        <div className="grid gap-4">
          {currentCalendars.map((calendar) => (
            <CalendarDownload key={calendar.id} calendar={calendar} compact />
          ))}
        </div>
      </section>

      {/* How to Use */}
      <section className="mb-12">
        <Card className="bg-islamic-gold-50 border-islamic-gold-200">
          <CardContent className="p-8">
            <h3 className="mb-4 text-2xl font-bold text-islamic-gold-800">
              How to Use Islamic Calendars
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-3 font-semibold text-islamic-gold-800">📱 On Mobile Devices</h4>
                <ul className="space-y-2 text-sm text-islamic-gold-700">
                  <li>• Download PDF files to your device</li>
                  <li>• Save to your preferred calendar app</li>
                  <li>• Set prayer time reminders</li>
                  <li>• Share with family and friends</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3 font-semibold text-islamic-gold-800">🖨️ For Print Use</h4>
                <ul className="space-y-2 text-sm text-islamic-gold-700">
                  <li>• Print at home or local print shop</li>
                  <li>• High-quality PDF format for clear printing</li>
                  <li>• Display in your home or office</li>
                  <li>• Great for community bulletin boards</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Archived Calendars */}
      {archivedCalendars.length > 0 && (
        <section>
          <header className="mb-6">
            <h2 className="mb-2 text-2xl font-bold text-islamic-navy-800">
              Archived Calendars
            </h2>
            <p className="text-islamic-navy-600">
              Previous years' calendars available for reference and historical purposes.
            </p>
          </header>
          
          <div className="grid gap-4">
            {archivedCalendars.map((calendar) => (
              <div key={calendar.id} className="opacity-75">
                <CalendarDownload calendar={calendar} compact />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Subscription */}
      <section className="mt-12">
        <Card className="bg-islamic-green-50 border-islamic-green-200">
          <CardContent className="p-8 text-center">
            <h3 className="mb-4 text-2xl font-bold text-islamic-green-800">
              Get Calendar Updates
            </h3>
            <p className="mb-6 text-islamic-green-700">
              Subscribe to receive notifications when new Islamic calendars are available. 
              Be the first to know about Ramadan schedules, prayer time updates, and special event calendars.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-islamic-green-600 hover:bg-islamic-green-700">
                Subscribe for Updates
              </Button>
              <Button size="lg" variant="outline" className="border-islamic-green-600 text-islamic-green-600 hover:bg-islamic-green-600 hover:text-white">
                Request Custom Calendar
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}