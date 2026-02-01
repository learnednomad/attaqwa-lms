'use client';

import React, { useState } from 'react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight, Clock, MapPin, User } from 'lucide-react';

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const scheduleData = {
  Monday: [
    { id: 1, title: 'Quran Memorization', time: '04:00 PM - 05:00 PM', instructor: 'Imam Mohammad', room: 'QUR-201', color: 'emerald' },
    { id: 2, title: 'Arabic Language', time: '05:00 PM - 06:30 PM', instructor: 'Ustadh Omar', room: 'ARB-401', color: 'blue' },
  ],
  Tuesday: [
    { id: 3, title: 'Islamic Studies - Fiqh', time: '03:00 PM - 04:30 PM', instructor: 'Sheikh Abdullah', room: 'ISL-303', color: 'purple' },
  ],
  Wednesday: [
    { id: 4, title: 'Quran Memorization', time: '04:00 PM - 05:00 PM', instructor: 'Imam Mohammad', room: 'QUR-201', color: 'emerald' },
    { id: 5, title: 'Arabic Language', time: '05:00 PM - 06:30 PM', instructor: 'Ustadh Omar', room: 'ARB-401', color: 'blue' },
  ],
  Thursday: [
    { id: 6, title: 'Islamic Studies - Fiqh', time: '03:00 PM - 04:30 PM', instructor: 'Sheikh Abdullah', room: 'ISL-303', color: 'purple' },
    { id: 7, title: 'Hadith Studies', time: '04:30 PM - 06:00 PM', instructor: 'Dr. Fatima Ali', room: 'HAD-102', color: 'amber' },
  ],
  Friday: [
    { id: 8, title: 'Quran Memorization', time: '04:00 PM - 05:00 PM', instructor: 'Imam Mohammad', room: 'QUR-201', color: 'emerald' },
    { id: 9, title: 'Jummah Prayer', time: '01:00 PM - 02:00 PM', instructor: 'Imam Mohammad', room: 'Main Hall', color: 'rose' },
  ],
  Saturday: [],
  Sunday: [],
};

const colorMap: Record<string, string> = {
  emerald: 'bg-emerald-100 border-emerald-300 text-emerald-800',
  blue: 'bg-blue-100 border-blue-300 text-blue-800',
  purple: 'bg-purple-100 border-purple-300 text-purple-800',
  amber: 'bg-amber-100 border-amber-300 text-amber-800',
  rose: 'bg-rose-100 border-rose-300 text-rose-800',
};

export default function SchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [view, setView] = useState<'week' | 'day'>('week');

  const getWeekDates = () => {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay());
    return weekDays.map((_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates();
  const today = new Date();

  return (
    <StudentLayout title="Class Schedule" subtitle="View your weekly class schedule">
      {/* Week Navigation */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => {
                const newDate = new Date(currentWeek);
                newDate.setDate(newDate.getDate() - 7);
                setCurrentWeek(newDate);
              }}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-center">
                <p className="font-semibold text-lg">
                  {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <Button variant="outline" size="icon" onClick={() => {
                const newDate = new Date(currentWeek);
                newDate.setDate(newDate.getDate() + 7);
                setCurrentWeek(newDate);
              }}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentWeek(new Date())}>Today</Button>
              <Button
                variant={view === 'week' ? 'default' : 'outline'}
                onClick={() => setView('week')}
                className={view === 'week' ? 'bg-emerald-600' : ''}
              >
                Week
              </Button>
              <Button
                variant={view === 'day' ? 'default' : 'outline'}
                onClick={() => setView('day')}
                className={view === 'day' ? 'bg-emerald-600' : ''}
              >
                Day
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b">
            {weekDays.map((day, index) => {
              const date = weekDates[index];
              const isToday = date.toDateString() === today.toDateString();
              return (
                <div
                  key={day}
                  className={`p-4 text-center border-r last:border-r-0 ${isToday ? 'bg-emerald-50' : ''}`}
                >
                  <p className={`text-sm font-medium ${isToday ? 'text-emerald-600' : 'text-gray-500'}`}>
                    {day.slice(0, 3)}
                  </p>
                  <p className={`text-2xl font-bold ${isToday ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {date.getDate()}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-7 min-h-[500px]">
            {weekDays.map((day, index) => {
              const classes = scheduleData[day as keyof typeof scheduleData] || [];
              const isToday = weekDates[index].toDateString() === today.toDateString();
              return (
                <div
                  key={day}
                  className={`p-2 border-r last:border-r-0 ${isToday ? 'bg-emerald-50/50' : ''}`}
                >
                  {classes.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center mt-4">No classes</p>
                  ) : (
                    <div className="space-y-2">
                      {classes.map((cls) => (
                        <div
                          key={cls.id}
                          className={`p-2 rounded-lg border ${colorMap[cls.color]} cursor-pointer hover:shadow-md transition-shadow`}
                        >
                          <p className="font-medium text-sm truncate">{cls.title}</p>
                          <div className="flex items-center gap-1 mt-1 text-xs opacity-80">
                            <Clock className="h-3 w-3" />
                            <span>{cls.time.split(' - ')[0]}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-xs opacity-80">
                            <MapPin className="h-3 w-3" />
                            <span>{cls.room}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's Classes Detail */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Today's Classes</CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const todayClasses = scheduleData[weekDays[today.getDay()] as keyof typeof scheduleData] || [];
            if (todayClasses.length === 0) {
              return <p className="text-gray-500 text-center py-8">No classes scheduled for today</p>;
            }
            return (
              <div className="space-y-4">
                {todayClasses.map((cls) => (
                  <div key={cls.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className={`${colorMap[cls.color].split(' ')[0]} text-sm`}>
                          {cls.instructor.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{cls.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" /> {cls.instructor}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {cls.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {cls.room}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">Join Class</Button>
                  </div>
                ))}
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </StudentLayout>
  );
}
