'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-gray-100 p-4 mb-4">
            <Users className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700">User Management Coming Soon</h2>
          <p className="text-gray-500 mt-2 text-center max-w-md">
            User accounts will be managed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
