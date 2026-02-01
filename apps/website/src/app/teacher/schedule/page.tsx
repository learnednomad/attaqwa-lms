'use client';

import React from 'react';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, MapPin, Users, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const mockSchedule = [
  { id: 1, day: 'Monday', time: '6:30 PM - 8:00 PM', course: 'Fiqh of Worship', room: 'A-101', students: 24 },
  { id: 2, day: 'Tuesday', time: '7:00 PM - 8:30 PM', course: 'Hadith Studies - 40 Nawawi', room: 'B-203', students: 18 },
  { id: 3, day: 'Wednesday', time: '5:00 PM - 6:30 PM', course: 'Arabic Grammar Level 2', room: 'C-105', students: 15 },
  { id: 4, day: 'Thursday', time: '6:30 PM - 8:00 PM', course: 'Fiqh of Worship', room: 'A-101', students: 24 },
  { id: 5, day: 'Friday', time: '8:00 PM - 9:00 PM', course: 'Office Hours', room: 'B-105', students: 0 },
  { id: 6, day: 'Saturday', time: '10:00 AM - 12:00 PM', course: 'Hadith Studies - 40 Nawawi', room: 'B-203', students: 18 },
];

const todayClasses = [
  { time: '6:30 PM', course: 'Fiqh of Worship', room: 'A-101', status: 'upcoming' },
  { time: '8:00 PM', course: 'Office Hours', room: 'B-105', status: 'later' },
];

export default function TeacherSchedulePage() {
  return (
    <TeacherLayout title="Class Schedule" subtitle="View and manage your teaching schedule">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Schedule */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Weekly Schedule</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">Dec 9 - 15, 2024</span>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSchedule.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-24 text-center">
                        <p className="font-medium text-gray-900">{item.day}</p>
                        <p className="text-sm text-gray-500">{item.time.split(' - ')[0]}</p>
                      </div>
                      <div className="h-12 w-px bg-gray-200" />
                      <div>
                        <h3 className="font-medium text-gray-900">{item.course}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" /> {item.room}
                          </span>
                          {item.students > 0 && (
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" /> {item.students} students
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" /> {item.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{item.day === 'Friday' ? 'Office Hours' : 'Class'}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Classes */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-500" />
                Today&apos;s Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayClasses.map((cls, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      cls.status === 'upcoming'
                        ? 'bg-indigo-50 border-indigo-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{cls.course}</p>
                        <p className="text-sm text-gray-500">{cls.time} | Room {cls.room}</p>
                      </div>
                      {cls.status === 'upcoming' && (
                        <Badge className="bg-indigo-100 text-indigo-700">Next</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" /> Add Special Session
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" /> Request Room Change
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="h-4 w-4 mr-2" /> Set Office Hours
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </TeacherLayout>
  );
}
