export default ({ env }) => {
  const s3BaseUrl = env('S3_BASE_URL', '');
  // Extract origin from S3_BASE_URL for CSP (e.g., "http://localhost:9000")
  let s3Origin = '';
  try {
    if (s3BaseUrl) {
      const url = new URL(s3BaseUrl);
      s3Origin = url.origin;
    }
  } catch {
    // ignore invalid URLs
  }

  return [
    'strapi::logger',
    'strapi::errors',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'connect-src': ["'self'", 'https:'],
            'img-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', ...(s3Origin ? [s3Origin] : [])],
            'media-src': ["'self'", 'data:', 'blob:', ...(s3Origin ? [s3Origin] : [])],
            upgradeInsecureRequests: null,
          },
        },
      },
    },
    'strapi::cors',
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};
