import { cookies } from 'next/headers';
import { adminAuth } from './firebase-admin';

export async function verifyAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying auth:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await verifyAuth();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export function setAuthCookie(token: string) {
  // This should be called from an API route or server action
  // Setting cookie with httpOnly flag for security
  return {
    name: 'auth-token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  };
}
