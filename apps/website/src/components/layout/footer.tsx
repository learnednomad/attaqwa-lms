'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Youtube, Building } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { MOSQUE_INFO } from '@/constants';
import { useState, useEffect } from 'react';

const quickLinks = [
  { name: 'Prayer Times', href: '/prayer-times' },
  { name: 'Events', href: '/events' },
  { name: 'Donations', href: '/donate' },
  { name: 'Contact Us', href: '/contact' },
];

const resources = [
  { name: 'Islamic Calendar', href: '/calendar' },
  { name: 'Announcements', href: '/announcements' },
  { name: 'About Us', href: '/about' },
  { name: 'Services', href: '/services' },
];

const socialLinks = [
  { name: 'Facebook', href: MOSQUE_INFO.social.facebook, icon: Facebook },
  { name: 'YouTube', href: MOSQUE_INFO.social.youtube, icon: Youtube },
];

export function Footer() {
  const [currentYear, setCurrentYear] = useState<number>(2025); // Default year to prevent hydration mismatch

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t bg-islamic-navy-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Mosque Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-islamic-green-600 p-2">
                <Building className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-islamic-navy-800">
                {MOSQUE_INFO.name}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              A place of worship, community, and learning. Join us for prayers, 
              events, and spiritual growth.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{MOSQUE_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{MOSQUE_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{MOSQUE_INFO.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-islamic-navy-800">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-islamic-green-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-islamic-navy-800">Resources</h3>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-islamic-green-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media & Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-islamic-navy-800">Stay Connected</h3>
            <div className="flex gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="rounded-md bg-white p-2 text-gray-600 transition-colors hover:bg-islamic-green-50 hover:text-islamic-green-600"
                    aria-label={social.name}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-islamic-navy-800">
                Prayer Time Notifications
              </p>
              <p className="text-xs text-gray-600">
                Subscribe to receive daily prayer time reminders and mosque updates.
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-sm text-gray-600">
            © {currentYear} {MOSQUE_INFO.name}. All rights reserved.
          </div>
          <div className="flex gap-4 text-sm text-gray-600">
            <Link href="/privacy" className="hover:text-islamic-green-600">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-islamic-green-600">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}