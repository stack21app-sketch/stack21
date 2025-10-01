'use client';

import React, { useCallback, useState } from 'react';
import ReactFlow, { 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  EdgeTypes,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import { OpalNode } from './OpalNode';

// Tipos de nodos personalizados
const nodeTypes: NodeTypes = {
  opal: OpalNode,
};

// Nodos iniciales de ejemplo
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'opal',
    position: { x: 100, y: 100 },
    data: { type: 'input', label: 'Input' },
  },
  {
    id: '2',
    type: 'opal',
    position: { x: 300, y: 100 },
    data: { type: 'generate', label: 'Generar' },
  },
  {
    id: '3',
    type: 'opal',
    position: { x: 500, y: 100 },
    data: { type: 'output', label: 'Output' },
  },
];

// Aristas iniciales de ejemplo
const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    style: { stroke: '#D1D5DB', strokeWidth: 2 },
    animated: false,
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'smoothstep',
    style: { stroke: '#D1D5DB', strokeWidth: 2 },
    animated: false,
  },
];

interface FlowCanvasProps {
  nodes?: Node[];
  edges?: Edge[];
  onNodesChange?: (changes: any) => void;
  onEdgesChange?: (changes: any) => void;
  onConnect?: (connection: Connection) => void;
  className?: string;
}

export function FlowCanvas({ 
  nodes: externalNodes, 
  edges: externalEdges, 
  onNodesChange: externalOnNodesChange,
  onEdgesChange: externalOnEdgesChange,
  onConnect: externalOnConnect,
  className = ''
}: FlowCanvasProps) {
  // Estados internos si no se proporcionan externamente
  const [internalNodes, setInternalNodes, onInternalNodesChange] = useNodesState(initialNodes);
  const [internalEdges, setInternalEdges, onInternalEdgesChange] = useEdgesState(initialEdges);

  // Usar nodos y aristas externos si se proporcionan, sino usar los internos
  const nodes = externalNodes || internalNodes;
  const edges = externalEdges || internalEdges;
  const onNodesChange = externalOnNodesChange || onInternalNodesChange;
  const onEdgesChange = externalOnEdgesChange || onInternalEdgesChange;

  // Función para manejar nuevas conexiones
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        type: 'smoothstep',
        style: { stroke: '#D1D5DB', strokeWidth: 2 },
        animated: false,
      };
      
      if (externalOnConnect) {
        externalOnConnect(params);
      } else {
        setInternalEdges((eds) => addEdge(newEdge, eds));
      }
    },
    [externalOnConnect, setInternalEdges]
  );

  return (
    <div className={`h-full w-full bg-[#F8FAFC] rounded-lg border border-gray-200 ${className}`}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.1}
          maxZoom={2}
          attributionPosition="bottom-left"
        >
          <Controls 
            position="top-left"
            showZoom={true}
            showFitView={true}
            showInteractive={false}
            style={{
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
            }}
          />
          <Background 
            gap={32} 
            color="#E5E7EB" 
            size={1}
            style={{ background: '#F8FAFC' }}
          />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
