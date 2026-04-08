'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function AdminEducationStudentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Education Students</h1>
        <p className="text-gray-600 mt-1">Monitor student progress across Islamic education programs</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-gray-100 p-4 mb-4">
            <Users className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Student Management Coming Soon</h2>
          <p className="text-gray-500 mt-2 text-center max-w-md">
            Student enrollment and progress data will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
