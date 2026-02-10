import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const IQAMAH_CONFIG_PATH = path.join(process.cwd(), 'src/data/iqamah-times.json');

const DEFAULT_IQAMAH = {
  fajr: '6:45 AM',
  dhuhr: '1:15 PM',
  asr: '4:15 PM',
  maghrib: '+5',
  isha: '7:45 PM',
  updatedAt: null,
};

export async function GET() {
  try {
    const data = await fs.readFile(IQAMAH_CONFIG_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json(DEFAULT_IQAMAH);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredPrayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    for (const prayer of requiredPrayers) {
      if (!body[prayer] || typeof body[prayer] !== 'string') {
        return NextResponse.json(
          { error: `Missing or invalid iqamah time for ${prayer}` },
          { status: 400 }
        );
      }
    }

    const config = {
      fajr: body.fajr,
      dhuhr: body.dhuhr,
      asr: body.asr,
      maghrib: body.maghrib,
      isha: body.isha,
      updatedAt: new Date().toISOString(),
    };

    // Ensure directory exists
    const dir = path.dirname(IQAMAH_CONFIG_PATH);
    await fs.mkdir(dir, { recursive: true });

    await fs.writeFile(IQAMAH_CONFIG_PATH, JSON.stringify(config, null, 2));

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error updating iqamah times:', error);
    return NextResponse.json(
      { error: 'Failed to update iqamah times' },
      { status: 500 }
    );
  }
}
