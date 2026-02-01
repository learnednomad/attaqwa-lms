'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImmersiveHeroProps {
  className?: string;
  // floatingContent?: React.ReactNode; // Commented out: redundant prayer times display
}

export function ImmersiveHero({ className }: ImmersiveHeroProps) {
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />

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

        {/* CTA Buttons */}
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

        {/* Community Stats */}
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
      </div>

      {/* Floating Glass Card — commented out to remove redundant prayer times
      {floatingContent && (
        <div
          className={cn(
            'absolute left-16 bottom-16 z-20',
            'hidden lg:block',
          )}
        >
          {floatingContent}
        </div>
      )}
      */}

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
