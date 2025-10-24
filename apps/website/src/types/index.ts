export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: Date;
  time?: string;
  imageUrl?: string;
  imageAlt?: string;
  isActive: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  isIndoor?: boolean;
  isOutdoor?: boolean;
  prayerTimes?: PrayerTime[];
  zakatInfo?: ZakatInfo;
  imageUrl?: string;
  imageAlt?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrayerTime {
  name: string;
  time: string;
  location?: string;
}

export interface ZakatInfo {
  amount: number;
  currency: string;
  description?: string;
}

export interface Calendar {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  year: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyPrayerTimes {
  date: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  qibla: number;
  // Iqama times (prayer congregation times)
  iqama?: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string; // Usually +5 minutes after Maghrib
    isha: string;
  };
  jummah?: string[]; // Multiple Jummah prayer times
}

export interface Donation {
  id: string;
  amount: number;
  currency: string;
  type: 'zakat' | 'sadaqah' | 'general';
  donorName?: string;
  email?: string;
  isAnonymous: boolean;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: Date;
  isPublished: boolean;
  tags: string[];
  imageUrl?: string;
  imageAlt?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactForm {
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  success: boolean;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  success: false;
}

export type EventType = 'eid' | 'ramadan' | 'graduation' | 'general';
export type AnnouncementType = 'general' | 'urgent' | 'event' | 'reminder';
export type UserRole = 'admin' | 'user';
export type DonationType = 'zakat' | 'sadaqah' | 'general';
export type PaymentStatus = 'pending' | 'completed' | 'failed';

// Enhanced UI Types for Premium Components
export type ComponentVariant = 'default' | 'compact' | 'premium';
export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';
export type AnimationType = 'fade' | 'slide' | 'scale' | 'bounce' | 'none';
export type ThemeMode = 'light' | 'dark' | 'auto';
export type LanguagePreference = 'en' | 'ar' | 'both';

// Prayer Times Enhancement
export interface EnhancedPrayerTime extends PrayerTime {
  icon?: string;
  description?: string;
  descriptionArabic?: string;
  remainingTime?: string;
  isNext?: boolean;
  isPast?: boolean;
}

// UI Preferences
export interface UserPreferences {
  id: string;
  userId: string;
  theme: ThemeMode;
  language: LanguagePreference;
  showArabicText: boolean;
  prayerNotifications: boolean;
  eventReminders: boolean;
  animationsEnabled: boolean;
  fontSize: ComponentSize;
  prayerTimeFormat: '12h' | '24h';
  createdAt: Date;
  updatedAt: Date;
}

// Enhanced Educational Content
export interface EducationProgress {
  id: string;
  userId: string;
  contentId: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  timeSpent: number; // in minutes
  lastAccessed: Date;
  completedAt?: Date;
  quizScores?: number[];
  notes?: string;
}

// Interactive Quiz Types
export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  timeSpent: number; // in seconds
  answers: Array<{
    questionId: string;
    selectedAnswer: number;
    isCorrect: boolean;
    timeTaken: number;
  }>;
  completedAt: Date;
}

// Notification System
export interface NotificationSettings {
  prayerReminders: {
    enabled: boolean;
    minutesBefore: number;
    playSound: boolean;
  };
  eventReminders: {
    enabled: boolean;
    hoursBefore: number;
  };
  educationProgress: {
    enabled: boolean;
    weeklyReports: boolean;
  };
  announcements: {
    enabled: boolean;
    urgentOnly: boolean;
  };
}