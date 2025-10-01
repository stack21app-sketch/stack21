'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Zap, 
  Globe, 
  Database, 
  MessageSquare, 
  Code, 
  BarChart3,
  ChevronRight,
  Star,
  Download,
  Shield,
  Cpu,
  Heart,
  GraduationCap,
  Home,
  Plane,
  Utensils
} from 'lucide-react';

interface App {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  logoUrl?: string;
  docsUrl?: string;
  oauthType: string;
  connectionCount: number;
  featured?: boolean;
}

interface AppDirectoryProps {
  initialApps?: App[];
}

export default function AppDirectoryPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [apiCategories, setApiCategories] = useState<string[]>([]);
  const [pageInput, setPageInput] = useState('1');
  const [totalCount, setTotalCount] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Cargar apps
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    loadApps();
  }, [debouncedSearch, selectedCategory, featuredOnly, page]);

  useEffect(() => {
    setPageInput(String(page));
  }, [page, totalPages]);

  const loadApps = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (featuredOnly) params.append('featured', 'true');
      params.append('page', String(page));
      params.append('limit', '20');

      const response = await fetch(`/api/apps?${params}`);
      const data = await response.json();
      setApps(data.apps || []);
      setTotalPages(data?.pagination?.pages || 1);
      setApiCategories(Array.isArray(data?.categories) ? data.categories : []);
      setTotalCount(Number(data?.pagination?.total || 0));
    } catch (error) {
      console.error('Error cargando apps:', error);
    } finally {
      setLoading(false);
    }
  };

  const localCategoryIconMap: Record<string, any> = {
    Communication: MessageSquare,
    Productivity: Zap,
    Development: Code,
    'Data Collection': Database,
    Monitoring: BarChart3,
    Integration: ExternalLink,
    'E-commerce': Zap,
    Marketing: BarChart3,
    'CRM & Sales': MessageSquare,
    'Finance & Accounting': BarChart3,
    'Development & IT': Code,
    'Social Media': MessageSquare,
    'Analytics & Data': BarChart3,
    'Customer Support': MessageSquare,
    'Project Management': Zap,
    'HR & People': MessageSquare,
    'Security & Compliance': Shield,
    'IoT & Hardware': Cpu,
    'Gaming & Entertainment': Zap,
    'Health & Fitness': Heart,
    Education: GraduationCap,
    'Real Estate': Home,
    'Travel & Hospitality': Plane,
    'Food & Delivery': Utensils,
  } as any;

  const categories = [{ id: 'all', name: 'Todos', icon: Globe }].concat(
    apiCategories.map((c) => ({ id: c, name: c, icon: localCategoryIconMap[c] || Globe }))
  );

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.id === category);
    return categoryData?.icon || Globe;
  };

  const getOAuthTypeColor = (type: string) => {
    switch (type) {
      case 'oauth2': return 'bg-blue-100 text-blue-800';
      case 'api_key': return 'bg-green-100 text-green-800';
      case 'basic_auth': return 'bg-yellow-100 text-yellow-800';
      case 'none': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              App Directory
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Conecta tu stack con más de 100+ aplicaciones populares
            </p>

            {/* Search and Filters */}
            <div className="max-w-2xl mx-auto">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar aplicaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {!loading && (
                <p className="text-sm text-gray-500 mb-4">Mostrando {apps.length} de {totalCount} apps — página {page} de {totalPages}</p>
              )}

              <div className="flex flex-wrap gap-4 justify-center">
                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map(category => {
                      const Icon = category.icon;
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Featured Filter */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featuredOnly}
                    onChange={(e) => { setFeaturedOnly(e.target.checked); setPage(1); }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Solo destacados</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => {
              const CategoryIcon = getCategoryIcon(app.category);
              return (
                <Link key={app.id} href={`/apps/${app.slug}`} className="block">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {app.logoUrl ? (
                        <img
                          src={app.logoUrl}
                          alt={app.name}
                          className="w-12 h-12 rounded-lg object-contain"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <CategoryIcon className="w-6 h-6 text-gray-600" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600">
                            {app.name}
                          </h3>
                          {app.featured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <CategoryIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-500">{app.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getOAuthTypeColor(app.oauthType)}`}>
                        {app.oauthType === 'none' ? 'HTTP' : app.oauthType.toUpperCase()}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {app.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {app.connectionCount} conexiones
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {app.docsUrl && (
                        <a
                          href={app.docsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}

        {!loading && apps.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron aplicaciones
            </h3>
            <p className="text-gray-600">
              Intenta ajustar tus filtros de búsqueda
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && apps.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-2 border rounded-lg disabled:opacity-50"
                onClick={() => setPage(1)}
                disabled={page <= 1}
              >
                Primero
              </button>
              <button
                className="px-3 py-2 border rounded-lg disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Anterior
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Página</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const n = Math.max(1, Math.min(totalPages, parseInt(pageInput || '1', 10)));
                    setPage(n);
                  }
                }}
                className="w-20 px-2 py-2 border rounded-lg"
              />
              <span className="text-sm text-gray-600">de {totalPages}</span>
              <button
                className="px-3 py-2 border rounded-lg"
                onClick={() => {
                  const n = Math.max(1, Math.min(totalPages, parseInt(pageInput || '1', 10)));
                  setPage(n);
                }}
              >
                Ir
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="px-3 py-2 border rounded-lg disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Siguiente
              </button>
              <button
                className="px-3 py-2 border rounded-lg disabled:opacity-50"
                onClick={() => setPage(totalPages)}
                disabled={page >= totalPages}
              >
                Último
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            ¿No encuentras la aplicación que necesitas?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Usa nuestro conector HTTP genérico para integrar cualquier API
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Ver Conector HTTP
            </button>
            <button className="px-6 py-3 border border-white text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Solicitar Nueva App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
