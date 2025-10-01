'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Zap, 
  Clock, 
  DollarSign,
  Activity,
  Target,
  Award,
  Calendar
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    monthlyGrowth: number;
    activeUsers: number;
    conversionRate: number;
    avgSessionTime: number;
    bounceRate: number;
  };
  realTime: {
    currentUsers: number;
    pageViews: number;
    events: number;
    errors: number;
  };
  trends: {
    daily: Array<{ date: string; value: number }>;
    weekly: Array<{ week: string; value: number }>;
    monthly: Array<{ month: string; value: number }>;
  };
  topPages: Array<{ page: string; views: number; conversion: number }>;
  userSegments: Array<{ segment: string; count: number; percentage: number }>;
}

export function AdvancedAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      
      // Simular datos realistas
      const mockData: AnalyticsData = {
        overview: {
          totalRevenue: 125430,
          monthlyGrowth: 23.5,
          activeUsers: 2847,
          conversionRate: 12.8,
          avgSessionTime: 8.5,
          bounceRate: 34.2
        },
        realTime: {
          currentUsers: Math.floor(Math.random() * 50) + 20,
          pageViews: Math.floor(Math.random() * 200) + 100,
          events: Math.floor(Math.random() * 500) + 300,
          errors: Math.floor(Math.random() * 10)
        },
        trends: {
          daily: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            value: Math.floor(Math.random() * 1000) + 500
          })),
          weekly: Array.from({ length: 12 }, (_, i) => ({
            week: `Semana ${i + 1}`,
            value: Math.floor(Math.random() * 5000) + 2000
          })),
          monthly: Array.from({ length: 12 }, (_, i) => ({
            month: new Date(2024, i).toLocaleString('es', { month: 'short' }),
            value: Math.floor(Math.random() * 20000) + 10000
          }))
        },
        topPages: [
          { page: '/dashboard', views: 15420, conversion: 15.2 },
          { page: '/workflow-builder', views: 8930, conversion: 8.7 },
          { page: '/analytics', views: 6720, conversion: 12.1 },
          { page: '/marketplace', views: 5430, conversion: 6.8 },
          { page: '/settings', views: 3210, conversion: 4.2 }
        ],
        userSegments: [
          { segment: 'Nuevos usuarios', count: 1240, percentage: 43.5 },
          { segment: 'Usuarios activos', count: 890, percentage: 31.2 },
          { segment: 'Usuarios premium', count: 450, percentage: 15.8 },
          { segment: 'Usuarios inactivos', count: 267, percentage: 9.5 }
        ]
      };

      setTimeout(() => {
        setData(mockData);
        setLoading(false);
      }, 1000);
    };

    fetchAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Avanzado</h2>
        <div className="flex space-x-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">
              +{data.overview.monthlyGrowth}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            ${data.overview.totalRevenue.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-600">Ingresos totales</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-blue-600 font-medium">
              +12.3%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {data.overview.activeUsers.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-600">Usuarios activos</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-purple-600 font-medium">
              +5.2%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {data.overview.conversionRate}%
          </h3>
          <p className="text-sm text-gray-600">Tasa de conversión</p>
        </motion.div>
      </div>

      {/* Métricas en tiempo real */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-green-500" />
          Métricas en Tiempo Real
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{data.realTime.currentUsers}</div>
            <div className="text-sm text-gray-600">Usuarios ahora</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{data.realTime.pageViews}</div>
            <div className="text-sm text-gray-600">Vistas hoy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{data.realTime.events}</div>
            <div className="text-sm text-gray-600">Eventos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{data.realTime.errors}</div>
            <div className="text-sm text-gray-600">Errores</div>
          </div>
        </div>
      </motion.div>

      {/* Páginas más visitadas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Páginas Más Visitadas</h3>
        <div className="space-y-3">
          {data.topPages.map((page, index) => (
            <div key={page.page} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium text-gray-600">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{page.page}</div>
                  <div className="text-sm text-gray-500">{page.views.toLocaleString()} vistas</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">{page.conversion}%</div>
                <div className="text-sm text-gray-500">conversión</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Segmentos de usuarios */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Segmentos de Usuarios</h3>
        <div className="space-y-4">
          {data.userSegments.map((segment) => (
            <div key={segment.segment} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-gray-900">{segment.segment}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">{segment.count.toLocaleString()}</div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${segment.percentage}%` }}
                  ></div>
                </div>
                <div className="text-sm font-medium text-gray-900 w-12 text-right">
                  {segment.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
