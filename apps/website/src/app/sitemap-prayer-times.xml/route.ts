/**
 * Prayer Times Specific Sitemap for Masjid At-Taqwa
 * Optimized for prayer time related SEO
 */

import { MOSQUE_INFO } from '@attaqwa/shared';

export async function GET() {
  const baseURL = MOSQUE_INFO.website;
  const currentDate = new Date().toISOString();
  
  // Generate prayer time pages for the next 30 days
  const prayerTimePages = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    prayerTimePages.push({
      url: `/prayer-times/${dateStr}`,
      priority: 0.8,
      changeFreq: 'daily',
      lastMod: currentDate,
    });
  }
  
  const staticPrayerPages = [
    {
      url: '/prayer-times',
      priority: 0.9,
      changeFreq: 'daily',
      lastMod: currentDate,
    },
    {
      url: '/prayer-times/qibla',
      priority: 0.7,
      changeFreq: 'monthly',
      lastMod: currentDate,
    },
    {
      url: '/prayer-times/calculator',
      priority: 0.6,
      changeFreq: 'monthly',
      lastMod: currentDate,
    },
  ];
  
  const allPages = [...staticPrayerPages, ...prayerTimePages];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map((page) => `  <url>
    <loc>${baseURL}${page.url}</loc>
    <lastmod>${page.lastMod}</lastmod>
    <changefreq>${page.changeFreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=43200', // 12 hours
    },
  });
}