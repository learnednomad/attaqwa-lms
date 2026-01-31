import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Revalidation API endpoint
 *
 * Next.js 16 Breaking Change:
 * revalidateTag() now requires a second argument - a cacheLife profile.
 * Using 'max' profile for SWR (stale-while-revalidate) behavior.
 */
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
    // Next.js 16: revalidateTag requires cacheLife profile as second argument
    for (const tag of tags) revalidateTag(tag, 'max');
  }
  if (Array.isArray(paths)) {
    for (const p of paths) revalidatePath(p);
  }

  return NextResponse.json({ revalidated: true });
}

