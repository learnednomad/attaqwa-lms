'use client';

import React, { useState } from 'react';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User, Bell, Lock, Mail, Upload, Save,
  Globe, BookOpen, Calendar
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export default function TeacherSettingsPage() {
  const [notifications, setNotifications] = useState({
    newEnrollment: true,
    submissionReceived: true,
    studentMessage: true,
    weeklyReport: false,
  });

  return (
    <TeacherLayout title="Settings" subtitle="Manage your account and preferences">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Globe className="h-4 w-4" /> Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Photo */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
                <CardDescription>Your photo will be visible to students</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 text-3xl">SA</AvatarFallback>
                </Avatar>
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" /> Upload Photo
                </Button>
              </CardContent>
            </Card>

            {/* Profile Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Abdullah" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Al-Faqih" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" defaultValue="Sheikh" placeholder="e.g., Sheikh, Ustadh, Dr." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="abdullah.faqih@attaqwa.org" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (770) 555-0123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    defaultValue="Sheikh Abdullah Al-Faqih has been teaching Islamic sciences for over 15 years. He specializes in Fiqh and Hadith studies."
                    placeholder="Tell students about yourself..."
                  />
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Save className="h-4 w-4 mr-2" /> Save Changes
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">New Student Enrollment</Label>
                  <p className="text-sm text-gray-500">Get notified when a student enrolls in your course</p>
                </div>
                <Switch
                  checked={notifications.newEnrollment}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, newEnrollment: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Assignment Submissions</Label>
                  <p className="text-sm text-gray-500">Get notified when students submit assignments</p>
                </div>
                <Switch
                  checked={notifications.submissionReceived}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, submissionReceived: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Student Messages</Label>
                  <p className="text-sm text-gray-500">Get notified when students send you a message</p>
                </div>
                <Switch
                  checked={notifications.studentMessage}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, studentMessage: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Weekly Reports</Label>
                  <p className="text-sm text-gray-500">Receive a weekly summary of course activity</p>
                </div>
                <Switch
                  checked={notifications.weeklyReport}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyReport: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password regularly for security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Update Password
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">2FA Status</p>
                    <p className="text-sm text-gray-500">Protect your account with two-factor authentication</p>
                  </div>
                  <Badge variant="outline" className="text-amber-600 border-amber-300">Not Enabled</Badge>
                </div>
                <Button variant="outline" className="mt-4">
                  Enable 2FA
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Teaching Preferences</CardTitle>
              <CardDescription>Customize your teaching experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Show Office Hours</Label>
                  <p className="text-sm text-gray-500">Display your office hours to students</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Allow Direct Messages</Label>
                  <p className="text-sm text-gray-500">Let students send you direct messages</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-Release Grades</Label>
                  <p className="text-sm text-gray-500">Automatically release quiz grades when completed</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Islamic Calendar Display</Label>
                  <p className="text-sm text-gray-500">Show Hijri dates alongside Gregorian</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </TeacherLayout>
  );
}
