'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb,
  Target,
  BarChart3,
  Clock,
  CheckCircle
} from 'lucide-react';

interface Prediction {
  id: string;
  type: 'opportunity' | 'risk' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
}

export function PredictiveIntelligence() {
  const [predictions, setPredictions] = useState<Prediction[]>([
    {
      id: '1',
      type: 'opportunity',
      title: 'Optimización de Email Marketing',
      description: 'Detectamos que puedes mejorar el CTR en un 23% ajustando el horario de envío',
      confidence: 87,
      impact: 'high',
      timeframe: 'Próximos 7 días'
    },
    {
      id: '2',
      type: 'risk',
      title: 'Posible Sobre carga del Sistema',
      description: 'El volumen de workflows aumentará 40% la próxima semana',
      confidence: 92,
      impact: 'medium',
      timeframe: 'Próximos 3 días'
    },
    {
      id: '3',
      type: 'optimization',
      title: 'Automatización de Respuestas',
      description: 'Puedes automatizar el 67% de las consultas de soporte',
      confidence: 78,
      impact: 'high',
      timeframe: 'Próximos 14 días'
    }
  ]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnalyzing(true);
      setTimeout(() => setIsAnalyzing(false), 2000);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Lightbulb className="w-4 h-4 text-green-500" />;
      case 'risk': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'optimization': return <Target className="w-4 h-4 text-blue-500" />;
      default: return <Brain className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-green-50 border-green-200 text-green-800';
      case 'risk': return 'bg-red-50 border-red-200 text-red-800';
      case 'optimization': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
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
      transition={{ duration: 0.6, delay: 0.2 }}
      className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Inteligencia Predictiva</h3>
            <p className="text-sm text-gray-600">Anticipa oportunidades y riesgos</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isAnalyzing ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
          <span className="text-sm text-gray-600">
            {isAnalyzing ? 'Analizando...' : 'Activo'}
          </span>
        </div>
      </div>

      {/* Métricas de Predicción */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">3</div>
          <div className="text-xs text-gray-600">Predicciones Activas</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">94%</div>
          <div className="text-xs text-gray-600">Precisión Promedio</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">12h</div>
          <div className="text-xs text-gray-600">Tiempo de Análisis</div>
        </div>
      </div>

      {/* Lista de Predicciones */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800 mb-3">Predicciones Inteligentes</h4>
        
        {predictions.map((prediction, index) => (
          <motion.div
            key={prediction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getTypeIcon(prediction.type)}
                <div>
                  <h5 className="font-medium text-gray-800">{prediction.title}</h5>
                  <p className="text-sm text-gray-600">{prediction.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getImpactColor(prediction.impact)}`}>
                  {prediction.impact}
                </span>
                <span className="text-xs text-gray-500">{prediction.confidence}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {prediction.timeframe}
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                Confianza: {prediction.confidence}%
              </div>
            </div>

            {/* Barra de Confianza */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${prediction.confidence}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Acciones Rápidas */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600">Última actualización: hace 2 minutos</span>
          </div>
          
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Ver todas las predicciones →
          </button>
        </div>
      </div>
    </motion.div>
  );
}
