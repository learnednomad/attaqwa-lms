'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle, User, Hash } from 'lucide-react';
// Removed server-side import, using API routes instead

// Metadata would normally be exported, but since this is a client component, we'll handle it differently
// export const metadata: Metadata = {
//   title: 'Hadith Collections | Authentic Narrations',
//   description: 'Authentic Hadith collections from Sahih Bukhari, Muslim, and other verified sources',
// };

interface Hadith {
  collection: string;
  bookNumber: string;
  hadithNumber: string;
  hadith: {
    arab: string;
    english: string;
    narrator: string;
  };
  grade: string;
  reference: string;
}

const hadithCollections = [
  { id: 'bukhari', name: 'Sahih al-Bukhari', arabic: 'صحيح البخاري', books: 97 },
  { id: 'muslim', name: 'Sahih Muslim', arabic: 'صحيح مسلم', books: 56 },
  { id: 'abudawud', name: 'Sunan Abu Dawud', arabic: 'سنن أبي داود', books: 43 },
  { id: 'tirmidhi', name: 'Jami at-Tirmidhi', arabic: 'جامع الترمذي', books: 49 },
  { id: 'nasai', name: "Sunan an-Nasa'i", arabic: 'سنن النسائي', books: 51 },
  { id: 'ibnmajah', name: 'Sunan Ibn Majah', arabic: 'سنن ابن ماجه', books: 37 },
];

export default function HadithCollectionsPage() {
  const [selectedCollection, setSelectedCollection] = useState('bukhari');
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(1);
  const [dailyHadith, setDailyHadith] = useState<Hadith | null>(null);

  useEffect(() => {
    loadHadiths();
    loadDailyHadith();
  }, [selectedCollection, selectedBook]);

  const loadHadiths = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/islamic/hadith?collection=${selectedCollection}&book=${selectedBook}`);
      const result = await response.json();
      if (result.success) {
        setHadiths(result.data);
      }
    } catch (error) {
      console.error('Error loading hadiths:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDailyHadith = async () => {
    // Get a hadith based on the day of the year
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const collections = ['bukhari', 'muslim'];
    const collection = collections[dayOfYear % 2];
    const bookNum = (dayOfYear % 10) + 1;
    
    try {
      const response = await fetch(`/api/islamic/hadith?collection=${collection}&book=${bookNum}`);
      const result = await response.json();
      if (result.success && result.data.length > 0) {
        setDailyHadith(result.data[dayOfYear % result.data.length]);
      }
    } catch (error) {
      console.error('Error loading daily hadith:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-green-50 via-white to-islamic-gold-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-islamic-navy-800 mb-4">
            📚 Hadith Collections
          </h1>
          <p className="text-xl text-islamic-navy-600 max-w-3xl mx-auto">
            Authentic narrations from the Prophet Muhammad ﷺ - Verified Sahih Hadiths Only
          </p>
        </div>

        {/* Daily Hadith */}
        {dailyHadith && (
          <Card className="mb-12 bg-gradient-to-r from-islamic-green-500 to-islamic-green-600 text-white border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                ✨ Hadith of the Day
              </CardTitle>
              <CardDescription className="text-white/90">
                From {dailyHadith.collection === 'bukhari' ? 'Sahih al-Bukhari' : 'Sahih Muslim'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Arabic Text */}
                <div className="text-right">
                  <p className="text-2xl leading-loose font-arabic text-white" dir="rtl">
                    {dailyHadith.hadith.arab}
                  </p>
                </div>
                
                {/* English Translation */}
                <div className="border-t border-white/20 pt-4">
                  <p className="text-lg text-white/95 leading-relaxed">
                    {dailyHadith.hadith.english}
                  </p>
                </div>
                
                {/* Narrator and Reference */}
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-white/80" />
                    <span className="text-white/90">Narrated by {dailyHadith.hadith.narrator}</span>
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {dailyHadith.grade}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Collections Tabs */}
        <Tabs value={selectedCollection} onValueChange={setSelectedCollection} className="mb-12">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 h-auto p-2 bg-islamic-green-50">
            {hadithCollections.map((collection) => (
              <TabsTrigger
                key={collection.id}
                value={collection.id}
                className="data-[state=active]:bg-islamic-green-600 data-[state=active]:text-white"
              >
                <div className="text-center py-2">
                  <p className="font-semibold text-sm">{collection.name}</p>
                  <p className="text-xs opacity-80">{collection.arabic}</p>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {hadithCollections.map((collection) => (
            <TabsContent key={collection.id} value={collection.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{collection.name} - {collection.arabic}</span>
                    <Badge className="bg-islamic-green-100 text-islamic-green-700">
                      {collection.books} Books
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Showing authentic (Sahih) narrations only
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Book Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-islamic-navy-700 mb-2">
                      Select Book Number
                    </label>
                    <select
                      value={selectedBook}
                      onChange={(e) => setSelectedBook(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-islamic-green-300 rounded-lg focus:ring-2 focus:ring-islamic-green-500 focus:border-islamic-green-500"
                    >
                      {Array.from({ length: Math.min(collection.books, 20) }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Book {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Hadiths List */}
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-islamic-green-600 mx-auto"></div>
                      <p className="mt-4 text-islamic-navy-600">Loading authentic hadiths...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {hadiths.map((hadith, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-islamic-green-500 pl-4 space-y-3"
                        >
                          {/* Hadith Number and Grade */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Hash className="w-4 h-4 text-islamic-green-600" />
                              <span className="font-semibold text-islamic-navy-700">
                                Hadith {hadith.hadithNumber}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <Badge className="bg-green-100 text-green-700">
                                {hadith.grade}
                              </Badge>
                            </div>
                          </div>

                          {/* Arabic Text */}
                          <div className="bg-islamic-green-50 p-4 rounded-lg text-right">
                            <p className="text-lg leading-loose font-arabic" dir="rtl">
                              {hadith.hadith.arab}
                            </p>
                          </div>

                          {/* English Translation */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-islamic-navy-700 leading-relaxed">
                              {hadith.hadith.english}
                            </p>
                          </div>

                          {/* Narrator */}
                          <div className="flex items-center gap-2 text-sm text-islamic-navy-600">
                            <User className="w-4 h-4" />
                            <span>Narrated by: <strong>{hadith.hadith.narrator}</strong></span>
                          </div>

                          {/* Reference */}
                          <div className="flex items-center gap-2 text-sm text-islamic-navy-500">
                            <BookOpen className="w-4 h-4" />
                            <span>Reference: {hadith.reference}</span>
                          </div>
                        </div>
                      ))}

                      {hadiths.length === 0 && (
                        <div className="text-center py-8 text-islamic-navy-600">
                          <p>No hadiths available for this selection.</p>
                          <p className="text-sm mt-2">Try selecting a different book or collection.</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Information Card */}
        <Card className="bg-islamic-gold-50 border-islamic-gold-200">
          <CardHeader>
            <CardTitle className="text-xl">About Our Hadith Collection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-islamic-navy-600">
              All hadiths displayed here are verified as <strong>Sahih (Authentic)</strong> from trusted sources.
              We use the Sunnah.com API to ensure authenticity and accuracy.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold">Verified Sources</h3>
                  <p className="text-sm text-islamic-navy-600">
                    Only authentic collections from the six major hadith books
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold">Graded Authenticity</h3>
                  <p className="text-sm text-islamic-navy-600">
                    Each hadith is graded by qualified scholars
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}