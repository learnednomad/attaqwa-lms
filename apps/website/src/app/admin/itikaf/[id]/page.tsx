'use client';

import { use } from 'react';
import { useState } from 'react';
import { useItikafRegistration, useUpdateItikafRegistration } from '@/lib/hooks/useItikafRegistrations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  User,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
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
  custom: 'Custom Duration',
};

export default function ItikafRegistrationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: registrationData, isLoading, error } = useItikafRegistration(id);
  const updateRegistration = useUpdateItikafRegistration();
  const [adminNotes, setAdminNotes] = useState('');

  const registration = registrationData?.data;

  const handleStatusUpdate = async (status: ItikafStatus) => {
    try {
      await updateRegistration.mutateAsync({
        id,
        data: {
          status,
          notes: adminNotes || undefined,
        },
      });
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

  if (error || !registration) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-red-600">
          Registration not found or failed to load.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/itikaf">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Registration Details</h1>
          <p className="text-gray-600 mt-1">
            Review and manage this i&apos;tikaf registration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Registrant Information</span>
                <Badge className={statusColors[registration.status]}>
                  {registration.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{registration.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{registration.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{registration.phone}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender / Age</p>
                  <p className="font-medium capitalize">{registration.gender}, {registration.age} years old</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>I&apos;tikaf Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Duration Type</p>
                  <p className="font-medium">{durationLabels[registration.durationType] || registration.durationType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Period</p>
                  <p className="font-medium">
                    {new Date(registration.startDate).toLocaleDateString()} &mdash; {new Date(registration.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {registration.medicalConditions && (
                <div className="border-l-4 border-orange-400 pl-4 bg-orange-50 p-3 rounded">
                  <div className="flex items-center space-x-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <p className="text-sm font-medium text-orange-800">Medical Conditions</p>
                  </div>
                  <p className="text-sm text-orange-700">{registration.medicalConditions}</p>
                </div>
              )}

              {registration.specialRequirements && (
                <div>
                  <p className="text-sm text-gray-500">Special Requirements</p>
                  <p className="text-sm text-gray-700 mt-1">{registration.specialRequirements}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Contact Name</p>
                  <p className="font-medium">{registration.emergencyContactName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Phone</p>
                  <p className="font-medium">{registration.emergencyContactPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-notes">Admin Notes</Label>
                <textarea
                  id="admin-notes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-islamic-green-500 min-h-[100px] text-sm"
                  value={adminNotes || registration.notes || ''}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this registration..."
                />
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => handleStatusUpdate('approved')}
                  disabled={updateRegistration.isPending || registration.status === 'approved'}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  className="w-full"
                  variant="destructive"
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={updateRegistration.isPending || registration.status === 'rejected'}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handleStatusUpdate('cancelled')}
                  disabled={updateRegistration.isPending || registration.status === 'cancelled'}
                >
                  Cancel Registration
                </Button>
              </div>

              <div className="text-xs text-gray-500 pt-2 border-t">
                <p>Registered: {new Date(registration.createdAt).toLocaleString()}</p>
                <p>Last updated: {new Date(registration.updatedAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
