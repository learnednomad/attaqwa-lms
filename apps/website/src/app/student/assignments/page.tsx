'use client';

import React from 'react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function AssignmentsPage() {
  return (
    <StudentLayout title="Assignments" subtitle="Track and submit your coursework">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Assignments Yet</h2>
          <p className="text-gray-500 text-center max-w-md">
            Your course assignments will appear here when assigned by your instructors.
          </p>
        </CardContent>
      </Card>
    </StudentLayout>
  );
}
