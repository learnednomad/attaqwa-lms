'use client';

import React from 'react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';

export default function FinancialAidPage() {
  return (
    <StudentLayout title="Zakat Aid" subtitle="Financial assistance programs">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Financial Aid Coming Soon</h2>
          <p className="text-gray-500 text-center max-w-md">
            Zakat-based financial assistance information will appear here.
          </p>
        </CardContent>
      </Card>
    </StudentLayout>
  );
}
