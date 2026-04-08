'use client';

import React from 'react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

export default function CommunityPage() {
  return (
    <StudentLayout title="Community" subtitle="Connect with the masjid community">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Community Hub Coming Soon</h2>
          <p className="text-gray-500 text-center max-w-md">
            Community resources and connections will be available here.
          </p>
        </CardContent>
      </Card>
    </StudentLayout>
  );
}
