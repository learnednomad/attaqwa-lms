'use client';

import React from 'react';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function TeacherAnalyticsPage() {
  return (
    <TeacherLayout title="Course Analytics" subtitle="Track student performance and engagement">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-gray-100 p-4 mb-4">
            <BarChart3 className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Analytics Coming Soon</h2>
          <p className="text-gray-500 mt-2 text-center max-w-md">
            Course analytics and student performance data will appear here once enough data is collected.
          </p>
        </CardContent>
      </Card>
    </TeacherLayout>
  );
}
