import { NextRequest, NextResponse } from 'next/server';

/**
 * Prayer Times API v1
 * GET /api/v1/prayer-times
 *
 * Returns prayer times for the specified date and location.
 * Follows Aladhan API response patterns.
 */

const getPrayerTimes = (date: string) => {
  return {
    date: date || new Date().toISOString().split('T')[0],
    location: 'Masjid At-Taqwa',
    coordinates: {
      latitude: 33.9114,
      longitude: -84.2614,
    },
    timings: {
      Fajr: '05:30 AM',
      Sunrise: '06:45 AM',
      Dhuhr: '12:30 PM',
      Asr: '03:45 PM',
      Maghrib: '06:15 PM',
      Isha: '07:30 PM',
      Midnight: '11:45 PM',
    },
    meta: {
      method: 'ISNA',
      school: 'Hanafi',
      timezone: 'America/New_York',
    },
  };
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');
    const method = searchParams.get('method') || 'ISNA';
    const school = searchParams.get('school') || 'hanafi';

    // Get prayer times (mock data for now)
    const prayerTimes = getPrayerTimes(date);

    // Update with query params if provided
    if (latitude && longitude) {
      prayerTimes.coordinates.latitude = parseFloat(latitude);
      prayerTimes.coordinates.longitude = parseFloat(longitude);
    }
    prayerTimes.meta.method = method;
    prayerTimes.meta.school = school.charAt(0).toUpperCase() + school.slice(1);

    return NextResponse.json({
      data: prayerTimes,
      meta: {
        version: 'v1',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return NextResponse.json(
      {
        error: {
          status: 500,
          name: 'ServerError',
          message: 'Failed to fetch prayer times',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
