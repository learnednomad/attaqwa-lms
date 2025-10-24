/**
 * Islamic Content Specific Sitemap for Masjid At-Taqwa
 * Optimized for Islamic educational and religious content SEO
 */

import { MOSQUE_INFO } from '@attaqwa/shared';

export async function GET() {
  const baseURL = MOSQUE_INFO.website;
  const currentDate = new Date().toISOString();
  
  // Static Islamic content pages
  const islamicContentPages = [
    // Educational content
    {
      url: '/education',
      priority: 0.8,
      changeFreq: 'weekly',
      lastMod: currentDate,
    },
    {
      url: '/education/browse',
      priority: 0.8,
      changeFreq: 'weekly',
      lastMod: currentDate,
    },
    {
      url: '/education/progress',
      priority: 0.6,
      changeFreq: 'monthly',
      lastMod: currentDate,
    },
    
    // Quran and Islamic studies
    {
      url: '/education/quran',
      priority: 0.9,
      changeFreq: 'weekly',
      lastMod: currentDate,
    },
    {
      url: '/education/hadith',
      priority: 0.8,
      changeFreq: 'weekly',
      lastMod: currentDate,
    },
    {
      url: '/education/sira',
      priority: 0.8,
      changeFreq: 'weekly',
      lastMod: currentDate,
    },
    {
      url: '/education/fiqh',
      priority: 0.8,
      changeFreq: 'weekly',
      lastMod: currentDate,
    },
    {
      url: '/education/tafsir',
      priority: 0.8,
      changeFreq: 'weekly',
      lastMod: currentDate,
    },
    
    // Islamic calendar and resources
    {
      url: '/calendar',
      priority: 0.7,
      changeFreq: 'weekly',
      lastMod: currentDate,
    },
    {
      url: '/calendar/hijri',
      priority: 0.7,
      changeFreq: 'monthly',
      lastMod: currentDate,
    },
    {
      url: '/calendar/ramadan',
      priority: 0.8,
      changeFreq: 'yearly',
      lastMod: currentDate,
    },
    
    // Community and worship
    {
      url: '/services',
      priority: 0.7,
      changeFreq: 'monthly',
      lastMod: currentDate,
    },
    {
      url: '/services/jummah',
      priority: 0.8,
      changeFreq: 'weekly',
      lastMod: currentDate,
    },
    {
      url: '/services/nikah',
      priority: 0.6,
      changeFreq: 'monthly',
      lastMod: currentDate,
    },
    {
      url: '/services/janazah',
      priority: 0.6,
      changeFreq: 'monthly',
      lastMod: currentDate,
    },
    
    // Donation and Zakat
    {
      url: '/donate',
      priority: 0.7,
      changeFreq: 'monthly',
      lastMod: currentDate,
    },
    {
      url: '/donate/zakat',
      priority: 0.8,
      changeFreq: 'monthly',
      lastMod: currentDate,
    },
    {
      url: '/donate/sadaqah',
      priority: 0.7,
      changeFreq: 'monthly',
      lastMod: currentDate,
    },
    {
      url: '/donate/calculator',
      priority: 0.6,
      changeFreq: 'yearly',
      lastMod: currentDate,
    },
  ];
  
  // TODO: In production, add dynamic Islamic content
  // Age-tier specific content
  const ageTiers = ['primary', 'intermediate', 'higher'];
  const islamicSubjects = ['quran', 'hadith', 'sira', 'fiqh', 'tafsir', 'character-building'];
  
  ageTiers.forEach(tier => {
    islamicSubjects.forEach(subject => {
      islamicContentPages.push({
        url: `/education/${tier}/${subject}`,
        priority: 0.7,
        changeFreq: 'weekly',
        lastMod: currentDate,
      });
    });
  });
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${islamicContentPages
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
      'Cache-Control': 'public, max-age=86400', // 24 hours
    },
  });
}