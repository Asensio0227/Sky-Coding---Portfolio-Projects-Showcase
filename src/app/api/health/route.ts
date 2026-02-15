import { env } from '@/lib/env';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

export async function GET() {
  // a simple heartbeat check
  logger.info('Health check ping');

  // we could also ping the database or external services here
  const uptime = process.uptime();

  return NextResponse.json({
    status: 'ok',
    env: env.NODE_ENV,
    uptime,
  });
}
