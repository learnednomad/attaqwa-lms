'use client';

import Link from 'next/link';
import { Menu, X, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MOSQUE_INFO } from '@/constants';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Education', href: '/education' },
  { name: 'Services', href: '/services' },
  { name: 'Events', href: '/events' },
  { name: 'Announcements', href: '/announcements' },
  { name: 'Calendar', href: '/calendar' },
  { name: 'Prayer Times', href: '/prayer-times' },
  { 
    name: 'Resources', 
    href: '/resources',
    submenu: [
      { name: 'Quran Study', href: '/resources/quran-study' },
      { name: 'Hadith Collections', href: '/resources/hadith-collections' },
      { name: 'Qibla Direction', href: '/resources/qibla-direction' },
      { name: 'Islamic Calendar', href: '/resources/islamic-calendar' },
    ]
  },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Site Name */}
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="rounded-md bg-islamic-green-600 p-2">
              <Building className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-islamic-navy-800">
              {MOSQUE_INFO.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-islamic-green-600"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t bg-white pb-4 md:hidden">
            <nav className="flex flex-col gap-2 pt-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-islamic-green-50 hover:text-islamic-green-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}