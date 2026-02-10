'use client';

import { useState } from 'react';
import { useAppeals, useDeleteAppeal } from '@/lib/hooks/useAppeals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Target,
} from 'lucide-react';
import Link from 'next/link';
import type { AppealCategory } from '@/types';

const categoryLabels: Record<AppealCategory, string> = {
  zakat: 'Zakat',
  sadaqah: 'Sadaqah',
  building_fund: 'Building Fund',
  emergency: 'Emergency',
  education: 'Education',
  community: 'Community',
};

const categoryColors: Record<AppealCategory, string> = {
  zakat: 'bg-green-100 text-green-800',
  sadaqah: 'bg-blue-100 text-blue-800',
  building_fund: 'bg-purple-100 text-purple-800',
  emergency: 'bg-red-100 text-red-800',
  education: 'bg-yellow-100 text-yellow-800',
  community: 'bg-teal-100 text-teal-800',
};

export default function AppealsPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { data: appeals, isLoading, error } = useAppeals();
  const deleteAppeal = useDeleteAppeal();

  const filteredAppeals = appeals?.data?.filter(
    (appeal) => categoryFilter === 'all' || appeal.category === categoryFilter
  ) || [];

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appeal?')) return;
    try {
      await deleteAppeal.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete appeal:', error);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = (current: number = 0, goal: number = 0) => {
    if (!goal) return 0;
    return Math.min(Math.round((current / goal) * 100), 100);
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
          Failed to load appeals. Please try again.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appeals &amp; Campaigns</h1>
          <p className="text-gray-600 mt-2">
            Manage fundraising campaigns and community appeals.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/appeals/new">
            <Plus className="w-4 h-4 mr-2" />
            New Appeal
          </Link>
        </Button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={categoryFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setCategoryFilter('all')}
        >
          All ({appeals?.data?.length || 0})
        </Button>
        {Object.entries(categoryLabels).map(([key, label]) => {
          const count = appeals?.data?.filter(a => a.category === key).length || 0;
          if (count === 0) return null;
          return (
            <Button
              key={key}
              size="sm"
              variant={categoryFilter === key ? 'default' : 'outline'}
              onClick={() => setCategoryFilter(key)}
            >
              {label} ({count})
            </Button>
          );
        })}
      </div>

      {/* Appeals List */}
      <div className="space-y-4">
        {filteredAppeals.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No appeals found.</p>
              <Button asChild className="mt-4">
                <Link href="/admin/appeals/new">Create your first appeal</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredAppeals.map((appeal) => {
            const progress = getProgressPercentage(appeal.currentAmount, appeal.goalAmount);
            return (
              <Card key={appeal.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">{appeal.title}</h3>
                        <Badge className={categoryColors[appeal.category]}>
                          {categoryLabels[appeal.category]}
                        </Badge>
                        {appeal.isFeatured && (
                          <Badge variant="secondary">Featured</Badge>
                        )}
                        {!appeal.isActive && (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">
                        {appeal.description.replace(/<[^>]*>/g, '').substring(0, 200)}
                        {appeal.description.length > 200 ? '...' : ''}
                      </p>

                      {/* Progress Bar */}
                      {appeal.goalAmount && appeal.goalAmount > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="font-medium">
                                {formatCurrency(appeal.currentAmount || 0, appeal.currency)}
                              </span>
                              <span className="text-gray-500">raised</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Target className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-500">
                                {formatCurrency(appeal.goalAmount, appeal.currency)} goal
                              </span>
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-islamic-green-600 h-2.5 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 text-right">{progress}% complete</p>
                        </div>
                      )}

                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Start: {new Date(appeal.startDate).toLocaleDateString()}</span>
                        {appeal.endDate && (
                          <span>End: {new Date(appeal.endDate).toLocaleDateString()}</span>
                        )}
                        {appeal.contactEmail && <span>{appeal.contactEmail}</span>}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/appeals/${appeal.id}/edit`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(appeal.id)}
                        disabled={deleteAppeal.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
