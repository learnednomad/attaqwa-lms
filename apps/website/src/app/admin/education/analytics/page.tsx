'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function AdminEducationAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Education Analytics</h1>
        <p className="text-gray-600 mt-1">Overview of Islamic education platform performance</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-gray-100 p-4 mb-4">
            <BarChart3 className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Education Analytics Coming Soon</h2>
          <p className="text-gray-500 mt-2 text-center max-w-md">
            Enrollment statistics and learning analytics will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
