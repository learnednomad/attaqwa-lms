/**
 * Next.js 16 Configuration with Security Headers
 *
 * NEXT.JS 16 NOTES:
 * - Turbopack is now the default bundler in Next.js 16
 * - This project uses custom webpack splitChunks config, so we use --webpack flag
 * - To migrate to Turbopack, remove the webpack config and use the turbopack key
 * - See: https://nextjs.org/docs/app/guides/upgrading/version-16
 *
 * SECURITY HEADERS:
 * - Content-Security-Policy (CSP): Prevents XSS attacks
 * - Strict-Transport-Security (HSTS): Forces HTTPS
 * - X-Frame-Options: Prevents clickjacking
 * - X-Content-Type-Options: Prevents MIME sniffing
 * - Referrer-Policy: Controls information leakage
 * - Permissions-Policy: Controls browser features
 */

import type { NextConfig } from "next";

// Security headers configuration
const securityHeaders = [
  {
    // Content Security Policy - Prevent XSS attacks
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts: self, inline for React hydration, eval for development.
      // Donorbox: widget.js for the embedded donation form.
      // PayPal:
      //   - paypalobjects.com — checkout.js (PayPal Express button)
      //   - paypal.com — pptm.js (PayPal tag manager / analytics, loaded
      //     by checkout.js after first render)
      "script-src 'self' 'unsafe-inline' https://donorbox.org https://www.paypalobjects.com https://www.paypal.com" + (process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''),
      // Styles: self, inline for styled components, Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts: self, Google Fonts
      "font-src 'self' https://fonts.gstatic.com data:",
      // Images: self, data URIs, blob, CDN, MinIO
      "img-src 'self' data: https: blob:" + (process.env.NODE_ENV === 'development' ? " http://localhost:9000" : ''),
      // Media: self, MinIO for video/audio uploads
      "media-src 'self' https: blob:" + (process.env.NODE_ENV === 'development' ? " http://localhost:9000" : ''),
      // API connections. Allow the configured Strapi/S3 origins when they
      // point at localhost (CI, local dev) — prod uses HTTPS-only wildcards.
      (() => {
        // Base allow-list.
        // donorbox.org — widget.js phones home for analytics / handshake.
        // paypal.com — pptm.js posts analytics events back to PayPal.
        const base = "connect-src 'self' https://api.aladhan.com https://cms.learnednomad.com https://hadithapi.com https://donorbox.org https://www.paypal.com wss:";
        const extra: string[] = [];
        if (process.env.NODE_ENV === 'development') {
          extra.push('http://localhost:1337', 'http://localhost:9000');
        }
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (apiUrl && /^https?:\/\/localhost(:\d+)?$/.test(apiUrl)) {
          extra.push(apiUrl);
        }
        return extra.length ? `${base} ${extra.join(' ')}` : base;
      })(),
      // Frames: allow YouTube + Vimeo (video lessons) and Donorbox (donate
      // page embedded form).
      "frame-src 'self' https://www.youtube.com https://youtube.com https://player.vimeo.com https://donorbox.org",
      // Frames: prevent clickjacking
      "frame-ancestors 'none'",
      // Forms: self only
      "form-action 'self'",
      // Base URI: self only
      "base-uri 'self'",
      // Object/embed: none
      "object-src 'none'",
      // Upgrade insecure requests in production
      process.env.NODE_ENV === 'production' ? "upgrade-insecure-requests" : '',
    ].filter(Boolean).join('; '),
  },
  {
    // HSTS - Force HTTPS (only in production)
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    // Prevent clickjacking
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    // Prevent MIME type sniffing
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    // Referrer policy - control information leakage
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    // Permissions policy - restrict browser features
    key: 'Permissions-Policy',
    value: [
      'camera=()',
      'microphone=()',
      'geolocation=(self)',
      // payment: allow our own origin + Donorbox iframe so Apple Pay,
      // Google Pay, and Stripe payment-request work inside the embed.
      'payment=(self "https://donorbox.org")',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
    ].join(', '),
  },
  {
    // XSS Protection (legacy, but still useful)
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    // DNS Prefetch Control
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
];

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  typescript: {
    // Pre-existing type mismatches in the codebase - ignore during build
    // TODO: Fix all type errors and re-enable
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cms.learnednomad.com' },
      { protocol: 'https', hostname: 'cdn.learnednomad.com' },
      // Dev: Strapi + MinIO serve uploads from localhost
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
      // Prod: masjidattaqwaatlanta.org and any subdomain (e.g. cdn.*)
      { protocol: 'https', hostname: 'masjidattaqwaatlanta.org' },
      { protocol: 'https', hostname: '**.masjidattaqwaatlanta.org' },
    ],
  },
  // Disable source maps in production for smaller builds and security
  productionBrowserSourceMaps: false,
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Security headers
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // Additional headers for API routes
        source: '/api/:path*',
        headers: [
          // No caching for API responses
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
      // CORS for auth API routes (admin app on :3000 calls auth on :3003)
      ...(process.env.NODE_ENV === 'development' ? [{
        source: '/api/auth/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'http://localhost:3000' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
        ],
      }] : []),
    ];
  },

  // Optimize bundle size
  webpack: (config, { isServer }) => {
    // Optimize chunks
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          lib: {
            test(module: any) {
              return module.size() > 160000 &&
                /node_modules[/\\]/.test(module.identifier());
            },
            name(module: any) {
              const hash = require('crypto').createHash('sha1');
              hash.update(module.identifier());
              return hash.digest('hex').substring(0, 8);
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            priority: 20,
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
