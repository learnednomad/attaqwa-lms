import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const TARAWIH_CONFIG_PATH = path.join(process.cwd(), 'src/data/tarawih-config.json');

const DEFAULT_TARAWIH = {
  enabled: false,
  time: '9:00 PM',
  updatedAt: null,
};

export async function GET() {
  try {
    const data = await fs.readFile(TARAWIH_CONFIG_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json(DEFAULT_TARAWIH);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (typeof body.enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing or invalid "enabled" field (must be boolean)' },
        { status: 400 }
      );
    }

    if (!body.time || typeof body.time !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "time" field (must be string)' },
        { status: 400 }
      );
    }

    const config = {
      enabled: body.enabled,
      time: body.time,
      updatedAt: new Date().toISOString(),
    };

    const dir = path.dirname(TARAWIH_CONFIG_PATH);
    await fs.mkdir(dir, { recursive: true });

    await fs.writeFile(TARAWIH_CONFIG_PATH, JSON.stringify(config, null, 2));

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error updating tarawih config:', error);
    return NextResponse.json(
      { error: 'Failed to update tarawih config' },
      { status: 500 }
    );
  }
}
