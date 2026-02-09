'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppeal, useUpdateAppeal } from '@/lib/hooks/useAppeals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, DollarSign } from 'lucide-react';
import Link from 'next/link';
import type { AppealCategory } from '@/types';

export default function EditAppealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: appealData, isLoading } = useAppeal(id);
  const updateAppeal = useUpdateAppeal();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<AppealCategory>('community');
  const [goalAmount, setGoalAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const appeal = appealData?.data;

  useEffect(() => {
    if (appeal) {
      setTitle(appeal.title);
      setDescription(appeal.description);
      setCategory(appeal.category);
      setGoalAmount(appeal.goalAmount?.toString() || '');
      setCurrentAmount(appeal.currentAmount?.toString() || '0');
      setStartDate(appeal.startDate);
      setEndDate(appeal.endDate || '');
      setContactEmail(appeal.contactEmail || '');
      setContactPhone(appeal.contactPhone || '');
      setIsFeatured(appeal.isFeatured || false);
      setIsActive(appeal.isActive);
    }
  }, [appeal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category || !startDate) return;

    try {
      await updateAppeal.mutateAsync({
        id,
        data: {
          title,
          description,
          category,
          goalAmount: goalAmount ? parseFloat(goalAmount) : undefined,
          currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
          startDate,
          endDate: endDate || undefined,
          isActive,
          isFeatured,
          contactEmail: contactEmail || undefined,
          contactPhone: contactPhone || undefined,
        },
      });
      router.push('/admin/appeals');
    } catch (error) {
      console.error('Failed to update appeal:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-islamic-green-600"></div>
      </div>
    );
  }

  if (!appeal) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-red-600">
          Appeal not found.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/appeals">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Appeal</h1>
          <p className="text-gray-600 mt-1">Update appeal details and progress.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appeal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-islamic-green-500 min-h-[150px] text-sm"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as AppealCategory)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-islamic-green-500"
                    >
                      <option value="zakat">Zakat</option>
                      <option value="sadaqah">Sadaqah</option>
                      <option value="building_fund">Building Fund</option>
                      <option value="emergency">Emergency</option>
                      <option value="education">Education</option>
                      <option value="community">Community</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goal">Goal Amount (USD)</Label>
                    <Input
                      id="goal"
                      type="number"
                      min="0"
                      step="0.01"
                      value={goalAmount}
                      onChange={(e) => setGoalAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date *</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Update Amount */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Fundraising Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-amount">Current Amount Raised (USD)</Label>
                  <Input
                    id="current-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                  />
                </div>
                {goalAmount && currentAmount && (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-islamic-green-600 h-3 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            Math.round((parseFloat(currentAmount) / parseFloat(goalAmount)) * 100),
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {Math.round((parseFloat(currentAmount) / parseFloat(goalAmount)) * 100)}% of goal reached
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact &amp; Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="featured">Featured appeal</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="active"
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="active">Active</Label>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    type="submit"
                    className="w-full bg-islamic-green-600 hover:bg-islamic-green-700"
                    disabled={updateAppeal.isPending}
                  >
                    {updateAppeal.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
