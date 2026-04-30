export const MOSQUE_INFO = {
  name: 'Masjid At-Taqwa',
  address: '2674 Woodwin Rd',
  city: 'Doraville',
  province: 'GA',
  postalCode: '30360',
  phone: '(678) 896-9257',
  adminPhone: '(678) 896-9257',
  educationPhoneBrothers: '(470) 731-1314',
  educationPhoneSisters: '(404) 936-7123',
  primaryEmail: 'almaad2674@gmail.com',
  email: 'almaad2674@gmail.com',
  imamEmail: 'Mohammad30360@hotmail.com',
  schoolEmail: 'Attaqwa.du@gmail.com',
  website: 'https://masjidattaqwaatlanta.org',
  social: {
    facebook: 'https://www.facebook.com/MasjidAttaqwa2674WoodwinRd',
    youtube: 'https://www.youtube.com/@MasjidAttaqwa2674',
    whatsappGroup: 'https://chat.whatsapp.com/GFJOW74TEmTGf41kv7AecY?mode=gi_t',
    whatsappChannel: 'https://whatsapp.com/channel/0029Vb7ZLYiFXUujmdTtii3M'
  }
} as const;

export const JANAZA_PARTNER = {
  name: 'Janazah Services of Georgia',
  phone: '(678) 915-1881',
  email: 'info@janazaga.com'
} as const;

const PRAYER_NAMES = {
  FAJR: 'Fajr',
  SUNRISE: 'Sunrise',
  DHUHR: 'Dhuhr',
  ASR: 'Asr',
  MAGHRIB: 'Maghrib',
  ISHA: 'Isha',
} as const;

const EVENT_TYPES = {
  EID: 'eid',
  RAMADAN: 'ramadan',
  GRADUATION: 'graduation',
  GENERAL: 'general',
} as const;

const ANNOUNCEMENT_TYPES = {
  GENERAL: 'general',
  URGENT: 'urgent',
  EVENT: 'event',
  REMINDER: 'reminder',
} as const;

const DONATION_TYPES = {
  ZAKAT: 'zakat',
  SADAQAH: 'sadaqah',
  GENERAL: 'general',
} as const;

const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

const API_ENDPOINTS = {
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

const EXTERNAL_APIS = {
  ALADHAN: 'https://api.aladhan.com/v1',
  STRIPE: 'https://api.stripe.com/v1',
} as const;

const CURRENCY = {
  USD: 'USD',
  CAD: 'CAD',
} as const;

const DATE_FORMATS = {
  DISPLAY: 'MMMM dd, yyyy',
  API: 'yyyy-MM-dd',
  TIME: 'HH:mm',
  DATETIME: 'yyyy-MM-dd HH:mm:ss',
} as const;

const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
} as const;

const CACHE_KEYS = {
  ANNOUNCEMENTS: 'announcements',
  EVENTS: 'events',
  PRAYER_TIMES: 'prayer-times',
  CALENDARS: 'calendars',
} as const;

const CACHE_TTL = {
  ANNOUNCEMENTS: 5 * 60 * 1000, // 5 minutes
  EVENTS: 10 * 60 * 1000, // 10 minutes
  PRAYER_TIMES: 60 * 60 * 1000, // 1 hour
  CALENDARS: 24 * 60 * 60 * 1000, // 24 hours
} as const;