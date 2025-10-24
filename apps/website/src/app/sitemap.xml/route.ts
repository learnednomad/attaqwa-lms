/**
 * Dynamic XML Sitemap Generation for Masjid At-Taqwa
 * Optimized for Islamic content and local mosque SEO
 */

import { MOSQUE_INFO } from '@attaqwa/shared';

// Static pages with Islamic content priorities
const staticPages = [
  {
    url: '/',
    priority: 1.0,
    changeFreq: 'daily',
    lastMod: new Date().toISOString(),
  },
  {
    url: '/prayer-times',
    priority: 0.9,
    changeFreq: 'daily',
    lastMod: new Date().toISOString(),
  },
  {
    url: '/events',
    priority: 0.8,
    changeFreq: 'weekly',
    lastMod: new Date().toISOString(),
  },
  {
    url: '/education',
    priority: 0.8,
    changeFreq: 'weekly',
    lastMod: new Date().toISOString(),
  },
  {
    url: '/about',
    priority: 0.7,
    changeFreq: 'monthly',
    lastMod: new Date().toISOString(),
  },
  {
    url: '/donate',
    priority: 0.7,
    changeFreq: 'monthly',
    lastMod: new Date().toISOString(),
  },
  {
    url: '/services',
    priority: 0.7,
    changeFreq: 'monthly',
    lastMod: new Date().toISOString(),
  },
  {
    url: '/contact',
    priority: 0.6,
    changeFreq: 'monthly',
    lastMod: new Date().toISOString(),
  },
  // Educational content pages
  {
    url: '/education/browse',
    priority: 0.8,
    changeFreq: 'weekly',
    lastMod: new Date().toISOString(),
  },
  {
    url: '/education/progress',
    priority: 0.6,
    changeFreq: 'monthly',
    lastMod: new Date().toISOString(),
  },
  // Privacy and legal pages
  {
    url: '/privacy',
    priority: 0.3,
    changeFreq: 'yearly',
    lastMod: new Date().toISOString(),
  },
  {
    url: '/terms',
    priority: 0.3,
    changeFreq: 'yearly',
    lastMod: new Date().toISOString(),
  },
];

// TODO: In production, fetch these from your API
async function getDynamicPages() {
  // Example of how you would fetch dynamic content
  // const announcements = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/announcements`);
  // const events = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`);
  // const educationContent = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/education`);
  
  return {
    announcements: [], // Replace with actual data
    events: [], // Replace with actual data
    educationContent: [], // Replace with actual data
  };
}

function generateSitemapXML(pages: Array<{
  url: string;
  priority: number;
  changeFreq: string;
  lastMod: string;
}>) {
  const baseURL = MOSQUE_INFO.website;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map((page) => `  <url>
    <loc>${baseURL}${page.url}</loc>
    <lastmod>${page.lastMod}</lastmod>
    <changefreq>${page.changeFreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
  .join('\n')}
</urlset>`;
}

export async function GET() {
  try {
    // Get dynamic content (in production, this would fetch from your API)
    const { announcements, events, educationContent } = await getDynamicPages();
    
    // Combine static and dynamic pages
    let allPages = [...staticPages];
    
    // Add dynamic announcement pages
    announcements.forEach((announcement: any) => {
      allPages.push({
        url: `/announcements/${announcement.id}`,
        priority: 0.6,
        changeFreq: 'monthly',
        lastMod: announcement.updatedAt || announcement.createdAt,
      });
    });
    
    // Add dynamic event pages
    events.forEach((event: any) => {
      allPages.push({
        url: `/events/${event.id}`,
        priority: 0.7,
        changeFreq: 'weekly',
        lastMod: event.updatedAt || event.createdAt,
      });
    });
    
    // Add dynamic educational content
    educationContent.forEach((content: any) => {
      allPages.push({
        url: `/education/content/${content.id}`,
        priority: 0.8,
        changeFreq: 'weekly',
        lastMod: content.updatedAt || content.createdAt,
      });
    });
    
    // Generate XML sitemap
    const sitemap = generateSitemapXML(allPages);
    
    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}