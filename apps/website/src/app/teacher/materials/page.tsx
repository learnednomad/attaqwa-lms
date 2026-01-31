'use client';

import React from 'react';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen, FileText, Video, Download,
  Upload, Search, FolderOpen, File
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const materials = [
  { title: 'Fiqh of Salah - Lecture Notes', type: 'document', course: 'Fiqh of Worship', format: 'PDF', size: '2.4 MB', updated: '2025-01-20', downloads: 45 },
  { title: 'Hadith Authentication Methods', type: 'document', course: 'Hadith Studies', format: 'PDF', size: '1.8 MB', updated: '2025-01-18', downloads: 32 },
  { title: 'Arabic Verb Conjugation Chart', type: 'document', course: 'Arabic Grammar Level 2', format: 'PDF', size: '560 KB', updated: '2025-01-22', downloads: 58 },
  { title: 'Prayer Positions Visual Guide', type: 'image', course: 'Fiqh of Worship', format: 'PNG', size: '3.1 MB', updated: '2025-01-15', downloads: 67 },
  { title: 'Introduction to Hadith Sciences', type: 'video', course: 'Hadith Studies', format: 'MP4', size: '245 MB', updated: '2025-01-10', downloads: 28 },
  { title: 'Arabic Alphabet Practice Worksheet', type: 'document', course: 'Arabic Grammar Level 2', format: 'PDF', size: '890 KB', updated: '2025-01-25', downloads: 41 },
  { title: 'Wudu Step-by-Step Guide', type: 'document', course: 'Fiqh of Worship', format: 'PDF', size: '1.2 MB', updated: '2025-01-23', downloads: 53 },
  { title: 'Seerah Timeline - Meccan Period', type: 'document', course: 'Hadith Studies', format: 'PDF', size: '4.5 MB', updated: '2025-01-12', downloads: 19 },
];

const typeIcons: Record<string, React.ElementType> = {
  document: FileText,
  video: Video,
  image: File,
};

const typeColors: Record<string, string> = {
  document: 'bg-blue-100 text-blue-700',
  video: 'bg-purple-100 text-purple-700',
  image: 'bg-emerald-100 text-emerald-700',
};

export default function TeacherMaterialsPage() {
  return (
    <TeacherLayout title="Teaching Materials" subtitle="Manage and organize your course materials">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search materials..." className="pl-9 w-64" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="fiqh">Fiqh of Worship</SelectItem>
              <SelectItem value="hadith">Hadith Studies</SelectItem>
              <SelectItem value="arabic">Arabic Grammar</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-types">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-types">All Types</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="image">Images</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Upload className="h-4 w-4 mr-2" /> Upload Material
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Materials</p>
                <p className="text-2xl font-bold text-gray-900">{materials.length}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <FolderOpen className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Documents</p>
                <p className="text-2xl font-bold text-blue-600">{materials.filter(m => m.type === 'document').length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Videos</p>
                <p className="text-2xl font-bold text-purple-600">{materials.filter(m => m.type === 'video').length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Video className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900">{materials.reduce((s, m) => s + m.downloads, 0)}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Download className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Materials Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            Course Materials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.map((material, index) => {
              const Icon = typeIcons[material.type];
              return (
                <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${typeColors[material.type]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm truncate">{material.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{material.course}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span>{material.format}</span>
                        <span>{material.size}</span>
                        <span>{material.downloads} downloads</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">Updated {material.updated}</span>
                    <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </TeacherLayout>
  );
}
