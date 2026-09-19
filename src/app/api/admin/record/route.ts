import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  // 1. Verify Admin Authentication
  const cookieStore = await cookies();
  const role = cookieStore.get('admin_role')?.value;
  
  if (!role || (role !== 'SUPERADMIN' && role !== 'DOCTOR')) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // 2. Extract the URL of the private blob
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  // Ensure the URL is actually a Vercel Blob URL to prevent SSRF
  if (!url.includes('.vercel-storage.com')) {
    return new NextResponse('Invalid URL', { status: 403 });
  }

  try {
    // 3. Fetch the private blob using the server's token
    const response = await fetch(url, {
      headers: {
        authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch document: ${response.statusText}`, { status: response.status });
    }

    // 4. Proxy the blob content back to the client
    const headers = new Headers();
    headers.set('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');
    headers.set('Cache-Control', 'private, max-age=3600');
    // Force inline viewing rather than download
    headers.set('Content-Disposition', 'inline');

    return new NextResponse(response.body, { headers });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
