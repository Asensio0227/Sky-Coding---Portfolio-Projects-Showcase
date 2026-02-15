import Client from '@/models/Client';
import { JWTPayload } from '@/models/types';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { env } from './env';

const JWT_SECRET = env.JWT_SECRET;
const secret = new TextEncoder().encode(JWT_SECRET);

/**
 * Middleware to authenticate requests and attach user context
 * Use this in API routes that require authentication
 */
export async function authenticateRequest(
  request: NextRequest,
): Promise<{ user: JWTPayload | null; error: NextResponse | null }> {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return {
        user: null,
        error: NextResponse.json(
          { success: false, message: 'Authentication required' },
          { status: 401 },
        ),
      };
    }

    const { payload } = await jwtVerify(token, secret);

    if (!payload || !payload.userId) {
      return {
        user: null,
        error: NextResponse.json(
          { success: false, message: 'Invalid token' },
          { status: 401 },
        ),
      };
    }

    return {
      user: {
        userId: payload.userId as string,
        clientId: payload.clientId as string,
        email: payload.email as string,
        role: payload.role as 'client' | 'admin',
      },
      error: null,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      user: null,
      error: NextResponse.json(
        { success: false, message: 'Authentication failed' },
        { status: 500 },
      ),
    };
  }
}

/**
 * Middleware to ensure user is a client
 */
export function requireClient(user: JWTPayload | null): NextResponse | null {
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'Authentication required' },
      { status: 401 },
    );
  }

  if (user.role !== 'client') {
    return NextResponse.json(
      { success: false, message: 'Client access required' },
      { status: 403 },
    );
  }

  return null;
}

/**
 * Middleware to ensure user is an admin
 */
export function requireAdmin(user: JWTPayload | null): NextResponse | null {
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'Authentication required' },
      { status: 401 },
    );
  }

  if (user.role !== 'admin') {
    return NextResponse.json(
      { success: false, message: 'Admin access required' },
      { status: 403 },
    );
  }

  return null;
}

/**
 * Multi-tenant isolation check
 * Ensures clients can only access their own client's data
 */
export function enforceTenantIsolation(
  user: JWTPayload,
  requestedClientId: string,
): NextResponse | null {
  // Admins can access all clients
  if (user.role === 'admin') {
    return null;
  }

  // Clients can only access their own client
  if (user.clientId !== requestedClientId) {
    return NextResponse.json(
      { success: false, message: 'Access denied to this resource' },
      { status: 403 },
    );
  }

  return null;
}

/**
 * Ensure the client's subscription is active and allowed to interact with the system.
 * Useful for protecting endpoints that perform billing-sensitive operations such as
 * sending or generating messages.
 */
export function requireActiveSubscription(
  user: JWTPayload | null,
): NextResponse | null {
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'Authentication required' },
      { status: 401 },
    );
  }

  // only clients need subscription check; admins bypass
  if (user.role === 'client') {
    if (!user.clientId) {
      return NextResponse.json(
        { success: false, message: 'Client context missing' },
        { status: 400 },
      );
    }

    // rely on payload fields rather than querying database
    if (user.isActive === false || user.subscriptionStatus !== 'active') {
      return NextResponse.json(
        { success: false, message: 'Subscription inactive or cancelled' },
        { status: 403 },
      );
    }
  }

  return null;
}

/**
 * Validate domain against client's allowed domains
 */
export function validateDomain(
  domain: string,
  allowedDomains: string[],
): boolean {
  const normalizedDomain =
    domain
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, '')
      .split('/')[0] || '';

  return allowedDomains.includes(normalizedDomain);
}
