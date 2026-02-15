import bcryptjs from 'bcryptjs';
import { JWTPayload, SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { env } from './env';

const JWT_SECRET = env.JWT_SECRET; // validated on import via zod
const secret = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = 'auth_token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

console.log(
  '🔑 JWT_SECRET loaded:',
  JWT_SECRET ? `${JWT_SECRET.substring(0, 10)}...` : 'MISSING!',
);

// ==================== TYPE DEFINITIONS ====================

export interface JWTPayloadCustom extends JWTPayload {
  id?: string;
  email: string;
  role: 'admin' | 'client';
  clientId?: string;
  userId?: string;
  // additional tenant flags to avoid DB lookups in middleware
  isActive?: boolean;
  subscriptionStatus?: 'active' | 'past_due' | 'cancelled';
}

export interface AuthResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  statusCode: number;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

// Verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcryptjs.compare(password, hashedPassword);
}

// Sign JWT token (using jose for edge compatibility)
export async function signJWT(payload: JWTPayloadCustom): Promise<string> {
  console.log('🔐 Signing JWT with payload:', payload);

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);

  console.log('✅ JWT signed, token length:', token.length);
  return token;
}

// Verify JWT token (using jose for edge compatibility)
export async function verifyJWT(
  token: string,
): Promise<JWTPayloadCustom | null> {
  try {
    console.log('🔐 Verifying JWT...');
    console.log('   Token exists:', !!token);
    console.log('   Token length:', token?.length);

    if (!token) {
      console.log('❌ No token provided to verifyJWT');
      return null;
    }

    const { payload } = await jwtVerify(token, secret);
    console.log('✅ JWT verified successfully:', payload);
    return payload as JWTPayloadCustom;
  } catch (error) {
    console.error('❌ JWT verification failed!');
    if (error instanceof Error) {
      console.error('   Error:', error.message);
    }
    return null;
  }
}

// Get auth token from cookies
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return token || null;
}

// Set auth token in cookies
export async function setAuthToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

// Clear auth token
export async function clearAuthToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Get current user from token
export async function getCurrentUser(): Promise<JWTPayloadCustom | null> {
  const token = await getAuthToken();
  if (!token) return null;

  const decoded = await verifyJWT(token);
  if (!decoded) return null;

  return decoded;
}

// Create auth response
export function createAuthResponse<T = unknown>(
  success: boolean,
  message: string,
  data?: T,
  statusCode: number = 200,
): AuthResponse<T> {
  return {
    success,
    message,
    data,
    statusCode,
  };
}
