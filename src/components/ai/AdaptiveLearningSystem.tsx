'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  BookOpen, 
  TrendingUp, 
  Target,
  Lightbulb,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface LearningPattern {
  id: string;
  pattern: string;
  frequency: number;
  confidence: number;
  lastSeen: string;
  category: 'workflow' | 'user_behavior' | 'performance' | 'error';
}

interface LearningInsight {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  category: string;
}

export function AdaptiveLearningSystem() {
  const [patterns, setPatterns] = useState<LearningPattern[]>([
    {
      id: '1',
      pattern: 'Workflows de email marketing ejecutados los martes',
      frequency: 89,
      confidence: 94,
      lastSeen: 'Hace 2 horas',
      category: 'workflow'
    },
    {
      id: '2',
      pattern: 'Usuarios prefieren interfaces simples en móviles',
      frequency: 76,
      confidence: 87,
      lastSeen: 'Hace 1 día',
      category: 'user_behavior'
    },
    {
      id: '3',
      pattern: 'Picos de rendimiento entre 9-11 AM',
      frequency: 92,
      confidence: 96,
      lastSeen: 'Hace 3 horas',
      category: 'performance'
    },
    {
      id: '4',
      pattern: 'Errores de conexión aumentan en horario pico',
      frequency: 68,
      confidence: 82,
      lastSeen: 'Hace 5 horas',
      category: 'error'
    }
  ]);

  const [insights, setInsights] = useState<LearningInsight[]>([
    {
      id: '1',
      title: 'Optimización de Horarios',
      description: 'Los workflows de marketing tienen 23% mejor rendimiento cuando se ejecutan los martes',
      impact: 'high',
      confidence: 94,
      category: 'Performance'
    },
    {
      id: '2',
      title: 'Preferencias de UI',
      description: 'Los usuarios interactúan 40% más con interfaces minimalistas',
      impact: 'medium',
      confidence: 87,
      category: 'UX'
    },
    {
      id: '3',
      title: 'Gestión de Recursos',
      description: 'Escalar recursos automáticamente entre 9-11 AM mejora la eficiencia',
      impact: 'high',
      confidence: 96,
      category: 'Infrastructure'
    }
  ]);

  const [learningProgress, setLearningProgress] = useState(0);
  const [isLearning, setIsLearning] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setLearningProgress(prev => Math.min(100, prev + Math.random() * 2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'workflow': return <Target className="w-4 h-4 text-blue-500" />;
      case 'user_behavior': return <Users className="w-4 h-4 text-green-500" />;
      case 'performance': return <TrendingUp className="w-4 h-4 text-purple-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Brain className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'workflow': return 'bg-blue-100 text-blue-800';
      case 'user_behavior': return 'bg-green-100 text-green-800';
      case 'performance': return 'bg-purple-100 text-purple-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="card p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Sistema de Aprendizaje Adaptativo</h3>
            <p className="text-sm text-gray-600">IA que aprende de tus patrones</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isLearning ? 'bg-indigo-500 animate-pulse' : 'bg-gray-300'}`} />
          <span className="text-sm text-gray-600">
            {isLearning ? 'Aprendiendo...' : 'Inactivo'}
          </span>
        </div>
      </div>

      {/* Progreso de Aprendizaje */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Progreso de Aprendizaje</span>
          <span className="text-sm font-medium text-gray-800">{Math.round(learningProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${learningProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          El sistema está analizando patrones y mejorando continuamente
        </div>
      </div>

      {/* Métricas de Aprendizaje */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">{patterns.length}</div>
          <div className="text-xs text-gray-600">Patrones Detectados</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{insights.length}</div>
          <div className="text-xs text-gray-600">Insights Generados</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">94%</div>
          <div className="text-xs text-gray-600">Precisión</div>
        </div>
      </div>

      {/* Patrones Aprendidos */}
      <div className="space-y-4 mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">Patrones Aprendidos</h4>
        
        {patterns.map((pattern, index) => (
          <motion.div
            key={pattern.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getCategoryIcon(pattern.category)}
                <div>
                  <h5 className="font-medium text-gray-800">{pattern.pattern}</h5>
                  <p className="text-sm text-gray-600">{pattern.lastSeen}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(pattern.category)}`}>
                  {pattern.category}
                </span>
                <span className="text-sm font-medium text-indigo-600">
                  {pattern.confidence}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                Frecuencia: {pattern.frequency}%
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Confianza: {pattern.confidence}%
              </div>
            </div>

            {/* Barra de Frecuencia */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <motion.div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pattern.frequency}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Insights Generados */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-800 mb-3">Insights Inteligentes</h4>
        
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                <div>
                  <h5 className="font-medium text-gray-800">{insight.title}</h5>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getImpactColor(insight.impact)}`}>
                  {insight.impact}
                </span>
                <span className="text-sm font-medium text-indigo-600">
                  {insight.confidence}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {insight.category}
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Confianza: {insight.confidence}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Estado del Sistema */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLearning ? 'bg-indigo-500 animate-pulse' : 'bg-gray-300'}`} />
            <span className="text-sm text-gray-600">
              {isLearning ? 'Analizando patrones en tiempo real...' : 'Sistema en pausa'}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            Última actualización: hace 1 min
          </div>
        </div>
      </div>
    </motion.div>
  );
}
