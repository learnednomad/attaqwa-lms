/**
 * Students Management Page
 * View and manage all registered users — real data from BetterAuth + Strapi
 */

'use client';

import { Award, BookOpen, Clock, Loader2, Mail, MoreVertical, Search, TrendingUp, User } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils/formatters';
import { authClient } from '@/lib/auth-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  image?: string | null;
}

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [enrollmentCounts, setEnrollmentCounts] = useState<Record<string, number>>({});

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use BetterAuth admin API to list users
      const res = await authClient.admin.listUsers({
        query: {
          limit: 100,
          offset: 0,
        },
      });

      if (res.data?.users) {
        setUsers(res.data.users as AppUser[]);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchEnrollments = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/v1/course-enrollments?pagination[pageSize]=100&populate[0]=user&populate[1]=course`
      );
      if (res.ok) {
        const json = await res.json();
        const counts: Record<string, number> = {};
        for (const enrollment of json.data || []) {
          const userId = enrollment.user?.id;
          if (userId) {
            counts[userId] = (counts[userId] || 0) + 1;
          }
        }
        setEnrollmentCounts(counts);
      }
    } catch (err) {
      console.error('Failed to fetch enrollments:', err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchEnrollments();
  }, [fetchUsers, fetchEnrollments]);

  const roles = [
    { value: 'all', label: 'All Users' },
    { value: 'admin', label: 'Admins' },
    { value: 'teacher', label: 'Teachers' },
    { value: 'student', label: 'Students' },
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'teacher': return 'warning';
      case 'student': return 'success';
      default: return 'default';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchQuery ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const studentCount = users.filter((u) => u.role === 'student').length;
  const teacherCount = users.filter((u) => u.role === 'teacher').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Users</h1>
          <p className="mt-2 text-charcoal-600">
            Manage all registered users and their roles
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Message Users
          </Button>
          <Button>
            <User className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-600">Total Users</p>
              <p className="mt-2 text-3xl font-bold text-charcoal-900">{users.length}</p>
            </div>
            <div className="rounded-lg bg-primary-100 p-3">
              <User className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-600">Students</p>
              <p className="mt-2 text-3xl font-bold text-charcoal-900">{studentCount}</p>
            </div>
            <div className="rounded-lg bg-green-100 p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-600">Teachers</p>
              <p className="mt-2 text-3xl font-bold text-charcoal-900">{teacherCount}</p>
            </div>
            <div className="rounded-lg bg-blue-100 p-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal-600">Admins</p>
              <p className="mt-2 text-3xl font-bold text-charcoal-900">{adminCount}</p>
            </div>
            <div className="rounded-lg bg-amber-100 p-3">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-charcoal-300 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="rounded-lg border border-charcoal-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary-500 mr-2" />
            <span className="text-charcoal-500">Loading users...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Enrollments</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="font-medium text-charcoal-900">
                          {user.name}
                        </p>
                        <p className="text-sm text-charcoal-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadge(user.role) as any}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-charcoal-900">
                      {enrollmentCounts[user.id] || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-charcoal-600">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(user.createdAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/students/${user.id}`}>
                        <button
                          className="rounded-lg p-2 text-charcoal-600 hover:bg-charcoal-50"
                          aria-label="View user"
                          title="View user details"
                        >
                          <User className="h-4 w-4" />
                        </button>
                      </Link>
                      <button
                        className="rounded-lg p-2 text-charcoal-600 hover:bg-charcoal-50"
                        aria-label="More actions"
                        title="More actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {!isLoading && filteredUsers.length === 0 && (
          <div className="py-12 text-center">
            <User className="mx-auto h-12 w-12 text-charcoal-400" />
            <p className="mt-4 text-charcoal-500">No users found</p>
          </div>
        )}
      </Card>
    </div>
  );
}
