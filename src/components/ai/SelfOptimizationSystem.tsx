'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Zap, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Target,
  BarChart3,
  Clock
} from 'lucide-react';

interface Optimization {
  id: string;
  category: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  status: 'completed' | 'in-progress' | 'pending';
  improvement: number;
  estimatedTime: string;
}

export function SelfOptimizationSystem() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizations, setOptimizations] = useState<Optimization[]>([
    {
      id: '1',
      category: 'Performance',
      description: 'Optimización de consultas de base de datos',
      impact: 'high',
      status: 'completed',
      improvement: 23,
      estimatedTime: '2 min'
    },
    {
      id: '2',
      category: 'UI/UX',
      description: 'Mejora de tiempos de carga de componentes',
      impact: 'medium',
      status: 'in-progress',
      improvement: 15,
      estimatedTime: '5 min'
    },
    {
      id: '3',
      category: 'API',
      description: 'Cache inteligente de respuestas frecuentes',
      impact: 'high',
      status: 'pending',
      improvement: 31,
      estimatedTime: '8 min'
    },
    {
      id: '4',
      category: 'Security',
      description: 'Actualización de políticas de autenticación',
      impact: 'high',
      status: 'pending',
      improvement: 12,
      estimatedTime: '3 min'
    }
  ]);

  const [overallImprovement, setOverallImprovement] = useState(0);

  useEffect(() => {
    const completedOptimizations = optimizations.filter(opt => opt.status === 'completed');
    const totalImprovement = completedOptimizations.reduce((sum, opt) => sum + opt.improvement, 0);
    setOverallImprovement(totalImprovement);
  }, [optimizations]);

  const startOptimization = () => {
    setIsOptimizing(true);
    
    // Simular proceso de optimización
    setTimeout(() => {
      setOptimizations(prev => prev.map(opt => 
        opt.status === 'pending' 
          ? { ...opt, status: 'in-progress' }
          : opt
      ));
    }, 2000);

    setTimeout(() => {
      setOptimizations(prev => prev.map(opt => 
        opt.status === 'in-progress' 
          ? { ...opt, status: 'completed' }
          : opt
      ));
      setIsOptimizing(false);
    }, 8000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completedCount = optimizations.filter(opt => opt.status === 'completed').length;
  const inProgressCount = optimizations.filter(opt => opt.status === 'in-progress').length;
  const pendingCount = optimizations.filter(opt => opt.status === 'pending').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Sistema de Auto-Optimización</h3>
            <p className="text-sm text-gray-600">Mejora continua automática</p>
          </div>
        </div>
        
        <button
          onClick={startOptimization}
          disabled={isOptimizing || pendingCount === 0}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          {isOptimizing ? 'Optimizando...' : 'Optimizar'}
        </button>
      </div>

      {/* Métricas Generales */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          <div className="text-xs text-gray-600">Completadas</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{inProgressCount}</div>
          <div className="text-xs text-gray-600">En Progreso</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">{pendingCount}</div>
          <div className="text-xs text-gray-600">Pendientes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">+{overallImprovement}%</div>
          <div className="text-xs text-gray-600">Mejora Total</div>
        </div>
      </div>

      {/* Barra de Progreso General */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Progreso de Optimización</span>
          <span className="text-sm font-medium text-gray-800">
            {Math.round((completedCount / optimizations.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / optimizations.length) * 100}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Lista de Optimizaciones */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-800 mb-3">Optimizaciones Activas</h4>
        
        {optimizations.map((optimization, index) => (
          <motion.div
            key={optimization.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(optimization.status)}
                <div>
                  <h5 className="font-medium text-gray-800">{optimization.description}</h5>
                  <p className="text-sm text-gray-600">{optimization.category}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getImpactColor(optimization.impact)}`}>
                  {optimization.impact}
                </span>
                <span className="text-sm font-medium text-green-600">
                  +{optimization.improvement}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {optimization.estimatedTime}
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                Mejora: +{optimization.improvement}%
              </div>
            </div>

            {/* Barra de Progreso Individual */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <motion.div
                  className={`h-1 rounded-full ${
                    optimization.status === 'completed' 
                      ? 'bg-green-500' 
                      : optimization.status === 'in-progress'
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ 
                    width: optimization.status === 'completed' 
                      ? '100%' 
                      : optimization.status === 'in-progress'
                      ? '60%'
                      : '0%'
                  }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Estado del Sistema */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isOptimizing ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
            <span className="text-sm text-gray-600">
              {isOptimizing ? 'Optimizando automáticamente...' : 'Sistema inactivo'}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Target className="w-4 h-4" />
            {pendingCount} optimizaciones pendientes
          </div>
        </div>
      </div>
    </motion.div>
  );
}
