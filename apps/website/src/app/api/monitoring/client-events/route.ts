import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/monitoring/client-events
 * Receives client-side monitoring events from the ClientLogger.
 * In development, logs to console. In production, would forward to a monitoring service.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { events, metadata } = body;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Client Events] Received ${events?.length || 0} events`);
    }

    return NextResponse.json({ received: events?.length || 0 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process events' },
      { status: 400 }
    );
  }
}
