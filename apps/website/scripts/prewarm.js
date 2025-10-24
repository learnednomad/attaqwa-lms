#!/usr/bin/env node

/**
 * Prewarm script to optimize cold starts
 * Runs after the container starts to warm up the Next.js application
 */

const http = require('http');

const ROUTES_TO_WARM = [
  '/',
  '/student/login',
  '/student/dashboard', 
  '/education/seerah',
  '/resources/quran-study',
  '/resources/hadith-collections',
  '/api/health',
  '/api/prayer-times',
  '/api/announcements'
];

const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

async function warmRoute(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: HOST,
      port: PORT,
      path: path,
      method: 'GET',
      timeout: 60000 // 60 second timeout
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`✓ Warmed ${path} - Status: ${res.statusCode} - Time: ${Date.now() - startTime}ms`);
        resolve();
      });
    });

    req.on('error', (error) => {
      console.error(`✗ Failed to warm ${path}:`, error.message);
      reject(error);
    });

    req.on('timeout', () => {
      console.error(`✗ Timeout warming ${path}`);
      req.destroy();
      reject(new Error('Request timeout'));
    });

    const startTime = Date.now();
    req.end();
  });
}

async function prewarmApp() {
  console.log('🔥 Starting application prewarm...');
  console.log(`   Warming ${ROUTES_TO_WARM.length} routes on http://${HOST}:${PORT}`);
  
  // Wait for app to be ready
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  for (const route of ROUTES_TO_WARM) {
    try {
      await warmRoute(route);
    } catch (error) {
      // Continue warming other routes even if one fails
      continue;
    }
  }
  
  console.log('✅ Prewarm complete! Application is ready for optimal performance.');
}

// Run if executed directly
if (require.main === module) {
  prewarmApp().catch(error => {
    console.error('Prewarm failed:', error);
    process.exit(1);
  });
}