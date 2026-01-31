'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Settings, Globe, Shield, Bell,
  Database, Clock, Mail, Server
} from 'lucide-react';

const systemInfo = [
  { label: 'Platform Version', value: 'At-Taqwa LMS v2.1.0' },
  { label: 'Next.js Version', value: '15.x' },
  { label: 'Node.js Version', value: '20.x LTS' },
  { label: 'Database', value: 'PostgreSQL 14' },
  { label: 'Cache', value: 'Redis' },
  { label: 'Uptime', value: '99.9%' },
];

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <Button className="bg-islamic-green-600 hover:bg-islamic-green-700">
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Globe className="h-5 w-5 text-indigo-600" />
                General Settings
              </CardTitle>
              <CardDescription>Configure the basic platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Masjid Name
                </label>
                <Input defaultValue="Masjid At-Taqwa" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform URL
                </label>
                <Input defaultValue="https://lms.attaqwa.org" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <Input defaultValue="admin@attaqwa.org" type="email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <Input defaultValue="America/New_York" />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage authentication and security policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">JWT Token Expiration</p>
                  <p className="text-sm text-gray-500">How long auth tokens remain valid</p>
                </div>
                <Input defaultValue="7" className="w-20 text-center" />
                <span className="text-sm text-gray-500">days</span>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Session Timeout</p>
                  <p className="text-sm text-gray-500">Inactive session duration</p>
                </div>
                <Input defaultValue="30" className="w-20 text-center" />
                <span className="text-sm text-gray-500">minutes</span>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Max Login Attempts</p>
                  <p className="text-sm text-gray-500">Before account lockout</p>
                </div>
                <Input defaultValue="5" className="w-20 text-center" />
                <span className="text-sm text-gray-500">attempts</span>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-600" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure system notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Send email for important events</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Prayer Time Alerts</p>
                  <p className="text-sm text-gray-500">Alert admins on prayer time API issues</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">SMTP Server</p>
                  <p className="text-sm text-gray-500">Email delivery configuration</p>
                </div>
                <Input defaultValue="smtp.sendgrid.net" className="w-60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* System Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Server className="h-5 w-5 text-indigo-600" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemInfo.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <span className="text-sm font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Database className="h-4 w-4 mr-2" /> Backup Database
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="h-4 w-4 mr-2" /> Clear Cache
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" /> Test Email
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                <Shield className="h-4 w-4 mr-2" /> Reset Security Keys
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
