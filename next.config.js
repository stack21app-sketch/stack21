/* eslint-disable @typescript-eslint/no-var-requires */
let withBundleAnalyzer = (config) => config
try {
  // Carga opcional del analyzer para evitar fallos si no está instalado
  const analyzer = require('@next/bundle-analyzer')
  withBundleAnalyzer = analyzer({ enabled: process.env.ANALYZE === 'true' })
} catch (e) {
  // Analyzer no disponible; continuar sin él
}

/** @type {import('next').NextConfig} */
const baseConfig = {
  output: 'standalone',
  images: {
    domains: ['vacio.stack21app.com', 'localhost'],
  },
  env: {
    CUSTOM_DOMAIN: 'vacio.stack21app.com',
  },
  i18n: {
    locales: ['es', 'en', 'pt', 'fr', 'de'],
    defaultLocale: 'es',
    localeDetection: false,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
        ],
      },
      // Cache agresivo para assets estáticos
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache para imágenes remotas/optimizadas
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // No cache para APIs
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = withBundleAnalyzer(baseConfig);