'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, XCircle, Loader, RefreshCw } from 'lucide-react';
import { runAllTests, testWorkflows, testAnalytics, testChatbot, testEmails, testNotifications } from '@/lib/test-apis';

interface TestResult {
  name: string;
  success: boolean;
  status: number;
  data: any;
  error: string | null;
  description: string;
}

interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  results: TestResult[];
}

export const TestPanel: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestSummary | null>(null);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const runTests = async () => {
    setIsRunning(true);
    try {
      const testResults = await runAllTests();
      setResults(testResults);
      setLastRun(new Date());
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runIndividualTest = async (testFunction: () => Promise<TestResult>) => {
    setIsRunning(true);
    try {
      const result = await testFunction();
      setResults({
        total: 1,
        passed: result.success ? 1 : 0,
        failed: result.success ? 0 : 1,
        results: [result],
      });
      setLastRun(new Date());
    } catch (error) {
      console.error('Error running individual test:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    if (success) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = (success: boolean) => {
    return success ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Panel de Pruebas</h2>
          <p className="text-sm text-gray-600 mt-1">
            Prueba todas las APIs y funcionalidades del sistema
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastRun && (
            <div className="text-xs text-gray-500">
              Última ejecución: {lastRun.toLocaleTimeString()}
            </div>
          )}
          <button
            onClick={runTests}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isRunning ? 'Ejecutando...' : 'Ejecutar Todos'}
          </button>
        </div>
      </div>

      {/* Tests Individuales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          { name: 'Workflows', test: testWorkflows, color: 'bg-blue-100 text-blue-800' },
          { name: 'Analytics', test: testAnalytics, color: 'bg-green-100 text-green-800' },
          { name: 'Chatbot', test: testChatbot, color: 'bg-purple-100 text-purple-800' },
          { name: 'Emails', test: testEmails, color: 'bg-orange-100 text-orange-800' },
          { name: 'Notifications', test: testNotifications, color: 'bg-pink-100 text-pink-800' },
        ].map(({ name, test, color }) => (
          <button
            key={name}
            onClick={() => runIndividualTest(test)}
            disabled={isRunning}
            className={`p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${color}`}
          >
            <div className="text-sm font-medium">{name}</div>
            <div className="text-xs opacity-75">Probar API</div>
          </button>
        ))}
      </div>

      {/* Resultados */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Resumen */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{results.total}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{results.passed}</div>
                <div className="text-xs text-gray-600">Exitosos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{results.failed}</div>
                <div className="text-xs text-gray-600">Fallidos</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {Math.round((results.passed / results.total) * 100)}% Éxito
              </div>
              <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(results.passed / results.total) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Detalles de cada test */}
          <div className="space-y-3">
            {results.results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.success)}
                  <div>
                    <div className="font-medium text-gray-900">{result.name}</div>
                    <div className="text-sm text-gray-600">{result.description}</div>
                    {result.error && (
                      <div className="text-xs text-red-600 mt-1">{result.error}</div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getStatusColor(result.success)}`}>
                    {result.success ? 'Éxito' : 'Error'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Status: {result.status}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Estado inicial */}
      {!results && !isRunning && (
        <div className="text-center py-8 text-gray-500">
          <RefreshCw className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Haz clic en "Ejecutar Todos" para probar todas las funcionalidades</p>
        </div>
      )}
    </div>
  );
};
