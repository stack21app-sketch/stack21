'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Star, 
  Download, 
  Heart, 
  Filter, 
  Grid, 
  List,
  Crown,
  Zap,
  TrendingUp,
  Users
} from 'lucide-react';
import { getTemplates, getFeaturedTemplates, searchTemplates, MarketplaceTemplate } from '@/lib/marketplace-simple';

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const allTemplates = getTemplates();
  const featuredTemplates = getFeaturedTemplates();
  
  const filteredTemplates = searchQuery 
    ? searchTemplates(searchQuery)
    : selectedCategory === 'all' 
      ? allTemplates 
      : allTemplates.filter(t => t.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'Todos', icon: Grid },
    { id: 'marketing', name: 'Marketing', icon: TrendingUp },
    { id: 'sales', name: 'Ventas', icon: Users },
    { id: 'support', name: 'Soporte', icon: Heart }
  ];

  const renderTemplateCard = (template: MarketplaceTemplate) => (
    <motion.div
      key={template.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Header de la tarjeta */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
              {template.featured && (
                <Crown className="w-4 h-4 text-yellow-500" />
              )}
            </div>
            <p className="text-gray-600 text-sm mb-3">{template.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>por {template.author}</span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                {template.rating}
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                {template.downloads.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="text-right">
            {template.isFree ? (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Gratis
              </span>
            ) : (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                ${template.price}
              </span>
            )}
          </div>
        </div>

        {/* Categoría */}
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 text-xs rounded-full ${
            template.category === 'marketing' ? 'bg-purple-100 text-purple-800' :
            template.category === 'sales' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {template.category}
          </span>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Heart className="w-4 h-4 text-gray-500" />
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              {template.isFree ? 'Descargar' : 'Comprar'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🏪 Marketplace de Templates
              </h1>
              <p className="text-gray-600">
                Descubre y descarga workflows creados por la comunidad
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Búsqueda y filtros */}
          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtros
              </button>
            </div>

            {/* Categorías */}
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Templates destacados */}
        {selectedCategory === 'all' && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900">Templates Destacados</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTemplates.map(renderTemplateCard)}
            </div>
          </motion.div>
        )}

        {/* Todos los templates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {searchQuery ? `Resultados para "${searchQuery}"` : 
               selectedCategory === 'all' ? 'Todos los Templates' : 
               `Templates de ${categories.find(c => c.id === selectedCategory)?.name}`}
            </h2>
            <span className="text-gray-500">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin resultados</h3>
              <p className="text-gray-600">
                No se encontraron templates que coincidan con tu búsqueda.
              </p>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredTemplates.map(renderTemplateCard)}
            </div>
          )}
        </motion.div>

        {/* Estadísticas del marketplace */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas del Marketplace</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {allTemplates.length}
              </div>
              <div className="text-sm text-gray-600">Templates Disponibles</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {allTemplates.reduce((sum, t) => sum + t.downloads, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Descargas Totales</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {featuredTemplates.length}
              </div>
              <div className="text-sm text-gray-600">Templates Destacados</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}