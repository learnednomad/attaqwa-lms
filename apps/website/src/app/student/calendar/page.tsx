'use client';

import React, { useState } from 'react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Moon, Star, BookOpen, Calendar as CalendarIcon } from 'lucide-react';

const islamicEvents = [
  { date: '2024-12-01', name: 'Jumada al-Thani 1', type: 'hijri', hijriDate: '1 Jumada al-Thani 1446' },
  { date: '2024-12-17', name: 'Start of Rajab', type: 'special', hijriDate: '1 Rajab 1446' },
  { date: '2024-12-27', name: "Isra' and Mi'raj", type: 'holiday', hijriDate: '27 Rajab 1446' },
  { date: '2025-01-15', name: 'Start of Sha\'ban', type: 'special', hijriDate: '1 Sha\'ban 1446' },
  { date: '2025-02-28', name: 'Start of Ramadan', type: 'holiday', hijriDate: '1 Ramadan 1446' },
  { date: '2025-03-30', name: 'Eid al-Fitr', type: 'holiday', hijriDate: '1 Shawwal 1446' },
];

const academicEvents = [
  { date: '2024-12-13', name: 'Quiz: Arabic Vocabulary', type: 'quiz', course: 'Arabic Language' },
  { date: '2024-12-15', name: 'Assignment Due: Surah Recitation', type: 'assignment', course: 'Quran Memorization' },
  { date: '2024-12-18', name: 'Midterm: Fiqh', type: 'exam', course: 'Islamic Studies' },
  { date: '2024-12-20', name: 'Hadith Paper Due', type: 'assignment', course: 'Hadith Studies' },
  { date: '2024-12-22', name: 'Winter Break Begins', type: 'break' },
  { date: '2025-01-06', name: 'Classes Resume', type: 'academic' },
  { date: '2025-01-15', name: 'Final Exams Begin', type: 'exam' },
];

const typeColors: Record<string, string> = {
  hijri: 'bg-gray-100 text-gray-700 border-gray-300',
  special: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  holiday: 'bg-amber-100 text-amber-700 border-amber-300',
  quiz: 'bg-blue-100 text-blue-700 border-blue-300',
  assignment: 'bg-purple-100 text-purple-700 border-purple-300',
  exam: 'bg-red-100 text-red-700 border-red-300',
  break: 'bg-cyan-100 text-cyan-700 border-cyan-300',
  academic: 'bg-indigo-100 text-indigo-700 border-indigo-300',
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    return { daysInMonth, startingDay };
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const islamic = islamicEvents.filter(e => e.date === dateStr);
    const academic = academicEvents.filter(e => e.date === dateStr);
    return [...islamic, ...academic];
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const today = new Date();
  const isToday = (day: number) => {
    return day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear();
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <StudentLayout title="Islamic Calendar" subtitle="Islamic events and academic schedule">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <CardTitle>
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </CardTitle>
                <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Week headers */}
              <div className="grid grid-cols-7 mb-2">
                {weekDays.map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before start of month */}
                {Array.from({ length: startingDay }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square p-1" />
                ))}

                {/* Days of month */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const events = getEventsForDate(day);
                  const hasIslamicEvent = events.some(e => ['hijri', 'special', 'holiday'].includes(e.type));
                  const hasAcademicEvent = events.some(e => !['hijri', 'special', 'holiday'].includes(e.type));

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                      className={`aspect-square p-1 rounded-lg text-sm relative hover:bg-gray-100 transition-colors
                        ${isToday(day) ? 'bg-emerald-100 text-emerald-700 font-bold' : ''}
                        ${selectedDate?.getDate() === day && selectedDate?.getMonth() === currentDate.getMonth() ? 'ring-2 ring-emerald-500' : ''}
                      `}
                    >
                      <span>{day}</span>
                      {events.length > 0 && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {hasIslamicEvent && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                          {hasAcademicEvent && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 pt-4 border-t flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-gray-600">Islamic Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-gray-600">Academic Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-100" />
                  <span className="text-gray-600">Today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a Date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                (() => {
                  const events = getEventsForDate(selectedDate.getDate());
                  if (events.length === 0) {
                    return <p className="text-gray-500 text-sm">No events on this day</p>;
                  }
                  return (
                    <div className="space-y-3">
                      {events.map((event, index) => (
                        <div key={index} className={`p-3 rounded-lg border ${typeColors[event.type]}`}>
                          <p className="font-medium">{event.name}</p>
                          {'hijriDate' in event && (
                            <p className="text-sm opacity-80 mt-1">{event.hijriDate}</p>
                          )}
                          {'course' in event && (
                            <p className="text-sm opacity-80 mt-1">{event.course}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()
              ) : (
                <p className="text-gray-500 text-sm">Click on a date to view events</p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Islamic Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Moon className="h-5 w-5" />
                Islamic Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {islamicEvents.slice(0, 5).map((event, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-b-0 last:pb-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${event.type === 'holiday' ? 'bg-amber-100' : 'bg-emerald-100'}`}>
                      {event.type === 'holiday' ? (
                        <Star className="h-4 w-4 text-amber-600" />
                      ) : (
                        <Moon className="h-4 w-4 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{event.name}</p>
                      <p className="text-xs text-gray-500">{event.hijriDate}</p>
                      <p className="text-xs text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Academic Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Academic Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {academicEvents.slice(0, 5).map((event, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-b-0 last:pb-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeColors[event.type].split(' ')[0]}`}>
                      <BookOpen className={`h-4 w-4 ${typeColors[event.type].split(' ')[1]}`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{event.name}</p>
                      {'course' in event && <p className="text-xs text-gray-500">{event.course}</p>}
                      <p className="text-xs text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
}
