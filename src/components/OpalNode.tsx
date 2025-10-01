'use client';

import { Handle, NodeProps, Position } from 'reactflow';
import { Circle, Zap, Terminal, FileText, Database, Settings } from 'lucide-react';

// Mapeo de tipos de nodo a colores pastel e iconos
const typeMap = {
  input: { 
    color: '#E5E8FF', // azul suave
    icon: Circle,
    label: 'Input'
  },
  generate: { 
    color: '#FFF7D6', // amarillo claro
    icon: Zap,
    label: 'Generar'
  },
  output: { 
    color: '#E9FBEA', // verde menta
    icon: Terminal,
    label: 'Output'
  },
  process: { 
    color: '#FDEDF8', // rosa claro
    icon: FileText,
    label: 'Procesar'
  },
  data: { 
    color: '#E5E8FF', // azul suave
    icon: Database,
    label: 'Datos'
  },
  config: { 
    color: '#FFF7D6', // amarillo claro
    icon: Settings,
    label: 'Config'
  },
};

export function OpalNode({ data }: NodeProps) {
  const { type = 'input', label } = data;
  const nodeConfig = typeMap[type as keyof typeof typeMap] || typeMap.input;
  const IconComponent = nodeConfig.icon;

  return (
    <div 
      className="node-pastel px-4 py-3 min-w-[120px]"
      style={{ background: nodeConfig.color }}
    >
      <div className="flex items-center gap-2 text-gray-700">
        <IconComponent className="w-4 h-4" />
        <span className="font-semibold text-sm">
          {label || nodeConfig.label}
        </span>
      </div>
      
      {/* Conectores de entrada y salida */}
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ 
          background: '#A1A1AA',
          border: '2px solid #FFFFFF',
          width: '8px',
          height: '8px'
        }} 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ 
          background: '#A1A1AA',
          border: '2px solid #FFFFFF',
          width: '8px',
          height: '8px'
        }} 
      />
    </div>
  );
}
