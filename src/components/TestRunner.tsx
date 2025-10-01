'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  Settings,
  FileText,
  Zap,
  AlertTriangle,
  Info
} from 'lucide-react';

interface Test {
  id: string;
  name: string;
  description: string;
  category: 'unit' | 'integration' | 'e2e' | 'performance';
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  duration: number;
  lastRun: Date | null;
  error?: string;
}

export function TestRunner() {
  const [tests, setTests] = useState<Test[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Simular tests existentes
    const mockTests: Test[] = [
      {
        id: '1',
        name: 'Authentication Flow',
        description: 'Test complete user authentication process',
        category: 'e2e',
        status: 'passed',
        duration: 2.3,
        lastRun: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: '2',
        name: 'API Health Check',
        description: 'Verify all API endpoints are responding',
        category: 'integration',
        status: 'passed',
        duration: 0.8,
        lastRun: new Date(Date.now() - 15 * 60 * 1000)
      },
      {
        id: '3',
        name: 'Workflow Creation',
        description: 'Test workflow creation and validation',
        category: 'unit',
        status: 'failed',
        duration: 1.2,
        lastRun: new Date(Date.now() - 5 * 60 * 1000),
        error: 'Validation error: Missing required field "name"'
      },
      {
        id: '4',
        name: 'Database Connection',
        description: 'Test database connectivity and queries',
        category: 'integration',
        status: 'passed',
        duration: 0.5,
        lastRun: new Date(Date.now() - 10 * 60 * 1000)
      },
      {
        id: '5',
        name: 'Performance Load Test',
        description: 'Test application under high load',
        category: 'performance',
        status: 'running',
        duration: 0,
        lastRun: null
      },
      {
        id: '6',
        name: 'UI Component Rendering',
        description: 'Test React components render correctly',
        category: 'unit',
        status: 'passed',
        duration: 1.8,
        lastRun: new Date(Date.now() - 20 * 60 * 1000)
      }
    ];
    setTests(mockTests);
  }, []);

  const runAllTests = async () => {
    setIsRunning(true);
    
    // Simular ejecución de tests
    setTests(prev => 
      prev.map(test => ({ ...test, status: 'running' as const }))
    );

    // Simular progreso de tests
    for (let i = 0; i < tests.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTests(prev => 
        prev.map((test, index) => {
          if (index === i) {
            const status = Math.random() > 0.1 ? 'passed' : 'failed';
            return {
              ...test,
              status,
              duration: Math.random() * 3 + 0.5,
              lastRun: new Date(),
              error: status === 'failed' ? 'Test assertion failed' : undefined
            };
          }
          return test;
        })
      );
    }

    setIsRunning(false);
  };

  const runTest = async (testId: string) => {
    setTests(prev => 
      prev.map(test => 
        test.id === testId 
          ? { ...test, status: 'running' as const }
          : test
      )
    );

    // Simular ejecución individual
    await new Promise(resolve => setTimeout(resolve, 2000));

    setTests(prev => 
      prev.map(test => 
        test.id === testId 
          ? {
              ...test,
              status: Math.random() > 0.2 ? 'passed' : 'failed' as const,
              duration: Math.random() * 3 + 0.5,
              lastRun: new Date(),
              error: Math.random() > 0.2 ? undefined : 'Test failed unexpectedly'
            }
          : test
      )
    );
  };

  const filteredTests = selectedCategory === 'all' 
    ? tests 
    : tests.filter(test => test.category === selectedCategory);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'skipped':
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'unit':
        return 'bg-blue-100 text-blue-800';
      case 'integration':
        return 'bg-green-100 text-green-800';
      case 'e2e':
        return 'bg-purple-100 text-purple-800';
      case 'performance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = [
    { id: 'all', name: 'Todos', count: tests.length },
    { id: 'unit', name: 'Unit', count: tests.filter(t => t.category === 'unit').length },
    { id: 'integration', name: 'Integration', count: tests.filter(t => t.category === 'integration').length },
    { id: 'e2e', name: 'E2E', count: tests.filter(t => t.category === 'e2e').length },
    { id: 'performance', name: 'Performance', count: tests.filter(t => t.category === 'performance').length }
  ];

  const stats = {
    total: tests.length,
    passed: tests.filter(t => t.status === 'passed').length,
    failed: tests.filter(t => t.status === 'failed').length,
    running: tests.filter(t => t.status === 'running').length,
    skipped: tests.filter(t => t.status === 'skipped').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Test Runner</h2>
          <p className="text-gray-600">Ejecuta y monitorea tests automatizados</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Configurar</span>
          </button>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>{isRunning ? 'Ejecutando...' : 'Ejecutar Todos'}</span>
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="w-6 h-6 text-gray-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pasaron</p>
              <p className="text-2xl font-bold text-green-500">{stats.passed}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fallaron</p>
              <p className="text-2xl font-bold text-red-500">{stats.failed}</p>
            </div>
            <XCircle className="w-6 h-6 text-red-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ejecutando</p>
              <p className="text-2xl font-bold text-blue-500">{stats.running}</p>
            </div>
            <RefreshCw className="w-6 h-6 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tasa Éxito</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0}%
              </p>
            </div>
            <Zap className="w-6 h-6 text-yellow-500" />
          </div>
        </motion.div>
      </div>

      {/* Filtros */}
      <div className="flex space-x-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Lista de tests */}
      <div className="space-y-4">
        {filteredTests.map((test, index) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getStatusIcon(test.status)}
                <div>
                  <h3 className="font-semibold text-gray-900">{test.name}</h3>
                  <p className="text-sm text-gray-600">{test.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(test.category)}`}>
                      {test.category}
                    </span>
                    {test.duration > 0 && (
                      <span className="text-xs text-gray-500">
                        {test.duration.toFixed(1)}s
                      </span>
                    )}
                    {test.lastRun && (
                      <span className="text-xs text-gray-500">
                        {test.lastRun.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {test.error && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                        <p className="text-sm text-red-700">{test.error}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => runTest(test.id)}
                  disabled={test.status === 'running'}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {test.status === 'running' ? 'Ejecutando...' : 'Ejecutar'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTests.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron tests</h3>
          <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
        </motion.div>
      )}
    </div>
  );
}
