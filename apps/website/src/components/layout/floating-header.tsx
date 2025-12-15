'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Building, Clock, Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOSQUE_INFO } from '@/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type NavItem = {
  name: string;
  href?: string;
  submenu?: { name: string; href: string }[];
};

const navigation: NavItem[] = [
  { name: 'Home', href: '/' },
  {
    name: 'Education',
    submenu: [
      { name: 'Programs', href: '/education' },
      { name: 'Student Portal', href: '/student/dashboard' },
      { name: 'Teacher Portal', href: '/teacher/dashboard' },
      { name: 'Quran Study', href: '/resources/quran-study' },
    ],
  },
  { name: 'Services', href: '/services' },
  {
    name: 'Community',
    submenu: [
      { name: 'Events', href: '/events' },
      { name: 'Announcements', href: '/announcements' },
      { name: 'Calendar', href: '/calendar' },
    ],
  },
  { name: 'Prayer Times', href: '/prayer-times' },
];

export function FloatingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);
  const location = 'Doraville, GA';

  useEffect(() => {
    // Update time every second for live feel
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Handle scroll for nav background and hide/show
    const SCROLL_THRESHOLD = 10; // Minimum scroll delta to trigger
    const TOP_THRESHOLD = 100; // Always show nav when within this distance from top

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Update background opacity
      setScrolled(currentScrollY > 50);

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
      <div className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Top Left */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-white/15 transition-colors">
              <Building className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-semibold text-lg hidden sm:block">
              {MOSQUE_INFO.name}
            </span>
          </Link>

          {/* Time/Location Widget - Top Right */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
            <Clock className="h-4 w-4 text-white/70" />
            <span className="text-white font-medium text-sm">{currentTime}</span>
            <span className="text-white/60 text-sm hidden sm:inline">{location}</span>
          </div>
        </div>
      </div>

      {/* Centered Navigation - Hides on scroll down, shows on scroll up */}
      <header
        className={cn(
          'fixed top-16 md:top-20 left-1/2 -translate-x-1/2 z-50',
          'transition-all duration-300 ease-out',
          navHidden
            ? 'opacity-0 -translate-y-full pointer-events-none'
            : 'opacity-100 translate-y-0'
        )}
      >
        <nav
          className={cn(
            'flex items-center gap-1 px-2 py-1.5 rounded-lg',
            'bg-white/10 backdrop-blur-sm border border-white/20',
            'shadow-lg shadow-black/10',
            scrolled && 'bg-white/15 shadow-xl'
          )}
        >
          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center">
            {navigation.map((item) =>
              item.submenu ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 text-sm font-medium transition-all outline-none">
                    {item.name}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    className="min-w-[160px] bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg"
                  >
                    {item.submenu.map((subItem) => (
                      <DropdownMenuItem key={subItem.name} asChild>
                        <Link
                          href={subItem.href}
                          className="w-full cursor-pointer text-white/90 hover:text-white hover:bg-white/10 rounded-lg"
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
                  className="px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* CTA Button - Get Involved */}
          <Link
            href="/donate"
            className="hidden md:flex items-center gap-1.5 ml-1 px-4 py-2 rounded-lg bg-islamic-green-600 hover:bg-islamic-green-500 text-white text-sm font-medium transition-colors shadow-lg shadow-islamic-green-600/25"
          >
            Get Involved
            <ChevronDown className="h-3.5 w-3.5 rotate-[-90deg]" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 text-white" />
            ) : (
              <Menu className="h-5 w-5 text-white" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg py-3 px-2 shadow-xl">
            <nav className="flex flex-col gap-0.5">
              {navigation.map((item) =>
                item.submenu ? (
                  <div key={item.name} className="space-y-0.5">
                    <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                      {item.name}
                    </div>
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block rounded-lg px-3 py-2.5 pl-5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
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
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </nav>

            {/* Mobile CTA */}
            <div className="mt-3 pt-3 border-t border-white/10 px-2">
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
      </header>
    </>
  );
}
