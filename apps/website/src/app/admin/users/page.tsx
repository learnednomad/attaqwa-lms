'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Users, Search, Plus, Edit, Trash2, Shield,
  UserCheck, UserX, MoreVertical
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const mockUsers = [
  { id: '1', name: 'Sheikh Abdullah', email: 'abdullah@attaqwa.edu', role: 'admin', status: 'active', joined: '2024-06-15', lastLogin: '2025-01-27' },
  { id: '2', name: 'Ustadha Fatima', email: 'fatima@attaqwa.edu', role: 'teacher', status: 'active', joined: '2024-07-20', lastLogin: '2025-01-26' },
  { id: '3', name: 'Sheikh Omar', email: 'omar@attaqwa.edu', role: 'teacher', status: 'active', joined: '2024-08-10', lastLogin: '2025-01-25' },
  { id: '4', name: 'Aisha Mohamed', email: 'aisha@student.attaqwa.edu', role: 'student', status: 'active', joined: '2024-09-01', lastLogin: '2025-01-27' },
  { id: '5', name: 'Ahmad Hassan', email: 'ahmad@student.attaqwa.edu', role: 'student', status: 'active', joined: '2024-09-01', lastLogin: '2025-01-24' },
  { id: '6', name: 'Ibrahim Ahmed', email: 'ibrahim@student.attaqwa.edu', role: 'student', status: 'active', joined: '2024-09-15', lastLogin: '2025-01-23' },
  { id: '7', name: 'Sara Hassan', email: 'sara@student.attaqwa.edu', role: 'student', status: 'inactive', joined: '2024-09-01', lastLogin: '2025-01-10' },
  { id: '8', name: 'Moderator Ali', email: 'ali@attaqwa.edu', role: 'moderator', status: 'active', joined: '2024-08-01', lastLogin: '2025-01-26' },
];

const roleColors: Record<string, string> = {
  admin: 'bg-red-100 text-red-700',
  moderator: 'bg-purple-100 text-purple-700',
  teacher: 'bg-blue-100 text-blue-700',
  student: 'bg-emerald-100 text-emerald-700',
};

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const activeCount = mockUsers.filter(u => u.status === 'active').length;
  const inactiveCount = mockUsers.filter(u => u.status === 'inactive').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <Button className="bg-islamic-green-600 hover:bg-islamic-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{mockUsers.length}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Users</p>
                <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <UserCheck className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Inactive Users</p>
                <p className="text-2xl font-bold text-red-600">{inactiveCount}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <UserX className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Admins</p>
                <p className="text-2xl font-bold text-purple-600">
                  {mockUsers.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="moderator">Moderator</SelectItem>
            <SelectItem value="teacher">Teacher</SelectItem>
            <SelectItem value="student">Student</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>{filteredUsers.length} Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Name</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Email</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Role</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Status</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Joined</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Last Login</th>
                  <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge className={roleColors[user.role]}>{user.role}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{user.joined}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{user.lastLogin}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
