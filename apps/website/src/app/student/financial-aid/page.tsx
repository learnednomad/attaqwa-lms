'use client';

import React from 'react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, FileText, CheckCircle2, Clock, AlertCircle, Download, DollarSign, Calendar } from 'lucide-react';

const zakatAidStatus = {
  currentApplication: {
    id: 'ZAK-2024-0456',
    status: 'approved',
    submittedDate: '2024-08-01',
    approvedDate: '2024-08-15',
    amount: 625,
    semester: 'Fall 2024',
    disbursedDate: '2024-08-20',
  },
  totalReceived: 1250,
  applicationHistory: [
    {
      id: 'ZAK-2024-0456',
      semester: 'Fall 2024',
      amount: 625,
      status: 'approved',
      date: '2024-08-15',
    },
    {
      id: 'ZAK-2024-0234',
      semester: 'Spring 2024',
      amount: 625,
      status: 'approved',
      date: '2024-01-20',
    },
    {
      id: 'ZAK-2023-0892',
      semester: 'Fall 2023',
      amount: 500,
      status: 'denied',
      date: '2023-08-25',
      reason: 'Income exceeded eligibility threshold',
    },
  ],
};

const eligibilityRequirements = [
  { requirement: 'Enrolled in at least 6 credit hours', met: true },
  { requirement: 'Minimum 2.0 GPA', met: true },
  { requirement: 'Demonstrated financial need', met: true },
  { requirement: 'Submitted FAFSA or equivalent', met: true },
  { requirement: 'Active student status', met: true },
];

const availableAid = [
  {
    name: 'Zakat Educational Fund',
    description: 'Need-based aid funded by community Zakat contributions',
    amount: 'Up to $1,000/semester',
    deadline: 'Aug 1 / Jan 1',
    status: 'applied',
  },
  {
    name: 'Islamic Studies Scholarship',
    description: 'Merit-based scholarship for Islamic Studies students',
    amount: '$500/semester',
    deadline: 'Rolling',
    status: 'eligible',
  },
  {
    name: 'Quran Memorization Grant',
    description: 'For students completing Hifz program',
    amount: '$750',
    deadline: 'Jul 15',
    status: 'eligible',
  },
  {
    name: 'Community Service Award',
    description: 'For students volunteering 50+ hours at the masjid',
    amount: '$250',
    deadline: 'Dec 1',
    status: 'eligible',
  },
];

const statusColors: Record<string, string> = {
  approved: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  denied: 'bg-red-100 text-red-700',
  applied: 'bg-blue-100 text-blue-700',
  eligible: 'bg-purple-100 text-purple-700',
};

export default function FinancialAidPage() {
  return (
    <StudentLayout title="Zakat Aid" subtitle="Financial assistance programs and applications">
      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-emerald-600">Current Status</p>
                <p className="text-lg font-bold text-emerald-700">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${zakatAidStatus.currentApplication.amount}</p>
                <p className="text-sm text-gray-500">Current Award</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${zakatAidStatus.totalReceived}</p>
                <p className="text-sm text-gray-500">Total Received</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-lg font-bold">Jan 1, 2025</p>
                <p className="text-sm text-gray-500">Next Deadline</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Application */}
          <Card className="border-emerald-200">
            <CardHeader className="bg-emerald-50 border-b border-emerald-200">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-emerald-600" />
                  Current Zakat Aid Award
                </CardTitle>
                <Badge className={statusColors.approved}>Approved</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Application ID</p>
                  <p className="font-medium font-mono">{zakatAidStatus.currentApplication.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Semester</p>
                  <p className="font-medium">{zakatAidStatus.currentApplication.semester}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Award Amount</p>
                  <p className="font-medium text-emerald-600">${zakatAidStatus.currentApplication.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Disbursed</p>
                  <p className="font-medium">{new Date(zakatAidStatus.currentApplication.disbursedDate!).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-lg">
                <p className="text-sm text-emerald-700">
                  <CheckCircle2 className="h-4 w-4 inline mr-2" />
                  Your Zakat aid has been applied to your Fall 2024 tuition balance.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Available Aid Programs */}
          <Card>
            <CardHeader>
              <CardTitle>Available Financial Aid Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableAid.map((aid, index) => (
                  <div key={index} className="border rounded-xl p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{aid.name}</h4>
                        <p className="text-sm text-gray-500">{aid.description}</p>
                      </div>
                      <Badge className={statusColors[aid.status]}>
                        {aid.status === 'applied' ? 'Applied' : 'Eligible'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span><strong>Amount:</strong> {aid.amount}</span>
                        <span><strong>Deadline:</strong> {aid.deadline}</span>
                      </div>
                      {aid.status === 'eligible' && (
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Apply Now</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Application History */}
          <Card>
            <CardHeader>
              <CardTitle>Application History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {zakatAidStatus.applicationHistory.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${app.status === 'approved' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                        {app.status === 'approved' ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{app.semester}</p>
                        <p className="text-sm text-gray-500">ID: {app.id}</p>
                        {app.reason && <p className="text-sm text-red-600 mt-1">{app.reason}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${app.amount}</p>
                      <Badge className={statusColors[app.status]}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Eligibility */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Eligibility Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {eligibilityRequirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className={`h-5 w-5 ${req.met ? 'text-emerald-500' : 'text-gray-300'}`} />
                    <span className={`text-sm ${req.met ? 'text-gray-700' : 'text-gray-400'}`}>
                      {req.requirement}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-emerald-600 font-medium">
                  You meet all eligibility requirements
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                <FileText className="h-4 w-4 mr-2" />
                New Application
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Award Letter
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Update Financial Info
              </Button>
            </CardContent>
          </Card>

          {/* About Zakat Aid */}
          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-purple-600" />
                About Zakat Aid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-purple-800">
                The Zakat Educational Fund is made possible through generous Zakat contributions
                from our community members. This fund helps eligible students pursue Islamic
                education regardless of their financial circumstances.
              </p>
              <p className="text-sm text-purple-700 mt-3">
                <strong>May Allah reward our donors abundantly.</strong>
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Aid Office</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Questions about your aid package? Contact us:
              </p>
              <p className="text-sm"><strong>Email:</strong> zakataid@attaqwa.org</p>
              <p className="text-sm"><strong>Phone:</strong> (770) 555-0124</p>
              <p className="text-sm"><strong>Hours:</strong> Mon-Thu, 10AM-4PM</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
}
