'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTime } from '@attaqwa/shared';
import type { DailyPrayerTimes } from '@/types';

interface ImmersiveHeroProps {
  className?: string;
  prayerTimes?: DailyPrayerTimes | null;
}

export function ImmersiveHero({ className, prayerTimes }: ImmersiveHeroProps) {
  const prayers = prayerTimes
    ? [
        { name: 'Fajr', time: prayerTimes.fajr, iqama: prayerTimes.iqama?.fajr },
        { name: 'Dhuhr', time: prayerTimes.dhuhr, iqama: prayerTimes.iqama?.dhuhr },
        { name: 'Asr', time: prayerTimes.asr, iqama: prayerTimes.iqama?.asr },
        { name: 'Maghrib', time: prayerTimes.maghrib, iqama: prayerTimes.iqama?.maghrib },
        { name: 'Isha', time: prayerTimes.isha, iqama: prayerTimes.iqama?.isha },
      ]
    : null;

  return (
    <section
      className={cn(
        'relative min-h-[85vh] flex items-center justify-center overflow-hidden',
        className
      )}
      role="banner"
      aria-labelledby="hero-title"
    >
      {/* Background Base */}
      <div className="absolute inset-0 bg-[#0a0f1a]" />

      {/* Mosque Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/alexander-psiuk-u7yUvVU-q9Y-unsplash.jpg"
          alt="Beautiful mosque at twilight"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center flex flex-col items-center justify-center min-h-[85vh] pt-24 pb-16">
        {/* Arabic Calligraphy - Bismillah */}
        <div className="mb-8 md:mb-10">
          <span className="font-amiri text-3xl md:text-4xl lg:text-5xl text-white/90 leading-relaxed tracking-wide">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>
        </div>

        {/* Main Headline */}
        <h1
          id="hero-title"
          className="mb-6 md:mb-8"
        >
          <span className="font-cormorant text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight">
            Masjid At-Taqwa
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl lg:text-2xl text-white/70 mb-10 md:mb-14 max-w-2xl">
          Your spiritual home where faith meets community
        </p>

        {/* CTA Buttons - hidden for now
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-islamic-green-600 hover:bg-islamic-green-500 text-white font-medium text-base transition-colors shadow-lg shadow-islamic-green-600/30 group"
          >
            Explore Our Services
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/prayer-times"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium text-base transition-colors border border-white/20 backdrop-blur-sm"
          >
            View Prayer Times
          </Link>
        </div>
        */}

        {/* Prayer Times Strip */}
        {prayers ? (
          <div className="mt-12 md:mt-16 w-full max-w-2xl mx-auto">
            <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-5 sm:px-6 sm:py-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  Today&apos;s Prayer Times
                </p>
                <Link
                  href="/prayer-times"
                  className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1 group"
                >
                  Full Schedule
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-5 gap-2 sm:gap-4">
                {prayers.map((prayer) => {
                  const formatted = formatTime(prayer.time);
                  const match = formatted.match(/^(.+?)\s*(AM|PM)$/i);
                  return (
                    <div key={prayer.name} className="text-center">
                      <p className="text-[10px] sm:text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
                        {prayer.name}
                      </p>
                      {match ? (
                        <>
                          <p className="text-base sm:text-xl md:text-2xl font-bold text-white font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {match[1]}
                          </p>
                          <p className="text-[10px] sm:text-xs text-white/40 mt-0.5">
                            {match[2]}
                          </p>
                        </>
                      ) : (
                        <p className="text-base sm:text-xl md:text-2xl font-bold text-white font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
                          {formatted}
                        </p>
                      )}
                      {prayer.iqama && (
                        <p className="text-[10px] sm:text-xs text-emerald-400 mt-1 font-medium whitespace-nowrap">
                          {formatTime(prayer.iqama)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Jummah & Tarawih inline */}
              {(prayerTimes?.jummah && prayerTimes.jummah.length > 0) || prayerTimes?.tarawih ? (
                <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
                  {prayerTimes.jummah && prayerTimes.jummah.length > 0 && (
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="text-sm sm:text-base font-semibold text-amber-400">Jumu&apos;ah</span>
                      {prayerTimes.jummah.map((time, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                          <span className="text-xs text-white/40">{index === 0 ? '1st' : '2nd'}</span>
                          <span className="text-base sm:text-lg font-bold text-white font-mono">
                            {time}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {prayerTimes.tarawih && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-purple-400">Tarawih</span>
                      <span className="text-sm sm:text-base font-bold text-white font-mono">
                        {formatTime(prayerTimes.tarawih)}
                      </span>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          /* Fallback: Community Stats when no prayer times data */
          <div className="mt-12 md:mt-16 grid grid-cols-2 gap-6 md:gap-12 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">5</div>
              <div className="text-sm md:text-base text-white/50 mt-1">Daily Prayers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">2</div>
              <div className="text-sm md:text-base text-white/50 mt-1">Jummah Services</div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
