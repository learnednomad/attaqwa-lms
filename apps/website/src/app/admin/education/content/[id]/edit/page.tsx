'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileEdit } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function AdminEditContentPage() {
  const params = useParams();
  const contentId = params.id as string;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/education">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Content</h1>
          <p className="text-gray-600 mt-1">Modify existing educational content</p>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-gray-100 p-4 mb-4">
            <FileEdit className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Content Editor Coming Soon</h2>
          <p className="text-gray-500 mt-2 text-center max-w-md">
            Content editing for item {contentId} will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
