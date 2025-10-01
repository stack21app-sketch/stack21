'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  TrendingUp,
  Eye,
  Target,
  Zap
} from 'lucide-react';
import { 
  analyzeSEO, 
  generatePageSEO, 
  getSEOPerformanceSuggestions,
  type SEOData,
  type SEOMetrics,
  type SEOIssue,
  type SEOSuggestion
} from '@/lib/seo-optimizer';

export const SEOOptimizer: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [seoData, setSeodata] = useState<SEOData>(generatePageSEO(currentPage));
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null);
  const [performanceSuggestions, setPerformanceSuggestions] = useState<SEOSuggestion[]>([]);

  useEffect(() => {
    const newSeodata = generatePageSEO(currentPage);
    setSeodata(newSeodata);
    const analysis = analyzeSEO(newSeodata);
    setMetrics(analysis);
    setPerformanceSuggestions(getSEOPerformanceSuggestions());
  }, [currentPage]);

  const updateSeodata = (field: keyof SEOData, value: any) => {
    const updated = { ...seoData, [field]: value };
    setSeodata(updated);
    const analysis = analyzeSEO(updated);
    setMetrics(analysis);
  };

  const getIssueIcon = (type: SEOIssue['type']) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getIssueColor = (type: SEOIssue['type']) => {
    switch (type) {
      case 'error': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'info': return 'border-blue-200 bg-blue-50';
    }
  };

  const getPriorityColor = (priority: SEOSuggestion['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const pages = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'workflows', name: 'Workflows' },
    { id: 'chatbot', name: 'Chatbot' },
    { id: 'analytics', name: 'Analytics' },
    { id: 'settings', name: 'Configuración' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Optimizador SEO</h2>
          <p className="text-sm text-gray-600 mt-1">
            Optimiza el SEO de tu aplicación para mejor visibilidad
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-600">SEO</span>
        </div>
      </div>

      {/* Selector de página */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Página a optimizar
        </label>
        <select
          value={currentPage}
          onChange={(e) => setCurrentPage(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {pages.map(page => (
            <option key={page.id} value={page.id}>
              {page.name}
            </option>
          ))}
        </select>
      </div>

      {/* Puntuación SEO */}
      {metrics && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Puntuación SEO</h3>
                <p className="text-sm text-gray-600">Análisis de la página actual</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${getScoreColor(metrics.score)}`}>
                {metrics.score}
              </div>
              <div className="text-sm text-gray-600">/ 100</div>
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                metrics.score >= 80 ? 'bg-green-500' : 
                metrics.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${metrics.score}%` }}
            />
          </div>
        </div>
      )}

      {/* Editor de datos SEO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              value={seoData.title}
              onChange={(e) => updateSeodata('title', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Título de la página"
            />
            <div className="text-xs text-gray-500 mt-1">
              {seoData.title.length}/60 caracteres
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={seoData.description}
              onChange={(e) => updateSeodata('description', e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descripción de la página"
            />
            <div className="text-xs text-gray-500 mt-1">
              {seoData.description.length}/160 caracteres
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Palabras clave
            </label>
            <input
              type="text"
              value={seoData.keywords.join(', ')}
              onChange={(e) => updateSeodata('keywords', e.target.value.split(', ').filter(k => k.trim()))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="palabra1, palabra2, palabra3"
            />
            <div className="text-xs text-gray-500 mt-1">
              {seoData.keywords.length} palabras clave
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL canónica
            </label>
            <input
              type="url"
              value={seoData.canonical || ''}
              onChange={(e) => updateSeodata('canonical', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://ejemplo.com/pagina"
            />
          </div>
        </div>
      </div>

      {/* Issues y sugerencias */}
      {metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Issues */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Problemas detectados</h3>
            <div className="space-y-3">
              {metrics.issues.map((issue, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-3 border rounded-lg ${getIssueColor(issue.type)}`}
                >
                  <div className="flex items-start gap-3">
                    {getIssueIcon(issue.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{issue.message}</p>
                      {issue.fix && (
                        <p className="text-xs text-gray-600 mt-1">{issue.fix}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {metrics.issues.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p>¡No se encontraron problemas!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sugerencias */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sugerencias de mejora</h3>
            <div className="space-y-3">
              {[...metrics.suggestions, ...performanceSuggestions].map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                      <p className="text-xs text-blue-600">Impacto: {suggestion.impact}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(suggestion.priority)}`}>
                      {suggestion.priority}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Vista previa */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vista previa en resultados de búsqueda</h3>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-blue-600 text-sm mb-1">
            {seoData.canonical || 'https://stack21.com/' + currentPage}
          </div>
          <div className="text-xl text-blue-600 mb-2 hover:underline cursor-pointer">
            {seoData.title}
          </div>
          <div className="text-sm text-gray-600">
            {seoData.description}
          </div>
        </div>
      </div>
    </div>
  );
};
