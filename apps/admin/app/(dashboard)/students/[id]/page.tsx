/**
 * Student Profile Page
 * View detailed student information and progress
 */

import { ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: studentId } = await params;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/students"
          className="rounded-lg p-2 text-charcoal-600 transition-colors hover:bg-charcoal-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-charcoal-900">Student Profile</h1>
          <p className="mt-2 text-charcoal-600">
            View detailed information and progress tracking
          </p>
        </div>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-charcoal-100 p-4 mb-4">
            <User className="h-10 w-10 text-charcoal-400" />
          </div>
          <h2 className="text-xl font-semibold text-charcoal-700">Student Details</h2>
          <p className="text-charcoal-500 mt-2 text-center max-w-md">
            Student detail view coming soon. Student ID: {studentId}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
