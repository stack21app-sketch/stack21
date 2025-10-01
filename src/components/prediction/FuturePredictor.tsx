'use client';

import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Clock, Target, Zap } from 'lucide-react';

interface Prediction {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description: string;
  probability: number;
  timeframe: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
}

export function FuturePredictor() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(null);

  useEffect(() => {
    // Simular predicciones del futuro
    const mockPredictions: Prediction[] = [
      {
        id: '1',
        type: 'success',
        title: 'Aumento de Conversiones',
        description: 'Tu workflow de marketing generará un 47% más de conversiones en los próximos 30 días',
        probability: 94,
        timeframe: '30 días',
        impact: 'high',
        confidence: 92
      },
      {
        id: '2',
        type: 'warning',
        title: 'Posible Error en Workflow',
        description: 'Detectamos un patrón que podría causar fallos en el workflow de facturación',
        probability: 78,
        timeframe: '7 días',
        impact: 'medium',
        confidence: 85
      },
      {
        id: '3',
        type: 'info',
        title: 'Nueva Oportunidad de Mercado',
        description: 'El análisis de datos sugiere una oportunidad en el mercado B2B que podrías aprovechar',
        probability: 67,
        timeframe: '60 días',
        impact: 'high',
        confidence: 88
      },
      {
        id: '4',
        type: 'error',
        title: 'Riesgo de Sobrecarga del Sistema',
        description: 'El crecimiento actual podría sobrecargar el sistema en 45 días',
        probability: 82,
        timeframe: '45 días',
        impact: 'critical',
        confidence: 90
      }
    ];
    setPredictions(mockPredictions);
  }, []);

  const analyzeFuture = () => {
    setIsAnalyzing(true);
    
    // Simular análisis del futuro
    setTimeout(() => {
      const newPrediction: Prediction = {
        id: Date.now().toString(),
        type: 'info',
        title: 'Nueva Predicción Generada',
        description: 'El sistema ha analizado 10,000+ variables y generado una nueva predicción',
        probability: Math.floor(Math.random() * 40) + 60,
        timeframe: 'Próximos días',
        impact: 'medium',
        confidence: Math.floor(Math.random() * 20) + 80
      };
      
      setPredictions(prev => [newPrediction, ...prev]);
      setCurrentPrediction(newPrediction);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'info': return <Target className="w-5 h-5 text-blue-500" />;
      default: return <Brain className="w-5 h-5 text-[var(--muted)]" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 90) return 'text-green-600';
    if (probability >= 70) return 'text-yellow-600';
    if (probability >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-6 shadow-soft">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[var(--text)]">Predictor del Futuro</h3>
          <p className="text-sm text-[var(--muted)]">IA que predice el futuro de tu negocio</p>
        </div>
      </div>

      {/* Botón de análisis */}
      <div className="mb-6">
        <button
          onClick={analyzeFuture}
          disabled={isAnalyzing}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
        >
            {isAnalyzing ? (
              <>
                <div className="animate-spin">
                  <Brain className="w-5 h-5" />
                </div>
                Analizando el futuro...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                Analizar Futuro
              </>
            )}
        </button>
      </div>

      {/* Predicciones */}
      <div className="space-y-4">
        {predictions.map((prediction) => (
          <div
            key={prediction.id}
            className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-md ${
              currentPrediction?.id === prediction.id 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-[var(--border)] hover:border-purple-300'
            }`}
            onClick={() => setCurrentPrediction(prediction)}
          >
            <div className="flex items-start gap-3">
              {getTypeIcon(prediction.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-[var(--text)]">{prediction.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getImpactColor(prediction.impact)}`}>
                      {prediction.impact}
                    </span>
                    <span className={`text-sm font-bold ${getProbabilityColor(prediction.probability)}`}>
                      {prediction.probability}%
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-[var(--muted)] mb-3">{prediction.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {prediction.timeframe}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {prediction.confidence}% confianza
                  </div>
                </div>
                
                {/* Barra de probabilidad */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        prediction.probability >= 90 ? 'bg-green-500' :
                        prediction.probability >= 70 ? 'bg-yellow-500' :
                        prediction.probability >= 50 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${prediction.probability}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detalles de la predicción seleccionada */}
      {currentPrediction && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-[var(--text)] mb-3">Análisis Detallado</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{currentPrediction.probability}%</div>
              <div className="text-xs text-[var(--muted)]">Probabilidad</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{currentPrediction.confidence}%</div>
              <div className="text-xs text-[var(--muted)]">Confianza</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{currentPrediction.timeframe}</div>
              <div className="text-xs text-[var(--muted)]">Tiempo</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 capitalize">{currentPrediction.impact}</div>
              <div className="text-xs text-[var(--muted)]">Impacto</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
