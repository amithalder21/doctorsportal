import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear all possible auth cookies
  response.cookies.delete('admin_session');
  response.cookies.delete('admin_role');
  response.cookies.delete('admin_id');
  response.cookies.delete('patient_session');
  response.cookies.delete('patient_email');

  return response;
}
