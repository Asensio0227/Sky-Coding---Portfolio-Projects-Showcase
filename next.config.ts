import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // bcryptjs is still needed for password hashing in API routes
  serverExternalPackages: ['bcryptjs'],

  // Explicitly set Turbopack root to current project directory
  turbopack: {
    root: path.resolve(__dirname),
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false, // Changed to false - better to fix errors properly
  },
  // Removed eslint config - no longer supported in next.config
  // Use .eslintrc.json or eslint.config.js instead
};

export default nextConfig;
