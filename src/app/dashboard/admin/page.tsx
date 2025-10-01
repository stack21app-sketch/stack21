'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Activity, 
  DollarSign, 
  Server, 
  Database, 
  Settings, 
  BarChart3, 
  Shield, 
  Bell, 
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe
} from 'lucide-react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStats, setSystemStats] = useState({
    totalUsers: 1247,
    activeWorkflows: 89,
    totalRevenue: 45230,
    systemHealth: 98.5,
    apiCalls: 156789,
    storage: 2.3
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'user_signup', user: 'Juan Pérez', timestamp: '2025-09-27 10:30', status: 'success' },
    { id: 2, type: 'workflow_created', user: 'María García', timestamp: '2025-09-27 10:25', status: 'success' },
    { id: 3, type: 'payment_failed', user: 'Carlos López', timestamp: '2025-09-27 10:20', status: 'error' },
    { id: 4, type: 'system_backup', user: 'Sistema', timestamp: '2025-09-27 10:15', status: 'success' },
    { id: 5, type: 'api_limit_reached', user: 'Pedro Martín', timestamp: '2025-09-27 10:10', status: 'warning' }
  ]);

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: BarChart3 },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'system', label: 'Sistema', icon: Server },
    { id: 'billing', label: 'Facturación', icon: DollarSign },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_signup': return <Users className="w-4 h-4 text-green-500" />;
      case 'workflow_created': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'payment_failed': return <DollarSign className="w-4 h-4 text-red-500" />;
      case 'system_backup': return <Database className="w-4 h-4 text-purple-500" />;
      case 'api_limit_reached': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] p-6">
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
              <h1 className="text-3xl font-bold text-[var(--text)] mb-2">
                Panel de Administración
              </h1>
              <p className="text-[var(--muted)]">
                Gestiona y monitorea toda la plataforma Stack21
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Sistema Operativo</span>
              </div>
              <button className="px-4 py-2 bg-[var(--brand)] text-white rounded-lg hover:bg-[var(--brand-hover)] transition-colors">
                <Settings className="w-4 h-4 mr-2 inline" />
                Configuración
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)] mb-1">Usuarios Totales</p>
                <p className="text-2xl font-bold text-[var(--text)]">{systemStats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600">+12% este mes</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)] mb-1">Workflows Activos</p>
                <p className="text-2xl font-bold text-[var(--text)]">{systemStats.activeWorkflows}</p>
                <p className="text-xs text-green-600">+8% esta semana</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)] mb-1">Ingresos Totales</p>
                <p className="text-2xl font-bold text-[var(--text)]">${systemStats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600">+23% este mes</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)] mb-1">Salud del Sistema</p>
                <p className="text-2xl font-bold text-[var(--text)]">{systemStats.systemHealth}%</p>
                <p className="text-xs text-green-600">Excelente</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Server className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6 mb-8"
        >
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2 ${
                  activeTab === tab.id 
                    ? 'bg-white text-[var(--brand)] shadow-sm' 
                    : 'text-[var(--muted)] hover:text-[var(--text)]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Actividad Reciente */}
            <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6">
              <h3 className="text-lg font-semibold text-[var(--text)] mb-6">Actividad Reciente</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <div className="font-medium text-[var(--text)]">
                        {activity.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                      <div className="text-sm text-[var(--muted)]">{activity.user}</div>
                    </div>
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </div>
                      <div className="text-xs text-[var(--muted)] mt-1">{activity.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Métricas del Sistema */}
            <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6">
              <h3 className="text-lg font-semibold text-[var(--text)] mb-6">Métricas del Sistema</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-blue-500" />
                    <span className="text-[var(--text)]">Llamadas API</span>
                  </div>
                  <span className="font-semibold text-[var(--text)]">
                    {systemStats.apiCalls.toLocaleString()}/h
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-green-500" />
                    <span className="text-[var(--text)]">Almacenamiento</span>
                  </div>
                  <span className="font-semibold text-[var(--text)]">
                    {systemStats.storage} GB
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-purple-500" />
                    <span className="text-[var(--text)]">Tiempo de Respuesta</span>
                  </div>
                  <span className="font-semibold text-[var(--text)]">45ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    <span className="text-[var(--text)]">Crecimiento</span>
                  </div>
                  <span className="font-semibold text-green-600">+15.3%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--text)]">Gestión de Usuarios</h3>
              <button className="px-4 py-2 bg-[var(--brand)] text-white rounded-lg hover:bg-[var(--brand-hover)] transition-colors">
                Exportar Usuarios
              </button>
            </div>
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-[var(--muted)]">Panel de gestión de usuarios en desarrollo</p>
            </div>
          </motion.div>
        )}

        {activeTab === 'system' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--text)]">Monitoreo del Sistema</h3>
              <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                <CheckCircle className="w-4 h-4 mr-2 inline" />
                Sistema Saludable
              </button>
            </div>
            <div className="text-center py-12">
              <Server className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-[var(--muted)]">Panel de monitoreo del sistema en desarrollo</p>
            </div>
          </motion.div>
        )}

        {activeTab === 'billing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--text)]">Gestión de Facturación</h3>
              <button className="px-4 py-2 bg-[var(--brand)] text-white rounded-lg hover:bg-[var(--brand-hover)] transition-colors">
                Generar Reporte
              </button>
            </div>
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-[var(--muted)]">Panel de facturación en desarrollo</p>
            </div>
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--text)]">Centro de Seguridad</h3>
              <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                <Shield className="w-4 h-4 mr-2 inline" />
                Seguro
              </button>
            </div>
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-[var(--muted)]">Panel de seguridad en desarrollo</p>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--text)]">Configuración del Sistema</h3>
              <button className="px-4 py-2 bg-[var(--brand)] text-white rounded-lg hover:bg-[var(--brand-hover)] transition-colors">
                Guardar Cambios
              </button>
            </div>
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-[var(--muted)]">Panel de configuración en desarrollo</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}


