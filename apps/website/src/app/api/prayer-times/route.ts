import { NextRequest, NextResponse } from 'next/server';

// Mock prayer times data - in production, this would come from a database or external API
const getPrayerTimes = (date: string) => {
  return {
    date: date || new Date().toISOString().split('T')[0],
    location: 'Masjid At-Taqwa',
    coordinates: {
      latitude: 40.7128,
      longitude: -74.0060
    },
    times: {
      fajr: '05:30 AM',
      sunrise: '06:45 AM',
      dhuhr: '12:30 PM',
      asr: '03:45 PM',
      maghrib: '06:15 PM',
      isha: '07:30 PM',
      midnight: '11:45 PM'
    },
    method: 'ISNA',
    school: 'Hanafi',
    timezone: 'America/New_York'
  };
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const location = searchParams.get('location') || 'default';

    // Get prayer times (mock data for now)
    const prayerTimes = getPrayerTimes(date);

    return NextResponse.json({
      success: true,
      data: prayerTimes
    });
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch prayer times',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: Add a POST endpoint to update prayer times (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In production, validate admin authentication here
    // Then save to database
    
    return NextResponse.json({
      success: true,
      message: 'Prayer times updated successfully',
      data: body
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update prayer times'
      },
      { status: 500 }
    );
  }
}