'use client';

import React, { useState } from 'react';
import { X, Settings, Bell, Download, ExternalLink, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export type NotificationType = 'assignment' | 'resource' | 'announcement' | 'enrollment' | 'grade' | 'message';

export interface NotificationAttachment {
  name: string;
  type: string; // 'PDF', 'PPT', 'DOCX', 'Google Form', etc.
  size?: string;
  url?: string;
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  sender: {
    name: string;
    role?: string;
    avatar?: string;
  };
  timestamp: Date;
  isRead: boolean;
  attachment?: NotificationAttachment;
  actionUrl?: string;
}

interface NotificationPanelProps {
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllRead?: () => void;
  onMarkAsRead?: (id: string) => void;
  onNotificationClick?: (notification: NotificationItem) => void;
}

const NOTIFICATION_TABS = [
  { id: 'all', label: 'All Updates' },
  { id: 'assignment', label: 'Assignment' },
  { id: 'resource', label: 'Resources' },
] as const;

type TabId = typeof NOTIFICATION_TABS[number]['id'];

function getFileIcon(type: string): string {
  const icons: Record<string, string> = {
    'PDF': '📄',
    'PPT': '📊',
    'PPTX': '📊',
    'DOC': '📝',
    'DOCX': '📝',
    'XLS': '📈',
    'XLSX': '📈',
    'Google Form': '📋',
    'Video': '🎬',
    'Image': '🖼️',
  };
  return icons[type.toUpperCase()] || '📎';
}

function getFileColor(type: string): string {
  const colors: Record<string, string> = {
    'PDF': 'bg-red-100 text-red-700',
    'PPT': 'bg-orange-100 text-orange-700',
    'PPTX': 'bg-orange-100 text-orange-700',
    'DOC': 'bg-blue-100 text-blue-700',
    'DOCX': 'bg-blue-100 text-blue-700',
    'XLS': 'bg-green-100 text-green-700',
    'XLSX': 'bg-green-100 text-green-700',
    'Google Form': 'bg-purple-100 text-purple-700',
    'Video': 'bg-pink-100 text-pink-700',
    'Image': 'bg-cyan-100 text-cyan-700',
  };
  return colors[type.toUpperCase()] || 'bg-gray-100 text-gray-700';
}

function getActionLabel(type: NotificationType): string {
  const labels: Record<NotificationType, string> = {
    assignment: 'shared',
    resource: 'shared',
    announcement: 'posted',
    enrollment: 'enrolled in',
    grade: 'graded',
    message: 'sent',
  };
  return labels[type];
}

function getActionTypeLabel(type: NotificationType): string {
  const labels: Record<NotificationType, string> = {
    assignment: 'Weekly Assessment',
    resource: 'Course Resource',
    announcement: 'Announcement',
    enrollment: 'New Enrollment',
    grade: 'Grade Update',
    message: 'Message',
  };
  return labels[type];
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) {
    return `On ${date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`;
  }
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function NotificationPanel({
  notifications,
  isOpen,
  onClose,
  onMarkAllRead,
  onMarkAsRead,
  onNotificationClick,
}: NotificationPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('all');

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'assignment') return n.type === 'assignment' || n.type === 'grade';
    if (activeTab === 'resource') return n.type === 'resource';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50",
        "transform transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onMarkAllRead && unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onMarkAllRead}
                className="text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Mark as Read
              </Button>
            )}
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-2 border-b border-gray-100 bg-gray-50">
          {NOTIFICATION_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="overflow-y-auto h-[calc(100%-140px)]">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Bell className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => {
                    onMarkAsRead?.(notification.id);
                    onNotificationClick?.(notification);
                  }}
                  className={cn(
                    "p-4 hover:bg-gray-50 cursor-pointer transition-colors",
                    !notification.isRead && "bg-indigo-50/50"
                  )}
                >
                  {/* Sender Info */}
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={notification.sender.avatar} />
                      <AvatarFallback className="bg-indigo-100 text-indigo-700 text-sm">
                        {getInitials(notification.sender.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-semibold">{notification.sender.name}</span>
                        {notification.sender.role && (
                          <span className="text-gray-500">, {notification.sender.role}</span>
                        )}
                        {' '}
                        <span className="text-gray-500">{getActionLabel(notification.type)}</span>
                        {' '}
                        <span className="font-medium text-indigo-600">{getActionTypeLabel(notification.type)}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2" />
                    )}
                  </div>

                  {/* Attachment Card */}
                  {notification.attachment && (
                    <div className="mt-3 ml-13 flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors">
                      <div className={cn(
                        "p-2 rounded-lg",
                        getFileColor(notification.attachment.type)
                      )}>
                        <span className="text-lg">{getFileIcon(notification.attachment.type)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {notification.attachment.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {notification.attachment.type}
                          {notification.attachment.size && ` · ${notification.attachment.size}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {notification.attachment.url && (
                          <>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Description if no attachment */}
                  {!notification.attachment && notification.description && (
                    <p className="mt-2 ml-13 text-sm text-gray-600 line-clamp-2">
                      {notification.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
            <Button variant="ghost" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
              View More Notifications
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

// Export mock data generator for testing
export function generateMockNotifications(): NotificationItem[] {
  return [
    {
      id: '1',
      type: 'resource',
      title: 'Course Resource',
      description: '',
      sender: {
        name: 'Sheikh Abdullah Al-Faqih',
        role: 'Ph.D',
        avatar: undefined,
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isRead: false,
      attachment: {
        name: 'Fiqh & Taharah 101',
        type: 'PPT',
        size: '11.5Mb',
        url: '#',
      },
    },
    {
      id: '2',
      type: 'assignment',
      title: 'Weekly Assessment',
      description: '',
      sender: {
        name: 'Ustadh Ahmad Hassan',
        role: 'Ph.D',
        avatar: undefined,
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isRead: false,
      attachment: {
        name: 'Weekly Assessment 4',
        type: 'Google Form',
        url: '#',
      },
    },
    {
      id: '3',
      type: 'resource',
      title: 'Student Homework',
      description: '',
      sender: {
        name: 'Sheikh Omar Ibrahim',
        role: 'Ph.D',
        avatar: undefined,
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      isRead: true,
      attachment: {
        name: 'Homework - Arabic Grammar',
        type: 'Docx',
        size: '5.2Mb',
        url: '#',
      },
    },
    {
      id: '4',
      type: 'announcement',
      title: 'Class Schedule Update',
      description: 'Due to the upcoming Eid celebration, all classes will be cancelled from December 20-25. Please review the updated schedule.',
      sender: {
        name: 'Masjid Administration',
        avatar: undefined,
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
      isRead: true,
    },
    {
      id: '5',
      type: 'grade',
      title: 'Grade Posted',
      description: 'Your Hadith Studies midterm exam has been graded. Score: 92/100',
      sender: {
        name: 'Sheikh Abdullah Al-Faqih',
        role: 'Ph.D',
        avatar: undefined,
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96), // 4 days ago
      isRead: true,
    },
  ];
}
