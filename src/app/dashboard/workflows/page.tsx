'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Grid, List, Play, Pause, Settings, Trash2, Copy, Workflow, Code, Eye } from 'lucide-react';
import { AdvancedWorkflowBuilder } from '@/components/workflows/AdvancedWorkflowBuilder';
import { AdvancedWorkflow, AdvancedWorkflowExecution } from '@/lib/advanced-workflow-engine';

export default function WorkflowsPage() {
  const [viewMode, setViewMode] = useState<'list' | 'builder'>('list');
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  const handleSaveWorkflow = (workflow: AdvancedWorkflow) => {
    console.log('Workflow guardado:', workflow);
    // Aquí se podría actualizar la lista de workflows
  };

  const handleExecuteWorkflow = (execution: AdvancedWorkflowExecution) => {
    console.log('Workflow ejecutado:', execution);
    // Aquí se podría mostrar los resultados
  };

  if (viewMode === 'builder') {
    return (
      <div className="h-screen">
        <AdvancedWorkflowBuilder
          workflowId={selectedWorkflow || undefined}
          onSave={handleSaveWorkflow}
          onExecute={handleExecuteWorkflow}
        />
      </div>
    );
  }

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
                Mis Workflows
              </h1>
              <p className="text-gray-600">
                Gestiona y automatiza tus procesos de negocio
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setViewMode('builder')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 shadow-sm"
              >
                <Workflow className="w-5 h-5" />
                Constructor Avanzado
              </button>
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 shadow-sm">
                <Plus className="w-5 h-5" />
                Crear Workflow
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filtros y Búsqueda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar workflows..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </button>
            <div className="flex border border-gray-300 rounded-lg">
              <button className="px-3 py-2 bg-blue-600 text-white rounded-l-lg">
                <Grid className="w-4 h-4" />
              </button>
              <button className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-r-lg">
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Grid de Workflows */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Workflow Card 1 */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text)]">Automatización de Leads</h3>
                  <p className="text-sm text-[var(--muted)]">Marketing</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600">Activo</span>
              </div>
            </div>
            <p className="text-sm text-[var(--muted)] mb-4">
              Captura y procesa automáticamente nuevos leads desde el formulario web.
            </p>
            <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-4">
              <span>Última ejecución: hace 2 min</span>
              <span>1,247 ejecuciones</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-2">
                <Pause className="w-4 h-4" />
                Pausar
              </button>
              <button className="px-3 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
              <button className="px-3 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Workflow Card 2 */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text)]">Notificaciones de Ventas</h3>
                  <p className="text-sm text-[var(--muted)]">Ventas</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-yellow-600">Pausado</span>
              </div>
            </div>
            <p className="text-sm text-[var(--muted)] mb-4">
              Envía notificaciones automáticas al equipo cuando se cierra una venta.
            </p>
            <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-4">
              <span>Última ejecución: hace 1 hora</span>
              <span>89 ejecuciones</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Activar
              </button>
              <button className="px-3 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
              <button className="px-3 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Workflow Card 3 - Nuevo */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-[var(--border)] p-6 hover:border-[var(--brand)] transition-colors cursor-pointer">
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="font-semibold text-[var(--text)] mb-2">Crear Nuevo Workflow</h3>
              <p className="text-sm text-[var(--muted)]">
                Comienza desde cero o usa una plantilla
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}