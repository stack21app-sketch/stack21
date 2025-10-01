'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Plus,
  Play, 
  Settings, 
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Calendar,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'draft';
  lastRun?: string;
  totalRuns: number;
  successRate: number;
  createdAt: string;
  updatedAt: string;
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/workflows');
      const data = await response.json();
      setWorkflows(data.workflows || []);
    } catch (error) {
      console.error('Error cargando workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive': return <AlertCircle className="w-4 h-4 text-gray-500" />;
      case 'draft': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleRunWorkflow = async (workflowId: string) => {
    try {
      const response = await fetch(`/api/workflows/${workflowId}/run`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Error ejecutando workflow');
      await loadWorkflows(); // Refresh to update stats
    } catch (error) {
      alert('Error al ejecutar el workflow');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Workflows
              </h1>
              <p className="text-gray-600">
                Crea y gestiona tus automatizaciones
              </p>
            </div>
            <Link
              href="/workflows/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo Workflow
            </Link>
          </div>
        </div>
      </div>

      {/* Workflows List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : workflows.length === 0 ? (
          <div className="text-center py-12">
            <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tienes workflows
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tu primer workflow para automatizar tareas
            </p>
            <Link
              href="/workflows/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Crear Workflow
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows.map((workflow) => (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(workflow.status)}
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600">
                        {workflow.name}
                      </h3>
                    </div>
                    {workflow.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {workflow.description}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(workflow.status)}`}>
                    {workflow.status === 'active' ? 'Activo' :
                     workflow.status === 'inactive' ? 'Inactivo' : 'Borrador'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <div className="text-gray-500">Ejecuciones</div>
                    <div className="font-medium">{workflow.totalRuns}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Éxito</div>
                    <div className="font-medium">{workflow.successRate}%</div>
                  </div>
                </div>

                {workflow.lastRun && (
                  <div className="text-xs text-gray-500 mb-4">
                    Última ejecución: {formatDate(workflow.lastRun)}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRunWorkflow(workflow.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Play className="w-4 h-4" />
                    Ejecutar
                  </button>
                  <Link
                    href={`/workflows/${workflow.id}/edit`}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/runs?workflow=${workflow.id}`}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}