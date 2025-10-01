#!/usr/bin/env node

// Script de Optimización de Rendimiento y SEO para Stack21
// Este script automatiza las optimizaciones de rendimiento y SEO

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${step}. ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

// Configuración de optimización
const optimizationConfig = {
  // Optimizaciones de imágenes
  images: {
    formats: ['webp', 'avif'],
    quality: 85,
    sizes: [16, 32, 64, 128, 256, 512, 1024, 2048]
  },
  
  // Optimizaciones de CSS
  css: {
    purge: true,
    minify: true,
    critical: true
  },
  
  // Optimizaciones de JavaScript
  javascript: {
    minify: true,
    treeShaking: true,
    codeSplitting: true
  },
  
  // Optimizaciones de SEO
  seo: {
    sitemap: true,
    robots: true,
    metaTags: true,
    structuredData: true
  },
  
  // Optimizaciones de rendimiento
  performance: {
    compression: true,
    caching: true,
    preloading: true,
    lazyLoading: true
  }
};

class PerformanceOptimizer {
  constructor() {
    this.projectRoot = process.cwd();
    this.optimizations = [];
  }

  // Paso 1: Optimizar Next.js Config
  optimizeNextConfig() {
    logStep(1, 'Optimizando configuración de Next.js...');
    
    const nextConfigPath = path.join(this.projectRoot, 'next.config.js');
    let nextConfig = {};
    
    if (fs.existsSync(nextConfigPath)) {
      delete require.cache[require.resolve(nextConfigPath)];
      nextConfig = require(nextConfigPath);
    }
    
    const optimizedConfig = {
      ...nextConfig,
      // Optimizaciones de rendimiento
      experimental: {
        ...nextConfig.experimental,
        optimizeCss: true,
        optimizePackageImports: ['lucide-react', 'framer-motion'],
        turbo: {
          rules: {
            '*.svg': {
              loaders: ['@svgr/webpack'],
              as: '*.js'
            }
          }
        }
      },
      
      // Optimizaciones de imágenes
      images: {
        ...nextConfig.images,
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 31536000,
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
      },
      
      // Compresión
      compress: true,
      
      // Headers de seguridad y rendimiento
      async headers() {
        return [
          {
            source: '/(.*)',
            headers: [
              {
                key: 'X-Frame-Options',
                value: 'DENY'
              },
              {
                key: 'X-Content-Type-Options',
                value: 'nosniff'
              },
              {
                key: 'Referrer-Policy',
                value: 'origin-when-cross-origin'
              },
              {
                key: 'X-DNS-Prefetch-Control',
                value: 'on'
              }
            ]
          },
          {
            source: '/api/(.*)',
            headers: [
              {
                key: 'Cache-Control',
                value: 'public, max-age=60, s-maxage=60'
              }
            ]
          },
          {
            source: '/_next/static/(.*)',
            headers: [
              {
                key: 'Cache-Control',
                value: 'public, max-age=31536000, immutable'
              }
            ]
          }
        ];
      },
      
      // Redirects para SEO
      async redirects() {
        return [
          {
            source: '/home',
            destination: '/',
            permanent: true
          }
        ];
      }
    };
    
    // Escribir configuración optimizada
    const configContent = `/** @type {import('next').NextConfig} */
const nextConfig = ${JSON.stringify(optimizedConfig, null, 2)};

module.exports = nextConfig;
`;
    
    fs.writeFileSync(nextConfigPath, configContent);
    this.optimizations.push('Next.js config optimizado');
    logSuccess('Configuración de Next.js optimizada');
  }

  // Paso 2: Optimizar Tailwind CSS
  optimizeTailwind() {
    logStep(2, 'Optimizando configuración de Tailwind CSS...');
    
    const tailwindConfigPath = path.join(this.projectRoot, 'tailwind.config.js');
    let tailwindConfig = {};
    
    if (fs.existsSync(tailwindConfigPath)) {
      delete require.cache[require.resolve(tailwindConfigPath)];
      tailwindConfig = require(tailwindConfigPath);
    }
    
    const optimizedTailwindConfig = {
      ...tailwindConfig,
      content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
      ],
      theme: {
        ...tailwindConfig.theme,
        extend: {
          ...tailwindConfig.theme?.extend,
          // Optimizaciones de rendimiento
          animation: {
            ...tailwindConfig.theme?.extend?.animation,
            'fade-in': 'fadeIn 0.5s ease-in-out',
            'slide-up': 'slideUp 0.3s ease-out',
            'bounce-subtle': 'bounceSubtle 2s infinite'
          },
          keyframes: {
            ...tailwindConfig.theme?.extend?.keyframes,
            fadeIn: {
              '0%': { opacity: '0' },
              '100%': { opacity: '1' }
            },
            slideUp: {
              '0%': { transform: 'translateY(10px)', opacity: '0' },
              '100%': { transform: 'translateY(0)', opacity: '1' }
            },
            bounceSubtle: {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-5px)' }
            }
          }
        }
      },
      plugins: [
        ...(tailwindConfig.plugins || []),
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio')
      ],
      // Optimizaciones de rendimiento
      future: {
        hoverOnlyWhenSupported: true
      },
      experimental: {
        optimizeUniversalDefaults: true
      }
    };
    
    // Escribir configuración optimizada
    const configContent = `/** @type {import('tailwindcss').Config} */
module.exports = ${JSON.stringify(optimizedTailwindConfig, null, 2)};
`;
    
    fs.writeFileSync(tailwindConfigPath, configContent);
    this.optimizations.push('Tailwind CSS optimizado');
    logSuccess('Configuración de Tailwind CSS optimizada');
  }

  // Paso 3: Crear archivo de metadatos SEO
  createSEOMetadata() {
    logStep(3, 'Creando metadatos SEO optimizados...');
    
    const seoConfig = {
      title: 'Stack21 - Plataforma SaaS de Automatización y IA',
      description: 'Stack21 es una plataforma SaaS completa que combina automatización de workflows, chatbots con IA, emails automatizados y más. Optimiza tu negocio con tecnología avanzada.',
      keywords: [
        'automatización',
        'workflows',
        'chatbot',
        'IA',
        'SaaS',
        'email marketing',
        'automatización de procesos',
        'inteligencia artificial',
        'productividad',
        'negocios'
      ],
      openGraph: {
        type: 'website',
        locale: 'es_ES',
        url: 'https://stack21.com',
        siteName: 'Stack21',
        title: 'Stack21 - Plataforma SaaS de Automatización y IA',
        description: 'Automatiza tu negocio con workflows inteligentes, chatbots con IA y emails automatizados.',
        images: [
          {
            url: '/og-image.jpg',
            width: 1200,
            height: 630,
            alt: 'Stack21 - Plataforma SaaS'
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        site: '@stack21',
        creator: '@stack21',
        title: 'Stack21 - Plataforma SaaS de Automatización y IA',
        description: 'Automatiza tu negocio con workflows inteligentes, chatbots con IA y emails automatizados.',
        images: ['/twitter-image.jpg']
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1
        }
      },
      verification: {
        google: 'google-site-verification-code',
        yandex: 'yandex-verification-code',
        yahoo: 'yahoo-site-verification-code'
      }
    };
    
    // Crear archivo de configuración SEO
    const seoConfigPath = path.join(this.projectRoot, 'src/lib/seo-config.ts');
    const seoConfigContent = `// Configuración SEO para Stack21
export const seoConfig = ${JSON.stringify(seoConfig, null, 2)};

export function generateMetadata({
  title,
  description,
  keywords = [],
  image,
  url
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
}) {
  const baseTitle = seoConfig.title;
  const baseDescription = seoConfig.description;
  
  return {
    title: title ? \`\${title} | \${baseTitle}\` : baseTitle,
    description: description || baseDescription,
    keywords: [...seoConfig.keywords, ...keywords].join(', '),
    openGraph: {
      ...seoConfig.openGraph,
      title: title ? \`\${title} | \${baseTitle}\` : seoConfig.openGraph.title,
      description: description || seoConfig.openGraph.description,
      url: url || seoConfig.openGraph.url,
      images: image ? [{ url: image, width: 1200, height: 630 }] : seoConfig.openGraph.images
    },
    twitter: {
      ...seoConfig.twitter,
      title: title ? \`\${title} | \${baseTitle}\` : seoConfig.twitter.title,
      description: description || seoConfig.twitter.description,
      images: image ? [image] : seoConfig.twitter.images
    },
    robots: seoConfig.robots,
    verification: seoConfig.verification
  };
}
`;
    
    fs.writeFileSync(seoConfigPath, seoConfigContent);
    this.optimizations.push('Metadatos SEO creados');
    logSuccess('Metadatos SEO optimizados creados');
  }

  // Paso 4: Crear sitemap.xml
  createSitemap() {
    logStep(4, 'Creando sitemap.xml...');
    
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://stack21.com</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://stack21.com/dashboard</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://stack21.com/workflow-builder</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://stack21.com/marketplace</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://stack21.com/docs</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;
    
    const sitemapPath = path.join(this.projectRoot, 'public/sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapContent);
    this.optimizations.push('Sitemap.xml creado');
    logSuccess('Sitemap.xml creado');
  }

  // Paso 5: Crear robots.txt
  createRobotsTxt() {
    logStep(5, 'Creando robots.txt...');
    
    const robotsContent = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://stack21.com/sitemap.xml

# Disallow admin and private areas
Disallow: /dashboard/admin/
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

# Allow important pages
Allow: /dashboard
Allow: /workflow-builder
Allow: /marketplace
Allow: /docs

# Crawl delay
Crawl-delay: 1`;
    
    const robotsPath = path.join(this.projectRoot, 'public/robots.txt');
    fs.writeFileSync(robotsPath, robotsContent);
    this.optimizations.push('robots.txt creado');
    logSuccess('robots.txt creado');
  }

  // Paso 6: Crear datos estructurados
  createStructuredData() {
    logStep(6, 'Creando datos estructurados...');
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Stack21",
      "description": "Plataforma SaaS completa de automatización de workflows, chatbots con IA y emails automatizados",
      "url": "https://stack21.com",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "29",
        "priceCurrency": "USD",
        "priceValidUntil": "2025-12-31",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1247"
      },
      "author": {
        "@type": "Organization",
        "name": "Stack21",
        "url": "https://stack21.com"
      },
      "featureList": [
        "Automatización de Workflows",
        "Chatbots con Inteligencia Artificial",
        "Automatización de Emails",
        "Sistema de Pagos Integrado",
        "Panel de Administración",
        "APIs Completas"
      ]
    };
    
    const structuredDataPath = path.join(this.projectRoot, 'src/lib/structured-data.ts');
    const structuredDataContent = `// Datos estructurados para Stack21
export const structuredData = ${JSON.stringify(structuredData, null, 2)};

export function generateStructuredData(additionalData = {}) {
  return {
    ...structuredData,
    ...additionalData
  };
}
`;
    
    fs.writeFileSync(structuredDataPath, structuredDataContent);
    this.optimizations.push('Datos estructurados creados');
    logSuccess('Datos estructurados creados');
  }

  // Paso 7: Optimizar package.json
  optimizePackageJson() {
    logStep(7, 'Optimizando package.json...');
    
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Agregar scripts de optimización
    packageJson.scripts = {
      ...packageJson.scripts,
      'build:optimized': 'next build && npm run optimize:images && npm run optimize:css',
      'optimize:images': 'next-optimized-images',
      'optimize:css': 'purgecss --css ./src/app/globals.css --content ./src/**/*.{js,ts,jsx,tsx} --output ./public/optimized.css',
      'analyze:bundle': 'cross-env ANALYZE=true next build',
      'lighthouse': 'lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html',
      'performance:test': 'npm run build && npm run start & sleep 10 && npm run lighthouse && pkill -f next'
    };
    
    // Agregar dependencias de optimización
    const optimizationDeps = {
      'next-optimized-images': '^1.6.0',
      'purgecss': '^5.0.0',
      'lighthouse': '^10.0.0',
      'cross-env': '^7.0.3'
    };
    
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      ...optimizationDeps
    };
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    this.optimizations.push('package.json optimizado');
    logSuccess('package.json optimizado');
  }

  // Paso 8: Crear archivo de configuración de performance
  createPerformanceConfig() {
    logStep(8, 'Creando configuración de rendimiento...');
    
    const performanceConfig = {
      // Configuración de caché
      cache: {
        static: {
          maxAge: 31536000, // 1 año
          immutable: true
        },
        api: {
          maxAge: 300, // 5 minutos
          staleWhileRevalidate: 60
        },
        pages: {
          maxAge: 3600, // 1 hora
          staleWhileRevalidate: 300
        }
      },
      
      // Configuración de compresión
      compression: {
        gzip: true,
        brotli: true,
        level: 6
      },
      
      // Configuración de preloading
      preloading: {
        critical: true,
        fonts: true,
        images: false // Lazy loading
      },
      
      // Configuración de lazy loading
      lazyLoading: {
        images: true,
        components: true,
        routes: true
      },
      
      // Métricas de rendimiento
      metrics: {
        coreWebVitals: true,
        firstContentfulPaint: true,
        largestContentfulPaint: true,
        cumulativeLayoutShift: true,
        firstInputDelay: true
      }
    };
    
    const performanceConfigPath = path.join(this.projectRoot, 'src/lib/performance-config.ts');
    const performanceConfigContent = `// Configuración de rendimiento para Stack21
export const performanceConfig = ${JSON.stringify(performanceConfig, null, 2)};

// Función para medir métricas de rendimiento
export function measurePerformance() {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      // Core Web Vitals
      fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
      lcp: performance.getEntriesByType('largest-contentful-paint')[0]?.startTime,
      cls: performance.getEntriesByType('layout-shift').reduce((acc, entry) => acc + entry.value, 0),
      fid: performance.getEntriesByType('first-input')[0]?.processingStart,
      
      // Métricas adicionales
      ttfb: navigation.responseStart - navigation.requestStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
      loadComplete: navigation.loadEventEnd - navigation.navigationStart
    };
  }
  
  return null;
}

// Función para optimizar imágenes
export function optimizeImage(src: string, width: number, height: number, quality = 85) {
  const params = new URLSearchParams({
    url: src,
    w: width.toString(),
    h: height.toString(),
    q: quality.toString(),
    f: 'webp'
  });
  
  return \`/api/optimize-image?\${params.toString()}\`;
}

// Función para preloadar recursos críticos
export function preloadCriticalResources() {
  if (typeof window !== 'undefined') {
    // Preloadar fuentes críticas
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = '/fonts/inter.woff2';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);
    
    // Preloadar CSS crítico
    const cssLink = document.createElement('link');
    cssLink.rel = 'preload';
    cssLink.href = '/styles/critical.css';
    cssLink.as = 'style';
    document.head.appendChild(cssLink);
  }
}
`;
    
    fs.writeFileSync(performanceConfigPath, performanceConfigContent);
    this.optimizations.push('Configuración de rendimiento creada');
    logSuccess('Configuración de rendimiento creada');
  }

  // Paso 9: Crear API de optimización de imágenes
  createImageOptimizationAPI() {
    logStep(9, 'Creando API de optimización de imágenes...');
    
    const apiPath = path.join(this.projectRoot, 'src/app/api/optimize-image/route.ts');
    const apiContent = `import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    const width = parseInt(searchParams.get('w') || '800');
    const height = parseInt(searchParams.get('h') || '600');
    const quality = parseInt(searchParams.get('q') || '85');
    const format = searchParams.get('f') || 'webp';
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'URL de imagen requerida' }, { status: 400 });
    }
    
    // Fetch la imagen
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return NextResponse.json({ error: 'No se pudo cargar la imagen' }, { status: 404 });
    }
    
    const imageBuffer = await response.arrayBuffer();
    
    // Optimizar con Sharp
    let sharpInstance = sharp(Buffer.from(imageBuffer))
      .resize(width, height, { 
        fit: 'cover',
        position: 'center'
      });
    
    // Aplicar formato
    switch (format) {
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality });
        break;
      case 'avif':
        sharpInstance = sharpInstance.avif({ quality });
        break;
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({ quality });
        break;
      case 'png':
        sharpInstance = sharpInstance.png({ quality });
        break;
      default:
        sharpInstance = sharpInstance.webp({ quality });
    }
    
    const optimizedBuffer = await sharpInstance.toBuffer();
    
    return new NextResponse(optimizedBuffer, {
      headers: {
        'Content-Type': \`image/\${format}\`,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': optimizedBuffer.length.toString()
      }
    });
    
  } catch (error) {
    console.error('Error optimizing image:', error);
    return NextResponse.json({ error: 'Error al optimizar imagen' }, { status: 500 });
  }
}
`;
    
    fs.writeFileSync(apiPath, apiContent);
    this.optimizations.push('API de optimización de imágenes creada');
    logSuccess('API de optimización de imágenes creada');
  }

  // Paso 10: Crear reporte de optimización
  createOptimizationReport() {
    logStep(10, 'Creando reporte de optimización...');
    
    const report = {
      timestamp: new Date().toISOString(),
      optimizations: this.optimizations,
      recommendations: [
        'Ejecutar lighthouse para medir métricas de rendimiento',
        'Configurar CDN para assets estáticos',
        'Implementar Service Worker para caching offline',
        'Optimizar imágenes con WebP y AVIF',
        'Implementar lazy loading para componentes no críticos',
        'Configurar preloading de recursos críticos',
        'Optimizar bundle size con code splitting',
        'Implementar Critical CSS',
        'Configurar HTTP/2 Server Push',
        'Optimizar base de datos con índices apropiados'
      ],
      nextSteps: [
        'npm run analyze:bundle - Analizar tamaño del bundle',
        'npm run lighthouse - Ejecutar auditoría de rendimiento',
        'npm run performance:test - Ejecutar tests de rendimiento',
        'Configurar variables de entorno para producción',
        'Implementar monitoreo de métricas en tiempo real'
      ]
    };
    
    const reportPath = path.join(this.projectRoot, 'optimization-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    logSuccess('Reporte de optimización creado');
    
    // Mostrar resumen
    log('\n📊 Resumen de Optimizaciones:', 'cyan');
    this.optimizations.forEach((optimization, index) => {
      log(`   ${index + 1}. ${optimization}`, 'green');
    });
    
    log('\n🎯 Próximos Pasos Recomendados:', 'yellow');
    report.nextSteps.forEach((step, index) => {
      log(`   ${index + 1}. ${step}`, 'yellow');
    });
  }

  // Ejecutar todas las optimizaciones
  async run() {
    try {
      log('🚀 Iniciando optimización de rendimiento y SEO de Stack21...', 'bright');
      
      this.optimizeNextConfig();
      this.optimizeTailwind();
      this.createSEOMetadata();
      this.createSitemap();
      this.createRobotsTxt();
      this.createStructuredData();
      this.optimizePackageJson();
      this.createPerformanceConfig();
      this.createImageOptimizationAPI();
      this.createOptimizationReport();
      
      log('\n🎉 ¡Optimización completada exitosamente!', 'bright');
      log('📈 Stack21 está ahora optimizado para rendimiento y SEO', 'green');
      
    } catch (error) {
      logError(`Error durante la optimización: ${error.message}`);
      process.exit(1);
    }
  }
}

// Ejecutar optimización si se llama directamente
if (require.main === module) {
  const optimizer = new PerformanceOptimizer();
  optimizer.run();
}

module.exports = PerformanceOptimizer;
