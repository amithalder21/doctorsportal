import { put } from '@vercel/blob';

async function run() {
  try {
    const blob = await put('test.txt', 'Hello World', {
      access: 'private',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    console.log('Success:', blob);
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
