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
      // Scripts: self, inline for React hydration, eval for development
      "script-src 'self' 'unsafe-inline'" + (process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''),
      // Styles: self, inline for styled components, Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts: self, Google Fonts
      "font-src 'self' https://fonts.gstatic.com data:",
      // Images: self, data URIs, blob, CDN
      "img-src 'self' data: https: blob:",
      // API connections
      "connect-src 'self' https://api.aladhan.com https://cms.learnednomad.com wss:" + (process.env.NODE_ENV === 'development' ? " http://localhost:1337" : ''),
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
      'payment=()',
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
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cms.learnednomad.com' },
      { protocol: 'https', hostname: 'cdn.learnednomad.com' },
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
