'use client';

import React, { useState } from 'react';
import { StudentLayout } from '@/components/layout/student-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreditCard, Download, Search, Filter, CheckCircle2, Clock, XCircle, ExternalLink } from 'lucide-react';

const paymentHistory = [
  {
    id: 'PID-331829',
    date: '2024-10-28',
    description: 'Fall 2024 Tuition - Installment 3',
    amount: 687.50,
    method: 'Credit Card ****4532',
    status: 'completed',
    receiptUrl: '#',
  },
  {
    id: 'PID-331828',
    date: '2024-09-30',
    description: 'Fall 2024 Tuition - Installment 2',
    amount: 687.50,
    method: 'Credit Card ****4532',
    status: 'completed',
    receiptUrl: '#',
  },
  {
    id: 'PID-331827',
    date: '2024-08-28',
    description: 'Fall 2024 Tuition - Installment 1',
    amount: 687.50,
    method: 'Bank Transfer',
    status: 'completed',
    receiptUrl: '#',
  },
  {
    id: 'PID-331826',
    date: '2024-08-15',
    description: 'Fall 2024 Registration Fee',
    amount: 50.00,
    method: 'Credit Card ****4532',
    status: 'completed',
    receiptUrl: '#',
  },
  {
    id: 'PID-331825',
    date: '2024-06-15',
    description: 'Spring 2024 Tuition - Final',
    amount: 625.00,
    method: 'Zakat Aid Applied',
    status: 'completed',
    receiptUrl: '#',
  },
  {
    id: 'PID-331824',
    date: '2024-05-01',
    description: 'Spring 2024 Tuition - Installment 3',
    amount: 625.00,
    method: 'Credit Card ****4532',
    status: 'completed',
    receiptUrl: '#',
  },
  {
    id: 'PID-331823',
    date: '2024-04-01',
    description: 'Spring 2024 Tuition - Installment 2',
    amount: 625.00,
    method: 'Credit Card ****4532',
    status: 'completed',
    receiptUrl: '#',
  },
  {
    id: 'PID-331822',
    date: '2024-03-01',
    description: 'Spring 2024 Tuition - Installment 1',
    amount: 625.00,
    method: 'Bank Transfer',
    status: 'completed',
    receiptUrl: '#',
  },
  {
    id: 'PID-331821',
    date: '2024-01-15',
    description: 'Spring 2024 Registration Fee',
    amount: 50.00,
    method: 'Credit Card ****4532',
    status: 'completed',
    receiptUrl: '#',
  },
];

const statusColors: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-blue-100 text-blue-700',
};

const statusIcons: Record<string, React.ReactNode> = {
  completed: <CheckCircle2 className="h-4 w-4" />,
  pending: <Clock className="h-4 w-4" />,
  failed: <XCircle className="h-4 w-4" />,
};

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  const filteredPayments = paymentHistory.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesYear = yearFilter === 'all' || payment.date.startsWith(yearFilter);
    return matchesSearch && matchesStatus && matchesYear;
  });

  const totalPaid = paymentHistory
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <StudentLayout title="Payment History" subtitle="View your complete payment history">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${totalPaid.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Total Paid (2024)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{paymentHistory.length}</p>
                <p className="text-sm text-gray-500">Total Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Download className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <Button variant="link" className="p-0 h-auto text-lg font-bold">
                  Download All
                </Button>
                <p className="text-sm text-gray-500">Export History</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by description or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payment History Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Payment ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Method</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-mono text-gray-600">{payment.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{new Date(payment.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{payment.description}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{payment.method}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">${payment.amount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={statusColors[payment.status]}>
                        <span className="flex items-center gap-1">
                          {statusIcons[payment.status]}
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No payments found matching your criteria
            </div>
          )}

          {/* Pagination placeholder */}
          <div className="flex items-center justify-between pt-4 border-t mt-4">
            <p className="text-sm text-gray-500">
              Showing {filteredPayments.length} of {paymentHistory.length} transactions
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </StudentLayout>
  );
}
