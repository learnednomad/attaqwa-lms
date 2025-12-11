"use client";

// Iteration 9: Advanced Interactivity & Animation Refinements - Premium interactions
import { generatePrayerTimesStructuredData, generateEventStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo';

// Dynamic imports for performance optimization - lazy load non-critical components
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Suspense, useState, useEffect } from 'react';

// Core UI components - keep as static imports for immediate rendering
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Essential icons for immediate rendering - no lazy loading for critical UI
import { Clock, Calendar, BookOpen, ArrowRight, Moon, Sparkles, Star, Activity, CheckCircle, Zap, Users, Download, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

// Types - static import for TypeScript
import type { Announcement, Event, Calendar as CalendarType, DailyPrayerTimes } from '@/types';

// Performance-optimized dynamic component loading with suspense fallbacks
const AnnouncementCard = dynamic(() => import('@/components/features/announcements/announcement-card').then(mod => ({ default: mod.AnnouncementCard })), {
  loading: () => <div className="animate-pulse h-32 bg-islamic-green/10 rounded-xl border border-islamic-green/20 flex items-center justify-center"><div className="text-islamic-green-600 text-sm">Loading announcement...</div></div>,
  ssr: true
});

const EventCard = dynamic(() => import('@/components/features/events/event-card').then(mod => ({ default: mod.EventCard })), {
  loading: () => <div className="animate-pulse h-28 bg-islamic-gold/10 rounded-xl border border-islamic-gold/20 flex items-center justify-center"><div className="text-islamic-gold-600 text-sm">Loading event...</div></div>,
  ssr: true
});

const CalendarDownload = dynamic(() => import('@/components/features/calendar/calendar-download').then(mod => ({ default: mod.CalendarDownload })), {
  loading: () => <div className="animate-pulse h-24 bg-islamic-navy/10 rounded-xl border border-islamic-navy/20 flex items-center justify-center"><div className="text-islamic-navy-600 text-sm">Loading calendar...</div></div>,
  ssr: true
});

// Prayer times widget - optimized for performance
const PrayerTimesWidget = dynamic(() => import('@/components/features/prayer-times/prayer-times-widget').then(mod => ({ default: mod.PrayerTimesWidget })), {
  loading: () => (
    <div className="animate-pulse h-96 bg-gradient-to-br from-islamic-green-50 to-islamic-gold-50 rounded-xl border border-islamic-green/20 flex items-center justify-center p-6">
      <div className="text-center space-y-2">
        <div className="text-islamic-green-600 font-medium">Loading Prayer Times...</div>
        <div className="text-xs text-islamic-navy-500">Please wait while we fetch today&apos;s prayer schedule</div>
      </div>
    </div>
  )
});

// Islamic Services Grid - mosque theme inspired - static import for immediate rendering
import { IslamicServicesGrid } from '@/components/features/islamic-services/islamic-services-grid';

// Mosque Prayer Times Section - mosque theme inspired
import { MosquePrayerTimesSection } from '@/components/features/prayer-times/mosque-prayer-times-section';


// Real data from Masjid At-Taqwa website
const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Eid ul-Fitr Sunday March 30, 2025',
    content: '<p>Insha\'Allah Eid will be on Sunday March 30, 2025. <strong>Zakat ul Fitr $10/person</strong> and should be paid prior to Eid ul Fitr Salah.</p><p>As always, 1st Salah, we will be praying outside in the parking lot. 2nd Salah will be inside the masjid.</p><ul><li><strong>1st Salah:</strong> 8:30am</li><li><strong>2nd Salah:</strong> 9:30am</li><li>We are humbly requesting everyone to come in a group instead of individual cars due to limited parking space</li><li>Please follow the direction of our volunteer brothers for parking</li></ul>',
    date: new Date('2025-03-30'),
    time: '8:30 AM & 9:30 AM',
    isActive: true,
    isArchived: false,
    createdAt: new Date('2025-03-15'),
    updatedAt: new Date('2025-03-20'),
  },
  {
    id: '2',
    title: 'Eid-Al-Adha Friday June 6th, 2025',
    content: '<p>Insha\'Allah Eid-Al-Adha will be on Friday June 6th, 2025.</p><p>As always, 1st Salah, we will be praying outside in the parking lot. 2nd Salah will be inside the masjid.</p><ul><li><strong>1st Salah:</strong> 8:00am</li><li><strong>2nd Salah:</strong> 9:00am</li><li>We are humbly requesting everyone to come in a group instead of individual cars due to limited parking space</li><li>Please follow the direction of our volunteer brothers for parking</li></ul>',
    date: new Date('2025-06-06'),
    time: '8:00 AM & 9:00 AM',
    isActive: true,
    isArchived: false,
    createdAt: new Date('2025-03-15'),
    updatedAt: new Date('2025-03-20'),
  },
  {
    id: '3',
    title: 'Ramadan Mubarak - Tarawee and Daily Programs',
    content: '<p><strong>RAMADAN MUBARAK!!!</strong> InshaAllah, we will have our 1st Tarawee tonight after Isha and it will be 20 rakhat.</p><ul><li>Daily brief tafseer and dua will start before maghrib</li><li>Daily Tahajjud will start at 4:45am</li><li>Community iftar will be served throughout the month of ramadan</li><li><strong>Tarawee Prayer:</strong> 20 rakhat after Isha prayer</li></ul>',
    date: new Date('2025-02-28'),
    time: 'After Isha & 4:45 AM',
    isActive: true,
    isArchived: false,
    createdAt: new Date('2025-02-20'),
    updatedAt: new Date('2025-02-25'),
  },
];

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Eid ul-Fitr 2025',
    description: 'Celebrate the end of Ramadan with our community. Multiple prayer times available with outdoor arrangements.',
    date: new Date('2025-03-30'),
    startTime: '8:30 AM',
    endTime: '11:00 AM',
    location: 'Masjid At-Taqwa',
    isIndoor: true,
    isOutdoor: true,
    prayerTimes: [
      { name: '1st Prayer', time: '8:30 AM', location: 'Parking Lot (Outdoor)' },
      { name: '2nd Prayer', time: '9:30 AM', location: 'Inside Masjid' },
    ],
    zakatInfo: {
      amount: 10,
      currency: 'USD',
      description: 'per person',
    },
    isActive: true,
    createdAt: new Date('2025-03-01'),
    updatedAt: new Date('2025-03-15'),
  },
  {
    id: '2',
    title: 'Eid-Al-Adha 2025',
    description: 'Join us for Eid-Al-Adha prayers and celebration. Multiple prayer times with outdoor and indoor arrangements.',
    date: new Date('2025-06-06'),
    startTime: '8:00 AM',
    endTime: '10:30 AM',
    location: 'Masjid At-Taqwa',
    isIndoor: true,
    isOutdoor: true,
    prayerTimes: [
      { name: '1st Prayer', time: '8:00 AM', location: 'Parking Lot (Outdoor)' },
      { name: '2nd Prayer', time: '9:00 AM', location: 'Inside Masjid' },
    ],
    isActive: true,
    createdAt: new Date('2025-03-01'),
    updatedAt: new Date('2025-03-15'),
  },
  {
    id: '3',
    title: 'Hifz Graduation 2025',
    description: 'Celebrating the achievement of students who have completed memorization of the Holy Quran.',
    date: new Date('2025-06-15'),
    startTime: '6:00 PM',
    endTime: '8:00 PM',
    location: 'Masjid At-Taqwa',
    isIndoor: true,
    isOutdoor: false,
    isActive: true,
    createdAt: new Date('2025-03-01'),
    updatedAt: new Date('2025-03-15'),
  },
];

const mockCalendars: CalendarType[] = [
  {
    id: '1',
    title: 'Ramadan Calendar 2025/1446',
    description: 'Complete Ramadan schedule with Suhur and Iftar times',
    fileUrl: '/calendars/ramadan-2025.pdf',
    fileName: 'ramadan-calendar-2025.pdf',
    fileSize: 2048576,
    year: 2025,
    isActive: true,
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-02-15'),
  },
];

const mockPrayerTimes: DailyPrayerTimes = {
  date: '2025-08-26',
  fajr: '5:41 AM',
  sunrise: '7:07 AM', 
  dhuhr: '1:40 PM',
  asr: '5:19 PM',
  maghrib: '8:15 PM',
  isha: '9:34 PM',
  qibla: 58.5,
  iqama: {
    fajr: '6:15 AM',
    dhuhr: '2:00 PM',
    asr: '6:30 PM',
    maghrib: '+5 min',
    isha: '10:00 PM',
  },
  jummah: ['2:00 PM', '2:30 PM'],
};

// Islamic Hero Slider Data - inspired by mosque theme
const heroSlides = [
  {
    id: 1,
    arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    englishText: 'In the name of Allah, the Most Gracious, the Most Merciful',
    subText: 'Welcome to Masjid At-Taqwa',
    backgroundGradient: 'from-islamic-green-600 via-islamic-green-700 to-islamic-green-800'
  },
  {
    id: 2,
    arabicText: 'أَهْلًا وَسَهْلًا بِكُمْ',
    englishText: 'Welcome to our Islamic Community',
    subText: 'Your spiritual home where faith meets community',
    backgroundGradient: 'from-islamic-navy-600 via-islamic-navy-700 to-islamic-green-700'
  },
  {
    id: 3,
    arabicText: 'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ',
    englishText: 'Establish prayer and give zakat',
    subText: 'Join us for daily prayers and community service',
    backgroundGradient: 'from-islamic-gold-600 via-islamic-gold-700 to-islamic-green-700'
  },
  {
    id: 4,
    arabicText: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً',
    englishText: 'Our Lord, give us good in this world and good in the Hereafter',
    subText: 'Strengthen your faith through Islamic education',
    backgroundGradient: 'from-islamic-green-700 via-islamic-navy-600 to-islamic-gold-600'
  }
];

export default function Home() {
  // Islamic Hero Slider State Management
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slider every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Slider navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Iteration 8: Performance-optimized structured data generation with error handling
  let prayerTimesStructuredData = null;
  let eventsStructuredData: any[] = [];
  let breadcrumbStructuredData = null;

  try {
    prayerTimesStructuredData = generatePrayerTimesStructuredData(mockPrayerTimes, mockPrayerTimes.date);
  } catch (error) {
    console.warn('Failed to generate prayer times structured data:', error);
  }

  try {
    eventsStructuredData = mockEvents.map(event => generateEventStructuredData(event));
  } catch (error) {
    console.warn('Failed to generate events structured data:', error);
  }

  try {
    breadcrumbStructuredData = generateBreadcrumbStructuredData([
      { name: 'Home', url: '/' }
    ]);
  } catch (error) {
    console.warn('Failed to generate breadcrumb structured data:', error);
  }

  return (
    <>
      {/* Structured Data for SEO */}
      {prayerTimesStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(prayerTimesStructuredData),
          }}
        />
      )}
      {eventsStructuredData.map((eventData, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(eventData),
          }}
        />
      ))}
      {breadcrumbStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbStructuredData),
          }}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Islamic Hero Slider Section - Mosque Theme Integration */}
        <section className={`islamic-pattern rounded-xl sm:rounded-2xl bg-gradient-to-br ${heroSlides[currentSlide].backgroundGradient} p-8 sm:p-12 text-white md:p-16 lg:p-20 xl:p-24 min-h-[70vh] sm:min-h-[75vh] md:min-h-[80vh] lg:min-h-[85vh] relative overflow-hidden shadow-xl sm:shadow-2xl shadow-islamic-green/15 sm:shadow-islamic-green/20 hover:shadow-3xl hover:shadow-islamic-green/35 hover:scale-[1.02] transition-all duration-1000 will-change-transform focus-within:ring-4 focus-within:ring-islamic-gold-400/50 focus-within:outline-none group/hero transform-gpu flex items-center justify-center`} 
                 style={{
                   backgroundImage: `linear-gradient(to bottom right, rgba(75, 85, 99, 0.6), rgba(75, 85, 99, 0.5), rgba(75, 85, 99, 0.6)), url('/alexander-psiuk-u7yUvVU-q9Y-unsplash.jpg')`,
                   backgroundSize: 'cover',
                   backgroundPosition: 'center',
                   backgroundRepeat: 'no-repeat'
                 }}
                 role="banner" 
                 aria-labelledby="hero-title" 
                 aria-describedby="hero-description"
                 aria-live="polite">
          {/* Enhanced Premium background patterns with advanced interactivity - Iteration 9 */}
          <div className="absolute inset-0 opacity-8 sm:opacity-10 group-hover/hero:opacity-12 sm:group-hover/hero:opacity-15 transition-opacity duration-1000">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/12 sm:via-white/15 to-transparent animate-shimmer will-change-transform group-hover/hero:animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-islamic-gold/6 sm:from-islamic-gold/8 via-transparent to-islamic-navy/10 sm:to-islamic-navy/12 group-hover/hero:from-islamic-gold/10 group-hover/hero:to-islamic-navy/15 transition-all duration-1000"></div>
            
            {/* Advanced responsive Islamic geometric pattern overlay with hover animation */}
            <div className="absolute inset-0 opacity-20 sm:opacity-25 will-change-transform group-hover/hero:opacity-30 sm:group-hover/hero:opacity-35 group-hover/hero:animate-pulse transition-all duration-1000" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.08'%3E%3Cpolygon points='60,20 100,40 100,80 60,100 20,80 20,40'/%3E%3Cpolygon points='60,30 90,45 90,75 60,90 30,75 30,45'/%3E%3Ccircle cx='60' cy='60' r='8'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px', // Mobile-first sizing
            }}></div>
            
            {/* Premium floating particles effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover/hero:opacity-100 transition-all duration-1000">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-islamic-gold-300 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '200ms'}}></div>
              <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-islamic-gold-400 rounded-full animate-bounce" style={{animationDelay: '400ms'}}></div>
              <div className="absolute bottom-1/4 left-3/4 w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '600ms'}}></div>
            </div>
            
            {/* Premium mobile-optimized radial gradient overlay with advanced interaction */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-islamic-navy/3 sm:to-islamic-navy/5 group-hover/hero:to-islamic-navy/8 transition-all duration-1000"></div>
          </div>
          
          {/* Slider Navigation Controls */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              onClick={toggleAutoPlay}
              className="p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white hover:bg-black/30 transition-all duration-300"
              aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white hover:bg-black/30 transition-all duration-300"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white hover:bg-black/30 transition-all duration-300"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-islamic-gold-400 scale-110'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Enhanced responsive container with dynamic content */}
          <div className="max-w-4xl relative z-10">
            <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
              {/* Dynamic content container based on current slide */}
              <div className="flex-1 space-y-3 text-center">
                {/* Arabic text with beautiful calligraphy */}
                <div className="arabic text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-[8.5rem] xl:text-[10rem] 2xl:text-[12rem] font-arabic font-black leading-tight text-white opacity-95 animate-fade-in mb-6"
                     key={`arabic-${currentSlide}`}
                     style={{animationDelay: '0ms', direction: 'rtl'}}>
                  {heroSlides[currentSlide].arabicText}
                </div>
                
                {/* English translation */}
                <h1 id="hero-title" className="hidden text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black animate-fade-in leading-tight tracking-wide text-black opacity-95 mb-3"
                    key={`english-${currentSlide}`}
                    style={{animationDelay: '200ms'}}>
                  {heroSlides[currentSlide].englishText}
                </h1>
                
                {/* Subtitle */}
                <p className="hidden text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black opacity-90 animate-fade-in leading-snug"
                   key={`subtitle-${currentSlide}`}
                   style={{animationDelay: '400ms'}}>
                  {heroSlides[currentSlide].subText}
                </p>
                
              </div>
            </div>
            
            {/* Enhanced description section with Islamic community focus */}
            <div id="hero-description" className="space-y-3 sm:space-y-4 animate-slide-up text-center" style={{animationDelay: '800ms'}} role="region" aria-labelledby="hero-title">
              <p className="hidden text-lg sm:text-xl md:text-2xl lg:text-3xl text-black opacity-90 leading-relaxed font-semibold">
                Join our welcoming Muslim community for <span className="font-semibold text-islamic-gold-200">daily prayers</span>, 
                <span className="font-semibold text-islamic-gold-200"> Islamic education</span>, 
                <span className="font-semibold text-islamic-gold-200"> community events</span>, and spiritual growth together.
              </p>
            </div>
            
          </div>
        </section>

        {/* Mosque Prayer Times Section - Above Services */}
        <section className="mt-2 sm:mt-3 md:mt-4 animate-fade-in" style={{ animationDelay: '800ms' }}>
          <MosquePrayerTimesSection location="Doraville, Georgia" />
        </section>

        {/* Islamic Services Grid Section - Mosque Theme Integration */}
        <section className="mt-8 sm:mt-12 md:mt-16 animate-fade-in" style={{ animationDelay: '1000ms' }}>
          <IslamicServicesGrid />
        </section>

      {/* Enhanced mobile-first responsive main content grid */}
      <div className="mt-8 sm:mt-10 md:mt-12 grid gap-6 sm:gap-8 lg:grid-cols-3">
        {/* Main Content - Mobile-first Enhanced Layout */}
        <article className="lg:col-span-2 space-y-8 sm:space-y-10 md:space-y-12">
          {/* Recent Announcements - Iteration 5 Enhancement: Advanced Micro-interactions */}
          <section className="group relative" aria-labelledby="announcements-heading">
            {/* Premium section background with subtle patterns */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316A34A' fill-opacity='0.08'%3E%3Ccircle cx='30' cy='30' r='15'/%3E%3Ccircle cx='30' cy='30' r='8'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px'
              }}></div>
            </div>
            
            <header className="mb-8 flex items-center justify-between relative z-10 group-hover:translate-y-[-2px] transition-transform duration-500">
              <div className="flex items-center gap-4">
                <div className="relative group/icon">
                  {/* Enhanced icon container with premium effects */}
                  <div className="relative p-3 rounded-xl bg-gradient-to-br from-islamic-navy-50 to-islamic-green-50 border border-islamic-green/20 shadow-lg shadow-islamic-green/10 hover:shadow-xl hover:shadow-islamic-green/20 transition-all duration-500 group-hover/icon:-translate-y-1">
                    <Users className="h-8 w-8 text-islamic-navy-600 group-hover/icon:text-islamic-green-600 transition-colors duration-300" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-islamic-green rounded-full animate-pulse flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    {/* Premium glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 bg-gradient-to-r from-islamic-green/20 via-transparent to-islamic-green/20 rounded-xl blur-sm"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  {/* Enhanced typography with advanced gradient and spacing */}
                  <h2 id="announcements-heading" className="text-3xl lg:text-4xl font-bold text-islamic-green-800 group-hover:text-islamic-green-700 transition-all duration-700 leading-tight tracking-tight">
                    Recent Islamic Community Announcements
                  </h2>
                  <p className="text-sm text-islamic-navy-600 mt-2 flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    <Activity className="h-3 w-3 animate-pulse" />
                    <span className="font-medium">Stay connected with your community</span>
                    <span className="w-1 h-1 rounded-full bg-islamic-green animate-pulse"></span>
                    <span className="text-xs opacity-70">أبق على تواصل مع مجتمعك</span>
                  </p>
                </div>
              </div>
              
              {/* Enhanced View All button with premium interactions */}
              <Link href="/announcements" aria-label="View all mosque announcements" className="group/btn">
                <Button variant="outline" 
                        size="sm" 
                        className="group/btn gap-3 border-islamic-green/30 text-islamic-green hover:bg-islamic-green hover:text-white hover:border-islamic-green transition-all duration-500 hover:shadow-lg hover:shadow-islamic-green/30 relative overflow-hidden min-h-[40px] font-medium">
                  
                  {/* Advanced shimmer effect for button */}
                  <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
                  </div>
                  
                  <span className="relative z-10 group-hover/btn:animate-pulse">View All</span>
                  <ArrowRight className="h-4 w-4 relative z-10 group-hover/btn:translate-x-2 group-hover/btn:scale-110 transition-all duration-300" aria-hidden="true" />
                  
                  {/* Premium pulse effect on hover */}
                  <div className="absolute inset-0 rounded-md border border-islamic-green/50 opacity-0 group-hover/btn:opacity-100 group-hover/btn:animate-ping"></div>
                </Button>
              </Link>
            </header>
            
            {/* Enhanced announcements grid with advanced stagger animations - Iteration 8: Performance-optimized with code splitting */}
            <div className="grid gap-8 animate-fade-in relative z-10" role="feed" aria-label="Latest announcements">
              {mockAnnouncements.map((announcement, index) => (
                <div key={announcement.id} 
                     className={`group/card relative transform transition-all duration-700 hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-islamic-green/10 ${index % 2 === 0 ? 'animate-slide-up' : 'animate-fade-in'}`}
                     style={{ 
                       animationDelay: `${index * 200}ms`,
                       transformOrigin: 'center bottom'
                     }}>
                  
                  {/* Premium card container with enhanced interactions */}
                  <div className="relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-md hover:border-islamic-green/30 transition-all duration-500 group-hover/card:shadow-xl group-hover/card:shadow-islamic-green/5">
                    
                    {/* Advanced card glow effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 bg-gradient-to-br from-islamic-green/5 via-transparent to-islamic-gold/5"></div>
                    </div>
                    
                    {/* Premium shine effect across the card */}
                    <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover/card:translate-x-[200%] transition-transform duration-1200"></div>
                    </div>
                    
                    {/* Performance-optimized lazy-loaded announcement cards */}
                    <div className="relative z-10">
                      <Suspense fallback={
                        <div className="animate-pulse h-32 bg-islamic-green/10 rounded-xl border border-islamic-green/20 flex items-center justify-center">
                          <div className="text-islamic-green-600 text-sm">Loading announcement...</div>
                        </div>
                      }>
                        <AnnouncementCard announcement={announcement} />
                      </Suspense>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-islamic-green/5 to-islamic-gold/5 border border-islamic-green/10">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-islamic-green mt-0.5 flex-shrink-0" />
                <p className="text-sm text-islamic-navy-600 leading-relaxed">
                  Stay updated with important mosque announcements, Eid celebrations, Ramadan schedules, and community activities. 
                  <span className="font-medium text-islamic-green-700"> Never miss an important update from your Islamic community.</span>
                </p>
              </div>
            </div>
          </section>

          {/* Upcoming Events - Iteration 5 Enhancement: Advanced Micro-interactions */}
          <section className="group relative" aria-labelledby="events-heading">
            {/* Premium section background with Islamic gold patterns */}
            <div className="absolute inset-0 opacity-4 pointer-events-none">
              <div className="w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D97706' fill-opacity='0.08'%3E%3Cpath d='M40 20L60 40L40 60L20 40z'/%3E%3Cpath d='M40 30L50 40L40 50L30 40z'/%3E%3Ccircle cx='40' cy='40' r='6'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '40px 40px'
              }}></div>
            </div>
            
            <header className="mb-8 flex items-center justify-between relative z-10 group-hover:translate-y-[-2px] transition-transform duration-500">
              <div className="flex items-center gap-4">
                <div className="relative group/icon">
                  {/* Enhanced icon container with Islamic gold theme */}
                  <div className="relative p-3 rounded-xl bg-gradient-to-br from-islamic-gold-50 to-islamic-navy-50 border border-islamic-gold/20 shadow-lg shadow-islamic-gold/10 hover:shadow-xl hover:shadow-islamic-gold/20 transition-all duration-500 group-hover/icon:-translate-y-1">
                    <Calendar className="h-8 w-8 text-islamic-gold-600 group-hover/icon:text-islamic-gold-700 transition-colors duration-300" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-islamic-gold rounded-full animate-pulse flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    {/* Premium golden glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 bg-gradient-to-r from-islamic-gold/20 via-transparent to-islamic-gold/20 rounded-xl blur-sm"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  {/* Enhanced typography with Islamic gold gradient */}
                  <h2 id="events-heading" className="text-3xl lg:text-4xl font-bold text-islamic-gold-700 group-hover:text-islamic-gold-600 transition-all duration-700 leading-tight tracking-tight">
                    Upcoming Islamic Events & Activities
                  </h2>
                  <p className="text-sm text-islamic-navy-600 mt-2 flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    <Sparkles className="h-3 w-3 animate-pulse text-islamic-gold-500" />
                    <span className="font-medium">Join our vibrant community gatherings</span>
                    <span className="w-1 h-1 rounded-full bg-islamic-gold animate-pulse"></span>
                    <span className="text-xs opacity-70">انضم إلى تجمعاتنا المجتمعية</span>
                  </p>
                </div>
              </div>
              
              {/* Enhanced View All button with Islamic gold theme */}
              <Link href="/events" aria-label="Browse all Islamic events and programs" className="group/btn">
                <Button variant="outline" 
                        size="sm" 
                        className="group/btn gap-3 border-islamic-gold/30 text-islamic-gold hover:bg-islamic-gold hover:text-white hover:border-islamic-gold transition-all duration-500 hover:shadow-lg hover:shadow-islamic-gold/30 relative overflow-hidden min-h-[40px] font-medium">
                  
                  {/* Advanced golden shimmer effect */}
                  <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
                  </div>
                  
                  <span className="relative z-10 group-hover/btn:animate-pulse">View All</span>
                  <ArrowRight className="h-4 w-4 relative z-10 group-hover/btn:translate-x-2 group-hover/btn:scale-110 transition-all duration-300" aria-hidden="true" />
                  
                  {/* Premium golden pulse effect */}
                  <div className="absolute inset-0 rounded-md border border-islamic-gold/50 opacity-0 group-hover/btn:opacity-100 group-hover/btn:animate-ping"></div>
                </Button>
              </Link>
            </header>
            
            {/* Enhanced events grid with advanced Islamic gold animations */}
            <div className="grid gap-8 animate-fade-in relative z-10" role="list" aria-label="Upcoming events">
              {mockEvents.map((event, index) => (
                <div key={event.id} 
                     className={`group/card relative transform transition-all duration-700 hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-islamic-gold/15 ${index % 2 === 1 ? 'animate-slide-up' : 'animate-fade-in'}`}
                     style={{ 
                       animationDelay: `${(index + 3) * 200}ms`,
                       transformOrigin: 'center bottom'
                     }}>
                  
                  {/* Premium event card container with enhanced Islamic gold interactions */}
                  <div className="relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-md hover:border-islamic-gold/30 transition-all duration-500 group-hover/card:shadow-xl group-hover/card:shadow-islamic-gold/10">
                    
                    {/* Advanced Islamic gold card glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 bg-gradient-to-br from-islamic-gold/5 via-transparent to-islamic-navy/5"></div>
                    </div>
                    
                    {/* Premium golden shine effect across the card */}
                    <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-islamic-gold/15 to-transparent -skew-x-12 translate-x-[-100%] group-hover/card:translate-x-[200%] transition-transform duration-1200"></div>
                    </div>
                    
                    {/* Performance-optimized lazy-loaded event cards */}
                    <div className="relative z-10">
                      <Suspense fallback={
                        <div className="animate-pulse h-28 bg-islamic-gold/10 rounded-xl border border-islamic-gold/20 flex items-center justify-center">
                          <div className="text-islamic-gold-600 text-sm">Loading event...</div>
                        </div>
                      }>
                        <EventCard event={event} />
                      </Suspense>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-islamic-gold/5 to-islamic-green/5 border border-islamic-gold/10">
              <div className="flex items-start gap-3">
                <Star className="h-5 w-5 text-islamic-gold mt-0.5 flex-shrink-0" />
                <p className="text-sm text-islamic-navy-600 leading-relaxed">
                  Join our Islamic community events including Eid prayers, Ramadan programs, educational workshops, and family gatherings. 
                  <span className="font-medium text-islamic-gold-700"> Experience the warmth of our Islamic brotherhood and sisterhood.</span>
                </p>
              </div>
            </div>
          </section>

          {/* Calendar Downloads - Iteration 5 Enhancement: Advanced Micro-interactions */}
          <section className="hidden group relative" aria-labelledby="calendar-heading">
            {/* Premium section background with Islamic navy patterns */}
            <div className="absolute inset-0 opacity-3 pointer-events-none">
              <div className="w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='70' height='70' viewBox='0 0 70 70' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='0.08'%3E%3Crect x='20' y='20' width='30' height='30' rx='5'/%3E%3Crect x='25' y='25' width='20' height='20' rx='3'/%3E%3Ccircle cx='35' cy='35' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '35px 35px'
              }}></div>
            </div>
            
            <header className="mb-8 flex items-center justify-between relative z-10 group-hover:translate-y-[-2px] transition-transform duration-500">
              <div className="flex items-center gap-4">
                <div className="relative group/icon">
                  {/* Enhanced icon container with Islamic navy theme */}
                  <div className="relative p-3 rounded-xl bg-gradient-to-br from-islamic-navy-50 to-islamic-green-50 border border-islamic-navy/20 shadow-lg shadow-islamic-navy/10 hover:shadow-xl hover:shadow-islamic-navy/20 transition-all duration-500 group-hover/icon:-translate-y-1">
                    <Download className="h-8 w-8 text-islamic-navy-600 group-hover/icon:text-islamic-navy-700 transition-colors duration-300" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-islamic-navy rounded-full animate-pulse flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    {/* Premium navy glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 bg-gradient-to-r from-islamic-navy/20 via-transparent to-islamic-navy/20 rounded-xl blur-sm"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  {/* Enhanced typography with Islamic navy gradient */}
                  <h2 id="calendar-heading" className="text-3xl lg:text-4xl font-bold text-islamic-navy-700 group-hover:text-islamic-navy-600 transition-all duration-700 leading-tight tracking-tight">
                    Islamic Calendar Downloads
                  </h2>
                  <p className="text-sm text-islamic-navy-600 mt-2 flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    <Zap className="h-3 w-3 animate-pulse text-islamic-navy-500" />
                    <span className="font-medium">Essential Islamic resources</span>
                    <span className="w-1 h-1 rounded-full bg-islamic-navy animate-pulse"></span>
                    <span className="text-xs opacity-70">المصادر الإسلامية الأساسية</span>
                  </p>
                </div>
              </div>
              
              {/* Enhanced Download All button with Islamic navy theme */}
              <Link href="/calendar" aria-label="Download all Islamic calendar resources" className="group/btn">
                <Button variant="outline" 
                        size="sm" 
                        className="group/btn gap-3 border-islamic-navy/30 text-islamic-navy hover:bg-islamic-navy hover:text-white hover:border-islamic-navy transition-all duration-500 hover:shadow-lg hover:shadow-islamic-navy/30 relative overflow-hidden min-h-[40px] font-medium">
                  
                  {/* Advanced navy shimmer effect */}
                  <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
                  </div>
                  
                  <Download className="h-4 w-4 relative z-10 group-hover/btn:animate-bounce group-hover/btn:scale-110 transition-all duration-300" aria-hidden="true" />
                  <span className="relative z-10 group-hover/btn:animate-pulse">All Downloads</span>
                  
                  {/* Premium navy pulse effect */}
                  <div className="absolute inset-0 rounded-md border border-islamic-navy/50 opacity-0 group-hover/btn:opacity-100 group-hover/btn:animate-ping"></div>
                </Button>
              </Link>
            </header>
            
            {/* Enhanced calendar downloads grid with advanced navy animations */}
            <div className="grid gap-6 animate-fade-in relative z-10" role="list" aria-label="Available Islamic calendars">
              {mockCalendars.map((calendar, index) => (
                <div key={calendar.id} 
                     className="group/card relative transform transition-all duration-700 hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-islamic-navy/15 animate-slide-up"
                     style={{ 
                       animationDelay: `${(index + 6) * 200}ms`,
                       transformOrigin: 'center bottom'
                     }}>
                  
                  {/* Premium calendar card container with enhanced Islamic navy interactions */}
                  <div className="relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-md hover:border-islamic-navy/30 transition-all duration-500 group-hover/card:shadow-xl group-hover/card:shadow-islamic-navy/10">
                    
                    {/* Advanced Islamic navy card glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 bg-gradient-to-br from-islamic-navy/5 via-transparent to-islamic-green/5"></div>
                    </div>
                    
                    {/* Premium navy shine effect across the card */}
                    <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-islamic-navy/15 to-transparent -skew-x-12 translate-x-[-100%] group-hover/card:translate-x-[200%] transition-transform duration-1200"></div>
                    </div>
                    
                    {/* Performance-optimized lazy-loaded calendar downloads */}
                    <div className="relative z-10">
                      <Suspense fallback={
                        <div className="animate-pulse h-24 bg-islamic-navy/10 rounded-xl border border-islamic-navy/20 flex items-center justify-center">
                          <div className="text-islamic-navy-600 text-sm">Loading calendar...</div>
                        </div>
                      }>
                        <CalendarDownload calendar={calendar} compact />
                      </Suspense>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-islamic-navy/5 to-islamic-green/5 border border-islamic-navy/10">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-islamic-navy mt-0.5 flex-shrink-0" />
                <p className="text-sm text-islamic-navy-600 leading-relaxed">
                  Download Ramadan calendars, prayer time schedules, and Islamic holiday dates for your convenience. 
                  <span className="font-medium text-islamic-navy-700"> Keep your Islamic observances organized and timely.</span>
                </p>
              </div>
            </div>
          </section>
        </article>

        {/* Premium Sidebar - Iteration 6 Enhancement: Mobile-First Responsive Design */}
        <aside className="space-y-6 sm:space-y-8 animate-fade-in" 
               style={{ animationDelay: '900ms' }} 
               role="complementary" 
               aria-label="Prayer times and community information">
          
          {/* Enhanced Prayer Times Widget Container - Iteration 8: Performance-optimized with Suspense */}
          <section aria-labelledby="prayer-times-sidebar" 
                   className="relative group">
            <h3 id="prayer-times-sidebar" className="sr-only">Daily Prayer Times</h3>
            
            {/* Premium container wrapper with Islamic patterns */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-islamic-green-50 via-white to-islamic-gold-50/30 p-1 shadow-xl shadow-islamic-green/10 hover:shadow-2xl hover:shadow-islamic-green/20 transition-all duration-700 group-hover:-translate-y-1">
              
              {/* Islamic geometric border pattern */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316A34A' fill-opacity='0.08'%3E%3Cpath d='M20 0L30 10L20 20L10 10z'/%3E%3Cpath d='M20 20L30 30L20 40L10 30z'/%3E%3Cpath d='M0 20L10 10L20 20L10 30z'/%3E%3Cpath d='M20 20L30 10L40 20L30 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '20px 20px'
                }}></div>
              </div>
              
              {/* Premium shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1500"></div>
              </div>
              
              <div className="relative z-10 bg-white rounded-lg">
                <Suspense fallback={
                  <div className="animate-pulse h-96 bg-gradient-to-br from-islamic-green-50 to-islamic-gold-50 rounded-xl border border-islamic-green/20 flex items-center justify-center p-6">
                    <div className="text-center space-y-2">
                      <div className="text-islamic-green-600 font-medium">Loading Prayer Times...</div>
                      <div className="text-xs text-islamic-navy-500">Please wait while we fetch today's prayer schedule</div>
                    </div>
                  </div>
                }>
                  <PrayerTimesWidget 
                    prayerTimes={mockPrayerTimes} 
                    currentPrayer="dhuhr"
                  />
                </Suspense>
              </div>
            </div>
          </section>

          {/* Premium Quick Actions */}
          <section className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white via-islamic-navy-50/30 to-islamic-gold-50/20 border border-islamic-navy/10 shadow-xl shadow-islamic-navy/5 hover:shadow-2xl hover:shadow-islamic-navy/15 transition-all duration-700 hover:-translate-y-1" 
                   aria-labelledby="quick-actions-heading">
            
            {/* Premium background patterns */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='0.06'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3Ccircle cx='30' cy='30' r='10'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px'
              }}></div>
            </div>
            
            {/* Premium shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1500"></div>
            </div>
            
            <div className="relative z-10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <Zap className="h-6 w-6 text-islamic-navy-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-islamic-green rounded-full animate-pulse"></div>
                </div>
                <h3 id="quick-actions-heading" className="font-bold text-lg text-islamic-navy-800">
                  Quick Actions
                </h3>
              </div>
              
              <nav className="space-y-3" role="navigation" aria-label="Quick access links">
                <Link href="/donate" className="block" aria-label="Make a donation to support the mosque">
                  <Button className="w-full justify-start gap-3 group/btn relative overflow-hidden border border-islamic-green/20 bg-gradient-to-r from-islamic-green-50 to-transparent hover:from-islamic-green-100 hover:to-islamic-green-50 hover:border-islamic-green/40 hover:shadow-lg hover:shadow-islamic-green/10 transition-all duration-500" 
                          variant="outline">
                    <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-islamic-green/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
                    </div>
                    <span className="relative z-10 text-islamic-green-600 text-lg group-hover/btn:animate-pulse" aria-hidden="true">💚</span>
                    <span className="relative z-10 text-islamic-navy-700 font-medium group-hover/btn:text-islamic-green-700">Make a Donation (Zakat & Sadaqah)</span>
                  </Button>
                </Link>
                
                <Link href="/contact" className="block" aria-label="Contact mosque administration">
                  <Button className="w-full justify-start gap-3 group/btn relative overflow-hidden border border-islamic-navy/20 bg-gradient-to-r from-islamic-navy-50 to-transparent hover:from-islamic-navy-100 hover:to-islamic-navy-50 hover:border-islamic-navy/40 hover:shadow-lg hover:shadow-islamic-navy/10 transition-all duration-500" 
                          variant="outline">
                    <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-islamic-navy/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
                    </div>
                    <span className="relative z-10 text-islamic-navy-600 text-lg group-hover/btn:animate-pulse" aria-hidden="true">📧</span>
                    <span className="relative z-10 text-islamic-navy-700 font-medium group-hover/btn:text-islamic-navy-800">Contact Us</span>
                  </Button>
                </Link>
                
                <Link href="/about" className="block" aria-label="Learn about our Islamic center">
                  <Button className="w-full justify-start gap-3 group/btn relative overflow-hidden border border-islamic-gold/20 bg-gradient-to-r from-islamic-gold-50 to-transparent hover:from-islamic-gold-100 hover:to-islamic-gold-50 hover:border-islamic-gold/40 hover:shadow-lg hover:shadow-islamic-gold/10 transition-all duration-500" 
                          variant="outline">
                    <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-islamic-gold/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
                    </div>
                    <span className="relative z-10 text-islamic-gold-600 text-lg group-hover/btn:animate-pulse" aria-hidden="true">🏛️</span>
                    <span className="relative z-10 text-islamic-navy-700 font-medium group-hover/btn:text-islamic-gold-700">About the Mosque</span>
                  </Button>
                </Link>
                
                <Link href="/education" className="block" aria-label="Browse Islamic education programs">
                  <Button className="w-full justify-start gap-3 group/btn relative overflow-hidden border border-islamic-green/20 bg-gradient-to-r from-islamic-green-50 to-transparent hover:from-islamic-green-100 hover:to-islamic-green-50 hover:border-islamic-green/40 hover:shadow-lg hover:shadow-islamic-green/10 transition-all duration-500" 
                          variant="outline">
                    <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-islamic-green/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
                    </div>
                    <span className="relative z-10 text-islamic-green-600 text-lg group-hover/btn:animate-pulse" aria-hidden="true">📚</span>
                    <span className="relative z-10 text-islamic-navy-700 font-medium group-hover/btn:text-islamic-green-700">Islamic Education</span>
                  </Button>
                </Link>
              </nav>
            </div>
          </section>

          {/* Premium Community Notice */}
          <section className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-islamic-gold-50 via-islamic-gold-100/50 to-islamic-gold-200/30 border border-islamic-gold-200/60 shadow-xl shadow-islamic-gold/10 hover:shadow-2xl hover:shadow-islamic-gold/20 transition-all duration-700 hover:-translate-y-1" 
                   aria-labelledby="community-notice-heading">
            
            {/* Premium Islamic pattern background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D97706' fill-opacity='0.08'%3E%3Cpath d='M40 0L60 20L40 40L20 20z'/%3E%3Cpath d='M40 40L60 60L40 80L20 60z'/%3E%3Cpath d='M0 40L20 20L40 40L20 60z'/%3E%3Cpath d='M40 40L60 20L80 40L60 60z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '40px 40px'
              }}></div>
            </div>
            
            {/* Premium shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1500"></div>
            </div>
            
            <div className="relative z-10 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <Moon className="h-6 w-6 text-islamic-gold-700" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-islamic-gold-500 rounded-full animate-pulse"></div>
                </div>
                <h3 id="community-notice-heading" className="font-bold text-lg text-islamic-gold-700">
                  Mosque Etiquette & Guidelines
                </h3>
              </div>
              
              <div className="text-sm text-islamic-gold-700 space-y-3">
                <p className="font-medium">
                  Please observe Islamic etiquette during prayers:
                </p>
                <ul className="list-none space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-islamic-gold-600 mt-0.5 flex-shrink-0" />
                    <span>Remove shoes before entering the prayer hall</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-islamic-gold-600 mt-0.5 flex-shrink-0" />
                    <span>Maintain silence during prayer services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-islamic-gold-600 mt-0.5 flex-shrink-0" />
                    <span>Dress modestly and appropriately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-islamic-gold-600 mt-0.5 flex-shrink-0" />
                    <span>Turn off mobile devices during prayers</span>
                  </li>
                </ul>
                <div className="mt-4 p-3 rounded-lg bg-islamic-gold-200/30 border border-islamic-gold-300/50">
                  <p className="font-semibold text-islamic-gold-800 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <strong>Jummah Prayer:</strong>
                  </p>
                  <p className="mt-1">
                    Fridays at <span className="font-medium">2:00 PM & 2:30 PM</span> - Arrive early for the best experience.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Premium Islamic Resources */}
          <section className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white via-islamic-navy-50/30 to-islamic-green-50/20 border border-islamic-navy/10 shadow-xl shadow-islamic-navy/5 hover:shadow-2xl hover:shadow-islamic-navy/15 transition-all duration-700 hover:-translate-y-1" 
                   aria-labelledby="resources-heading">
            
            {/* Premium background patterns */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316A34A' fill-opacity='0.06'%3E%3Cpath d='M25 5L35 15L25 25L15 15z'/%3E%3Cpath d='M25 25L35 35L25 45L15 35z'/%3E%3Cpath d='M5 25L15 15L25 25L15 35z'/%3E%3Cpath d='M25 25L35 15L45 25L35 35z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '25px 25px'
              }}></div>
            </div>
            
            {/* Premium shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1500"></div>
            </div>
            
            <div className="relative z-10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <BookOpen className="h-6 w-6 text-islamic-green-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-islamic-green-500 rounded-full animate-pulse"></div>
                </div>
                <h3 id="resources-heading" className="font-bold text-lg text-islamic-green-700">
                  Islamic Resources
                </h3>
              </div>
              
              <nav className="space-y-3" role="navigation" aria-label="Islamic learning resources">
                <Link href="/resources/quran-study" className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-islamic-green-50 to-transparent border border-islamic-green/10 hover:border-islamic-green/30 hover:bg-islamic-green-100/50 hover:shadow-md hover:shadow-islamic-green/10 transition-all duration-300 group/link">
                  <span className="text-lg group-hover/link:animate-pulse">📖</span>
                  <span className="text-sm font-medium text-islamic-navy-700 group-hover/link:text-islamic-green-700">Quran Study & Tafsir</span>
                  <ArrowRight className="h-3 w-3 ml-auto text-islamic-green-600 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all duration-300" />
                </Link>
                
                <Link href="/resources/hadith-collections" className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-islamic-navy-50 to-transparent border border-islamic-navy/10 hover:border-islamic-navy/30 hover:bg-islamic-navy-100/50 hover:shadow-md hover:shadow-islamic-navy/10 transition-all duration-300 group/link">
                  <span className="text-lg group-hover/link:animate-pulse">📚</span>
                  <span className="text-sm font-medium text-islamic-navy-700 group-hover/link:text-islamic-navy-800">Hadith Collections</span>
                  <ArrowRight className="h-3 w-3 ml-auto text-islamic-navy-600 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all duration-300" />
                </Link>
                
                <Link href="/resources/qibla-direction" className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-islamic-gold-50 to-transparent border border-islamic-gold/10 hover:border-islamic-gold/30 hover:bg-islamic-gold-100/50 hover:shadow-md hover:shadow-islamic-gold/10 transition-all duration-300 group/link">
                  <span className="text-lg group-hover/link:animate-pulse">🧭</span>
                  <span className="text-sm font-medium text-islamic-navy-700 group-hover/link:text-islamic-gold-700">Qibla Direction</span>
                  <ArrowRight className="h-3 w-3 ml-auto text-islamic-gold-600 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all duration-300" />
                </Link>
                
                <Link href="/resources/islamic-calendar" className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-islamic-green-50 to-transparent border border-islamic-green/10 hover:border-islamic-green/30 hover:bg-islamic-green-100/50 hover:shadow-md hover:shadow-islamic-green/10 transition-all duration-300 group/link">
                  <span className="text-lg group-hover/link:animate-pulse">🗓️</span>
                  <span className="text-sm font-medium text-islamic-navy-700 group-hover/link:text-islamic-green-700">Islamic Calendar</span>
                  <ArrowRight className="h-3 w-3 ml-auto text-islamic-green-600 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all duration-300" />
                </Link>
              </nav>
            </div>
          </section>
        </aside>
      </div>
    </div>
    </>
  );
}