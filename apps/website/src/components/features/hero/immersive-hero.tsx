'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Moon, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImmersiveHeroProps {
  className?: string;
}

export function ImmersiveHero({ className }: ImmersiveHeroProps) {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  const headline = 'Masjid At-Taqwa';
  const words = headline.split(' ');

  useEffect(() => {
    setMounted(true);

    // Parallax scroll effect
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      className={cn(
        'relative min-h-screen flex items-center justify-center overflow-hidden',
        className
      )}
      role="banner"
      aria-labelledby="hero-title"
    >
      {/* Background Base */}
      <div className="absolute inset-0 bg-[#0a0f1a]" />

      {/* Mosque Background Image - Clear and Prominent */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${scrollY * 0.15}px)`,
        }}
      >
        <Image
          src="/alexander-psiuk-u7yUvVU-q9Y-unsplash.jpg"
          alt="Beautiful mosque at twilight"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Subtle Gradient Overlay - Only at top and bottom for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />

      {/* Content Container - Centered */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center flex flex-col items-center justify-center min-h-screen pt-32 pb-24">
        {/* Arabic Calligraphy - Bismillah */}
        <div
          className={cn(
            'mb-8 md:mb-10 transition-all duration-1000',
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <span className="font-amiri text-3xl md:text-4xl lg:text-5xl text-white/90 leading-relaxed tracking-wide">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>
        </div>

        {/* Main Headline - Centered */}
        <h1
          id="hero-title"
          className="mb-6 md:mb-8"
        >
          {words.map((word, index) => (
            <span
              key={index}
              className={cn(
                'inline-block font-cormorant text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight',
                'mr-4 md:mr-6',
                mounted ? 'word-animate' : 'opacity-0'
              )}
              style={{
                animationDelay: mounted ? `${index * 120 + 300}ms` : '0ms',
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p
          className={cn(
            'text-lg md:text-xl lg:text-2xl text-white/70 mb-10 md:mb-14 max-w-2xl transition-all duration-1000',
            mounted ? 'opacity-100 translate-y-0 delay-700' : 'opacity-0 translate-y-8'
          )}
        >
          Your spiritual home where faith meets community
        </p>

        {/* CTA Buttons */}
        <div
          className={cn(
            'flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000',
            mounted ? 'opacity-100 translate-y-0 delay-1000' : 'opacity-0 translate-y-8'
          )}
        >
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-islamic-green-600 hover:bg-islamic-green-500 text-white font-medium text-base transition-all shadow-lg shadow-islamic-green-600/30 hover:shadow-xl hover:shadow-islamic-green-600/40 group"
          >
            Explore Our Services
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/prayer-times"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium text-base transition-all border border-white/20 backdrop-blur-sm"
          >
            View Prayer Times
          </Link>
        </div>

        {/* Community Stats */}
        <div
          className={cn(
            'mt-20 md:mt-28 grid grid-cols-3 gap-6 md:gap-12 max-w-2xl mx-auto transition-all duration-1000',
            mounted ? 'opacity-100 translate-y-0 delay-1200' : 'opacity-0 translate-y-8'
          )}
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">5</div>
            <div className="text-sm md:text-base text-white/50 mt-1">Daily Prayers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">2</div>
            <div className="text-sm md:text-base text-white/50 mt-1">Jummah Services</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">1000+</div>
            <div className="text-sm md:text-base text-white/50 mt-1">Community Members</div>
          </div>
        </div>
      </div>

      {/* Floating Glass Morphic Card - Mosque Etiquette (GIC-inspired) */}
      <div
        className={cn(
          'absolute left-4 md:left-8 lg:left-16 bottom-28 md:bottom-36 z-20',
          'hidden md:block',
          'transition-all duration-1000',
          mounted ? 'opacity-100 translate-y-0 delay-1000' : 'opacity-0 translate-y-8'
        )}
      >
        <div className="w-80 lg:w-96 p-7 lg:p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/30 shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-amber-500/30">
              <Moon className="h-6 w-6 text-amber-300" />
            </div>
            <h3 className="font-bold text-xl lg:text-2xl text-white">Mosque Etiquette</h3>
          </div>

          {/* Guidelines List */}
          <ul className="space-y-4 text-base lg:text-lg text-white">
            <li className="flex items-start gap-4">
              <Check className="h-5 w-5 lg:h-6 lg:w-6 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>Remove shoes before entering the prayer hall</span>
            </li>
            <li className="flex items-start gap-4">
              <Check className="h-5 w-5 lg:h-6 lg:w-6 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>Maintain silence during prayer services</span>
            </li>
            <li className="flex items-start gap-4">
              <Check className="h-5 w-5 lg:h-6 lg:w-6 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>Dress modestly and appropriately</span>
            </li>
            <li className="flex items-start gap-4">
              <Check className="h-5 w-5 lg:h-6 lg:w-6 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>Turn off mobile devices during prayers</span>
            </li>
          </ul>

          {/* Jummah Info */}
          <div className="mt-6 pt-5 border-t border-white/20">
            <p className="text-sm text-white/70 uppercase tracking-wider mb-2">Jummah Prayer</p>
            <p className="text-white text-lg lg:text-xl font-semibold">Fridays at 2:00 PM & 2:30 PM</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator">
        <ChevronDown className="h-8 w-8 text-white/40" />
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
