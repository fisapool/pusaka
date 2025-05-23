import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: [
    'https://9002-firebase-studio-1747721957874.cluster-ys234awlzbhwoxmkkse6qo3fz6.cloudworkstations.dev',
  ],
  async headers() {
    return [
      {
        source: '/_next/static/(.*)', // Apply to static media files
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Allow requests from any origin
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS', // Allowed methods for static files
          },
        ],
      },
      {
        source: '/(.*)', // Apply to all routes
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Allow requests from any origin
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS', // Allowed methods
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization', // Allowed headers
          },
        ],
      },
    ];
  },
};

export default nextConfig;
