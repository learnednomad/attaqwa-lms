import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DailyPrayerTimes } from '@/types';

interface MosquePrayerTimesSectionProps {
  className?: string;
  location?: string;
  prayerTimes: DailyPrayerTimes;
}

// Authentic Hadith about Salah from Bukhari and Muslim
const hadithCollection = [
  {
    arabic: 'صَلُّوا كَمَا رَأَيْتُمُونِي أُصَلِّي',
    english: 'Pray as you have seen me praying.',
    source: 'Sahih al-Bukhari 631',
    narrator: 'Malik ibn al-Huwayrith'
  },
  {
    arabic: 'إِنَّ صَلاَةَ الْجَمَاعَةِ أَفْضَلُ مِنْ صَلاَةِ الْفَذِّ بِسَبْعٍ وَعِشْرِينَ دَرَجَةً',
    english: 'The prayer offered in congregation is twenty-seven times more superior in reward to the prayer offered alone.',
    source: 'Sahih al-Bukhari 645',
    narrator: 'Abdullah ibn Umar'
  },
  {
    arabic: 'مَنْ صَلَّى صَلاَتَنَا وَاسْتَقْبَلَ قِبْلَتَنَا وَأَكَلَ ذَبِيحَتَنَا فَذَلِكَ الْمُسْلِمُ',
    english: 'Whoever prays like us and faces our Qibla and eats our slaughtered animals is a Muslim and is under Allah\'s and His Apostle\'s protection.',
    source: 'Sahih al-Bukhari 391',
    narrator: 'Anas ibn Malik'
  },
  {
    arabic: 'بَيْنَ الرَّجُلِ وَبَيْنَ الشِّرْكِ وَالْكُفْرِ تَرْكُ الصَّلاَةِ',
    english: 'Between a man and disbelief and paganism is the abandonment of Salah (prayer).',
    source: 'Sahih Muslim 82',
    narrator: 'Jabir ibn Abdullah'
  },
  {
    arabic: 'أَوَّلُ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ الصَّلاَةُ',
    english: 'The first matter that the slave will be brought to account for on the Day of Judgment is the prayer.',
    source: 'Sahih Muslim (Sunan an-Nasa\'i 465)',
    narrator: 'Abu Hurairah'
  }
];

export function MosquePrayerTimesSection({
  className,
  location = "Doraville, Georgia",
  prayerTimes
}: MosquePrayerTimesSectionProps) {
  const prayers = [
    { name: 'Fajr', time: prayerTimes.fajr, iqama: prayerTimes.iqama?.fajr, key: 'fajr' },
    { name: 'Dhuhr', time: prayerTimes.dhuhr, iqama: prayerTimes.iqama?.dhuhr, key: 'dhuhr' },
    { name: 'Asr', time: prayerTimes.asr, iqama: prayerTimes.iqama?.asr, key: 'asr' },
    { name: 'Maghrib', time: prayerTimes.maghrib, iqama: prayerTimes.iqama?.maghrib, key: 'maghrib' },
    { name: 'Isha', time: prayerTimes.isha, iqama: prayerTimes.iqama?.isha, key: 'isha' }
  ];

  // Select a hadith based on the day of the year for variety
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const todaysHadith = hadithCollection[dayOfYear % hadithCollection.length];

  return (
    <section className={cn('relative pt-4 pb-6 md:pt-6 md:pb-8', className)}>
      <div className="max-w-7xl mx-auto">
        {/* Two Column Layout - Image Left, Hadith Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left Column - Prayer Illustration */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-sm">
              <Image
                src="/praying.png"
                alt="Muslim man praying on prayer mat"
                width={500}
                height={500}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* Right Column - Hadith of the Day */}
          <div className="space-y-6">
            {/* Hadith Label */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-emerald-500 to-transparent max-w-[60px]"></div>
              <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">
                Hadith of the Day
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-emerald-500 to-transparent max-w-[60px]"></div>
            </div>

            {/* Arabic Text */}
            <div className="relative">
              <Quote className="absolute -top-2 -left-2 h-8 w-8 text-emerald-200 rotate-180" />
              <p className="text-2xl md:text-3xl font-amiri text-gray-800 leading-relaxed text-right pr-4 pl-8" dir="rtl">
                {todaysHadith.arabic}
              </p>
            </div>

            {/* English Translation */}
            <blockquote className="text-xl md:text-2xl lg:text-3xl font-serif leading-snug text-gray-900 italic">
              &ldquo;{todaysHadith.english}&rdquo;
            </blockquote>

            {/* Source Attribution */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
              <span className="font-medium text-gray-700">
                — {todaysHadith.narrator}
              </span>
              <span className="hidden sm:inline text-gray-300">|</span>
              <span className="text-emerald-600 font-medium">
                {todaysHadith.source}
              </span>
            </div>
          </div>
        </div>

        {/* Prayer Times Grid - Full Width Below */}
        <div className="mt-8 pt-5 border-t border-gray-200">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm md:text-base font-semibold text-gray-500 uppercase tracking-wider">
              Today&apos;s Prayer Times
            </h3>
            <Link
              href="/prayer-times"
              className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-medium text-sm md:text-base group"
            >
              Full Schedule
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 sm:grid sm:grid-cols-5 sm:gap-6 sm:overflow-visible sm:pb-0">
            {prayers.map((prayer) => (
              <div
                key={prayer.key}
                className="text-center flex-shrink-0 min-w-[70px] sm:min-w-0"
              >
                <p className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                  {prayer.name}
                </p>
                <p className="text-xl md:text-3xl font-bold text-gray-900 font-mono"
                   style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {prayer.time.replace(' AM', '').replace(' PM', '')}
                </p>
                <p className="text-sm md:text-base text-gray-400 mt-0.5">
                  {prayer.time.includes('AM') ? 'AM' : 'PM'}
                </p>
                {prayer.iqama && (
                  <p className="text-xs md:text-sm text-emerald-600 mt-2 font-medium whitespace-nowrap">
                    Iqama: {prayer.iqama}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Jummah Times */}
          {prayerTimes.jummah && prayerTimes.jummah.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-6 md:gap-12">
                <p className="text-base md:text-lg font-semibold text-amber-700">
                  Jumu&apos;ah Prayer
                </p>
                <div className="flex gap-6 md:gap-10">
                  {prayerTimes.jummah.map((time, index) => (
                    <div key={index} className="text-center">
                      <p className="text-sm md:text-base text-gray-500 mb-1">
                        {index === 0 ? '1st' : '2nd'} Khutbah
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-amber-700 font-mono">
                        {time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
