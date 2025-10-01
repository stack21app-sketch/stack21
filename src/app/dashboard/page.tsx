'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Play, 
  Zap, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  Activity,
  Users,
  Database,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface DashboardStats {
  totalWorkflows: number;
  activeWorkflows: number;
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  totalConnections: number;
  recentRuns: any[];
  workflowsByStatus: { [key: string]: number };
  runsByDay: { date: string; count: number }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simular carga de datos del dashboard
      const mockStats: DashboardStats = {
        totalWorkflows: 12,
        activeWorkflows: 8,
        totalRuns: 156,
        successfulRuns: 142,
        failedRuns: 14,
        totalConnections: 24,
        recentRuns: [
          {
            id: 'run_1',
            workflowName: 'Procesar Datos de Formulario',
            status: 'completed',
            startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            duration: 3000
          },
          {
            id: 'run_2',
            workflowName: 'Sincronizar Datos CRM',
            status: 'completed',
            startedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            duration: 15000
          },
          {
            id: 'run_3',
            workflowName: 'Backup Automático',
            status: 'running',
            startedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            duration: null
          }
        ],
        workflowsByStatus: {
          active: 8,
          inactive: 3,
          draft: 1
        },
        runsByDay: [
          { date: '2024-01-15', count: 12 },
          { date: '2024-01-16', count: 18 },
          { date: '2024-01-17', count: 15 },
          { date: '2024-01-18', count: 22 },
          { date: '2024-01-19', count: 19 },
          { date: '2024-01-20', count: 25 },
          { date: '2024-01-21', count: 21 }
        ]
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">No se pudieron cargar los datos del dashboard</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const successRate = stats.totalRuns > 0 ? ((stats.successfulRuns / stats.totalRuns) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Resumen de tu plataforma de automatización
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Workflows Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeWorkflows}</p>
                <p className="text-sm text-gray-500">de {stats.totalWorkflows} total</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ejecuciones Totales</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRuns}</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +12% vs mes anterior
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasa de Éxito</p>
                <p className="text-2xl font-bold text-gray-900">{successRate}%</p>
                <p className="text-sm text-gray-500">{stats.successfulRuns} exitosas</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conexiones</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalConnections}</p>
                <p className="text-sm text-gray-500">apps conectadas</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Runs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Ejecuciones Recientes
              </h2>
              <Link
                href="/runs"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Ver todas
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {stats.recentRuns.map((run) => (
                <div key={run.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(run.status)}
                    <div>
                      <p className="font-medium text-gray-900">{run.workflowName}</p>
                      <p className="text-sm text-gray-500">{formatDate(run.startedAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {run.duration && (
                      <p className="text-sm text-gray-600">{formatDuration(run.duration)}</p>
                    )}
                    <p className={`text-xs px-2 py-1 rounded-full ${
                      run.status === 'completed' ? 'bg-green-100 text-green-800' :
                      run.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {run.status === 'completed' ? 'Completado' :
                       run.status === 'failed' ? 'Fallido' : 'Ejecutando'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Workflow Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Estado de Workflows
              </h2>
              <Link
                href="/workflows"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Gestionar
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Activos</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.workflowsByStatus.active}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Inactivos</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.workflowsByStatus.inactive}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Borradores</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.workflowsByStatus.draft}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Ejecuciones por día</span>
                <span className="text-sm text-gray-500">Últimos 7 días</span>
              </div>
              <div className="flex items-end gap-2 h-20">
                {stats.runsByDay.map((day, index) => (
                  <div key={day.date} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${(day.count / 25) * 100}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(day.date).getDate()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white rounded-lg border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/workflows/new"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Crear Workflow</p>
                <p className="text-sm text-gray-500">Automatiza tus procesos</p>
              </div>
            </Link>

            <Link
              href="/templates"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Usar Plantilla</p>
                <p className="text-sm text-gray-500">Comienza con plantillas</p>
              </div>
            </Link>

            <Link
              href="/apps"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Conectar Apps</p>
                <p className="text-sm text-gray-500">Integra tus servicios</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}