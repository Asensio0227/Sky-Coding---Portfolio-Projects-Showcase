// Edge-compatible JWT verification using jose library
import { JWTPayload as CustomJWTPayload } from '@/models/types';
import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const secret = new TextEncoder().encode(JWT_SECRET);

/**
 * Verify JWT token (Edge-compatible)
 * Returns custom JWTPayload type with userId, clientId, role, email
 */
export async function verifyJWTEdge(
  token: string,
): Promise<CustomJWTPayload | null> {
  try {
    console.log('🔐 Verifying JWT (Edge)...');

    if (!token) {
      console.log('❌ No token provided');
      return null;
    }

    const { payload } = await jwtVerify(token, secret);

    // Validate required fields exist
    if (!payload || !payload.userId) {
      console.log('❌ Invalid token payload');
      return null;
    }

    // Transform to custom JWTPayload
    const customPayload: CustomJWTPayload = {
      userId: payload.userId as string,
      clientId: payload.clientId as string,
      email: payload.email as string,
      role: payload.role as 'client' | 'admin',
    };

    console.log('✅ JWT verified successfully (Edge):', customPayload);
    return customPayload;
  } catch (error) {
    console.error('❌ JWT verification failed (Edge)!');
    if (error instanceof Error) {
      console.error('   Error:', error.message);
    }
    return null;
  }
}

/**
 * Sign JWT token (Edge-compatible)
 * Accepts custom JWTPayload type
 */
export async function signJWTEdge(payload: CustomJWTPayload): Promise<string> {
  console.log('🔐 Signing JWT (Edge) with payload:', payload);

  const token = await new SignJWT({
    userId: payload.userId,
    clientId: payload.clientId,
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);

  console.log('✅ JWT signed (Edge), token length:', token.length);
  return token;
}
