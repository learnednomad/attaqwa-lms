'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Building, Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOSQUE_INFO } from '@/constants';
import { navigation } from '@/lib/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function FloatingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [hijriDate, setHijriDate] = useState({ en: '', ar: '' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      );
      try {
        const en = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
          day: 'numeric', month: 'long', year: 'numeric',
        }).format(now);
        const ar = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
          day: 'numeric', month: 'long', year: 'numeric',
        }).format(now);
        setHijriDate({ en, ar });
      } catch {
        // Fallback for browsers without islamic-umalqura support
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);

    // Handle scroll for nav background and hide/show
    const SCROLL_THRESHOLD = 10; // Minimum scroll delta to trigger
    const TOP_THRESHOLD = 100; // Always show nav when within this distance from top

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Update background opacity
      setScrolled(currentScrollY > 50);

      // Track when scrolled past the hero (75vh)
      const heroHeight = window.innerHeight * 0.75;
      setPastHero(currentScrollY > heroHeight);

      // Always show nav when near top of page
      if (currentScrollY < TOP_THRESHOLD) {
        setNavHidden(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Determine scroll direction with threshold
      const scrollDelta = currentScrollY - lastScrollY.current;

      if (scrollDelta > SCROLL_THRESHOLD) {
        // Scrolling down - hide nav
        setNavHidden(true);
        lastScrollY.current = currentScrollY;
      } else if (scrollDelta < -SCROLL_THRESHOLD) {
        // Scrolling up - show nav
        setNavHidden(false);
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Top Bar - Logo Left, Time Right - Always visible */}
      <div className={cn(
        'fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 transition-colors duration-300',
        pastHero && 'bg-white/95 backdrop-blur-md shadow-sm'
      )}>
        <div className="flex items-center justify-between">
          {/* Logo - Top Left */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className={cn(
              'p-2 rounded-lg transition-colors',
              pastHero
                ? 'bg-islamic-green-600/10 border border-islamic-green-600/20 group-hover:bg-islamic-green-600/15'
                : 'bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-white/15'
            )}>
              <Building className={cn('h-5 w-5 transition-colors', pastHero ? 'text-islamic-green-700' : 'text-white')} />
            </div>
            <span className={cn(
              'font-semibold text-lg hidden sm:block transition-colors',
              pastHero ? 'text-gray-900' : 'text-white'
            )}>
              {MOSQUE_INFO.name}
            </span>
          </Link>
        </div>
      </div>

      {/* Date Widget - Aligned with navbar top */}
      <div className={cn(
        'fixed top-16 md:top-20 right-4 md:right-8 z-50',
        'hidden xl:flex flex-col items-end gap-0.5 md:gap-1 px-2 sm:px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-colors whitespace-nowrap',
        pastHero
          ? 'bg-gray-100'
          : 'bg-white/10 backdrop-blur-md'
      )}>
        {/* Row 1: Gregorian date */}
        <div className={cn('flex items-center gap-2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold transition-colors', pastHero ? 'text-gray-800' : 'text-white')}>
          <span>{currentDate}</span>
        </div>
        {/* Row 2: Islamic date */}
        {hijriDate.en && (
          <div className={cn('flex items-center gap-2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold transition-colors', pastHero ? 'text-gray-700' : 'text-white/90')}>
            <span>{hijriDate.en}</span>
            {hijriDate.ar && (
              <>
                <span className={pastHero ? 'text-gray-400' : 'text-white/40'}>|</span>
                <span dir="rtl">{hijriDate.ar}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Centered Navigation - Hides on scroll down, shows on scroll up */}
      <header
        className={cn(
          'fixed top-16 md:top-20 left-1/2 -translate-x-1/2 z-50',
          'transition-[opacity,transform] duration-300 ease-out',
          navHidden
            ? 'opacity-0 -translate-y-full pointer-events-none'
            : 'opacity-100 translate-y-0'
        )}
      >
        <nav
          className={cn(
            'flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors duration-300',
            pastHero
              ? 'bg-white/95 backdrop-blur-md border border-gray-200 shadow-lg shadow-black/5'
              : 'bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/10',
            scrolled && !pastHero && 'bg-white/15 shadow-xl'
          )}
        >
          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center">
            {navigation.map((item) =>
              item.submenu ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger className={cn(
                    'flex items-center gap-1 px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors outline-none whitespace-nowrap',
                    pastHero
                      ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  )}>
                    {item.name}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    className={cn(
                      'min-w-[160px] rounded-lg',
                      pastHero
                        ? 'bg-white border border-gray-200 shadow-lg'
                        : 'bg-white/10 backdrop-blur-sm border border-white/20'
                    )}
                  >
                    {item.submenu.map((subItem) => (
                      <DropdownMenuItem key={subItem.name} asChild>
                        <Link
                          href={subItem.href}
                          className={cn(
                            'w-full cursor-pointer rounded-lg',
                            pastHero
                              ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                              : 'text-white/90 hover:text-white hover:bg-white/10'
                          )}
                        >
                          {subItem.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.name}
                  href={item.href!}
                  className={cn(
                    'px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                    pastHero
                      ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  )}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* CTA Button - Get Involved */}
          <Link
            href="/donate"
            className="hidden md:flex items-center gap-1.5 ml-1 px-3 lg:px-4 py-2 rounded-lg bg-islamic-green-600 hover:bg-islamic-green-500 text-white text-sm font-medium transition-colors shadow-lg shadow-islamic-green-600/25 whitespace-nowrap"
          >
            Get Involved
            <ChevronDown className="h-3.5 w-3.5 rotate-[-90deg]" />
          </Link>

        </nav>
      </header>

      {/* Mobile Menu Button - Fixed top right on tablet/mobile */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={cn(
          'fixed top-4 right-4 md:right-8 z-50 lg:hidden p-2.5 rounded-lg transition-colors',
          pastHero
            ? 'bg-white/95 backdrop-blur-md shadow-sm hover:bg-gray-100'
            : 'bg-white/10 backdrop-blur-md hover:bg-white/15'
        )}
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMenuOpen ? (
          <X className={cn('h-5 w-5', pastHero ? 'text-gray-700' : 'text-white')} />
        ) : (
          <Menu className={cn('h-5 w-5', pastHero ? 'text-gray-700' : 'text-white')} />
        )}
      </button>

      {/* Mobile Navigation Menu - Drops from top right */}
      {isMenuOpen && (
        <div className={cn(
          'fixed top-16 right-4 md:right-8 z-50 lg:hidden w-64 rounded-lg py-3 px-2 shadow-xl',
          pastHero
            ? 'bg-white border border-gray-200'
            : 'bg-white/10 backdrop-blur-sm border border-white/20'
        )}>
            <nav className="flex flex-col gap-0.5">
              {navigation.map((item) =>
                item.submenu ? (
                  <div key={item.name} className="space-y-0.5">
                    <div className={cn(
                      'px-3 py-2 text-xs font-semibold uppercase tracking-wider',
                      pastHero ? 'text-gray-400' : 'text-white/40'
                    )}>
                      {item.name}
                    </div>
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          'block rounded-lg px-3 py-2.5 pl-5 text-sm font-medium transition-colors',
                          pastHero
                            ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href!}
                    className={cn(
                      'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      pastHero
                        ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </nav>

            {/* Mobile CTA */}
            <div className={cn(
              'mt-3 pt-3 px-2',
              pastHero ? 'border-t border-gray-200' : 'border-t border-white/10'
            )}>
              <Link
                href="/donate"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-islamic-green-600 hover:bg-islamic-green-500 text-white text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Involved
              </Link>
            </div>
        </div>
      )}
    </>
  );
}
