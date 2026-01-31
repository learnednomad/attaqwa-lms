'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Upload, Image, FileText, Video } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

export default function AdminNewContentPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/education">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Content</h1>
            <p className="text-gray-600 mt-1">Add a new lesson, video, or educational material</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Save Draft</Button>
          <Button className="bg-islamic-green-600 hover:bg-islamic-green-700">
            <Save className="h-4 w-4 mr-2" /> Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Details</CardTitle>
              <CardDescription>Basic information about the educational content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g., Introduction to Salah" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Describe the content and learning objectives..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Subject</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quran">Quran</SelectItem>
                      <SelectItem value="hadith">Hadith</SelectItem>
                      <SelectItem value="fiqh">Fiqh</SelectItem>
                      <SelectItem value="seerah">Seerah</SelectItem>
                      <SelectItem value="arabic">Arabic</SelectItem>
                      <SelectItem value="aqidah">Aqidah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Content Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lesson">Lesson</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Age Tier</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="children">Children (5-10)</SelectItem>
                      <SelectItem value="youth">Youth (11-17)</SelectItem>
                      <SelectItem value="adults">Adults (18+)</SelectItem>
                      <SelectItem value="all">All Ages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Difficulty Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Body */}
          <Card>
            <CardHeader>
              <CardTitle>Content Body</CardTitle>
              <CardDescription>Write or paste the lesson content</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full min-h-[300px] px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Write your lesson content here...&#10;&#10;You can include:&#10;- Quranic verses (with references)&#10;- Hadith narrations&#10;- Scholarly explanations&#10;- Key takeaways and action items"
              />
            </CardContent>
          </Card>

          {/* Media Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Media & Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                <p className="text-xs text-gray-400 mb-4">Supports: PDF, MP4, MP3, JPG, PNG (max 50MB)</p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" size="sm">
                    <Image className="h-4 w-4 mr-2" /> Image
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4 mr-2" /> Video
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" /> Document
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Status</span>
                <Badge className="bg-yellow-100 text-yellow-700">Draft</Badge>
              </div>
              <Button className="w-full bg-islamic-green-600 hover:bg-islamic-green-700">
                Publish Content
              </Button>
              <Button variant="outline" className="w-full">
                Schedule Publication
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Islamic Calendar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Related Islamic Event</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Optional" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="ramadan">Ramadan</SelectItem>
                    <SelectItem value="hajj">Hajj Season</SelectItem>
                    <SelectItem value="mawlid">Mawlid</SelectItem>
                    <SelectItem value="isra">Isra & Mi'raj</SelectItem>
                    <SelectItem value="eid-fitr">Eid al-Fitr</SelectItem>
                    <SelectItem value="eid-adha">Eid al-Adha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-gray-500">
                Content tagged with Islamic events will be featured during the relevant time period.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SEO & Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>URL Slug</Label>
                <Input placeholder="introduction-to-salah" />
              </div>
              <div>
                <Label>Meta Description</Label>
                <textarea
                  className="w-full min-h-[60px] px-3 py-2 rounded-md border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Brief description for search engines..."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
