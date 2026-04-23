/**
 * Users Management Page
 * View and manage all registered users — real data from BetterAuth + Strapi
 */

'use client';

import { Calendar, Loader2, Mail, MoreVertical, Search, Upload, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { AddUserDialog } from '@/components/users/add-user-dialog';
import { ImportUsersDialog } from '@/components/users/import-users-dialog';
import { Badge, type BadgeProps } from '@/components/ui/badge';
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
import { strapiClient, adminApiEndpoints } from '@/lib/api/strapi-client';
import { cn } from '@/lib/utils/cn';

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  image?: string | null;
}

type RoleFilter = 'all' | 'admin' | 'teacher' | 'student';

const ROLE_BADGE: Record<string, BadgeProps['variant']> = {
  admin: 'accent',
  teacher: 'warning',
  student: 'success',
};

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleFilter>('all');
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [enrollmentCounts, setEnrollmentCounts] = useState<Record<string, number>>({});
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authClient.admin.listUsers({
        query: { limit: 100, offset: 0 },
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
      const json = await strapiClient.get(
        adminApiEndpoints.courseEnrollments + '?pagination[pageSize]=100&populate[0]=user&populate[1]=course'
      );
      const counts: Record<string, number> = {};
      for (const enrollment of (json as any).data || []) {
        const userId = enrollment.user?.id;
        if (userId) {
          counts[userId] = (counts[userId] || 0) + 1;
        }
      }
      setEnrollmentCounts(counts);
    } catch (err) {
      console.error('Failed to fetch enrollments:', err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchEnrollments();
  }, [fetchUsers, fetchEnrollments]);

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

  const hasAnyEnrollments = Object.values(enrollmentCounts).some((n) => n > 0);

  const roleChips: Array<{ value: RoleFilter; label: string; count: number }> = [
    { value: 'all', label: 'All', count: users.length },
    { value: 'student', label: 'Students', count: studentCount },
    { value: 'teacher', label: 'Teachers', count: teacherCount },
    { value: 'admin', label: 'Admins', count: adminCount },
  ];

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900">Users</h1>
          <p className="mt-1.5 text-sm text-charcoal-600">
            Manage all registered users and their roles
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Message
          </Button>
          <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filter + Search Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Role filter chips (replace stat cards + role dropdown) */}
        <div
          className="flex flex-wrap items-center gap-1.5 rounded-lg border border-charcoal-200 bg-white p-1"
          role="tablist"
          aria-label="Filter by role"
        >
          {roleChips.map((chip) => {
            const isActive = selectedRole === chip.value;
            return (
              <button
                key={chip.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedRole(chip.value)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-charcoal-600 hover:bg-charcoal-50 hover:text-charcoal-900'
                )}
              >
                <span>{chip.label}</span>
                <span
                  className={cn(
                    'inline-flex min-w-[1.5rem] justify-center rounded-full px-1.5 text-xs font-semibold tabular-nums',
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-charcoal-100 text-charcoal-600'
                  )}
                >
                  {chip.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Local search */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
          <input
            type="search"
            placeholder="Search by name or email…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-charcoal-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary-500" />
            <span className="text-sm text-charcoal-500">Loading users…</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-charcoal-100">
              <UserPlus className="h-6 w-6 text-charcoal-400" />
            </div>
            <p className="mt-4 text-sm font-medium text-charcoal-900">No users found</p>
            <p className="mt-1 text-xs text-charcoal-500">
              {searchQuery || selectedRole !== 'all'
                ? 'Try adjusting your filters.'
                : 'Get started by adding your first user.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  {hasAnyEnrollments && <TableHead>Enrollments</TableHead>}
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-12 text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const enrollments = enrollmentCounts[user.id] || 0;
                  return (
                    <TableRow
                      key={user.id}
                      className="group cursor-pointer transition-colors hover:bg-charcoal-50/60"
                    >
                      <TableCell>
                        <Link
                          href={`/students/${user.id}`}
                          className="flex items-center space-x-3"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                            {getInitials(user.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-charcoal-900 group-hover:text-primary-700">
                              {user.name}
                            </p>
                            <p className="truncate text-sm text-charcoal-500">
                              {user.email}
                            </p>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant={ROLE_BADGE[user.role] ?? 'default'}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </TableCell>
                      {hasAnyEnrollments && (
                        <TableCell>
                          <span
                            className={cn(
                              'tabular-nums',
                              enrollments > 0
                                ? 'font-medium text-charcoal-900'
                                : 'text-charcoal-400'
                            )}
                          >
                            {enrollments}
                          </span>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-charcoal-600">
                          <Calendar className="h-3.5 w-3.5 text-charcoal-400" />
                          <span>{formatDate(user.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-lg p-2 text-charcoal-400 opacity-0 hover:bg-charcoal-100 hover:text-charcoal-700 focus:opacity-100 group-hover:opacity-100"
                          aria-label={`Actions for ${user.name}`}
                          title="More actions"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <AddUserDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={() => {
          fetchUsers();
          fetchEnrollments();
        }}
        defaultRole={
          selectedRole === 'teacher' || selectedRole === 'admin'
            ? selectedRole
            : 'student'
        }
      />

      <ImportUsersDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImported={() => {
          fetchUsers();
          fetchEnrollments();
        }}
      />
    </div>
  );
}
