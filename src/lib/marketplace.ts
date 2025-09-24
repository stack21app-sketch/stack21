// Sistema de Marketplace de Módulos para Stack21
export interface Module {
  id: string
  name: string
  description: string
  shortDescription: string
  version: string
  author: string
  authorEmail: string
  category: 'workflow' | 'integration' | 'template' | 'ai' | 'analytics' | 'ui'
  price: number
  currency: 'USD' | 'EUR' | 'MXN'
  isFree: boolean
  isPremium: boolean
  rating: number
  downloads: number
  reviews: number
  tags: string[]
  features: string[]
  requirements: string[]
  compatibility: string[]
  screenshots: string[]
  documentation: string
  changelog: ChangelogEntry[]
  createdAt: Date
  updatedAt: Date
  status: 'active' | 'inactive' | 'pending' | 'deprecated'
  license: 'MIT' | 'GPL' | 'Commercial' | 'Custom'
  size: number // en KB
  dependencies: string[]
  supportedLanguages: string[]
  industry: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface ChangelogEntry {
  version: string
  date: string
  changes: string[]
}

export interface Review {
  id: string
  moduleId: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  title: string
  comment: string
  helpful: number
  createdAt: Date
  verified: boolean
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  color: string
  moduleCount: number
}

// Categorías disponibles
export const CATEGORIES: Category[] = [
  {
    id: 'workflow',
    name: 'Workflows',
    description: 'Automatizaciones y flujos de trabajo',
    icon: '⚡',
    color: 'from-blue-500 to-cyan-500',
    moduleCount: 0
  },
  {
    id: 'integration',
    name: 'Integraciones',
    description: 'Conectores para herramientas externas',
    icon: '🔗',
    color: 'from-green-500 to-emerald-500',
    moduleCount: 0
  },
  {
    id: 'template',
    name: 'Plantillas',
    description: 'Plantillas predefinidas para empezar rápido',
    icon: '📋',
    color: 'from-purple-500 to-pink-500',
    moduleCount: 0
  },
  {
    id: 'ai',
    name: 'IA y Machine Learning',
    description: 'Módulos de inteligencia artificial',
    icon: '🧠',
    color: 'from-orange-500 to-red-500',
    moduleCount: 0
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Herramientas de análisis y reportes',
    icon: '📊',
    color: 'from-indigo-500 to-blue-500',
    moduleCount: 0
  },
  {
    id: 'ui',
    name: 'UI/UX',
    description: 'Componentes de interfaz de usuario',
    icon: '🎨',
    color: 'from-pink-500 to-rose-500',
    moduleCount: 0
  }
]

// Módulos de ejemplo
export const SAMPLE_MODULES: Module[] = [
  {
    id: 'email-marketing-automation',
    name: 'Email Marketing Automation',
    description: 'Sistema completo de automatización de email marketing con segmentación avanzada, A/B testing y analytics integrados.',
    shortDescription: 'Automatiza tu email marketing con IA',
    version: '2.1.0',
    author: 'Stack21 Team',
    authorEmail: 'team@stack21.com',
    category: 'workflow',
    price: 0,
    currency: 'USD',
    isFree: true,
    isPremium: false,
    rating: 4.8,
    downloads: 15420,
    reviews: 234,
    tags: ['email', 'marketing', 'automation', 'ai', 'segmentation'],
    features: [
      'Segmentación automática de audiencias',
      'A/B testing integrado',
      'Plantillas responsivas',
      'Analytics en tiempo real',
      'Integración con 50+ plataformas'
    ],
    requirements: ['Stack21 Pro', 'Conexión a internet'],
    compatibility: ['Chrome 90+', 'Firefox 88+', 'Safari 14+'],
    screenshots: [
      '/images/modules/email-marketing-1.png',
      '/images/modules/email-marketing-2.png',
      '/images/modules/email-marketing-3.png'
    ],
    documentation: 'https://docs.stack21.com/modules/email-marketing',
    changelog: [
      {
        version: '2.1.0',
        date: '2024-01-15',
        changes: ['Nueva funcionalidad de segmentación por comportamiento', 'Mejoras en el editor de plantillas', 'Integración con HubSpot']
      }
    ],
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2024-01-15'),
    status: 'active',
    license: 'MIT',
    size: 2048,
    dependencies: ['@stack21/core', '@stack21/ai'],
    supportedLanguages: ['es', 'en', 'pt', 'fr', 'de'],
    industry: ['ecommerce', 'saas', 'marketing'],
    difficulty: 'intermediate'
  },
  {
    id: 'salesforce-crm-integration',
    name: 'Salesforce CRM Integration',
    description: 'Conector completo para Salesforce con sincronización bidireccional, mapeo de campos personalizado y webhooks.',
    shortDescription: 'Integra Salesforce con cualquier workflow',
    version: '1.5.2',
    author: 'DataFlow Solutions',
    authorEmail: 'contact@dataflow.com',
    category: 'integration',
    price: 49.99,
    currency: 'USD',
    isFree: false,
    isPremium: true,
    rating: 4.6,
    downloads: 8934,
    reviews: 156,
    tags: ['salesforce', 'crm', 'integration', 'api', 'sync'],
    features: [
      'Sincronización bidireccional',
      'Mapeo de campos personalizado',
      'Webhooks en tiempo real',
      'Filtros avanzados',
      'Soporte para objetos personalizados'
    ],
    requirements: ['Stack21 Pro', 'Salesforce API access'],
    compatibility: ['Salesforce API v58+'],
    screenshots: [
      '/images/modules/salesforce-1.png',
      '/images/modules/salesforce-2.png'
    ],
    documentation: 'https://docs.stack21.com/modules/salesforce',
    changelog: [
      {
        version: '1.5.2',
        date: '2024-01-10',
        changes: ['Corrección de bug en sincronización', 'Mejoras en performance', 'Nuevos campos soportados']
      }
    ],
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date('2024-01-10'),
    status: 'active',
    license: 'Commercial',
    size: 1536,
    dependencies: ['@stack21/core', '@stack21/api'],
    supportedLanguages: ['en'],
    industry: ['sales', 'crm', 'enterprise'],
    difficulty: 'advanced'
  },
  {
    id: 'ecommerce-abandoned-cart',
    name: 'E-commerce Abandoned Cart Recovery',
    description: 'Sistema inteligente de recuperación de carritos abandonados con emails personalizados y ofertas dinámicas.',
    shortDescription: 'Recupera carritos abandonados automáticamente',
    version: '3.0.1',
    author: 'Ecommerce Pro',
    authorEmail: 'hello@ecommercepro.com',
    category: 'template',
    price: 0,
    currency: 'USD',
    isFree: true,
    isPremium: false,
    rating: 4.9,
    downloads: 22156,
    reviews: 445,
    tags: ['ecommerce', 'cart', 'recovery', 'email', 'conversion'],
    features: [
      'Detección automática de abandono',
      'Emails personalizados con IA',
      'Ofertas dinámicas',
      'Analytics de conversión',
      'Integración con Shopify, WooCommerce'
    ],
    requirements: ['Stack21 Basic', 'Tienda online'],
    compatibility: ['Shopify', 'WooCommerce', 'Magento'],
    screenshots: [
      '/images/modules/abandoned-cart-1.png',
      '/images/modules/abandoned-cart-2.png',
      '/images/modules/abandoned-cart-3.png'
    ],
    documentation: 'https://docs.stack21.com/modules/abandoned-cart',
    changelog: [
      {
        version: '3.0.1',
        date: '2024-01-20',
        changes: ['Nueva IA para personalización de emails', 'Soporte para múltiples monedas', 'Dashboard mejorado']
      }
    ],
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2024-01-20'),
    status: 'active',
    license: 'MIT',
    size: 3072,
    dependencies: ['@stack21/core', '@stack21/ai', '@stack21/email'],
    supportedLanguages: ['es', 'en', 'pt', 'fr', 'de'],
    industry: ['ecommerce'],
    difficulty: 'beginner'
  },
  {
    id: 'sentiment-analysis-ai',
    name: 'Sentiment Analysis AI',
    description: 'Análisis de sentimientos avanzado con IA para comentarios, reviews y feedback de clientes en tiempo real.',
    shortDescription: 'Analiza sentimientos con IA avanzada',
    version: '1.2.0',
    author: 'AI Solutions Inc',
    authorEmail: 'support@aisolutions.com',
    category: 'ai',
    price: 29.99,
    currency: 'USD',
    isFree: false,
    isPremium: true,
    rating: 4.7,
    downloads: 5678,
    reviews: 89,
    tags: ['ai', 'sentiment', 'analysis', 'nlp', 'machine-learning'],
    features: [
      'Análisis en tiempo real',
      'Soporte para 15 idiomas',
      'Clasificación de emociones',
      'API REST completa',
      'Dashboard de insights'
    ],
    requirements: ['Stack21 Pro', 'OpenAI API key'],
    compatibility: ['OpenAI GPT-4', 'Azure Cognitive Services'],
    screenshots: [
      '/images/modules/sentiment-1.png',
      '/images/modules/sentiment-2.png'
    ],
    documentation: 'https://docs.stack21.com/modules/sentiment-analysis',
    changelog: [
      {
        version: '1.2.0',
        date: '2024-01-05',
        changes: ['Soporte para más idiomas', 'Mejoras en precisión', 'Nueva API de batch processing']
      }
    ],
    createdAt: new Date('2023-11-01'),
    updatedAt: new Date('2024-01-05'),
    status: 'active',
    license: 'Commercial',
    size: 4096,
    dependencies: ['@stack21/core', '@stack21/ai', 'openai'],
    supportedLanguages: ['en', 'es', 'pt', 'fr', 'de', 'it', 'nl', 'sv', 'da', 'no', 'fi', 'pl', 'cs', 'hu', 'ru'],
    industry: ['customer-service', 'marketing', 'product'],
    difficulty: 'advanced'
  },
  {
    id: 'advanced-analytics-dashboard',
    name: 'Advanced Analytics Dashboard',
    description: 'Dashboard completo de analytics con visualizaciones interactivas, reportes automáticos y predicciones con IA.',
    shortDescription: 'Dashboard de analytics con IA predictiva',
    version: '2.3.0',
    author: 'Analytics Pro',
    authorEmail: 'team@analyticspro.com',
    category: 'analytics',
    price: 79.99,
    currency: 'USD',
    isFree: false,
    isPremium: true,
    rating: 4.5,
    downloads: 12345,
    reviews: 198,
    tags: ['analytics', 'dashboard', 'visualization', 'predictions', 'reports'],
    features: [
      'Visualizaciones interactivas',
      'Reportes automáticos',
      'Predicciones con IA',
      'Exportación a PDF/Excel',
      'Alertas inteligentes'
    ],
    requirements: ['Stack21 Enterprise', 'Datos históricos'],
    compatibility: ['Chrome 90+', 'Firefox 88+', 'Safari 14+'],
    screenshots: [
      '/images/modules/analytics-1.png',
      '/images/modules/analytics-2.png',
      '/images/modules/analytics-3.png'
    ],
    documentation: 'https://docs.stack21.com/modules/analytics-dashboard',
    changelog: [
      {
        version: '2.3.0',
        date: '2024-01-12',
        changes: ['Nuevas visualizaciones', 'Mejoras en performance', 'Exportación mejorada']
      }
    ],
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-01-12'),
    status: 'active',
    license: 'Commercial',
    size: 6144,
    dependencies: ['@stack21/core', '@stack21/ai', '@stack21/charts'],
    supportedLanguages: ['es', 'en', 'pt', 'fr', 'de'],
    industry: ['all'],
    difficulty: 'intermediate'
  },
  {
    id: 'custom-ui-components',
    name: 'Custom UI Components',
    description: 'Biblioteca completa de componentes UI personalizables para crear interfaces únicas en Stack21.',
    shortDescription: 'Componentes UI personalizables',
    version: '1.0.0',
    author: 'UI Design Studio',
    authorEmail: 'hello@uidesign.com',
    category: 'ui',
    price: 0,
    currency: 'USD',
    isFree: true,
    isPremium: false,
    rating: 4.4,
    downloads: 8765,
    reviews: 123,
    tags: ['ui', 'components', 'design', 'customizable', 'react'],
    features: [
      '50+ componentes personalizables',
      'Temas predefinidos',
      'Documentación interactiva',
      'Storybook incluido',
      'TypeScript support'
    ],
    requirements: ['Stack21 Basic', 'Conocimientos de React'],
    compatibility: ['React 18+', 'Next.js 13+'],
    screenshots: [
      '/images/modules/ui-components-1.png',
      '/images/modules/ui-components-2.png'
    ],
    documentation: 'https://docs.stack21.com/modules/ui-components',
    changelog: [
      {
        version: '1.0.0',
        date: '2024-01-01',
        changes: ['Lanzamiento inicial', '50 componentes incluidos', 'Documentación completa']
      }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    status: 'active',
    license: 'MIT',
    size: 8192,
    dependencies: ['@stack21/core', 'react', 'typescript'],
    supportedLanguages: ['en'],
    industry: ['all'],
    difficulty: 'intermediate'
  }
]

// Funciones de utilidad
export function getModulesByCategory(categoryId: string): Module[] {
  return SAMPLE_MODULES.filter(module => module.category === categoryId)
}

export function getFreeModules(): Module[] {
  return SAMPLE_MODULES.filter(module => module.isFree)
}

export function getPremiumModules(): Module[] {
  return SAMPLE_MODULES.filter(module => !module.isFree)
}

export function getModulesByIndustry(industry: string): Module[] {
  return SAMPLE_MODULES.filter(module => module.industry.includes(industry))
}

export function searchModules(query: string): Module[] {
  const lowercaseQuery = query.toLowerCase()
  return SAMPLE_MODULES.filter(module => 
    module.name.toLowerCase().includes(lowercaseQuery) ||
    module.description.toLowerCase().includes(lowercaseQuery) ||
    module.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

export function getModuleById(id: string): Module | undefined {
  return SAMPLE_MODULES.find(module => module.id === id)
}

export function getTopRatedModules(limit: number = 10): Module[] {
  return SAMPLE_MODULES
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

export function getMostDownloadedModules(limit: number = 10): Module[] {
  return SAMPLE_MODULES
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, limit)
}

export function getRecentlyAddedModules(limit: number = 10): Module[] {
  return SAMPLE_MODULES
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)
}

export function getModulesByDifficulty(difficulty: string): Module[] {
  return SAMPLE_MODULES.filter(module => module.difficulty === difficulty)
}

export function getModulesByPriceRange(minPrice: number, maxPrice: number): Module[] {
  return SAMPLE_MODULES.filter(module => 
    module.price >= minPrice && module.price <= maxPrice
  )
}

export function getModuleStats() {
  const totalModules = SAMPLE_MODULES.length
  const freeModules = getFreeModules().length
  const premiumModules = getPremiumModules().length
  const totalDownloads = SAMPLE_MODULES.reduce((sum, module) => sum + module.downloads, 0)
  const averageRating = SAMPLE_MODULES.reduce((sum, module) => sum + module.rating, 0) / totalModules

  return {
    totalModules,
    freeModules,
    premiumModules,
    totalDownloads,
    averageRating: Math.round(averageRating * 10) / 10
  }
}
