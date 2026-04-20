export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'http://localhost:1337'),
  // Strapi v5 reads `server.proxy.koa` and passes it to Koa's app.proxy.
  // Setting just `proxy: true` (v4 shape) is silently ignored, causing
  // "Cannot send secure cookie over unencrypted connection" when running
  // behind Traefik/Caddy because Koa sees HTTP and refuses Secure cookies.
  proxy: {
    koa: env.bool('STRAPI_PROXY', false),
  },
  app: {
    keys: env.array('APP_KEYS'),
  },
});
