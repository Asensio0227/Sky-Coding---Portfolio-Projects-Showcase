import mongoose from 'mongoose';

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const cached: CachedConnection = {
  conn: null,
  promise: null,
};

const MONGO_URI = process.env.MONGO_URL;

export async function connectDB() {
  // Check for MONGO_URI at runtime
  if (!MONGO_URI) {
    throw new Error('Please define the MONGO_URL environment variable');
  }

  if (cached.conn) {
    console.log('Using cached database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // TypeScript now knows MONGO_URI is defined here
    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      console.log('Database connected successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('Database connection failed:', e);
    throw e;
  }

  return cached.conn;
}
