'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Clock, 
  HardDrive, 
  Database,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { 
  PerformanceMonitor, 
  getPerformanceMetrics, 
  getOptimizationSuggestions,
  applyOptimization,
  type PerformanceMetrics,
  type OptimizationSuggestion
} from '@/lib/performance-optimizer';

export const PerformanceMonitorComponent: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(getPerformanceMetrics());
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitor] = useState(new PerformanceMonitor());
  const [applyingOptimization, setApplyingOptimization] = useState<string | null>(null);

  useEffect(() => {
    const newSuggestions = getOptimizationSuggestions(metrics);
    setSuggestions(newSuggestions);
  }, [metrics]);

  const startMonitoring = () => {
    setIsMonitoring(true);
    monitor.startMonitoring(3000); // Actualizar cada 3 segundos
    
    monitor.subscribe((newMetrics) => {
      setMetrics(newMetrics);
    });
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    // En una implementación real, aquí pararías el monitor
  };

  const handleApplyOptimization = async (type: OptimizationSuggestion['type']) => {
    setApplyingOptimization(type);
    try {
      await applyOptimization(type);
      // Simular mejora en métricas
      setMetrics(prev => ({
        ...prev,
        loadTime: prev.loadTime * 0.8,
        renderTime: prev.renderTime * 0.9,
        apiResponseTime: prev.apiResponseTime * 0.7,
      }));
    } catch (error) {
      console.error('Error applying optimization:', error);
    } finally {
      setApplyingOptimization(null);
    }
  };

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'loadTime': return <Clock className="w-4 h-4" />;
      case 'renderTime': return <Zap className="w-4 h-4" />;
      case 'memoryUsage': return <HardDrive className="w-4 h-4" />;
      case 'bundleSize': return <Database className="w-4 h-4" />;
      case 'apiResponseTime': return <Activity className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getMetricColor = (value: number, type: string) => {
    const thresholds = {
      loadTime: { good: 1000, warning: 2000 },
      renderTime: { good: 200, warning: 400 },
      memoryUsage: { good: 20, warning: 40 },
      bundleSize: { good: 500, warning: 1000 },
      apiResponseTime: { good: 400, warning: 800 },
    };

    const threshold = thresholds[type as keyof typeof thresholds];
    if (value <= threshold.good) return 'text-green-600';
    if (value <= threshold.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatMetric = (value: number, type: string) => {
    switch (type) {
      case 'loadTime':
      case 'renderTime':
      case 'apiResponseTime':
        return `${Math.round(value)}ms`;
      case 'memoryUsage':
        return `${Math.round(value)}MB`;
      case 'bundleSize':
        return `${Math.round(value)}KB`;
      default:
        return value.toString();
    }
  };

  const getPriorityIcon = (priority: OptimizationSuggestion['priority']) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Info className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getEffortColor = (effort: OptimizationSuggestion['effort']) => {
    switch (effort) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Monitor de Rendimiento</h2>
          <p className="text-sm text-gray-600 mt-1">
            Monitorea y optimiza el rendimiento de la aplicación
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
          <button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isMonitoring 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isMonitoring ? 'Detener' : 'Iniciar'} Monitoreo
          </button>
        </div>
      </div>

      {/* Métricas en tiempo real */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {Object.entries(metrics).map(([key, value]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              {getMetricIcon(key)}
              <span className="text-sm font-medium text-gray-600 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
            <div className={`text-2xl font-bold ${getMetricColor(value, key)}`}>
              {formatMetric(value, key)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sugerencias de optimización */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Sugerencias de Optimización</h3>
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {getPriorityIcon(suggestion.priority)}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-blue-600">Impacto: {suggestion.impact}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getEffortColor(suggestion.effort)}`}>
                      Esfuerzo: {suggestion.effort}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleApplyOptimization(suggestion.type)}
                disabled={applyingOptimization === suggestion.type}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {applyingOptimization === suggestion.type ? 'Aplicando...' : 'Aplicar'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Estado del sistema */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Estado del sistema: {isMonitoring ? 'Monitoreando' : 'Inactivo'}
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600">Rendimiento estable</span>
          </div>
        </div>
      </div>
    </div>
  );
};
