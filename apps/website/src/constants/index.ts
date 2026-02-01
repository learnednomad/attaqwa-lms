export const MOSQUE_INFO = {
  name: 'Masjid At-Taqwa',
  address: '2674 Woodwin Rd',
  city: 'Doraville',
  province: 'GA',
  postalCode: '30360',
  phone: '(678) 896-9257',
  email: 'Mohammad30360@hotmail.com',
  schoolEmail: 'Attaqwa.du@gmail.com',
  website: 'https://masjidattaqwaatlanta.org',
  social: {
    facebook: 'https://www.facebook.com/MasjidAttaqwa2674WoodwinRd',
    youtube: 'https://www.youtube.com/@MasjidAttaqwa2674'
  }
} as const;

export const PRAYER_NAMES = {
  FAJR: 'Fajr',
  SUNRISE: 'Sunrise',
  DHUHR: 'Dhuhr',
  ASR: 'Asr',
  MAGHRIB: 'Maghrib',
  ISHA: 'Isha',
} as const;

export const EVENT_TYPES = {
  EID: 'eid',
  RAMADAN: 'ramadan',
  GRADUATION: 'graduation',
  GENERAL: 'general',
} as const;

export const ANNOUNCEMENT_TYPES = {
  GENERAL: 'general',
  URGENT: 'urgent',
  EVENT: 'event',
  REMINDER: 'reminder',
} as const;

export const DONATION_TYPES = {
  ZAKAT: 'zakat',
  SADAQAH: 'sadaqah',
  GENERAL: 'general',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const API_ENDPOINTS = {
  ANNOUNCEMENTS: '/api/announcements',
  EVENTS: '/api/events',
  CALENDARS: '/api/calendars',
  PRAYER_TIMES: '/api/prayer-times',
  DONATIONS: '/api/donations',
  BLOG: '/api/blog',
  CONTACT: '/api/contact',
  AUTH: '/api/auth',
  USERS: '/api/users',
} as const;

export const EXTERNAL_APIS = {
  ALADHAN: 'https://api.aladhan.com/v1',
  STRIPE: 'https://api.stripe.com/v1',
} as const;

export const CURRENCY = {
  USD: 'USD',
  CAD: 'CAD',
} as const;

export const DATE_FORMATS = {
  DISPLAY: 'MMMM dd, yyyy',
  API: 'yyyy-MM-dd',
  TIME: 'HH:mm',
  DATETIME: 'yyyy-MM-dd HH:mm:ss',
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
} as const;

export const CACHE_KEYS = {
  ANNOUNCEMENTS: 'announcements',
  EVENTS: 'events',
  PRAYER_TIMES: 'prayer-times',
  CALENDARS: 'calendars',
} as const;

export const CACHE_TTL = {
  ANNOUNCEMENTS: 5 * 60 * 1000, // 5 minutes
  EVENTS: 10 * 60 * 1000, // 10 minutes
  PRAYER_TIMES: 60 * 60 * 1000, // 1 hour
  CALENDARS: 24 * 60 * 60 * 1000, // 24 hours
} as const;