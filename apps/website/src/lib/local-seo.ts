/**
 * Local SEO Optimization for Masjid At-Taqwa
 * Comprehensive local search optimization for mosque discovery
 */

import { MOSQUE_INFO } from '@attaqwa/shared';

// Local SEO configuration for the mosque
export const LOCAL_SEO_CONFIG = {
  // Business information
  business: {
    name: MOSQUE_INFO.name,
    alternateName: 'At-Taqwa Islamic Center',
    description: 'Islamic community center and mosque providing daily prayers, religious education, community events, and spiritual guidance for Muslims in the local area.',
    
    // Update with actual coordinates
    coordinates: {
      latitude: 0, // Replace with actual latitude
      longitude: 0, // Replace with actual longitude
    },
    
    // Update with actual address
    address: {
      streetAddress: 'Your Street Address',
      addressLocality: 'Your City',
      addressRegion: 'Your State',
      postalCode: 'Your ZIP Code',
      addressCountry: 'US'
    },
    
    // Contact information
    contact: {
      telephone: MOSQUE_INFO.phone,
      email: MOSQUE_INFO.email,
      website: MOSQUE_INFO.website
    },
    
    // Operating hours
    openingHours: [
      'Monday 05:00-22:00',
      'Tuesday 05:00-22:00', 
      'Wednesday 05:00-22:00',
      'Thursday 05:00-22:00',
      'Friday 05:00-22:00',
      'Saturday 05:00-22:00',
      'Sunday 05:00-22:00'
    ],
    
    // Special Friday hours for Jummah
    specialOpeningHours: {
      friday: {
        opens: '11:30',
        closes: '14:00',
        description: 'Extended hours for Jummah (Friday) prayers'
      }
    }
  },
  
  // Services provided by the mosque
  services: [
    {
      name: 'Daily Prayers',
      description: 'Five daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) performed in congregation',
      serviceType: 'Religious Service',
      availability: 'Daily'
    },
    {
      name: 'Friday (Jummah) Prayer',
      description: 'Weekly congregational prayer with sermon every Friday',
      serviceType: 'Religious Service',
      availability: 'Friday'
    },
    {
      name: 'Islamic Education',
      description: 'Comprehensive Islamic studies program including Quran, Hadith, and Islamic history',
      serviceType: 'Educational Service',
      availability: 'Weekly'
    },
    {
      name: 'Wedding (Nikah) Ceremonies',
      description: 'Islamic wedding ceremonies and marriage counseling',
      serviceType: 'Religious Ceremony',
      availability: 'By appointment'
    },
    {
      name: 'Funeral (Janazah) Services',
      description: 'Islamic funeral services and burial arrangements',
      serviceType: 'Religious Ceremony',
      availability: 'As needed'
    },
    {
      name: 'Community Events',
      description: 'Eid celebrations, Ramadan activities, and community gatherings',
      serviceType: 'Community Service',
      availability: 'Regular'
    }
  ],
  
  // Local SEO keywords by intent
  localKeywords: {
    // "Near me" searches
    proximity: [
      'mosque near me',
      'masjid near me',
      'islamic center near me',
      'muslim community center near me',
      'friday prayers near me',
      'islamic prayers nearby',
      'local mosque',
      'neighborhood mosque'
    ],
    
    // Service-based searches
    services: [
      'friday prayer service',
      'daily prayer times',
      'islamic wedding ceremony',
      'muslim funeral service',
      'quran classes',
      'islamic education',
      'ramadan iftar',
      'eid celebration'
    ],
    
    // Community-based searches
    community: [
      'muslim community',
      'islamic community center',
      'muslim congregation',
      'islamic fellowship',
      'muslim family services',
      'halal community'
    ]
  }
} as const;

/**
 * Generate comprehensive local business structured data
 */
export function generateLocalBusinessStructuredData() {
  const { business, services } = LOCAL_SEO_CONFIG;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Mosque',
    '@id': `${business.contact.website}#mosque`,
    name: business.name,
    alternateName: business.alternateName,
    description: business.description,
    url: business.contact.website,
    
    // Contact information
    telephone: business.contact.telephone,
    email: business.contact.email,
    
    // Address
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.streetAddress,
      addressLocality: business.address.addressLocality,
      addressRegion: business.address.addressRegion,
      postalCode: business.address.postalCode,
      addressCountry: business.address.addressCountry
    },
    
    // Geographic coordinates
    geo: {
      '@type': 'GeoCoordinates',
      latitude: business.coordinates.latitude,
      longitude: business.coordinates.longitude
    },
    
    // Operating hours
    openingHoursSpecification: business.openingHours.map(hours => {
      const [day, timeRange] = hours.split(' ');
      const [opens, closes] = timeRange.split('-');
      
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${day}`,
        opens,
        closes
      };
    }),
    
    // Special services and amenities
    amenityFeature: [
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Prayer Hall',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification', 
        name: 'Parking Available',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Wheelchair Accessible',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Educational Facilities',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Separate Prayer Areas',
        value: true
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Community Hall',
        value: true
      }
    ],
    
    // Religion specification
    religion: 'Islam',
    
    // Services offered
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Islamic Services',
      itemListElement: services.map((service, index) => ({
        '@type': 'Offer',
        position: index + 1,
        name: service.name,
        description: service.description,
        category: service.serviceType,
        availability: `https://schema.org/${service.availability === 'Daily' ? 'InStock' : 'PreOrder'}`
      }))
    },
    
    // Social media and online presence
    sameAs: [
      // Add actual social media URLs
      // 'https://www.facebook.com/attaqwamasjid',
      // 'https://www.instagram.com/attaqwamasjid',
      // 'https://www.youtube.com/channel/attaqwamasjid'
    ],
    
    // Business type indicators
    additionalType: [
      'https://schema.org/ReligiousOrganization',
      'https://schema.org/EducationalOrganization',
      'https://schema.org/CommunityCenter'
    ]
  };
}

/**
 * Generate Google My Business optimization content
 */
export function generateGoogleMyBusinessContent() {
  const { business, services } = LOCAL_SEO_CONFIG;
  
  return {
    // Primary business description for GMB
    description: `${business.name} is a welcoming Islamic community center serving the local Muslim community. We offer daily prayers, Friday Jummah services, Islamic education programs, and community events. Join us for spiritual growth, religious learning, and community connection in a family-friendly environment.`,
    
    // Services list for GMB
    services: services.map(service => ({
      name: service.name,
      description: service.description
    })),
    
    // Attributes for GMB
    attributes: [
      { name: 'Wheelchair accessible', value: true },
      { name: 'Parking available', value: true },
      { name: 'Family friendly', value: true },
      { name: 'Free Wi-Fi', value: true },
      { name: 'Air conditioning', value: true },
      { name: 'Restrooms', value: true },
      { name: 'Prayer rugs provided', value: true },
      { name: 'Separate prayer areas', value: true },
      { name: 'Educational programs', value: true },
      { name: 'Community events', value: true }
    ],
    
    // Categories for GMB
    categories: {
      primary: 'Mosque',
      additional: [
        'Religious organization',
        'Community center', 
        'Educational institution',
        'Event venue',
        'Place of worship'
      ]
    },
    
    // Popular times (estimated - replace with actual data)
    popularTimes: {
      friday: {
        peak: '12:00-14:00',
        description: 'Busiest during Jummah prayer'
      },
      daily: {
        fajr: '05:00-06:00',
        dhuhr: '12:30-13:30', 
        asr: '16:30-17:30',
        maghrib: '18:00-19:00',
        isha: '20:00-21:00'
      }
    }
  };
}

/**
 * Generate local citations and NAP (Name, Address, Phone) data
 */
export function generateNAPCitations() {
  const { business } = LOCAL_SEO_CONFIG;
  
  return {
    // Standard NAP format
    nap: {
      name: business.name,
      address: `${business.address.streetAddress}, ${business.address.addressLocality}, ${business.address.addressRegion} ${business.address.postalCode}`,
      phone: business.contact.telephone
    },
    
    // Formatted for different citation sources
    citations: {
      // Yellow Pages format
      yellowPages: {
        businessName: business.name,
        street: business.address.streetAddress,
        city: business.address.addressLocality,
        state: business.address.addressRegion,
        zip: business.address.postalCode,
        phone: business.contact.telephone,
        website: business.contact.website,
        category: 'Religious Organizations'
      },
      
      // Yelp format
      yelp: {
        name: business.name,
        address: business.address,
        phone: business.contact.telephone,
        website: business.contact.website,
        categories: ['Religious Organizations', 'Community Service/Non-Profit'],
        description: business.description
      },
      
      // Facebook format
      facebook: {
        name: business.name,
        about: business.description,
        address: business.address,
        phone: business.contact.telephone,
        website: business.contact.website,
        category: 'Religious Organization',
        hours: business.openingHours
      }
    }
  };
}

/**
 * Generate local SEO meta tags
 */
export function generateLocalSEOMetaTags(pageType: 'home' | 'about' | 'services' | 'contact' = 'home') {
  const { business, localKeywords } = LOCAL_SEO_CONFIG;
  
  const baseTitle = business.name;
  const location = `${business.address.addressLocality}, ${business.address.addressRegion}`;
  
  const titleTemplates = {
    home: `${baseTitle} - Islamic Center & Mosque in ${location}`,
    about: `About ${baseTitle} - Local Mosque & Islamic Community Center`,
    services: `Services - ${baseTitle} | Prayer Times, Education & Community Events`,
    contact: `Contact ${baseTitle} - Mosque Location & Hours in ${location}`
  };
  
  const descriptionTemplates = {
    home: `Visit ${baseTitle}, a welcoming Islamic center in ${location}. Join us for daily prayers, Friday Jummah, Islamic education, and community events. Everyone welcome.`,
    about: `Learn about ${baseTitle}, your local Islamic community center serving Muslims in ${location} with prayer services, religious education, and community programs.`,
    services: `${baseTitle} offers daily prayers, Friday Jummah, Islamic education, wedding ceremonies, and community events. Serving the Muslim community in ${location}.`,
    contact: `Find ${baseTitle} location, prayer times, and contact information. Located in ${location}, we welcome the Muslim community for prayers and events.`
  };
  
  return {
    title: titleTemplates[pageType],
    description: descriptionTemplates[pageType],
    keywords: [
      ...localKeywords.proximity,
      ...localKeywords.services,
      ...localKeywords.community,
      `mosque ${business.address.addressLocality}`,
      `islamic center ${business.address.addressLocality}`,
      `muslim community ${business.address.addressLocality}`
    ],
    
    // Geographic targeting
    geo: {
      region: `${business.address.addressRegion}, ${business.address.addressCountry}`,
      placename: business.address.addressLocality,
      position: `${business.coordinates.latitude};${business.coordinates.longitude}`
    },
    
    // Local business schema
    organization: {
      name: business.name,
      address: business.address,
      telephone: business.contact.telephone,
      url: business.contact.website
    }
  };
}