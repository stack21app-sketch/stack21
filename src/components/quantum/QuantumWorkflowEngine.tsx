'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Cpu, Database, Network, Shield, Rocket, Brain, Atom } from 'lucide-react';

interface QuantumWorkflow {
  id: string;
  name: string;
  complexity: number;
  quantumBits: number;
  efficiency: number;
  status: 'quantum' | 'superposition' | 'entangled' | 'collapsed';
  nodes: QuantumNode[];
}

interface QuantumNode {
  id: string;
  type: 'input' | 'process' | 'decision' | 'output' | 'quantum';
  position: { x: number; y: number };
  quantumState: 'superposition' | 'entangled' | 'collapsed';
  energy: number;
}

export function QuantumWorkflowEngine() {
  const [workflows, setWorkflows] = useState<QuantumWorkflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<QuantumWorkflow | null>(null);
  const [quantumState, setQuantumState] = useState<'idle' | 'processing' | 'entangled' | 'collapsed'>('idle');

  useEffect(() => {
    // Simular workflows cuánticos
    const mockWorkflows: QuantumWorkflow[] = [
      {
        id: '1',
        name: 'Procesamiento Cuántico de Datos',
        complexity: 95,
        quantumBits: 128,
        efficiency: 99.7,
        status: 'quantum',
        nodes: [
          { id: '1', type: 'input', position: { x: 0, y: 0 }, quantumState: 'superposition', energy: 100 },
          { id: '2', type: 'quantum', position: { x: 100, y: 0 }, quantumState: 'entangled', energy: 95 },
          { id: '3', type: 'process', position: { x: 200, y: 0 }, quantumState: 'collapsed', energy: 90 },
          { id: '4', type: 'output', position: { x: 300, y: 0 }, quantumState: 'superposition', energy: 85 }
        ]
      },
      {
        id: '2',
        name: 'IA Entrelazada Cuántica',
        complexity: 98,
        quantumBits: 256,
        efficiency: 99.9,
        status: 'entangled',
        nodes: [
          { id: '1', type: 'input', position: { x: 0, y: 0 }, quantumState: 'superposition', energy: 100 },
          { id: '2', type: 'quantum', position: { x: 100, y: 0 }, quantumState: 'entangled', energy: 98 },
          { id: '3', type: 'quantum', position: { x: 200, y: 0 }, quantumState: 'entangled', energy: 96 },
          { id: '4', type: 'output', position: { x: 300, y: 0 }, quantumState: 'superposition', energy: 94 }
        ]
      }
    ];
    setWorkflows(mockWorkflows);
  }, []);

  const startQuantumProcessing = () => {
    setQuantumState('processing');
    
    // Simular procesamiento cuántico
    setTimeout(() => {
      setQuantumState('entangled');
      setTimeout(() => {
        setQuantumState('collapsed');
        setTimeout(() => {
          setQuantumState('idle');
        }, 2000);
      }, 3000);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'quantum': return 'bg-purple-500';
      case 'superposition': return 'bg-blue-500';
      case 'entangled': return 'bg-green-500';
      case 'collapsed': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getQuantumStateColor = (state: string) => {
    switch (state) {
      case 'superposition': return 'text-blue-500';
      case 'entangled': return 'text-green-500';
      case 'collapsed': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-6 shadow-soft">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
          <Atom className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[var(--text)]">Motor Cuántico de Workflows</h3>
          <p className="text-sm text-[var(--muted)]">Procesamiento cuántico de próxima generación</p>
        </div>
      </div>

      {/* Estado cuántico actual */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(quantumState)} animate-pulse`}></div>
            <span className="font-semibold text-[var(--text)]">
              Estado Cuántico: {quantumState.toUpperCase()}
            </span>
          </div>
          <button
            onClick={startQuantumProcessing}
            disabled={quantumState !== 'idle'}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <Rocket className="w-4 h-4 mr-2 inline" />
            Iniciar Procesamiento
          </button>
        </div>
      </div>

      {/* Workflows cuánticos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
              selectedWorkflow?.id === workflow.id 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-[var(--border)] hover:border-purple-300'
            }`}
            onClick={() => setSelectedWorkflow(workflow)}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-[var(--text)]">{workflow.name}</h4>
              <div className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(workflow.status)}`}>
                {workflow.status}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Complejidad:</span>
                <span className="font-medium">{workflow.complexity}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Qubits:</span>
                <span className="font-medium">{workflow.quantumBits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Eficiencia:</span>
                <span className="font-medium text-green-600">{workflow.efficiency}%</span>
              </div>
            </div>

            {/* Visualización de nodos cuánticos */}
            <div className="mt-4 flex items-center gap-2">
              {workflow.nodes.map((node, index) => (
                <div
                  key={node.id}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${getStatusColor(node.quantumState)}`}
                  title={`${node.type} - ${node.quantumState}`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Detalles del workflow seleccionado */}
      {selectedWorkflow && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-[var(--text)] mb-3">Detalles del Workflow Cuántico</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {selectedWorkflow.nodes.map((node) => (
              <div key={node.id} className="p-3 bg-white rounded-lg border border-[var(--border)]">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(node.quantumState)}`}></div>
                  <span className="text-sm font-medium capitalize">{node.type}</span>
                </div>
                <div className="text-xs text-[var(--muted)]">
                  Estado: <span className={getQuantumStateColor(node.quantumState)}>{node.quantumState}</span>
                </div>
                <div className="text-xs text-[var(--muted)]">
                  Energía: {node.energy}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
