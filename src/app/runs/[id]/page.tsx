'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft,
  Play, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  Calendar,
  Zap,
  Code,
  Database,
  ExternalLink
} from 'lucide-react';

interface RunStep {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  input?: any;
  output?: any;
  error?: string;
}

interface Run {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  duration?: number;
  triggerType: string;
  triggerData?: any;
  errorMessage?: string;
  steps: RunStep[];
}

export default function RunDetailPage() {
  const params = useParams();
  const runId = String(params?.id || '');
  const [run, setRun] = useState<Run | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (runId) {
      loadRun();
    }
  }, [runId]);

  const loadRun = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/runs/${runId}`);
      if (!response.ok) {
        throw new Error('Run no encontrado');
      }
      const data = await response.json();
      setRun(data);
    } catch (err: any) {
      setError(err.message || 'Error cargando run');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'cancelled': return <AlertCircle className="w-5 h-5 text-gray-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-gray-400" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-gray-100 text-gray-600';
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
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !run) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
            <p className="text-gray-600 mb-6">{error || 'Run no encontrado'}</p>
            <Link
              href="/runs"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a Runs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/runs"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Runs
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            {getStatusIcon(run.status)}
            <h1 className="text-3xl font-bold text-gray-900">{run.workflowName}</h1>
            <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(run.status)}`}>
              {run.status === 'running' ? 'Ejecutando' : 
               run.status === 'completed' ? 'Completado' :
               run.status === 'failed' ? 'Fallido' : 'Cancelado'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Calendar className="w-4 h-4" />
                Iniciado
              </div>
              <div className="font-medium">{formatDate(run.startedAt)}</div>
            </div>
            
            {run.completedAt && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <CheckCircle className="w-4 h-4" />
                  Completado
                </div>
                <div className="font-medium">{formatDate(run.completedAt)}</div>
              </div>
            )}
            
            {run.duration && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Clock className="w-4 h-4" />
                  Duración
                </div>
                <div className="font-medium">{formatDuration(run.duration)}</div>
              </div>
            )}
          </div>
        </div>

        {/* Trigger Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Información del Trigger
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Tipo</div>
              <div className="font-medium">{run.triggerType}</div>
            </div>
            {run.triggerData && (
              <div>
                <div className="text-sm text-gray-500 mb-1">Datos</div>
                <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(run.triggerData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Play className="w-5 h-5" />
            Pasos de Ejecución
          </h2>
          
          <div className="space-y-4">
            {run.steps.map((step, index) => (
              <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{step.name}</h3>
                      <p className="text-sm text-gray-500">{step.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(step.status)}
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(step.status)}`}>
                      {step.status === 'pending' ? 'Pendiente' :
                       step.status === 'running' ? 'Ejecutando' :
                       step.status === 'completed' ? 'Completado' : 'Fallido'}
                    </span>
                  </div>
                </div>

                {step.startedAt && (
                  <div className="text-xs text-gray-500 mb-2">
                    Iniciado: {formatDate(step.startedAt)}
                    {step.completedAt && ` • Completado: ${formatDate(step.completedAt)}`}
                    {step.duration && ` • Duración: ${formatDuration(step.duration)}`}
                  </div>
                )}

                {step.error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2 mb-3">
                    {step.error}
                  </div>
                )}

                {step.input && (
                  <div className="mb-3">
                    <div className="text-xs text-gray-500 mb-1">Input</div>
                    <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                      {JSON.stringify(step.input, null, 2)}
                    </pre>
                  </div>
                )}

                {step.output && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Output</div>
                    <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                      {JSON.stringify(step.output, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {run.errorMessage && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
              <XCircle className="w-5 h-5" />
              Error General
            </div>
            <p className="text-red-700">{run.errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
