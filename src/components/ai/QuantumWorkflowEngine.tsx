'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Brain, 
  Cpu, 
  Activity, 
  TrendingUp, 
  Sparkles,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

export function QuantumWorkflowEngine() {
  const [isActive, setIsActive] = useState(false);
  const [quantumState, setQuantumState] = useState('idle');
  const [workflowsGenerated, setWorkflowsGenerated] = useState(0);
  const [efficiency, setEfficiency] = useState(94.7);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setWorkflowsGenerated(prev => prev + Math.floor(Math.random() * 3) + 1);
        setEfficiency(prev => Math.min(99.9, prev + (Math.random() * 0.5 - 0.2)));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const toggleEngine = () => {
    setIsActive(!isActive);
    setQuantumState(isActive ? 'idle' : 'processing');
  };

  const resetEngine = () => {
    setIsActive(false);
    setQuantumState('idle');
    setWorkflowsGenerated(0);
    setEfficiency(94.7);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Motor Cuántico de Workflows</h3>
            <p className="text-sm text-gray-600">Generación automática inteligente</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleEngine}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              isActive
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isActive ? 'Pausar' : 'Activar'}
          </button>
          
          <button
            onClick={resetEngine}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Estado Cuántico */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Estado Cuántico</span>
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
            quantumState === 'processing' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {quantumState === 'processing' ? 'Procesando' : 'Inactivo'}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: isActive ? '100%' : '0%' }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Métricas en Tiempo Real */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-600">Workflows Generados</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{workflowsGenerated}</div>
          <div className="text-xs text-green-600">+{Math.floor(workflowsGenerated * 0.3)} esta hora</div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-gray-600">Eficiencia</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{efficiency.toFixed(1)}%</div>
          <div className="text-xs text-green-600">+0.3% vs ayer</div>
        </div>
      </div>

      {/* Algoritmos Activos */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-800 mb-3">Algoritmos Activos</h4>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <Cpu className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Análisis de Patrones</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">Optimización Automática</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Generación Creativa</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
          </div>
        </div>
      </div>

      {/* Progreso de Aprendizaje */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg border border-purple-200"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Aprendiendo de tus patrones...</span>
          </div>
          <div className="text-xs text-purple-600">
            El motor está analizando tus workflows existentes para generar automáticamente nuevas optimizaciones.
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
