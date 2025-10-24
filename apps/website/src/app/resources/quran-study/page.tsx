'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Play, Pause, Volume2, ChevronRight, Layers } from 'lucide-react';
// Removed server-side imports, using API routes instead

interface AyahData {
  number: number;
  text: string;
  translation: string;
  tafsir: string;
  surah: {
    number: number;
    name: string;
    englishName: string;
    revelationType: string;
  };
  juz: number;
  page: number;
  audio?: string;
}

interface ContextGroup {
  title: string;
  ayahs: [number, number];
  theme: string;
  verses?: any[];
}

// Popular Surahs for study
const popularSurahs = [
  { number: 1, name: 'Al-Fatihah', verses: 7, theme: 'The Opening' },
  { number: 2, name: 'Al-Baqarah', verses: 286, theme: 'The Cow' },
  { number: 18, name: 'Al-Kahf', verses: 110, theme: 'The Cave' },
  { number: 36, name: 'Ya-Sin', verses: 83, theme: 'The Heart of Quran' },
  { number: 55, name: 'Ar-Rahman', verses: 78, theme: 'The Merciful' },
  { number: 56, name: 'Al-Waqiah', verses: 96, theme: 'The Event' },
  { number: 67, name: 'Al-Mulk', verses: 30, theme: 'The Kingdom' },
  { number: 112, name: 'Al-Ikhlas', verses: 4, theme: 'The Sincerity' },
];

// Al-Baqarah contextual grouping
const baqarahGroups: ContextGroup[] = [
  {
    title: "Opening - Three Types of People",
    ayahs: [1, 20],
    theme: "Believers, disbelievers, and hypocrites - their characteristics and fate"
  },
  {
    title: "Creation Story & Divine Guidance",
    ayahs: [21, 39],
    theme: "Adam's creation, the test in Paradise, and descent to Earth"
  },
  {
    title: "Children of Israel - Part 1",
    ayahs: [40, 86],
    theme: "Covenant with Bani Israel, Moses and the cow, breaking of promises"
  },
  {
    title: "Children of Israel - Part 2",
    ayahs: [87, 121],
    theme: "Rejection of prophets, distortion of scripture, jealousy towards Muslims"
  },
  {
    title: "Abraham's Legacy & The Kaaba",
    ayahs: [122, 141],
    theme: "Abraham's trials, building of Kaaba, prayer for the final messenger"
  },
  {
    title: "Change of Qiblah",
    ayahs: [142, 152],
    theme: "From Jerusalem to Makkah - test of faith and unity of Ummah"
  },
  {
    title: "Patience, Life & Death",
    ayahs: [153, 177],
    theme: "Tests through fear and loss, laws of retribution (Qisas), wills and inheritance"
  },
  {
    title: "Fasting & Ramadan",
    ayahs: [183, 187],
    theme: "Obligation of fasting, rules, exceptions, and spiritual benefits"
  },
  {
    title: "Hajj & Umrah",
    ayahs: [196, 203],
    theme: "Pilgrimage rites, sacred months, and remembrance of Allah"
  },
  {
    title: "Striving in Allah's Path",
    ayahs: [190, 195],
    theme: "Rules of defensive warfare and spending in Allah's cause"
  },
  {
    title: "Social Laws - Part 1",
    ayahs: [204, 242],
    theme: "Fighting injustice, charity, prohibition of interest (riba), contracts"
  },
  {
    title: "Social Laws - Part 2",
    ayahs: [243, 252],
    theme: "Story of Talut (Saul) and Jalut (Goliath), David's kingdom"
  },
  {
    title: "Ayatul Kursi & Core Beliefs",
    ayahs: [253, 260],
    theme: "Allah's throne verse, no compulsion in religion, Abraham and resurrection"
  },
  {
    title: "Charity & Economic Justice",
    ayahs: [261, 274],
    theme: "Rewards of charity, sincerity in giving, prohibition of usury"
  },
  {
    title: "Financial Transactions",
    ayahs: [275, 283],
    theme: "Laws of trade, debts, witnesses, longest verse on documentation"
  },
  {
    title: "Conclusion - Declaration of Faith",
    ayahs: [284, 286],
    theme: "Accountability, the Prophet and believers' prayer, no burden beyond capacity"
  }
];

export default function QuranStudyPage() {
  const [ayahOfTheDay, setAyahOfTheDay] = useState<AyahData | null>(null);
  const [selectedSurah, setSelectedSurah] = useState(2); // Al-Baqarah by default
  const [selectedGroup, setSelectedGroup] = useState<ContextGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadAyahOfTheDay();
  }, []);

  const loadAyahOfTheDay = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/islamic/ayah?type=daily');
      const result = await response.json();
      if (result.success) {
        setAyahOfTheDay(result.data);
      }
    } catch (error) {
      console.error('Error loading ayah:', error);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    if (ayahOfTheDay?.audio) {
      const audio = new Audio(ayahOfTheDay.audio);
      audio.play();
      setAudioElement(audio);
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
    }
  };

  const stopAudio = () => {
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-green-50 via-white to-islamic-gold-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-islamic-navy-800 mb-4">
            📖 Quran Study & Tafsir
          </h1>
          <p className="text-xl text-islamic-navy-600 max-w-3xl mx-auto">
            Daily Ayah with complete Tafsir and contextual study of the Holy Quran
          </p>
        </div>

        {/* Ayah of the Day */}
        {loading ? (
          <Card className="mb-12">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-islamic-green-600 mx-auto"></div>
                <p className="mt-4 text-islamic-navy-600">Loading Ayah of the Day...</p>
              </div>
            </CardContent>
          </Card>
        ) : ayahOfTheDay && (
          <Card className="mb-12 bg-gradient-to-r from-islamic-gold-500 to-islamic-gold-600 text-white border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center justify-between">
                <span>✨ Ayah of the Day</span>
                <Badge className="bg-white/20 text-white border-white/30">
                  {ayahOfTheDay.surah.englishName} : {ayahOfTheDay.number}
                </Badge>
              </CardTitle>
              <CardDescription className="text-black/90">
                Surah {ayahOfTheDay.surah.name} • Juz {ayahOfTheDay.juz} • {ayahOfTheDay.surah.revelationType}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Arabic Text */}
                <div className="text-right bg-white/10 p-6 rounded-lg">
                  <p className="text-3xl leading-loose font-arabic text-black" dir="rtl">
                    {ayahOfTheDay.text}
                  </p>
                </div>

                {/* Audio Controls */}
                <div className="flex justify-center">
                  <button
                    onClick={isPlaying ? stopAudio : playAudio}
                    className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    <Volume2 className="w-5 h-5" />
                    <span>{isPlaying ? 'Stop Audio' : 'Play Audio'}</span>
                  </button>
                </div>

                {/* Translation */}
                <div className="border-t border-white/20 pt-6">
                  <h3 className="text-lg font-semibold mb-3 text-white">Translation</h3>
                  <p className="text-lg text-white/95 leading-relaxed">
                    {ayahOfTheDay.translation}
                  </p>
                </div>

                {/* Tafsir */}
                <div className="border-t border-white/20 pt-6">
                  <h3 className="text-lg font-semibold mb-3 text-white">Tafsir (Explanation)</h3>
                  <p className="text-white/90 leading-relaxed">
                    {ayahOfTheDay.tafsir}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Surah Study with Contextual Grouping */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">📚 Surah Study - Contextual Groups</CardTitle>
            <CardDescription>
              Study Surahs with verses grouped by themes and context
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="baqarah">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 h-auto p-2 bg-islamic-green-50 mb-6">
                {popularSurahs.slice(0, 4).map((surah) => (
                  <TabsTrigger
                    key={surah.number}
                    value={surah.number === 2 ? 'baqarah' : surah.name.toLowerCase()}
                    className="data-[state=active]:bg-islamic-green-600 data-[state=active]:text-white"
                  >
                    <div className="py-2">
                      <p className="font-semibold">{surah.name}</p>
                      <p className="text-xs opacity-80">{surah.verses} verses</p>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="baqarah">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-islamic-navy-800 mb-4">
                    Surah Al-Baqarah - Thematic Division
                  </h3>
                  <p className="text-islamic-navy-600 mb-6">
                    The longest chapter of the Quran, containing comprehensive guidance for mankind.
                    Study it through these contextual groups:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {baqarahGroups.map((group, index) => (
                      <div
                        key={index}
                        className="border border-islamic-green-200 rounded-lg p-4 hover:bg-islamic-green-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedGroup(group)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-islamic-navy-800">
                            {group.title}
                          </h4>
                          <Badge className="bg-islamic-green-100 text-islamic-green-700">
                            Ayah {group.ayahs[0]}-{group.ayahs[1]}
                          </Badge>
                        </div>
                        <p className="text-sm text-islamic-navy-600 mb-3">
                          {group.theme}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-islamic-green-600">
                            <Layers className="w-4 h-4" />
                            <span>{group.ayahs[1] - group.ayahs[0] + 1} verses</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-islamic-green-600" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedGroup && (
                    <Card className="mt-6 bg-islamic-gold-50 border-islamic-gold-200">
                      <CardHeader>
                        <CardTitle>{selectedGroup.title}</CardTitle>
                        <CardDescription>
                          Verses {selectedGroup.ayahs[0]} to {selectedGroup.ayahs[1]}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-islamic-navy-700 mb-4">
                          <strong>Theme:</strong> {selectedGroup.theme}
                        </p>
                        <p className="text-islamic-navy-600 text-sm">
                          This section contains {selectedGroup.ayahs[1] - selectedGroup.ayahs[0] + 1} verses
                          that form a complete thematic unit. Study these verses together to understand
                          the full context and message.
                        </p>
                        <button className="mt-4 px-4 py-2 bg-islamic-green-600 text-white rounded-lg hover:bg-islamic-green-700 transition-colors">
                          Read Full Section
                        </button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Other Surahs tabs can be added similarly */}
              <TabsContent value="al-fatihah">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-islamic-navy-800">
                    Surah Al-Fatihah - The Opening
                  </h3>
                  <p className="text-islamic-navy-600">
                    The opening chapter and the essence of the entire Quran in 7 verses.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Study Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Daily Recitation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-islamic-navy-600">
                Establish a daily Quran reading routine with our structured plan
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Layers className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Thematic Study</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-islamic-navy-600">
                Study verses grouped by themes and understand their context
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Volume2 className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Audio Recitation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-islamic-navy-600">
                Listen to beautiful recitations from renowned Qaris
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}