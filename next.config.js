/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export for production builds, not for development
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    distDir: 'out',
  }),
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.luxuryescapes.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig 