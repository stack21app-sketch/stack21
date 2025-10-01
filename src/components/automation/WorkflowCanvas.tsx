'use client'

/**
 * 🎨 STACK21 - Canvas Visual para Workflows
 * Editor drag & drop estilo n8n/Make
 */

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Play,
  Plus,
  Trash2,
  Settings,
  Zap,
  GitBranch,
  CheckCircle,
  AlertCircle,
  Save
} from 'lucide-react'
import type { WorkflowNode, WorkflowConnection } from '@/lib/automation/execution-engine'
import { getConnectorById } from '@/lib/automation/connectors'

interface WorkflowCanvasProps {
  initialNodes?: WorkflowNode[]
  initialConnections?: WorkflowConnection[]
  onSave?: (nodes: WorkflowNode[], connections: WorkflowConnection[]) => void
}

export default function WorkflowCanvas({
  initialNodes = [],
  initialConnections = [],
  onSave
}: WorkflowCanvasProps) {
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialNodes)
  const [connections, setConnections] = useState<WorkflowConnection[]>(initialConnections)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStart, setConnectionStart] = useState<string | null>(null)
  const [showNodePicker, setShowNodePicker] = useState(false)

  const addNode = useCallback((type: WorkflowNode['type'], connector: string, operation: string) => {
    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      type,
      connector,
      operation,
      config: {},
      position: { x: 100 + nodes.length * 50, y: 100 + nodes.length * 50 }
    }
    
    setNodes([...nodes, newNode])
    setShowNodePicker(false)
  }, [nodes])

  const deleteNode = useCallback((nodeId: string) => {
    setNodes(nodes.filter(n => n.id !== nodeId))
    setConnections(connections.filter(c => c.from !== nodeId && c.to !== nodeId))
    if (selectedNode === nodeId) {
      setSelectedNode(null)
    }
  }, [nodes, connections, selectedNode])

  const startConnection = useCallback((nodeId: string) => {
    setIsConnecting(true)
    setConnectionStart(nodeId)
  }, [])

  const completeConnection = useCallback((endNodeId: string) => {
    if (connectionStart && connectionStart !== endNodeId) {
      const newConnection: WorkflowConnection = {
        id: `conn_${Date.now()}`,
        from: connectionStart,
        to: endNodeId
      }
      setConnections([...connections, newConnection])
    }
    setIsConnecting(false)
    setConnectionStart(null)
  }, [connectionStart, connections])

  const deleteConnection = useCallback((connId: string) => {
    setConnections(connections.filter(c => c.id !== connId))
  }, [connections])

  const handleSave = () => {
    if (onSave) {
      onSave(nodes, connections)
    }
  }

  const renderNode = (node: WorkflowNode) => {
    const connector = getConnectorById(node.connector)
    const isSelected = selectedNode === node.id
    
    return (
      <div
        key={node.id}
        className={`absolute cursor-move ${isSelected ? 'z-10' : 'z-0'}`}
        style={{
          left: node.position?.x || 0,
          top: node.position?.y || 0
        }}
        onClick={() => setSelectedNode(node.id)}
      >
        <Card className={`w-64 ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow'} transition-all`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-xl">
                  {connector?.icon || '⚙️'}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    {connector?.name || node.connector}
                  </p>
                  <p className="text-xs text-gray-600">
                    {node.operation.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs capitalize">
                {node.type}
              </Badge>
            </div>

            {/* Connection Points */}
            <div className="flex items-center justify-between">
              <button
                className="w-6 h-6 rounded-full bg-gray-200 hover:bg-blue-500 hover:text-white flex items-center justify-center text-xs transition-colors"
                title="Punto de entrada"
              >
                ←
              </button>
              <div className="flex space-x-1">
                {isSelected && (
                  <>
                    <button
                      onClick={() => deleteNode(node.id)}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Configurar"
                    >
                      <Settings className="w-4 h-4 text-gray-600" />
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={() => startConnection(node.id)}
                className="w-6 h-6 rounded-full bg-gray-200 hover:bg-green-500 hover:text-white flex items-center justify-center text-xs transition-colors"
                title="Conectar a siguiente"
              >
                →
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderConnections = () => {
    return connections.map(conn => {
      const fromNode = nodes.find(n => n.id === conn.from)
      const toNode = nodes.find(n => n.id === conn.to)
      
      if (!fromNode || !toNode || !fromNode.position || !toNode.position) return null

      // Calcular posiciones de inicio y fin
      const startX = fromNode.position.x + 256 // ancho del card
      const startY = fromNode.position.y + 50 // mitad del alto del card
      const endX = toNode.position.x
      const endY = toNode.position.y + 50

      return (
        <g key={conn.id}>
          {/* Línea de conexión */}
          <path
            d={`M ${startX} ${startY} C ${startX + 50} ${startY}, ${endX - 50} ${endY}, ${endX} ${endY}`}
            stroke="#667eea"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrowhead)"
          />
          {/* Punto de control para eliminar conexión */}
          <circle
            cx={(startX + endX) / 2}
            cy={(startY + endY) / 2}
            r="8"
            fill="white"
            stroke="#667eea"
            strokeWidth="2"
            className="cursor-pointer hover:fill-red-100"
            onClick={() => deleteConnection(conn.id)}
          />
          <text
            x={(startX + endX) / 2}
            y={(startY + endY) / 2 + 4}
            textAnchor="middle"
            fontSize="12"
            fill="#667eea"
            className="pointer-events-none"
          >
            ×
          </text>
        </g>
      )
    })
  }

  return (
    <div className="relative w-full h-screen bg-gray-50">
      {/* Toolbar */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-bold text-gray-900">Editor Visual de Workflows</h2>
            <Badge variant="outline">{nodes.length} nodos</Badge>
            <Badge variant="outline">{connections.length} conexiones</Badge>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowNodePicker(!showNodePicker)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Nodo
            </Button>
            <Button
              variant="outline"
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Play className="w-4 h-4 mr-2" />
              Ejecutar Test
            </Button>
          </div>
        </div>
      </div>

      {/* Node Picker */}
      {showNodePicker && (
        <div className="absolute top-20 left-6 z-30 w-80">
          <Card className="shadow-xl">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Agregar Nodo</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {/* Triggers */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">TRIGGERS</p>
                  <button
                    onClick={() => addNode('trigger', 'webhook', 'http_request')}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded flex items-center space-x-2"
                  >
                    <span>🔗</span>
                    <span className="text-sm">Webhook</span>
                  </button>
                  <button
                    onClick={() => addNode('trigger', 'scheduler', 'daily')}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded flex items-center space-x-2"
                  >
                    <span>⏰</span>
                    <span className="text-sm">Scheduler</span>
                  </button>
                </div>

                {/* Actions */}
                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2">ACCIONES</p>
                  <button
                    onClick={() => addNode('action', 'slack', 'send_message')}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded flex items-center space-x-2"
                  >
                    <span>💬</span>
                    <span className="text-sm">Slack - Enviar Mensaje</span>
                  </button>
                  <button
                    onClick={() => addNode('action', 'hubspot', 'create_contact')}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded flex items-center space-x-2"
                  >
                    <span>🟠</span>
                    <span className="text-sm">HubSpot - Crear Contacto</span>
                  </button>
                  <button
                    onClick={() => addNode('action', 'openai', 'generate_content')}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded flex items-center space-x-2"
                  >
                    <span>🧠</span>
                    <span className="text-sm">OpenAI - Generar Contenido</span>
                  </button>
                </div>

                {/* Conditions */}
                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2">LÓGICA</p>
                  <button
                    onClick={() => addNode('condition', 'system', 'if_condition')}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded flex items-center space-x-2"
                  >
                    <span>🔀</span>
                    <span className="text-sm">Condición (IF)</span>
                  </button>
                  <button
                    onClick={() => addNode('approval', 'approval_system', 'request_approval')}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded flex items-center space-x-2"
                  >
                    <span>✅</span>
                    <span className="text-sm">Aprobación</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Canvas */}
      <div className="absolute inset-0 top-20 overflow-auto">
        {/* Grid Background */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />

        {/* SVG para conexiones */}
        <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#667eea" />
            </marker>
          </defs>
          {renderConnections()}
        </svg>

        {/* Nodes */}
        <div className="relative">
          {nodes.map(node => renderNode(node))}
        </div>

        {/* Empty State */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">Canvas Vacío</h3>
              <p className="text-gray-500 mb-4">Agrega tu primer nodo para comenzar</p>
              <Button
                onClick={() => setShowNodePicker(true)}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Nodo
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Node Inspector (cuando hay nodo seleccionado) */}
      {selectedNode && (
        <div className="absolute top-20 right-6 z-30 w-80">
          <Card className="shadow-xl">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Configuración del Nodo</h3>
              {(() => {
                const node = nodes.find(n => n.id === selectedNode)
                if (!node) return null
                
                const connector = getConnectorById(node.connector)
                
                return (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600">Conector</label>
                      <p className="text-sm">{connector?.name || node.connector}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600">Operación</label>
                      <p className="text-sm">{node.operation}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600">Tipo</label>
                      <Badge variant="outline" className="capitalize">{node.type}</Badge>
                    </div>
                    <div className="pt-3 border-t">
                      <p className="text-xs text-gray-500 mb-2">Configuración avanzada próximamente...</p>
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Connection Mode Indicator */}
      {isConnecting && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
          <Card className="bg-blue-600 text-white shadow-xl">
            <CardContent className="p-3 flex items-center space-x-2">
              <GitBranch className="w-4 h-4" />
              <span className="text-sm font-semibold">Haz click en un nodo para conectar</span>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

