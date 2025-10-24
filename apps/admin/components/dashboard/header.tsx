/**
 * Dashboard Header Component
 * Top navigation bar with user menu
 */

'use client';

import { Bell, LogOut, Search, User } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { cn } from '@/lib/utils/cn';

export function Header() {
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-10 border-b border-charcoal-200 bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Search Bar */}
        <div className="flex flex-1 items-center">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search courses, students..."
              className="w-full rounded-lg border border-charcoal-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            className="relative rounded-lg p-2 text-charcoal-600 hover:bg-charcoal-50"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 rounded-lg p-2 hover:bg-charcoal-50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden text-left lg:block">
                <p className="text-sm font-medium text-charcoal-900">
                  {user?.username || 'User'}
                </p>
                <p className="text-xs text-charcoal-500">
                  {user?.role?.name || 'Teacher'}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-lg border border-charcoal-200 bg-white shadow-lg">
                  <div className="p-4 border-b border-charcoal-200">
                    <p className="text-sm font-medium text-charcoal-900">
                      {user?.username}
                    </p>
                    <p className="text-xs text-charcoal-500">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        // Navigate to profile
                      }}
                      className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-charcoal-700 hover:bg-charcoal-50"
                    >
                      <User className="mr-3 h-4 w-4" />
                      Profile Settings
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        signOut();
                      }}
                      className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
