import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch (_) {}

  const tags: string[] | undefined = body?.tags;
  const paths: string[] | undefined = body?.paths;

  if (Array.isArray(tags)) {
    for (const tag of tags) revalidateTag(tag);
  }
  if (Array.isArray(paths)) {
    for (const p of paths) revalidatePath(p);
  }

  return NextResponse.json({ revalidated: true });
}

