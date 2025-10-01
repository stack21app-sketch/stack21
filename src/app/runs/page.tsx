'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Play, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  RefreshCw,
  Calendar,
  Zap
} from 'lucide-react';

interface Run {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  duration?: number;
  triggerType: string;
  errorMessage?: string;
  stepsCompleted: number;
  totalSteps: number;
}

export default function RunsPage() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    loadRuns();
  }, [debouncedSearch, statusFilter, page]);

  const loadRuns = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      params.append('page', String(page));
      params.append('limit', '20');

      const response = await fetch(`/api/runs?${params}`);
      const data = await response.json();
      setRuns(data.runs || []);
      setTotalPages(data?.pagination?.pages || 1);
      setTotalCount(Number(data?.pagination?.total || 0));
    } catch (error) {
      console.error('Error cargando runs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Ejecuciones de Workflows
              </h1>
              <p className="text-gray-600">
                Monitorea y gestiona todas las ejecuciones de tus workflows
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={loadRuns}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Actualizar
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-6 max-w-4xl">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por workflow o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todos los estados</option>
                  <option value="running">Ejecutando</option>
                  <option value="completed">Completado</option>
                  <option value="failed">Fallido</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
            </div>

            {!loading && (
              <p className="text-sm text-gray-500 mt-4">Mostrando {runs.length} de {totalCount} ejecuciones — página {page} de {totalPages}</p>
            )}
          </div>
        </div>
      </div>

      {/* Runs List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : runs.length === 0 ? (
          <div className="text-center py-12">
            <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay ejecuciones
            </h3>
            <p className="text-gray-600 mb-6">
              Aún no has ejecutado ningún workflow
            </p>
            <Link
              href="/workflows"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              Crear Workflow
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {runs.map((run) => (
              <motion.div
                key={run.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(run.status)}
                      <h3 className="text-lg font-semibold text-gray-900">
                        {run.workflowName}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(run.status)}`}>
                        {run.status === 'running' ? 'Ejecutando' : 
                         run.status === 'completed' ? 'Completado' :
                         run.status === 'failed' ? 'Fallido' : 'Cancelado'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(run.startedAt)}
                      </span>
                      {run.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(run.duration)}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Play className="w-4 h-4" />
                        {run.stepsCompleted}/{run.totalSteps} pasos
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        {run.triggerType}
                      </span>
                    </div>

                    {run.errorMessage && (
                      <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                        {run.errorMessage}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      href={`/runs/${run.id}`}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Ver detalles
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && runs.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-2 border rounded-lg disabled:opacity-50"
                onClick={() => setPage(1)}
                disabled={page <= 1}
              >
                Primero
              </button>
              <button
                className="px-3 py-2 border rounded-lg disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Anterior
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Página</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={page}
                onChange={(e) => setPage(Math.max(1, Math.min(totalPages, parseInt(e.target.value) || 1)))}
                className="w-20 px-2 py-2 border rounded-lg"
              />
              <span className="text-sm text-gray-600">de {totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="px-3 py-2 border rounded-lg disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Siguiente
              </button>
              <button
                className="px-3 py-2 border rounded-lg disabled:opacity-50"
                onClick={() => setPage(totalPages)}
                disabled={page >= totalPages}
              >
                Último
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}