/**
 * SEO Configuration and Utilities for Masjid At-Taqwa
 * Comprehensive SEO optimization for Islamic content and local mosque discovery
 */

import type { Metadata } from 'next';
import { MOSQUE_INFO } from '@attaqwa/shared';

// SEO Constants for Islamic Content
export const SEO_KEYWORDS = {
  PRIMARY: [
    'mosque', 'masjid', 'islamic center', 'muslim community',
    'prayer times', 'salah times', 'daily prayers',
    'quran', 'islamic education', 'ramadan', 'eid'
  ],
  PRAYER: [
    'fajr time', 'dhuhr time', 'asr time', 'maghrib time', 'isha time',
    'prayer schedule', 'islamic prayer times', 'salah schedule',
    'qibla direction', 'adhan times'
  ],
  EDUCATION: [
    'islamic studies', 'quran classes', 'arabic lessons',
    'islamic education for children', 'sunday school',
    'tafsir classes', 'hadith study', 'sira lessons'
  ],
  COMMUNITY: [
    'muslim community', 'islamic events', 'eid celebration',
    'ramadan iftar', 'jummah prayers', 'friday prayers',
    'islamic wedding', 'nikah ceremony'
  ],
  LOCAL: [
    'mosque near me', 'local mosque', 'muslim community center',
    'islamic center nearby', 'friday prayers near me'
  ]
} as const;

// Mosque Location Data (to be updated with actual coordinates)
export const MOSQUE_LOCATION = {
  name: MOSQUE_INFO.name,
  address: 'Your Full Address Here', // Update with actual address
  city: 'Your City',
  state: 'Your State', 
  postalCode: 'Your ZIP',
  country: 'United States',
  latitude: 0, // Update with actual coordinates
  longitude: 0, // Update with actual coordinates
  phone: MOSQUE_INFO.phone,
  website: MOSQUE_INFO.website
} as const;

// Islamic Content Categories for SEO
export const ISLAMIC_CONTENT_CATEGORIES = {
  PRAYER: {
    title: 'Prayer Times & Islamic Worship',
    description: 'Daily prayer times, Qibla direction, and Islamic worship guidance',
    keywords: SEO_KEYWORDS.PRAYER
  },
  EDUCATION: {
    title: 'Islamic Education & Learning',
    description: 'Comprehensive Islamic studies, Quran classes, and religious education',
    keywords: SEO_KEYWORDS.EDUCATION
  },
  COMMUNITY: {
    title: 'Muslim Community Events & Services',
    description: 'Islamic events, community gatherings, and mosque services',
    keywords: SEO_KEYWORDS.COMMUNITY
  },
  RAMADAN: {
    title: 'Ramadan Schedule & Activities',
    description: 'Ramadan prayer times, iftar schedule, and special Ramadan programs',
    keywords: ['ramadan schedule', 'iftar times', 'tarawih prayers', 'suhoor times', 'ramadan calendar']
  },
  EID: {
    title: 'Eid Celebrations & Special Events',
    description: 'Eid prayer times, community celebrations, and Islamic holiday events',
    keywords: ['eid prayers', 'eid celebration', 'islamic holidays', 'eid ul fitr', 'eid ul adha']
  }
} as const;

interface SEOPageConfig {
  title: string;
  description: string;
  keywords?: string[];
  category?: keyof typeof ISLAMIC_CONTENT_CATEGORIES;
  canonical?: string;
  images?: string[];
  type?: 'website' | 'article' | 'event' | 'organization';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noindex?: boolean;
}

/**
 * Generate comprehensive metadata for Islamic content pages
 */
export function generateSEOMetadata(config: SEOPageConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    category,
    canonical,
    images = [],
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    noindex = false
  } = config;

  const fullTitle = title.includes(MOSQUE_INFO.name) ? title : `${title} | ${MOSQUE_INFO.name}`;
  
  // Combine page-specific keywords with category and primary keywords
  const allKeywords = [
    ...keywords,
    ...(category ? ISLAMIC_CONTENT_CATEGORIES[category].keywords : []),
    ...SEO_KEYWORDS.PRIMARY
  ];

  const baseUrl = MOSQUE_INFO.website;
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : undefined;
  
  // Default mosque image for social sharing
  const defaultImage = `${baseUrl}/images/mosque-exterior.jpg`;
  const socialImages = images.length > 0 ? images.map(img => `${baseUrl}${img}`) : [defaultImage];

  return {
    title: fullTitle,
    description,
    keywords: [...new Set(allKeywords)].join(', '),
    
    // Canonical URL for SEO
    ...(canonicalUrl && { alternates: { canonical: canonicalUrl } }),
    
    // Author information
    ...(author && { authors: [{ name: author, url: MOSQUE_INFO.website }] }),
    
    // Publication metadata
    ...(publishedTime && { other: { 'article:published_time': publishedTime } }),
    ...(modifiedTime && { other: { 'article:modified_time': modifiedTime } }),
    
    // Robot instructions
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Open Graph metadata
    openGraph: {
      title: fullTitle,
      description,
      type,
      url: canonicalUrl,
      siteName: MOSQUE_INFO.name,
      locale: 'en_US',
      ...(socialImages.length > 0 && {
        images: socialImages.map(url => ({
          url,
          width: 1200,
          height: 630,
          alt: title
        }))
      })
    },

    // Twitter Card metadata
    twitter: {
      card: 'summary_large_image',
      site: '@attaqwamasjid', // Update with actual Twitter handle
      title: fullTitle,
      description,
      ...(socialImages.length > 0 && {
        images: socialImages
      })
    },

    // Additional metadata for Islamic content
    other: {
      'theme-color': '#16a34a', // Islamic green
      'apple-mobile-web-app-title': MOSQUE_INFO.name,
      'application-name': MOSQUE_INFO.name,
      'msapplication-TileColor': '#16a34a',
      'og:locale:alternate': 'ar_SA', // Arabic locale support
      ...config.publishedTime && { 'article:published_time': config.publishedTime },
      ...config.modifiedTime && { 'article:modified_time': config.modifiedTime }
    }
  };
}

/**
 * Generate JSON-LD structured data for the mosque
 */
export function generateMosqueStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'PlaceOfWorship',
    name: MOSQUE_LOCATION.name,
    description: 'Islamic community center providing prayer services, events, and religious education',
    url: MOSQUE_LOCATION.website,
    telephone: MOSQUE_LOCATION.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: MOSQUE_LOCATION.address,
      addressLocality: MOSQUE_LOCATION.city,
      addressRegion: MOSQUE_LOCATION.state,
      postalCode: MOSQUE_LOCATION.postalCode,
      addressCountry: MOSQUE_LOCATION.country
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: MOSQUE_LOCATION.latitude,
      longitude: MOSQUE_LOCATION.longitude
    },
    religion: 'Islam',
    amenityFeature: [
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Prayer Hall',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Parking',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Educational Facilities',
        value: true
      }
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '05:00',
        closes: '22:00'
      }
    ]
  };
}

/**
 * Generate JSON-LD structured data for prayer times
 */
export function generatePrayerTimesStructuredData(prayerTimes: any, date: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Schedule',
    name: `Prayer Times for ${date}`,
    description: `Daily Islamic prayer times for ${MOSQUE_LOCATION.name}`,
    scheduleTimezone: 'America/New_York', // Update with actual timezone
    byDay: [{
      '@type': 'DayOfWeek',
      name: new Date(date).toLocaleDateString('en-US', { weekday: 'long' })
    }],
    event: [
      {
        '@type': 'Event',
        name: 'Fajr Prayer',
        startDate: `${date}T${convertTo24Hour(prayerTimes.fajr)}:00`,
        location: {
          '@type': 'Place',
          name: MOSQUE_LOCATION.name,
          address: MOSQUE_LOCATION.address
        }
      },
      {
        '@type': 'Event', 
        name: 'Dhuhr Prayer',
        startDate: `${date}T${convertTo24Hour(prayerTimes.dhuhr)}:00`,
        location: {
          '@type': 'Place',
          name: MOSQUE_LOCATION.name,
          address: MOSQUE_LOCATION.address
        }
      },
      {
        '@type': 'Event',
        name: 'Asr Prayer',
        startDate: `${date}T${convertTo24Hour(prayerTimes.asr)}:00`,
        location: {
          '@type': 'Place',
          name: MOSQUE_LOCATION.name,
          address: MOSQUE_LOCATION.address
        }
      },
      {
        '@type': 'Event',
        name: 'Maghrib Prayer',
        startDate: `${date}T${convertTo24Hour(prayerTimes.maghrib)}:00`,
        location: {
          '@type': 'Place',
          name: MOSQUE_LOCATION.name,
          address: MOSQUE_LOCATION.address
        }
      },
      {
        '@type': 'Event',
        name: 'Isha Prayer',
        startDate: `${date}T${convertTo24Hour(prayerTimes.isha)}:00`,
        location: {
          '@type': 'Place',
          name: MOSQUE_LOCATION.name,
          address: MOSQUE_LOCATION.address
        }
      }
    ]
  };
}

/**
 * Generate JSON-LD structured data for Islamic events
 */
export function generateEventStructuredData(event: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: `${event.date.toISOString().split('T')[0]}T${convertTo24Hour(event.startTime)}:00`,
    endDate: `${event.date.toISOString().split('T')[0]}T${convertTo24Hour(event.endTime)}:00`,
    location: {
      '@type': 'Place',
      name: event.location || MOSQUE_LOCATION.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: MOSQUE_LOCATION.address,
        addressLocality: MOSQUE_LOCATION.city,
        addressRegion: MOSQUE_LOCATION.state,
        postalCode: MOSQUE_LOCATION.postalCode,
        addressCountry: MOSQUE_LOCATION.country
      }
    },
    organizer: {
      '@type': 'Organization',
      name: MOSQUE_LOCATION.name,
      url: MOSQUE_LOCATION.website
    },
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    isAccessibleForFree: true,
    ...(event.zakatInfo && {
      offers: {
        '@type': 'Offer',
        price: event.zakatInfo.amount,
        priceCurrency: event.zakatInfo.currency || 'USD',
        description: `Zakat: ${event.zakatInfo.description}`
      }
    })
  };
}

/**
 * Generate JSON-LD structured data for educational content
 */
export function generateEducationStructuredData(content: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: content.title,
    description: content.description,
    provider: {
      '@type': 'Organization',
      name: MOSQUE_LOCATION.name,
      url: MOSQUE_LOCATION.website
    },
    courseCode: content.id,
    educationalLevel: content.ageTier,
    inLanguage: ['en', 'ar'],
    about: content.category,
    teaches: content.objectives?.join(', '),
    ...(content.duration && {
      timeRequired: `PT${content.duration}M`
    })
  };
}

// Utility function to convert 12-hour time to 24-hour format
function convertTo24Hour(time12h: string): string {
  // Handle cases where time might not have AM/PM (already in 24h format)
  if (!time12h.includes(' ')) {
    return time12h; // Return as-is if already in 24h format
  }

  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (modifier === 'AM') {
    if (hours === '12') {
      hours = '00'; // 12 AM becomes 00
    }
  } else if (modifier === 'PM') {
    if (hours !== '12') {
      hours = (parseInt(hours, 10) + 12).toString(); // Add 12 for PM (except 12 PM stays 12)
    }
  }
  
  return `${hours.padStart(2, '0')}:${minutes}`;
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: `${MOSQUE_INFO.website}${breadcrumb.url}`
    }))
  };
}