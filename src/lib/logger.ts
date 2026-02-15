// simple centralized logger with structured output
// you can replace this with pino/winston/console whatever
import { env } from './env';

function timestamp() {
  return new Date().toISOString();
}

function format(
  level: string,
  message: string,
  meta?: Record<string, unknown>,
) {
  const base = `[${timestamp()}] [${level}] ${message}`;
  if (meta) {
    try {
      return `${base} ${JSON.stringify(meta)}`;
    } catch {
      return base;
    }
  }
  return base;
}

export const logger = {
  debug: (msg: string, meta?: Record<string, unknown>) => {
    if (env.NODE_ENV !== 'production')
      console.debug(format('DEBUG', msg, meta));
  },
  info: (msg: string, meta?: Record<string, unknown>) => {
    console.info(format('INFO ', msg, meta));
  },
  warn: (msg: string, meta?: Record<string, unknown>) => {
    console.warn(format('WARN ', msg, meta));
  },
  error: (msg: string, meta?: Record<string, unknown>) => {
    console.error(format('ERROR', msg, meta));
  },
};
