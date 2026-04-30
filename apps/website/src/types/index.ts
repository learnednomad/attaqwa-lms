export type AnnouncementCategory = 'general' | 'ramadan' | 'eid' | 'urgent' | 'community' | 'fundraising';

export interface Announcement {
  id: string;
  documentId?: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  imageUrl?: string;
  imageAlt?: string;
  pdfUrl?: string;
  isActive: boolean;
  isPinned?: boolean;
  publishDate?: string;
  expiryDate?: string;
  author?: { id: string; username: string };
  createdAt: string;
  updatedAt: string;
}

type EventCategory = 'lecture' | 'community' | 'youth' | 'sisters' | 'fundraiser' | 'other';

export interface Event {
  id: string;
  documentId?: string;
  title: string;
  description: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  isIndoor?: boolean;
  isOutdoor?: boolean;
  imageUrl?: string;
  imageAlt?: string;
  isActive: boolean;
  isRecurring?: boolean;
  recurrencePattern?: string;
  maxAttendees?: number;
  category?: EventCategory;
  createdAt: string;
  updatedAt: string;
}

export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTimeOverride {
  id: string;
  documentId?: string;
  date: string;
  prayer: PrayerName;
  overrideTime: string;
  reason?: string;
  isActive: boolean;
  createdBy?: { id: string; username: string };
  createdAt: string;
  updatedAt: string;
}

type ItikafDurationType = 'full' | 'last_ten' | 'weekend' | 'custom';
export type ItikafStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface ItikafRegistration {
  id: string;
  documentId?: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female';
  age: number;
  durationType: ItikafDurationType;
  startDate: string;
  endDate: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalConditions?: string;
  specialRequirements?: string;
  status: ItikafStatus;
  notes?: string;
  user?: { id: string; username: string };
  createdAt: string;
  updatedAt: string;
}

export type AppealCategory = 'zakat' | 'sadaqah' | 'building_fund' | 'emergency' | 'education' | 'community';

export interface Appeal {
  id: string;
  documentId?: string;
  title: string;
  description: string;
  category: AppealCategory;
  goalAmount?: number;
  currentAmount?: number;
  currency?: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  isFeatured?: boolean;
  imageUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrayerTime {
  name: string;
  time: string;
  location?: string;
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
  tarawih?: string; // Tarawih prayer time (Ramadan only)
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
