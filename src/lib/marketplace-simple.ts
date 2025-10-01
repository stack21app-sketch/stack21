// Marketplace básico para Stack21

export interface MarketplaceTemplate {
  id: string;
  name: string;
  description: string;
  category: 'marketing' | 'sales' | 'support';
  author: string;
  downloads: number;
  rating: number;
  price: number;
  isFree: boolean;
  featured: boolean;
}

const templates: MarketplaceTemplate[] = [
  {
    id: 'tpl_001',
    name: 'Abandono de Carrito E-commerce',
    description: 'Recupera ventas perdidas con emails automatizados',
    category: 'marketing',
    author: 'Usuario Experto',
    downloads: 1250,
    rating: 4.8,
    price: 0,
    isFree: true,
    featured: true
  },
  {
    id: 'tpl_002',
    name: 'Onboarding SaaS',
    description: 'Guía nuevos usuarios paso a paso',
    category: 'support',
    author: 'SaaS Master',
    downloads: 890,
    rating: 4.6,
    price: 29,
    isFree: false,
    featured: false
  },
  {
    id: 'tpl_003',
    name: 'Seguimiento de Leads',
    description: 'Automatiza el seguimiento de ventas',
    category: 'sales',
    author: 'Sales Pro',
    downloads: 675,
    rating: 4.4,
    price: 0,
    isFree: true,
    featured: true
  }
];

export function getTemplates(): MarketplaceTemplate[] {
  return templates;
}

export function getFeaturedTemplates(): MarketplaceTemplate[] {
  return templates.filter(t => t.featured);
}

export function getTemplate(id: string): MarketplaceTemplate | undefined {
  return templates.find(t => t.id === id);
}

export function searchTemplates(query: string): MarketplaceTemplate[] {
  return templates.filter(t => 
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.description.toLowerCase().includes(query.toLowerCase())
  );
}
