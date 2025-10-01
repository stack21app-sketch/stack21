'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Mail, Clock, DollarSign, Zap, Activity, Calendar, Download } from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  const metrics = [
    { name: 'Workflows Activos', value: '12', change: '+2', icon: Zap, color: 'blue' },
    { name: 'Ejecuciones Totales', value: '1,247', change: '+15%', icon: Activity, color: 'green' },
    { name: 'Emails Enviados', value: '3,456', change: '+8%', icon: Mail, color: 'purple' },
    { name: 'Usuarios Activos', value: '892', change: '+12%', icon: Users, color: 'orange' },
    { name: 'Tiempo Ahorrado', value: '47h', change: '+23%', icon: Clock, color: 'red' },
    { name: 'Ahorro Estimado', value: '$2,340', change: '+18%', icon: DollarSign, color: 'emerald' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Analytics & Reportes
              </h1>
              <p className="text-gray-600">
                Insights detallados sobre el rendimiento de tus automatizaciones
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm"
              >
                <option value="7d">Últimos 7 días</option>
                <option value="30d">Últimos 30 días</option>
                <option value="90d">Últimos 90 días</option>
                <option value="1y">Último año</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
                <Download className="w-4 h-4" />
                Exportar
              </button>
            </div>
          </div>
        </motion.div>

        {/* Métricas Principales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        >
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${metric.color}-100 rounded-lg flex items-center justify-center`}>
                  <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  metric.change.startsWith('+') 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {metric.change}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.name}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Gráficos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Gráfico de Ejecuciones */}
          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Ejecuciones por Día</h3>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Gráfico de ejecuciones</p>
              </div>
            </div>
          </div>

          {/* Gráfico de Tiempo de Respuesta */}
          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Tiempo de Respuesta</h3>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Gráfico de tiempo de respuesta</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tablas de Datos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Top Workflows */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-6">Top Workflows</h3>
            <div className="space-y-4">
              {[
                { name: 'Automatización de Leads', executions: 456, success: '94%' },
                { name: 'Notificaciones de Ventas', executions: 234, success: '87%' },
                { name: 'Sincronización CRM', executions: 189, success: '99%' },
                { name: 'Reportes Semanales', executions: 156, success: '92%' },
                { name: 'Backup Automático', executions: 123, success: '100%' }
              ].map((workflow, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-[var(--text)]">{workflow.name}</div>
                    <div className="text-sm text-[var(--muted)]">{workflow.executions} ejecuciones</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">{workflow.success}</div>
                    <div className="text-xs text-[var(--muted)]">éxito</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6">
            <h3 className="text-lg font-semibold text-[var(--text)] mb-6">Actividad Reciente</h3>
            <div className="space-y-4">
              {[
                { action: 'Workflow ejecutado', target: 'Automatización de Leads', time: 'hace 2 min', status: 'success' },
                { action: 'Email enviado', target: 'Newsletter #45', time: 'hace 15 min', status: 'success' },
                { action: 'Error en workflow', target: 'Sincronización CRM', time: 'hace 1 hora', status: 'error' },
                { action: 'Nuevo suscriptor', target: 'Lista Newsletter', time: 'hace 2 horas', status: 'info' },
                { action: 'Backup completado', target: 'Base de datos', time: 'hace 3 horas', status: 'success' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="font-medium text-[var(--text)]">{activity.action}</div>
                    <div className="text-sm text-[var(--muted)]">{activity.target}</div>
                  </div>
                  <div className="text-xs text-[var(--muted)]">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}