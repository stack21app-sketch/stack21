// Optimizador SEO para Stack21

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
  robots?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export interface SEOMetrics {
  score: number;
  issues: SEOIssue[];
  suggestions: SEOSuggestion[];
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: string;
  fix?: string;
}

export interface SEOSuggestion {
  type: 'title' | 'description' | 'keywords' | 'structure' | 'performance';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
}

// Datos SEO por defecto
export const defaultSEOData: SEOData = {
  title: 'Stack21 - Plataforma SaaS con IA',
  description: 'La plataforma SaaS definitiva para automatizar tu negocio con IA, facturación inteligente y gestión multi-tenant',
  keywords: ['SaaS', 'IA', 'automatización', 'workflows', 'chatbots', 'facturación', 'gestión'],
  ogImage: '/og-image.png',
  robots: 'index, follow',
  author: 'Stack21 Team',
};

// Generar datos SEO para páginas específicas
export const generatePageSEO = (page: string, customData?: Partial<SEOData>): SEOData => {
  const pageSEO: Record<string, SEOData> = {
    dashboard: {
      title: 'Dashboard - Stack21',
      description: 'Gestiona tu workspace, workflows y analytics desde el dashboard principal de Stack21',
      keywords: ['dashboard', 'workspace', 'gestión', 'analytics'],
      section: 'Dashboard',
    },
    workflows: {
      title: 'Workflows - Stack21',
      description: 'Crea y gestiona workflows avanzados con lógica condicional y ejecución en paralelo',
      keywords: ['workflows', 'automatización', 'lógica condicional', 'ejecución'],
      section: 'Workflows',
    },
    chatbot: {
      title: 'Chatbots con IA - Stack21',
      description: 'Crea chatbots inteligentes con IA para atención al cliente y automatización',
      keywords: ['chatbot', 'IA', 'atención al cliente', 'automatización'],
      section: 'Chatbots',
    },
    analytics: {
      title: 'Analytics - Stack21',
      description: 'Métricas detalladas, reportes personalizados e insights inteligentes para tu negocio',
      keywords: ['analytics', 'métricas', 'reportes', 'insights'],
      section: 'Analytics',
    },
    settings: {
      title: 'Configuración - Stack21',
      description: 'Personaliza tu experiencia, configura integraciones y gestiona tu cuenta',
      keywords: ['configuración', 'personalización', 'integraciones', 'cuenta'],
      section: 'Configuración',
    },
  };

  return {
    ...defaultSEOData,
    ...pageSEO[page],
    ...customData,
  };
};

// Analizar SEO de una página
export const analyzeSEO = (seoData: SEOData, content?: string): SEOMetrics => {
  const issues: SEOIssue[] = [];
  const suggestions: SEOSuggestion[] = [];

  // Analizar título
  if (seoData.title.length < 30) {
    issues.push({
      type: 'warning',
      message: 'El título es muy corto (menos de 30 caracteres)',
      element: 'title',
      fix: 'Aumenta la longitud del título para mejor SEO',
    });
  } else if (seoData.title.length > 60) {
    issues.push({
      type: 'warning',
      message: 'El título es muy largo (más de 60 caracteres)',
      element: 'title',
      fix: 'Acorta el título para evitar truncamiento en resultados de búsqueda',
    });
  }

  // Analizar descripción
  if (seoData.description.length < 120) {
    issues.push({
      type: 'warning',
      message: 'La descripción es muy corta (menos de 120 caracteres)',
      element: 'meta description',
      fix: 'Aumenta la longitud de la descripción para mejor SEO',
    });
  } else if (seoData.description.length > 160) {
    issues.push({
      type: 'warning',
      message: 'La descripción es muy larga (más de 160 caracteres)',
      element: 'meta description',
      fix: 'Acorta la descripción para evitar truncamiento',
    });
  }

  // Analizar palabras clave
  if (seoData.keywords.length < 3) {
    issues.push({
      type: 'info',
      message: 'Considera agregar más palabras clave relevantes',
      element: 'keywords',
      fix: 'Agrega 3-5 palabras clave relevantes',
    });
  }

  // Sugerencias de mejora
  if (!seoData.ogImage) {
    suggestions.push({
      type: 'structure',
      priority: 'medium',
      title: 'Agregar imagen Open Graph',
      description: 'Incluye una imagen atractiva para compartir en redes sociales',
      impact: 'Mejora la apariencia al compartir en redes sociales',
    });
  }

  if (!seoData.canonical) {
    suggestions.push({
      type: 'structure',
      priority: 'high',
      title: 'Agregar URL canónica',
      description: 'Define la URL canónica para evitar contenido duplicado',
      impact: 'Evita problemas de contenido duplicado en SEO',
    });
  }

  // Calcular puntuación SEO
  let score = 100;
  issues.forEach(issue => {
    if (issue.type === 'error') score -= 20;
    else if (issue.type === 'warning') score -= 10;
    else if (issue.type === 'info') score -= 5;
  });

  return {
    score: Math.max(0, score),
    issues,
    suggestions,
  };
};

// Generar meta tags HTML
export const generateMetaTags = (seoData: SEOData): string => {
  const tags = [
    `<title>${seoData.title}</title>`,
    `<meta name="description" content="${seoData.description}">`,
    `<meta name="keywords" content="${seoData.keywords.join(', ')}">`,
    `<meta name="author" content="${seoData.author || 'Stack21'}">`,
    `<meta name="robots" content="${seoData.robots || 'index, follow'}">`,
    `<meta property="og:title" content="${seoData.title}">`,
    `<meta property="og:description" content="${seoData.description}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:url" content="${typeof window !== 'undefined' ? window.location.href : ''}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${seoData.title}">`,
    `<meta name="twitter:description" content="${seoData.description}">`,
  ];

  if (seoData.ogImage) {
    tags.push(`<meta property="og:image" content="${seoData.ogImage}">`);
    tags.push(`<meta name="twitter:image" content="${seoData.ogImage}">`);
  }

  if (seoData.canonical) {
    tags.push(`<link rel="canonical" href="${seoData.canonical}">`);
  }

  if (seoData.publishedTime) {
    tags.push(`<meta property="article:published_time" content="${seoData.publishedTime}">`);
  }

  if (seoData.modifiedTime) {
    tags.push(`<meta property="article:modified_time" content="${seoData.modifiedTime}">`);
  }

  if (seoData.section) {
    tags.push(`<meta property="article:section" content="${seoData.section}">`);
  }

  if (seoData.tags) {
    seoData.tags.forEach(tag => {
      tags.push(`<meta property="article:tag" content="${tag}">`);
    });
  }

  return tags.join('\n');
};

// Optimizaciones de rendimiento para SEO
export const getSEOPerformanceSuggestions = (): SEOSuggestion[] => {
  return [
    {
      type: 'performance',
      priority: 'high',
      title: 'Optimizar imágenes',
      description: 'Comprime y optimiza imágenes para mejorar la velocidad de carga',
      impact: 'Mejora Core Web Vitals y ranking en búsquedas',
    },
    {
      type: 'performance',
      priority: 'high',
      title: 'Implementar lazy loading',
      description: 'Carga diferida de imágenes y contenido para mejorar rendimiento',
      impact: 'Reduce tiempo de carga inicial y mejora UX',
    },
    {
      type: 'performance',
      priority: 'medium',
      title: 'Minificar CSS y JS',
      description: 'Reduce el tamaño de archivos CSS y JavaScript',
      impact: 'Mejora velocidad de carga y Core Web Vitals',
    },
    {
      type: 'structure',
      priority: 'medium',
      title: 'Agregar schema markup',
      description: 'Implementa datos estructurados para mejor comprensión por motores de búsqueda',
      impact: 'Mejora la aparición en resultados de búsqueda',
    },
    {
      type: 'structure',
      priority: 'low',
      title: 'Optimizar URLs',
      description: 'Usa URLs descriptivas y amigables para SEO',
      impact: 'Mejora la comprensión del contenido por motores de búsqueda',
    },
  ];
};
