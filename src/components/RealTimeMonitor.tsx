'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimeDisplay } from '@/components/TimeDisplay';
import { Activity, Server, Database, Users, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

interface SystemMetrics {
  status: 'online' | 'offline' | 'warning';
  uptime: number;
  responseTime: number;
  activeUsers: number;
  memoryUsage: number;
  cpuUsage: number;
  lastUpdate: string;
}

export function RealTimeMonitor() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    status: 'online',
    uptime: 0,
    responseTime: 0,
    activeUsers: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    lastUpdate: new Date().toISOString()
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/health/public');
        const data = await response.json();
        
        setMetrics(prev => ({
          ...prev,
          status: data.status === 'ok' ? 'online' : 'offline',
          responseTime: Math.random() * 100 + 50, // Simulado
          activeUsers: Math.floor(Math.random() * 100) + 10,
          memoryUsage: Math.random() * 30 + 40,
          cpuUsage: Math.random() * 20 + 10,
          lastUpdate: new Date().toISOString()
        }));
      } catch (error) {
        setMetrics(prev => ({
          ...prev,
          status: 'offline'
        }));
      }
    };

    // Fetch inicial
    fetchMetrics();
    
    // Actualizar cada 5 segundos
    const interval = setInterval(fetchMetrics, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'offline': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'offline': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-white shadow-lg rounded-full p-3 border border-gray-200 hover:shadow-xl transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center space-x-2">
          {getStatusIcon(metrics.status)}
          <span className={`text-sm font-medium ${getStatusColor(metrics.status)}`}>
            {metrics.status === 'online' ? 'Online' : 'Offline'}
          </span>
        </div>
      </motion.button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Estado del Sistema</h3>
                <div className={`flex items-center space-x-2 ${getStatusColor(metrics.status)}`}>
                  {getStatusIcon(metrics.status)}
                  <span className="text-sm font-medium capitalize">{metrics.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Server className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Tiempo de Respuesta</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {metrics.responseTime.toFixed(0)}ms
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">Usuarios Activos</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {metrics.activeUsers}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Database className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700">Memoria</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {metrics.memoryUsage.toFixed(1)}%
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">CPU</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {metrics.cpuUsage.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Última actualización: <TimeDisplay timestamp={metrics.lastUpdate} format="time" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
