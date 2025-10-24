import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
    };

    // Optional: Check database connection
    // if (process.env.DATABASE_URL) {
    //   try {
    //     // Add database ping here
    //     health.database = 'connected';
    //   } catch (error) {
    //     health.database = 'disconnected';
    //     health.status = 'degraded';
    //   }
    // }

    // Optional: Check external services
    // if (process.env.NEXT_PUBLIC_PRAYER_API_KEY) {
    //   try {
    //     // Add prayer API check here
    //     health.prayerApi = 'connected';
    //   } catch (error) {
    //     health.prayerApi = 'disconnected';
    //     health.status = 'degraded';
    //   }
    // }

    return NextResponse.json(health, {
      status: health.status === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}