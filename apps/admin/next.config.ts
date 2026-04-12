import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cms.learnednomad.com' },
      { protocol: 'https', hostname: 'cdn.learnednomad.com' },
      { protocol: 'http', hostname: 'localhost', port: '1337', pathname: '/uploads/**' },
      { protocol: 'http', hostname: 'localhost', port: '9000', pathname: '/uploads-public/**' },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
