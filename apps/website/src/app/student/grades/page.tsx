'use client';

import React from 'react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Award } from 'lucide-react';

export default function GradesPage() {
  return (
    <StudentLayout title="Grades & Transcript" subtitle="View your academic performance">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Grades Coming Soon</h2>
          <p className="text-gray-500 text-center max-w-md">
            Your grades and academic records will appear here once the grading system is implemented.
          </p>
        </CardContent>
      </Card>
    </StudentLayout>
  );
}
