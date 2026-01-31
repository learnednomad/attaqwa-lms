'use client';

import React from 'react';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Award, Download, Search, FileText,
  CheckCircle2, Clock, Users
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const certificates = [
  { student: 'Aisha Mohamed', course: 'Fiqh of Worship', type: 'Completion', issued: '2025-01-15', status: 'issued', grade: 'A' },
  { student: 'Ahmad Hassan', course: 'Hadith Studies', type: 'Completion', issued: '2025-01-18', status: 'issued', grade: 'A-' },
  { student: 'Ibrahim Ahmed', course: 'Arabic Grammar Level 2', type: 'Excellence', issued: '2025-01-20', status: 'issued', grade: 'A+' },
  { student: 'Omar Khalid', course: 'Fiqh of Worship', type: 'Completion', issued: '', status: 'pending', grade: 'B+' },
  { student: 'Fatima Ali', course: 'Hadith Studies', type: 'Participation', issued: '', status: 'pending', grade: 'B' },
  { student: 'Maryam Yusuf', course: 'Arabic Grammar Level 2', type: 'Excellence', issued: '2025-01-22', status: 'issued', grade: 'A+' },
  { student: 'Sara Hassan', course: 'Fiqh of Worship', type: 'Completion', issued: '2025-01-25', status: 'issued', grade: 'B+' },
  { student: 'Yusuf Ibrahim', course: 'Hadith Studies', type: 'Participation', issued: '', status: 'draft', grade: 'C+' },
];

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  issued: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  pending: { color: 'bg-amber-100 text-amber-700', icon: Clock },
  draft: { color: 'bg-gray-100 text-gray-700', icon: FileText },
};

export default function TeacherCertificatesPage() {
  const issuedCount = certificates.filter(c => c.status === 'issued').length;
  const pendingCount = certificates.filter(c => c.status === 'pending').length;

  return (
    <TeacherLayout title="Certificates" subtitle="Manage and issue student certificates">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search certificates..." className="pl-9 w-64" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="issued">Issued</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Award className="h-4 w-4 mr-2" /> Issue Certificate
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Certificates</p>
                <p className="text-2xl font-bold text-gray-900">{certificates.length}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Award className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Issued</p>
                <p className="text-2xl font-bold text-emerald-600">{issuedCount}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Review</p>
                <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-600" />
            Certificate Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Student</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Course</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Type</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Grade</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Status</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Issued Date</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {certificates.map((cert, index) => {
                  const config = statusConfig[cert.status];
                  const StatusIcon = config.icon;
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{cert.student}</td>
                      <td className="px-4 py-3 text-gray-700">{cert.course}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{cert.type}</Badge>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{cert.grade}</td>
                      <td className="px-4 py-3">
                        <Badge className={config.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {cert.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {cert.issued || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {cert.status === 'issued' && (
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          {cert.status === 'pending' && (
                            <Button variant="outline" size="sm" className="text-emerald-600">
                              Approve
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </TeacherLayout>
  );
}
