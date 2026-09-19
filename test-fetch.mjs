import { put } from '@vercel/blob';
import fs from 'fs';

async function run() {
  try {
    const res = await fetch('https://wwn7qatffqlczkmq.private.blob.vercel-storage.com/test.txt', {
      headers: {
        authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`
      }
    });
    const text = await res.text();
    console.log('Response:', text);
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
