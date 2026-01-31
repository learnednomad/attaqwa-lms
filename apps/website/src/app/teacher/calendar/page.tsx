'use client';

import React from 'react';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar, Clock, BookOpen, Star,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const upcomingEvents = [
  { title: 'Fiqh of Worship - Midterm Exam', date: 'Jan 30, 2025', time: '10:00 AM', type: 'exam', course: 'Fiqh of Worship' },
  { title: 'Hadith Studies - Guest Lecture', date: 'Feb 2, 2025', time: '2:00 PM', type: 'lecture', course: 'Hadith Studies' },
  { title: 'Arabic Grammar - Quiz 3', date: 'Feb 5, 2025', time: '9:00 AM', type: 'quiz', course: 'Arabic Grammar Level 2' },
  { title: 'Parent-Teacher Conference', date: 'Feb 8, 2025', time: '4:00 PM', type: 'meeting', course: 'General' },
  { title: 'Isra & Mi\'raj Program', date: 'Feb 12, 2025', time: '7:00 PM', type: 'islamic', course: 'Community' },
  { title: 'End of Term Assessments Begin', date: 'Feb 20, 2025', time: '9:00 AM', type: 'exam', course: 'All Courses' },
];

const islamicDates = [
  { event: 'Rajab 1, 1446', gregorian: 'Jan 2, 2025', significance: 'Beginning of Rajab' },
  { event: 'Isra & Mi\'raj', gregorian: 'Feb 12, 2025', significance: '27th Rajab - Night Journey' },
  { event: 'Sha\'ban 1, 1446', gregorian: 'Feb 1, 2025', significance: 'Beginning of Sha\'ban' },
  { event: 'Mid-Sha\'ban', gregorian: 'Feb 15, 2025', significance: '15th Sha\'ban' },
  { event: 'Ramadan 1, 1446', gregorian: 'Mar 2, 2025', significance: 'Beginning of Ramadan' },
];

const typeColors: Record<string, string> = {
  exam: 'bg-red-100 text-red-700 border-red-200',
  lecture: 'bg-blue-100 text-blue-700 border-blue-200',
  quiz: 'bg-amber-100 text-amber-700 border-amber-200',
  meeting: 'bg-purple-100 text-purple-700 border-purple-200',
  islamic: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function TeacherCalendarPage() {
  return (
    <TeacherLayout title="Islamic Calendar" subtitle="Manage academic and Islamic calendar events">
      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold text-gray-900">January - February 2025</h2>
          <Button variant="outline" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Today</Button>
          <Button variant="outline" size="sm">Month</Button>
          <Button variant="outline" size="sm">Week</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:border-indigo-200 transition-colors">
                    <div className="flex-shrink-0 w-14 text-center">
                      <p className="text-xs text-gray-500">{event.date.split(',')[0].split(' ')[0]}</p>
                      <p className="text-2xl font-bold text-indigo-600">{event.date.split(' ')[1].replace(',', '')}</p>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {event.time}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <BookOpen className="h-3 w-3" /> {event.course}
                        </span>
                      </div>
                    </div>
                    <Badge className={typeColors[event.type]}>
                      {event.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Islamic Calendar Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Star className="h-5 w-5 text-emerald-600" />
              Islamic Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {islamicDates.map((date, index) => (
                <div key={index} className="p-3 border border-emerald-100 bg-emerald-50/50 rounded-lg">
                  <h4 className="font-medium text-gray-900 text-sm">{date.event}</h4>
                  <p className="text-xs text-gray-500 mt-1">{date.gregorian}</p>
                  <p className="text-xs text-emerald-700 mt-1">{date.significance}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TeacherLayout>
  );
}
