// Edge-compatible JWT verification using jose library
import { JWTPayload, jwtVerify, SignJWT } from 'jose';

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const secret = new TextEncoder().encode(JWT_SECRET);

// Verify JWT token (Edge-compatible)
export async function verifyJWTEdge(token: string): Promise<JWTPayload | null> {
  try {
    console.log('🔐 Verifying JWT (Edge)...');

    if (!token) {
      console.log('❌ No token provided');
      return null;
    }

    const { payload } = await jwtVerify(token, secret);
    console.log('✅ JWT verified successfully (Edge):', payload);
    return payload;
  } catch (error) {
    console.error('❌ JWT verification failed (Edge)!');
    if (error instanceof Error) {
      console.error('   Error:', error.message);
    }
    return null;
  }
}

// Sign JWT token (Edge-compatible)
export async function signJWTEdge(payload: JWTPayload): Promise<string> {
  console.log('🔐 Signing JWT (Edge) with payload:', payload);

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);

  console.log('✅ JWT signed (Edge), token length:', token.length);
  return token;
}
