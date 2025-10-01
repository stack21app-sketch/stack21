'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Upload, 
  Database, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Settings,
  Trash2,
  Eye
} from 'lucide-react';

interface Backup {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'manual';
  size: number;
  createdAt: Date;
  status: 'completed' | 'in_progress' | 'failed';
  description: string;
}

export function BackupManager() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);

  useEffect(() => {
    // Simular backups existentes
    const mockBackups: Backup[] = [
      {
        id: '1',
        name: 'Backup Completo - Inicio',
        type: 'full',
        size: 2.4,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        status: 'completed',
        description: 'Backup inicial del sistema completo'
      },
      {
        id: '2',
        name: 'Backup Incremental - Diario',
        type: 'incremental',
        size: 0.8,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        status: 'completed',
        description: 'Backup incremental de los últimos cambios'
      },
      {
        id: '3',
        name: 'Backup Manual - Pre-deploy',
        type: 'manual',
        size: 1.2,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'completed',
        description: 'Backup manual antes del despliegue'
      }
    ];
    setBackups(mockBackups);
  }, []);

  const createBackup = async (type: 'full' | 'incremental' | 'manual') => {
    setIsCreating(true);
    
    const newBackup: Backup = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Backup ${type === 'full' ? 'Completo' : type === 'incremental' ? 'Incremental' : 'Manual'} - ${new Date().toLocaleString()}`,
      type,
      size: type === 'full' ? Math.random() * 3 + 2 : Math.random() * 1 + 0.5,
      createdAt: new Date(),
      status: 'in_progress',
      description: `Backup ${type} iniciado por el usuario`
    };

    setBackups(prev => [newBackup, ...prev]);

    // Simular proceso de backup
    setTimeout(() => {
      setBackups(prev => 
        prev.map(backup => 
          backup.id === newBackup.id 
            ? { ...backup, status: 'completed' }
            : backup
        )
      );
      setIsCreating(false);
    }, 3000);
  };

  const downloadBackup = (backup: Backup) => {
    // Simular descarga
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${backup.name}.zip`;
    link.click();
  };

  const deleteBackup = (backupId: string) => {
    setBackups(prev => prev.filter(backup => backup.id !== backupId));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full':
        return 'bg-red-100 text-red-800';
      case 'incremental':
        return 'bg-blue-100 text-blue-800';
      case 'manual':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestor de Backups</h2>
          <p className="text-gray-600">Administra y programa backups de tu sistema</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => createBackup('manual')}
            disabled={isCreating}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Database className="w-4 h-4" />
            <span>Nuevo Backup</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Settings className="w-4 h-4" />
            <span>Configurar</span>
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Backups</p>
              <p className="text-2xl font-bold text-gray-900">{backups.length}</p>
            </div>
            <Database className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Espacio Usado</p>
              <p className="text-2xl font-bold text-gray-900">
                {backups.reduce((acc, backup) => acc + backup.size, 0).toFixed(1)}GB
              </p>
            </div>
            <Download className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Último Backup</p>
              <p className="text-2xl font-bold text-gray-900">
                {backups.length > 0 ? '2h' : 'N/A'}
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Estado</p>
              <p className="text-2xl font-bold text-green-500">Activo</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>
      </div>

      {/* Lista de backups */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Historial de Backups</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {backups.map((backup, index) => (
            <motion.div
              key={backup.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(backup.status)}
                  <div>
                    <h4 className="font-medium text-gray-900">{backup.name}</h4>
                    <p className="text-sm text-gray-600">{backup.description}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(backup.type)}`}>
                        {backup.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {backup.size}GB
                      </span>
                      <span className="text-xs text-gray-500">
                        {backup.createdAt.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedBackup(backup)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => downloadBackup(backup)}
                    disabled={backup.status !== 'completed'}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteBackup(backup.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modal de detalles */}
      {selectedBackup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedBackup(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Detalles del Backup
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Nombre</label>
                <p className="text-gray-900">{selectedBackup.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Tipo</label>
                <p className="text-gray-900 capitalize">{selectedBackup.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Tamaño</label>
                <p className="text-gray-900">{selectedBackup.size}GB</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Fecha</label>
                <p className="text-gray-900">{selectedBackup.createdAt.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Estado</label>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(selectedBackup.status)}
                  <span className="capitalize">{selectedBackup.status}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setSelectedBackup(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => downloadBackup(selectedBackup)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Descargar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
