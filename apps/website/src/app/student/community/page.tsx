'use client';

import React from 'react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Building2, Users, MessageSquare, Heart, Award, BookOpen,
  MapPin, Phone, Mail, Clock, ExternalLink, Search, Calendar
} from 'lucide-react';

const announcements = [
  {
    id: '1',
    title: 'Winter Break Schedule',
    content: 'The masjid will have modified hours during winter break (Dec 22 - Jan 5). Prayer times remain the same.',
    date: '2024-12-10',
    type: 'general',
  },
  {
    id: '2',
    title: 'Quran Competition Registration Open',
    content: 'Register now for the annual Quran competition. Deadline: December 15.',
    date: '2024-12-08',
    type: 'academic',
  },
  {
    id: '3',
    title: 'Volunteer Appreciation Dinner',
    content: 'Join us for a special dinner honoring our volunteers. RSVP required.',
    date: '2024-12-05',
    type: 'event',
  },
];

const resources = [
  {
    title: 'Student Handbook',
    description: 'Academic policies, code of conduct, and important information',
    icon: BookOpen,
    link: '#',
  },
  {
    title: 'Counseling Services',
    description: 'Confidential support for personal and academic challenges',
    icon: Heart,
    link: '#',
  },
  {
    title: 'Career Services',
    description: 'Resume help, job listings, and professional development',
    icon: Award,
    link: '#',
  },
  {
    title: 'Prayer Room Schedule',
    description: 'Reserve rooms for group prayers and meetings',
    icon: Calendar,
    link: '#',
  },
];

const staffDirectory = [
  {
    name: 'Imam Mohammad Rahman',
    role: 'Lead Imam & Director',
    email: 'imam@attaqwa.org',
    phone: '(770) 555-0101',
  },
  {
    name: 'Sheikh Abdullah Mahmoud',
    role: 'Islamic Studies Director',
    email: 'abdullah@attaqwa.org',
    phone: '(770) 555-0102',
  },
  {
    name: 'Sister Aisha Hassan',
    role: 'Student Affairs Coordinator',
    email: 'studentaffairs@attaqwa.org',
    phone: '(770) 555-0103',
  },
  {
    name: 'Brother Omar Khan',
    role: 'Youth Programs Director',
    email: 'youth@attaqwa.org',
    phone: '(770) 555-0104',
  },
];

const communityStats = [
  { label: 'Active Students', value: '320', icon: Users },
  { label: 'Study Groups', value: '24', icon: MessageSquare },
  { label: 'Events This Month', value: '15', icon: Calendar },
  { label: 'Volunteer Hours', value: '1,250', icon: Heart },
];

export default function CommunityPage() {
  return (
    <StudentLayout title="Community" subtitle="Connect with your masjid community">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {communityStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Announcements */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Community Announcements</CardTitle>
                <Button variant="link" className="text-emerald-600">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{announcement.title}</h4>
                      <span className="text-xs text-gray-500">{new Date(announcement.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600">{announcement.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Student Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource) => (
                  <a
                    key={resource.title}
                    href={resource.link}
                    className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                      <resource.icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{resource.title}</h4>
                      <p className="text-sm text-gray-500">{resource.description}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400 shrink-0" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Staff Directory */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Staff Directory</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search staff..." className="pl-9" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {staffDirectory.map((staff) => (
                  <div key={staff.email} className="flex items-start gap-3 p-4 border rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{staff.name}</h4>
                      <p className="text-sm text-gray-500 mb-2">{staff.role}</p>
                      <div className="space-y-1 text-sm">
                        <a href={`mailto:${staff.email}`} className="flex items-center gap-2 text-emerald-600 hover:underline">
                          <Mail className="h-3 w-3" /> {staff.email}
                        </a>
                        <span className="flex items-center gap-2 text-gray-500">
                          <Phone className="h-3 w-3" /> {staff.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Masjid At-Taqwa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-900">4674 Peachtree Industrial Blvd</p>
                    <p className="text-gray-600">Doraville, GA 30096</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">(770) 555-0100</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a href="mailto:info@attaqwa.org" className="text-emerald-600 hover:underline">info@attaqwa.org</a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Open daily for all prayers</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" /> Library Catalog
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" /> Find Study Partners
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Heart className="h-4 w-4 mr-2" /> Volunteer Opportunities
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" /> Discussion Forums
              </Button>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-lg text-red-800">Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-700 mb-2">For urgent matters after hours:</p>
              <p className="font-bold text-red-800">(770) 555-0911</p>
            </CardContent>
          </Card>

          {/* Feedback */}
          <Card className="bg-emerald-50 border-emerald-200">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-800">Share Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-emerald-700 mb-3">
                Your voice matters! Help us improve the student experience.
              </p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                Submit Feedback
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
}
