'use client';

import React from 'react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Download, Eye, Clock, CheckCircle2, Star } from 'lucide-react';

const certificates = [
  {
    id: '1',
    title: 'Tajweed Fundamentals',
    type: 'Course Completion',
    issueDate: '2024-06-15',
    credentialId: 'CERT-TAJ-2024-0892',
    status: 'issued',
    grade: 'A',
    instructor: 'Qari Ibrahim',
    hours: 45,
    description: 'Successfully completed the fundamentals of Tajweed, demonstrating proficiency in proper Quranic recitation rules.',
  },
  {
    id: '2',
    title: 'Seerah of the Prophet (PBUH)',
    type: 'Course Completion',
    issueDate: '2024-06-20',
    credentialId: 'CERT-SIR-2024-0893',
    status: 'issued',
    grade: 'A',
    instructor: 'Sheikh Ahmed',
    hours: 60,
    description: 'Comprehensive study of the life and teachings of Prophet Muhammad (PBUH).',
  },
  {
    id: '3',
    title: 'Arabic Language - Level 1',
    type: 'Proficiency',
    issueDate: '2024-06-25',
    credentialId: 'CERT-ARB1-2024-0894',
    status: 'issued',
    grade: 'A-',
    instructor: 'Ustadh Omar',
    hours: 80,
    description: 'Demonstrated foundational proficiency in Arabic reading, writing, and basic conversation.',
  },
  {
    id: '4',
    title: 'Islamic Ethics',
    type: 'Course Completion',
    issueDate: '2024-06-28',
    credentialId: 'CERT-ETH-2024-0895',
    status: 'issued',
    grade: 'A',
    instructor: 'Dr. Aisha Mahmoud',
    hours: 36,
    description: 'Understanding of Islamic ethical principles and their application in daily life.',
  },
  {
    id: '5',
    title: 'Quran Memorization - Juz 30',
    type: 'Memorization',
    issueDate: null,
    credentialId: null,
    status: 'in_progress',
    grade: null,
    instructor: 'Imam Mohammad',
    hours: 100,
    progress: 75,
    description: 'Complete memorization of Juz Amma (30th part of the Holy Quran).',
  },
  {
    id: '6',
    title: 'Islamic Studies Certificate',
    type: 'Program Completion',
    issueDate: null,
    credentialId: null,
    status: 'pending',
    requirements: [
      { name: 'Core Courses', completed: 24, required: 48 },
      { name: 'Quran Studies', completed: 10, required: 20 },
      { name: 'Arabic Language', completed: 8, required: 16 },
      { name: 'Electives', completed: 6, required: 12 },
    ],
    description: 'Full program certification upon completion of all required coursework.',
  },
];

const statusColors: Record<string, string> = {
  issued: 'bg-emerald-100 text-emerald-700',
  in_progress: 'bg-blue-100 text-blue-700',
  pending: 'bg-gray-100 text-gray-700',
};

export default function CertificatesPage() {
  const issuedCerts = certificates.filter(c => c.status === 'issued');
  const inProgressCerts = certificates.filter(c => c.status === 'in_progress' || c.status === 'pending');

  return (
    <StudentLayout title="Certificates" subtitle="View and download your earned certificates">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{issuedCerts.length}</p>
                <p className="text-sm text-gray-500">Certificates Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgressCerts.length}</p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">221</p>
                <p className="text-sm text-gray-500">Total Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">3.85</p>
                <p className="text-sm text-gray-500">Average Grade</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earned Certificates */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-600" />
            Earned Certificates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {issuedCerts.map((cert) => (
              <div key={cert.id} className="border rounded-xl p-5 hover:border-emerald-300 transition-colors bg-gradient-to-br from-white to-emerald-50/30">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <Award className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{cert.title}</h4>
                      <p className="text-sm text-gray-500">{cert.type}</p>
                    </div>
                  </div>
                  <Badge className={statusColors[cert.status]}>
                    {cert.grade}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 mb-4">{cert.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-500">Issued</p>
                    <p className="font-medium">{new Date(cert.issueDate!).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Hours</p>
                    <p className="font-medium">{cert.hours} hours</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Instructor</p>
                    <p className="font-medium">{cert.instructor}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Credential ID</p>
                    <p className="font-medium font-mono text-xs">{cert.credentialId}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* In Progress / Pending */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Certificates In Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inProgressCerts.map((cert) => (
              <div key={cert.id} className="border rounded-xl p-5 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      {cert.status === 'in_progress' ? (
                        <Clock className="h-6 w-6 text-blue-600" />
                      ) : (
                        <Star className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{cert.title}</h4>
                      <p className="text-sm text-gray-500">{cert.type}</p>
                    </div>
                  </div>
                  <Badge className={statusColors[cert.status]}>
                    {cert.status === 'in_progress' ? 'In Progress' : 'Requirements Pending'}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 mb-4">{cert.description}</p>

                {cert.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{cert.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${cert.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Instructor: {cert.instructor}</p>
                  </div>
                )}

                {cert.requirements && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Requirements:</p>
                    {cert.requirements.map((req, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{req.name}</span>
                        <span className={req.completed >= req.required ? 'text-emerald-600 font-medium' : 'text-gray-500'}>
                          {req.completed}/{req.required} credits
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </StudentLayout>
  );
}
