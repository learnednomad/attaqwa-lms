import type { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/lib/providers";
import { MOSQUE_INFO } from "@attaqwa/shared";
import { SEO_KEYWORDS, generateSEOMetadata, generateMosqueStructuredData } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", // Optimize font loading for Core Web Vitals
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap", // Optimize font loading for Core Web Vitals
});

export const metadata: Metadata = generateSEOMetadata({
  title: MOSQUE_INFO.name,
  description: "Masjid At-Taqwa is an Islamic community center providing daily prayer services, Islamic education, community events, and spiritual guidance. Join us for Jummah prayers, Ramadan activities, Eid celebrations, and comprehensive Islamic studies programs.",
  keywords: [
    ...SEO_KEYWORDS.PRIMARY,
    ...SEO_KEYWORDS.LOCAL,
    "jummah prayers",
    "islamic community center",
    "muslim worship",
    "halal events",
    "islamic calendar",
    "quranic studies"
  ],
  type: "website",
  canonical: "/",
  images: ["/images/mosque-hero.jpg"], // Add this image to public folder
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Generate structured data for the mosque
  const mosqueStructuredData = generateMosqueStructuredData();

  return (
    <html lang="en" dir="ltr" className={`${inter.variable} ${amiri.variable}`}>
      <head>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(mosqueStructuredData),
          }}
        />
        
        {/* Additional meta tags for Islamic content */}
        <meta name="theme-color" content="#16a34a" />
        <meta name="apple-mobile-web-app-title" content={MOSQUE_INFO.name} />
        <meta name="application-name" content={MOSQUE_INFO.name} />
        <meta name="msapplication-TileColor" content="#16a34a" />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />
        
        {/* Language alternates for multilingual SEO */}
        <link rel="alternate" hrefLang="en" href={MOSQUE_INFO.website} />
        <link rel="alternate" hrefLang="ar" href={`${MOSQUE_INFO.website}/ar`} />
        <link rel="alternate" hrefLang="x-default" href={MOSQUE_INFO.website} />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://api.aladhan.com" />
        
        {/* DNS prefetch for improved performance */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="min-h-screen bg-background font-inter antialiased">
        <Providers>
          {/* Skip to main content for accessibility and SEO */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-islamic-green-600 focus:px-3 focus:py-2 focus:text-white focus:outline-none"
          >
            Skip to main content
          </a>
          
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main id="main-content" className="flex-1" role="main">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>

        {/* Initialize performance monitoring and Arabic SEO */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize performance monitoring and Arabic SEO
              (function() {
                if (typeof window !== 'undefined' && !window.__perfMonitorInitialized) {
                  window.__perfMonitorInitialized = true;
                  
                  // Simple performance monitoring initialization
                  if ('PerformanceObserver' in window) {
                    try {
                      // Monitor Core Web Vitals
                      const observer = new PerformanceObserver((list) => {
                        list.getEntries().forEach((entry) => {
                          if (entry.entryType === 'largest-contentful-paint') {
                            console.log('LCP:', entry.startTime);
                          }
                        });
                      });
                      observer.observe({ entryTypes: ['largest-contentful-paint'] });
                    } catch (e) {
                      console.warn('Performance monitoring failed:', e);
                    }
                  }
                  
                  // Initialize Arabic text styling
                  const style = document.createElement('style');
                  style.textContent = \`
                    .arabic-text {
                      font-family: 'Amiri', serif;
                      direction: rtl;
                      text-align: right;
                      line-height: 1.8;
                    }
                  \`;
                  document.head.appendChild(style);
                }
              })();
            `
          }}
        />
      </body>
    </html>
  );
}
