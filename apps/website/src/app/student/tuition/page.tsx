'use client';

import React from 'react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CreditCard, DollarSign, Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const currentSemester = {
  name: 'Fall 2024',
  tuition: 2400,
  fees: 150,
  books: 200,
  total: 2750,
  paid: 1500,
  due: 1250,
  dueDate: '2024-12-31',
  status: 'partial',
};

const tuitionBreakdown = [
  { item: 'Tuition (15 credits)', amount: 2400, description: '$160 per credit hour' },
  { item: 'Registration Fee', amount: 50, description: 'Per semester' },
  { item: 'Technology Fee', amount: 50, description: 'Lab and online resources' },
  { item: 'Activity Fee', amount: 50, description: 'Student events and activities' },
  { item: 'Course Materials', amount: 200, description: 'Books and supplies (estimated)' },
];

const paymentPlan = [
  { installment: 1, amount: 687.50, dueDate: '2024-09-01', status: 'paid', paidDate: '2024-08-28' },
  { installment: 2, amount: 687.50, dueDate: '2024-10-01', status: 'paid', paidDate: '2024-09-30' },
  { installment: 3, amount: 687.50, dueDate: '2024-11-01', status: 'paid', paidDate: '2024-10-28' },
  { installment: 4, amount: 687.50, dueDate: '2024-12-01', status: 'pending' },
];

const financialHolds = [
  { type: 'None', description: 'Your account is in good standing', status: 'clear' },
];

export default function TuitionPage() {
  const paymentProgress = (currentSemester.paid / currentSemester.total) * 100;

  return (
    <StudentLayout title="Tuition & Fees" subtitle="View your tuition details and payment options">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${currentSemester.total.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Total Due</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${currentSemester.paid.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Paid</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${currentSemester.due.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Balance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">Dec 1</p>
                <p className="text-sm text-gray-500">Next Payment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Semester */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{currentSemester.name} Tuition</CardTitle>
                <Badge className="bg-amber-100 text-amber-700">Partial Payment</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Payment Progress</span>
                  <span className="font-medium">{paymentProgress.toFixed(0)}% Complete</span>
                </div>
                <Progress value={paymentProgress} className="h-3" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>${currentSemester.paid.toLocaleString()} paid</span>
                  <span>${currentSemester.due.toLocaleString()} remaining</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Item</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Description</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tuitionBreakdown.map((item, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="py-3 px-4 text-sm text-gray-900">{item.item}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">{item.description}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 text-right">${item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-medium">
                      <td colSpan={2} className="py-3 px-4 text-sm text-gray-900">Total</td>
                      <td className="py-3 px-4 text-sm text-gray-900 text-right">${currentSemester.total.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="flex gap-3 mt-6">
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Make Payment
                </Button>
                <Button variant="outline" className="flex-1">
                  Set Up Auto-Pay
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentPlan.map((payment) => (
                  <div key={payment.installment} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${payment.status === 'paid' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                        {payment.status === 'paid' ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Installment {payment.installment}</p>
                        <p className="text-sm text-gray-500">Due: {new Date(payment.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${payment.amount.toLocaleString()}</p>
                      {payment.status === 'paid' ? (
                        <p className="text-sm text-emerald-600">Paid {new Date(payment.paidDate!).toLocaleDateString()}</p>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700">Pending</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <Card className="border-emerald-200 bg-emerald-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-emerald-700 font-medium">Good Standing</p>
              <p className="text-sm text-emerald-600 mt-1">No financial holds on your account</p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                View Payment Methods
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Payment Due Dates
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="h-4 w-4 mr-2" />
                Apply for Zakat Aid
              </Button>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Contact the Financial Services office for questions about tuition, payment plans, or financial aid.
              </p>
              <p className="text-sm">
                <strong>Email:</strong> finance@attaqwa.org
              </p>
              <p className="text-sm">
                <strong>Phone:</strong> (770) 555-0123
              </p>
              <p className="text-sm">
                <strong>Hours:</strong> Mon-Fri, 9AM-5PM
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
}
