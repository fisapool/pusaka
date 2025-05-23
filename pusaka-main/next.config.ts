import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  reactStrictMode: true,
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
 'https://9003-firebase-studio-1747721957874.cluster-ys234awlzbhwoxmkkse6qo3fz6.cloudworkstations.dev',
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
  webpack(config, { isServer }) {
    config.ignoreWarnings = config.ignoreWarnings || [];
    config.ignoreWarnings.push({
      module: /handlebars[\\/]lib[\\/]index\.js$/,
      message: /require\.extensions is not supported by webpack/,
    });
    return config;
  },
};

export default nextConfig;
