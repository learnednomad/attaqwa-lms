'use client';

import { useState } from 'react';
import { useItikafRegistrations, useUpdateItikafRegistration } from '@/lib/hooks/useItikafRegistrations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Moon,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import type { ItikafStatus } from '@/types';

const statusColors: Record<ItikafStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

const durationLabels: Record<string, string> = {
  full: 'Full Ramadan',
  last_ten: 'Last 10 Days',
  weekend: 'Weekend',
  custom: 'Custom',
};

export default function ItikafRegistrationsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { data: registrations, isLoading, error } = useItikafRegistrations();
  const updateRegistration = useUpdateItikafRegistration();

  const filteredRegistrations = registrations?.data?.filter(
    (reg) => statusFilter === 'all' || reg.status === statusFilter
  ) || [];

  const statusCounts = {
    all: registrations?.data?.length || 0,
    pending: registrations?.data?.filter(r => r.status === 'pending').length || 0,
    approved: registrations?.data?.filter(r => r.status === 'approved').length || 0,
    rejected: registrations?.data?.filter(r => r.status === 'rejected').length || 0,
    cancelled: registrations?.data?.filter(r => r.status === 'cancelled').length || 0,
  };

  const handleQuickAction = async (id: string, status: ItikafStatus) => {
    try {
      await updateRegistration.mutateAsync({ id, data: { status } });
    } catch (error) {
      console.error('Failed to update registration:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-islamic-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-red-600">
          Failed to load registrations. Please try again.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">I&apos;tikaf Registrations</h1>
        <p className="text-gray-600 mt-2">
          Manage i&apos;tikaf registration requests from community members.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card
            key={status}
            className={`cursor-pointer transition-all ${statusFilter === status ? 'ring-2 ring-islamic-green-500' : ''}`}
            onClick={() => setStatusFilter(status)}
          >
            <CardContent className="py-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-xs text-gray-500 capitalize mt-1">{status}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Registrations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Moon className="w-5 h-5" />
            <span>Registrations ({filteredRegistrations.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No registrations found for the selected filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRegistrations.map((reg) => (
                <div
                  key={reg.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-gray-900">{reg.fullName}</h3>
                      <Badge className={statusColors[reg.status]}>
                        {reg.status}
                      </Badge>
                      <Badge variant="secondary">{reg.gender}</Badge>
                    </div>

                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{durationLabels[reg.durationType] || reg.durationType}</span>
                      {' '}&mdash;{' '}
                      {new Date(reg.startDate).toLocaleDateString()} to {new Date(reg.endDate).toLocaleDateString()}
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{reg.email}</span>
                      <span>{reg.phone}</span>
                      <span>Age: {reg.age}</span>
                    </div>

                    {reg.medicalConditions && (
                      <p className="text-xs text-orange-600">
                        Medical: {reg.medicalConditions}
                      </p>
                    )}

                    {reg.notes && (
                      <p className="text-xs text-gray-500 italic">
                        Admin notes: {reg.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/itikaf/${reg.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                    {reg.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleQuickAction(reg.id, 'approved')}
                          disabled={updateRegistration.isPending}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleQuickAction(reg.id, 'rejected')}
                          disabled={updateRegistration.isPending}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
