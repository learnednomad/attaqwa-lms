'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  Shield,
  GraduationCap,
  UserCheck,
  AlertCircle,
  RefreshCcw,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  banned: boolean;
  createdAt: string;
  updatedAt: string;
};

type Filter = 'all' | 'admin' | 'teacher' | 'student' | 'user';

const ROLE_META: Record<string, { label: string; icon: typeof Shield; tone: string }> = {
  admin: { label: 'Admin', icon: Shield, tone: 'bg-red-100 text-red-700' },
  superadmin: { label: 'Super Admin', icon: Shield, tone: 'bg-red-100 text-red-700' },
  masjidadmin: { label: 'Masjid Admin', icon: Shield, tone: 'bg-red-100 text-red-700' },
  teacher: { label: 'Teacher', icon: GraduationCap, tone: 'bg-amber-100 text-amber-700' },
  student: { label: 'Student', icon: UserCheck, tone: 'bg-blue-100 text-blue-700' },
  user: { label: 'User', icon: Users, tone: 'bg-gray-100 text-gray-700' },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/users', { credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as { data: AdminUser[] };
      setUsers(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  const counts = {
    all: users?.length ?? 0,
    admin:
      users?.filter((u) =>
        ['admin', 'superadmin', 'masjidadmin'].includes(u.role.toLowerCase())
      ).length ?? 0,
    teacher: users?.filter((u) => u.role.toLowerCase() === 'teacher').length ?? 0,
    student: users?.filter((u) => u.role.toLowerCase() === 'student').length ?? 0,
    user: users?.filter((u) => u.role.toLowerCase() === 'user').length ?? 0,
  };

  const filtered = (users ?? []).filter((u) => {
    if (filter === 'all') return true;
    if (filter === 'admin') {
      return ['admin', 'superadmin', 'masjidadmin'].includes(u.role.toLowerCase());
    }
    return u.role.toLowerCase() === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-2 text-sm">
            BetterAuth user accounts. Read-only listing — manage individual
            accounts via the BetterAuth admin plugin or directly in the database.
          </p>
        </div>
        <Button
          onClick={fetchUsers}
          disabled={loading}
          variant="outline"
          className="gap-2"
        >
          <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50/40">
          <CardContent className="py-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700">
                Could not load users
              </p>
              <p className="text-xs text-red-600 mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {(
          [
            ['all', 'All'],
            ['admin', 'Admins'],
            ['teacher', 'Teachers'],
            ['student', 'Students'],
            ['user', 'Other'],
          ] as Array<[Filter, string]>
        ).map(([key, label]) => (
          <Card
            key={key}
            onClick={() => setFilter(key)}
            className={`cursor-pointer transition-all ${
              filter === key ? 'ring-2 ring-islamic-green-500' : ''
            }`}
          >
            <CardContent className="py-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {counts[key]}
              </div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>Users ({filtered.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading && !users ? (
            <div className="p-12 text-center text-gray-500 text-sm">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">
              No users match the current filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Name
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Email
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Role
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => {
                    const meta =
                      ROLE_META[user.role.toLowerCase()] ?? ROLE_META.user;
                    const RoleIcon = meta.icon;
                    return (
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50/40"
                      >
                        <td className="px-4 py-3 text-gray-900">{user.name}</td>
                        <td className="px-4 py-3 text-gray-700 font-mono text-xs">
                          {user.email}
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`${meta.tone} gap-1 inline-flex`}>
                            <RoleIcon className="h-3 w-3" />
                            {meta.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          {user.banned ? (
                            <Badge className="bg-red-100 text-red-700 gap-1 inline-flex">
                              <XCircle className="h-3 w-3" />
                              Banned
                            </Badge>
                          ) : user.emailVerified ? (
                            <Badge className="bg-emerald-100 text-emerald-700 gap-1 inline-flex">
                              <CheckCircle2 className="h-3 w-3" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-700">
                              Unverified
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
