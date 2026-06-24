import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * POST /api/revalidate?tag=<tag>&path=<path>
 *
 * On-demand cache revalidation, protected by a shared secret. This is the
 * "external" counterpart to the PDP server action: it lets a curl call (or, in
 * Unit 4, a Contentful webhook) purge a cache tag or path from outside the app.
 *
 * Auth: header `x-revalidate-secret` must equal `process.env.REVALIDATE_SECRET`.
 *   - Unlike some samples, there is NO hardcoded fallback secret: if the env var
 *     is missing the route fails closed (500) instead of accepting a public default.
 *
 * Mirrors production (`innovation/.../configcat-demo/.../api/revalidate/route.ts`),
 * adapted to fail-closed auth and this app's cache tags (`devices`, `device:<slug>`,
 * `home-sections`).
 */
export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;

  // Fail closed: a missing secret is a server misconfiguration, not an open door.
  if (!expected) {
    return NextResponse.json(
      { error: 'Server misconfigured', message: 'REVALIDATE_SECRET is not set' },
      { status: 500 },
    );
  }

  const provided = request.headers.get('x-revalidate-secret');
  if (provided !== expected) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
        message: 'The x-revalidate-secret header is missing or invalid',
      },
      { status: 401 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    // Sanitize: trim and treat blank strings as absent.
    const tag = searchParams.get('tag')?.trim() || null;
    const path = searchParams.get('path')?.trim() || null;

    if (!tag && !path) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Provide at least one of ?tag= or ?path=',
        },
        { status: 400 },
      );
    }

    const revalidated: { tag?: string; path?: string } = {};

    if (tag) {
      // Second arg = cache-life profile applied on revalidation (see PDP action).
      revalidateTag(tag, 'max');
      revalidated.tag = tag;
    }
    if (path) {
      revalidatePath(path);
      revalidated.path = path;
    }

    console.log('[revalidate] ', { ...revalidated, at: new Date().toISOString() });

    return NextResponse.json({
      revalidated: true,
      ...revalidated,
      now: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[revalidate] failed:', error);
    return NextResponse.json(
      { error: 'Revalidation failed', message: String(error) },
      { status: 500 },
    );
  }
}

/**
 * GET /api/revalidate — usage docs for testing. Never echoes the secret.
 */
export function GET() {
  return NextResponse.json({
    message: 'Cache revalidation endpoint',
    usage: {
      method: 'POST',
      headers: { 'x-revalidate-secret': '<REVALIDATE_SECRET>' },
      query: {
        tag: 'Optional — cache tag to revalidate (devices, device:<slug>, home-sections)',
        path: 'Optional — path to revalidate (e.g. /dispositivos)',
      },
      note: 'Provide at least one of tag or path.',
    },
    example:
      'curl -X POST "http://localhost:3000/api/revalidate?tag=devices" -H "x-revalidate-secret: <secret>"',
  });
}
