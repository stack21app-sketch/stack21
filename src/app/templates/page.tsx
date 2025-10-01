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
  Play,
  Clock,
  Users
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  steps: number;
  apps: string[];
  popularity: number;
  featured?: boolean;
  previewUrl?: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    loadTemplates();
  }, [debouncedSearch, selectedCategory, difficulty, page]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (difficulty !== 'all') params.append('difficulty', difficulty);
      params.append('page', String(page));
      params.append('limit', '12');

      const response = await fetch(`/api/templates?${params}`);
      const data = await response.json();
      setTemplates(data.templates || []);
      setTotalPages(data?.pagination?.pages || 1);
      setTotalCount(Number(data?.pagination?.total || 0));
    } catch (error) {
      console.error('Error cargando plantillas:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'Todas', icon: Globe },
    { id: 'Communication', name: 'Comunicación', icon: MessageSquare },
    { id: 'Productivity', name: 'Productividad', icon: Zap },
    { id: 'E-commerce', name: 'E-commerce', icon: Database },
    { id: 'Marketing', name: 'Marketing', icon: BarChart3 },
    { id: 'Data Processing', name: 'Procesamiento de Datos', icon: Code },
  ];

  const difficulties = [
    { id: 'all', name: 'Todas', color: 'gray' },
    { id: 'beginner', name: 'Principiante', color: 'green' },
    { id: 'intermediate', name: 'Intermedio', color: 'yellow' },
    { id: 'advanced', name: 'Avanzado', color: 'red' },
  ];

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApplyTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/templates/${templateId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `Workflow from ${templateId}` }),
      });
      
      if (!response.ok) throw new Error('Error applying template');
      const data = await response.json();
      
      // Redirect to workflow editor
      window.location.href = `/workflows/${data.workflowId}/edit`;
    } catch (error) {
      alert('Error al aplicar la plantilla');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Plantillas de Workflows
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Comienza rápido con plantillas predefinidas para automatizar tu trabajo
            </p>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar plantillas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

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

                {/* Difficulty Filter */}
                <div className="flex items-center gap-2">
                  <select
                    value={difficulty}
                    onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {difficulties.map(diff => (
                      <option key={diff.id} value={diff.id}>
                        {diff.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {!loading && (
                <p className="text-sm text-gray-500 mt-4">Mostrando {templates.length} de {totalCount} plantillas — página {page} de {totalPages}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {templates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600">
                        {template.name}
                      </h3>
                      {template.featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(template.difficulty)}`}>
                    {difficulties.find(d => d.id === template.difficulty)?.name || template.difficulty}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {template.estimatedTime}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    {template.steps} pasos
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Users className="w-3 h-3" />
                    {template.popularity} usos
                  </div>
                  <div className="text-xs text-gray-500">
                    {template.apps.length} apps
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApplyTemplate(template.id)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Aplicar Plantilla
                  </button>
                  <Link
                    href={`/templates/${template.id}`}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && templates.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron plantillas
            </h3>
            <p className="text-gray-600">
              Intenta ajustar tus filtros de búsqueda
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && templates.length > 0 && (
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
                value={page}
                onChange={(e) => setPage(Math.max(1, Math.min(totalPages, parseInt(e.target.value) || 1)))}
                className="w-20 px-2 py-2 border rounded-lg"
              />
              <span className="text-sm text-gray-600">de {totalPages}</span>
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
    </div>
  );
}