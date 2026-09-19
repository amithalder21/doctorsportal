import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Here we could authorize the user if needed. 
        // For public appointment uploads, we can just return a true-like response.
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'application/pdf'],
          tokenPayload: JSON.stringify({
            // Optional: attach data to the upload token
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Triggered after the client successfully uploads the file.
        // We can do something with blob.url here if needed, but we'll save it 
        // on the client side when the appointment form is submitted.
        console.log('Upload completed', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}
