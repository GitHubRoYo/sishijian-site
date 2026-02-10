/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./src/i18n/request.ts')

const nextConfig = {
  serverExternalPackages: ['@libsql/client', 'esbuild', 'drizzle-kit', 'sharp'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.pexels.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/zh-HK',
        permanent: false,
      },
    ]
  },
  async headers() {
    const isProd = process.env.NODE_ENV === 'production'

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          ...(isProd
            ? [
              {
                key: 'X-Frame-Options',
                value: 'SAMEORIGIN',
              },
            ]
            : []),
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = withNextIntl(nextConfig)

