'use client';

import Link from 'next/link';
import { Menu, X, Building, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { MOSQUE_INFO } from '@/constants';
import { navigation } from '@/lib/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
            {navigation.map((item) =>
              item.submenu ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-islamic-green-600 outline-none">
                    {item.name}
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[160px]">
                    {item.submenu.map((subItem) => (
                      <DropdownMenuItem key={subItem.name} asChild>
                        <Link
                          href={subItem.href}
                          className="w-full cursor-pointer"
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
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-islamic-green-600"
                >
                  {item.name}
                </Link>
              )
            )}
            {/* Donate CTA */}
            <Link
              href="/donate"
              className="ml-2 rounded-md bg-islamic-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-islamic-green-500"
            >
              Donate
            </Link>
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
            <nav className="flex flex-col gap-1 pt-4">
              {navigation.map((item) =>
                item.submenu ? (
                  <div key={item.name} className="space-y-1">
                    <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {item.name}
                    </div>
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block rounded-md px-3 py-2 pl-6 text-sm font-medium text-gray-600 transition-colors hover:bg-islamic-green-50 hover:text-islamic-green-600"
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
                    className="block rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-islamic-green-50 hover:text-islamic-green-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              )}
              {/* Mobile Donate CTA */}
              <div className="mt-3 border-t pt-3">
                <Link
                  href="/donate"
                  className="block rounded-md bg-islamic-green-600 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-islamic-green-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Donate
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}