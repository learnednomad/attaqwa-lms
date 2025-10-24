/**
 * Structured Data Component for Islamic Content SEO
 * Provides reusable structured data for various page types
 */

import { generateMosqueStructuredData, generatePrayerTimesStructuredData, generateEventStructuredData, generateEducationStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo';

interface StructuredDataProps {
  type: 'mosque' | 'prayerTimes' | 'event' | 'education' | 'breadcrumb';
  data?: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  let structuredData;
  
  switch (type) {
    case 'mosque':
      structuredData = generateMosqueStructuredData();
      break;
    case 'prayerTimes':
      if (!data?.prayerTimes || !data?.date) {
        console.warn('Prayer times structured data requires prayerTimes and date');
        return null;
      }
      structuredData = generatePrayerTimesStructuredData(data.prayerTimes, data.date);
      break;
    case 'event':
      if (!data) {
        console.warn('Event structured data requires event data');
        return null;
      }
      structuredData = generateEventStructuredData(data);
      break;
    case 'education':
      if (!data) {
        console.warn('Education structured data requires content data');
        return null;
      }
      structuredData = generateEducationStructuredData(data);
      break;
    case 'breadcrumb':
      if (!data?.breadcrumbs) {
        console.warn('Breadcrumb structured data requires breadcrumbs array');
        return null;
      }
      structuredData = generateBreadcrumbStructuredData(data.breadcrumbs);
      break;
    default:
      console.warn('Unknown structured data type:', type);
      return null;
  }
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

interface BreadcrumbProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbStructuredData({ items }: BreadcrumbProps) {
  return <StructuredData type="breadcrumb" data={{ breadcrumbs: items }} />;
}

interface PrayerTimesStructuredDataProps {
  prayerTimes: any;
  date: string;
}

export function PrayerTimesStructuredData({ prayerTimes, date }: PrayerTimesStructuredDataProps) {
  return <StructuredData type="prayerTimes" data={{ prayerTimes, date }} />;
}

interface EventStructuredDataProps {
  event: any;
}

export function EventStructuredData({ event }: EventStructuredDataProps) {
  return <StructuredData type="event" data={event} />;
}

interface EducationStructuredDataProps {
  content: any;
}

export function EducationStructuredData({ content }: EducationStructuredDataProps) {
  return <StructuredData type="education" data={content} />;
}

export function MosqueStructuredData() {
  return <StructuredData type="mosque" />;
}

/**
 * Multiple structured data for complex pages
 */
interface MultipleStructuredDataProps {
  items: Array<{
    type: StructuredDataProps['type'];
    data?: any;
  }>;
}

export function MultipleStructuredData({ items }: MultipleStructuredDataProps) {
  return (
    <>
      {items.map((item, index) => (
        <StructuredData key={index} type={item.type} data={item.data} />
      ))}
    </>
  );
}