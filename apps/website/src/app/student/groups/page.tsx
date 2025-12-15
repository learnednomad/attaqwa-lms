'use client';

import React from 'react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, MessageSquare, Calendar, Clock, Plus, Search, BookOpen, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';

const myGroups = [
  {
    id: '1',
    name: 'Quran Memorization Circle',
    course: 'Quran Memorization - Juz 30',
    members: 8,
    nextMeeting: '2024-12-14 4:00 PM',
    role: 'member',
    unreadMessages: 3,
    lastActivity: '2 hours ago',
  },
  {
    id: '2',
    name: 'Arabic Study Partners',
    course: 'Arabic Language - Level 2',
    members: 6,
    nextMeeting: '2024-12-15 5:00 PM',
    role: 'leader',
    unreadMessages: 0,
    lastActivity: '1 day ago',
  },
  {
    id: '3',
    name: 'Fiqh Discussion Group',
    course: 'Islamic Studies - Fiqh',
    members: 12,
    nextMeeting: '2024-12-16 3:00 PM',
    role: 'member',
    unreadMessages: 5,
    lastActivity: '3 hours ago',
  },
];

const availableGroups = [
  {
    id: '4',
    name: 'Hadith Analysis Circle',
    course: 'Hadith Studies',
    members: 10,
    maxMembers: 15,
    description: 'Weekly study of hadith with scholarly analysis',
    meetingDay: 'Thursdays',
    meetingTime: '6:00 PM',
  },
  {
    id: '5',
    name: 'Sisters Quran Circle',
    course: 'Quran Studies',
    members: 8,
    maxMembers: 12,
    description: 'Women-only Quran study and reflection group',
    meetingDay: 'Saturdays',
    meetingTime: '10:00 AM',
  },
  {
    id: '6',
    name: 'Youth Leadership',
    course: 'General',
    members: 15,
    maxMembers: 20,
    description: 'Developing Islamic leadership skills for young adults',
    meetingDay: 'Sundays',
    meetingTime: '2:00 PM',
  },
];

export default function GroupsPage() {
  return (
    <StudentLayout title="Study Groups" subtitle="Collaborate with fellow students">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{myGroups.length}</p>
                <p className="text-sm text-gray-500">My Groups</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-gray-500">Unread Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-gray-500">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-gray-500">Leading</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search groups..." className="pl-9" />
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Groups */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>My Study Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myGroups.map((group) => (
                  <div key={group.id} className="border rounded-xl p-4 hover:border-emerald-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                          <Users className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{group.name}</h4>
                          <p className="text-sm text-gray-500">{group.course}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {group.role === 'leader' && (
                          <Badge className="bg-amber-100 text-amber-700">Leader</Badge>
                        )}
                        {group.unreadMessages > 0 && (
                          <Badge className="bg-red-100 text-red-700">{group.unreadMessages} new</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" /> {group.members} members
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {group.lastActivity}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-emerald-600" />
                        <span>Next: {new Date(group.nextMeeting).toLocaleDateString()} at {group.nextMeeting.split(' ')[1]} {group.nextMeeting.split(' ')[2]}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Open</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Groups */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Available to Join</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableGroups.map((group) => (
                  <div key={group.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{group.name}</h4>
                        <p className="text-xs text-gray-500">{group.course}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{group.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>{group.members}/{group.maxMembers} members</span>
                      <span>{group.meetingDay} @ {group.meetingTime}</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Request to Join
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Study Tips */}
          <Card className="mt-6 bg-emerald-50 border-emerald-200">
            <CardHeader>
              <CardTitle className="text-lg">Study Group Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-emerald-800">
                <li>- Regular attendance builds accountability</li>
                <li>- Prepare questions before meetings</li>
                <li>- Take turns leading discussions</li>
                <li>- Share notes and resources</li>
                <li>- Support each other's learning journey</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
}
