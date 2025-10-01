'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Plus, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  Trash2,
  Edit
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'productivity' | 'communication' | 'analytics' | 'storage' | 'development';
  status: 'connected' | 'disconnected' | 'error';
  icon: string;
  lastSync: Date | null;
  actions: number;
  isPopular: boolean;
  isNew: boolean;
}

export function IntegrationsHub() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de integraciones
    const mockIntegrations: Integration[] = [
      {
        id: '1',
        name: 'Google Workspace',
        description: 'Integra Gmail, Drive, Calendar y Docs con tus workflows',
        category: 'productivity',
        status: 'connected',
        icon: '🔵',
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
        actions: 15,
        isPopular: true,
        isNew: false
      },
      {
        id: '2',
        name: 'Slack',
        description: 'Envía notificaciones y automatiza mensajes en Slack',
        category: 'communication',
        status: 'connected',
        icon: '💬',
        lastSync: new Date(Date.now() - 30 * 60 * 1000),
        actions: 8,
        isPopular: true,
        isNew: false
      },
      {
        id: '3',
        name: 'GitHub',
        description: 'Automatiza repositorios, issues y pull requests',
        category: 'development',
        status: 'disconnected',
        icon: '🐙',
        lastSync: null,
        actions: 12,
        isPopular: false,
        isNew: false
      },
      {
        id: '4',
        name: 'Notion',
        description: 'Sincroniza bases de datos y páginas de Notion',
        category: 'productivity',
        status: 'error',
        icon: '📝',
        lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000),
        actions: 5,
        isPopular: false,
        isNew: true
      },
      {
        id: '5',
        name: 'Stripe',
        description: 'Gestiona pagos y suscripciones automáticamente',
        category: 'analytics',
        status: 'disconnected',
        icon: '💳',
        lastSync: null,
        actions: 20,
        isPopular: true,
        isNew: false
      },
      {
        id: '6',
        name: 'Airtable',
        description: 'Conecta y sincroniza bases de datos de Airtable',
        category: 'storage',
        status: 'disconnected',
        icon: '🗃️',
        lastSync: null,
        actions: 7,
        isPopular: false,
        isNew: true
      }
    ];

    setTimeout(() => {
      setIntegrations(mockIntegrations);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || integration.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const connectIntegration = (id: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, status: 'connected', lastSync: new Date() }
          : integration
      )
    );
  };

  const disconnectIntegration = (id: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, status: 'disconnected', lastSync: null }
          : integration
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'disconnected':
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'productivity':
        return 'bg-blue-100 text-blue-800';
      case 'communication':
        return 'bg-green-100 text-green-800';
      case 'analytics':
        return 'bg-purple-100 text-purple-800';
      case 'storage':
        return 'bg-orange-100 text-orange-800';
      case 'development':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = [
    { id: 'all', name: 'Todas', count: integrations.length },
    { id: 'productivity', name: 'Productividad', count: integrations.filter(i => i.category === 'productivity').length },
    { id: 'communication', name: 'Comunicación', count: integrations.filter(i => i.category === 'communication').length },
    { id: 'analytics', name: 'Analytics', count: integrations.filter(i => i.category === 'analytics').length },
    { id: 'storage', name: 'Almacenamiento', count: integrations.filter(i => i.category === 'storage').length },
    { id: 'development', name: 'Desarrollo', count: integrations.filter(i => i.category === 'development').length }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hub de Integraciones</h2>
          <p className="text-gray-600">Conecta Stack21 con tus herramientas favoritas</p>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>Actualizar</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Nueva Integración</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar integraciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilterCategory(category.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Integraciones</p>
              <p className="text-2xl font-bold text-gray-900">{integrations.length}</p>
            </div>
            <Zap className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conectadas</p>
              <p className="text-2xl font-bold text-green-500">
                {integrations.filter(i => i.status === 'connected').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Acciones Totales</p>
              <p className="text-2xl font-bold text-gray-900">
                {integrations.reduce((acc, i) => acc + i.actions, 0)}
              </p>
            </div>
            <Settings className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Con Errores</p>
              <p className="text-2xl font-bold text-red-500">
                {integrations.filter(i => i.status === 'error').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </motion.div>
      </div>

      {/* Lista de integraciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration, index) => (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{integration.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                    <span>{integration.name}</span>
                    {integration.isPopular && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Popular
                      </span>
                    )}
                    {integration.isNew && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Nuevo
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(integration.status)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(integration.category)}`}>
                  {integration.category}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Acciones disponibles</span>
                <span className="font-medium">{integration.actions}</span>
              </div>
              
              {integration.lastSync && (
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Última sincronización</span>
                  <span className="font-medium">
                    {integration.lastSync.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                {integration.status === 'connected' ? (
                  <>
                    <button
                      onClick={() => disconnectIntegration(integration.id)}
                      className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                    >
                      Desconectar
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => connectIntegration(integration.id)}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    Conectar
                  </button>
                )}
                <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredIntegrations.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron integraciones</h3>
          <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
        </motion.div>
      )}
    </div>
  );
}
