# 👥 Colaboración en Tiempo Real para Stack21

## 📋 Resumen Ejecutivo

Sistema de co-edición en tiempo real que permite a múltiples usuarios trabajar simultáneamente en workflows, similar a Google Docs pero para automatización.

### **Ventaja Competitiva:**
- ❌ **n8n:** Sin co-edición, solo compartir workflows
- 🟡 **Make:** Co-edición básica sin presencia en tiempo real
- ✅ **Stack21:** Co-edición avanzada con IA, comentarios, aprobaciones

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  React Flow Editor + Yjs CRDT                              │ │
│  │  • Real-time sync                                          │ │
│  │  • Awareness (cursores, selección)                         │ │
│  │  • Undo/Redo distribuido                                   │ │
│  │  • Conflict resolution automático                          │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓ WebSocket
┌─────────────────────────────────────────────────────────────────┐
│                     SYNC SERVER (Hocuspocus)                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  • Distribuye updates a todos los clientes                 │ │
│  │  • Persiste estado en Redis                                │ │
│  │  • Autenticación y autorización                            │ │
│  │  • Rate limiting por usuario                               │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    PERSISTENCE LAYER                             │
│  ┌─────────────────┐        ┌──────────────────┐               │
│  │  Redis (State)  │        │  PostgreSQL (DB) │               │
│  │  • Yjs updates  │        │  • Workflows     │               │
│  │  • Awareness    │        │  • Comments      │               │
│  │  • Locks        │        │  • History       │               │
│  └─────────────────┘        └──────────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Implementación Técnica

### **1. Setup con Yjs + Hocuspocus**

```typescript
// src/lib/collaboration/sync-server.ts

import { Server } from '@hocuspocus/server'
import { Database } from '@hocuspocus/extension-database'
import { Logger } from '@hocuspocus/extension-logger'
import { Redis } from '@hocuspocus/extension-redis'
import * as Y from 'yjs'

// Configurar servidor de sincronización
export function createSyncServer() {
  return Server.configure({
    port: 1234,
    
    // Extensión de base de datos
    extensions: [
      new Database({
        // Guardar estado en PostgreSQL
        fetch: async ({ documentName }) => {
          const workflow = await prisma.workflow.findUnique({
            where: { id: documentName }
          })
          
          if (!workflow || !workflow.yDocState) {
            return null
          }
          
          return Buffer.from(workflow.yDocState)
        },
        
        store: async ({ documentName, state }) => {
          await prisma.workflow.update({
            where: { id: documentName },
            data: {
              yDocState: Buffer.from(state),
              updatedAt: new Date()
            }
          })
        }
      }),
      
      // Redis para escalabilidad horizontal
      new Redis({
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379'),
        options: {
          password: process.env.REDIS_PASSWORD
        }
      }),
      
      // Logging
      new Logger()
    ],
    
    // Autenticación
    async onAuthenticate({ token, documentName }) {
      // Verificar JWT token
      const user = await verifyToken(token)
      
      if (!user) {
        throw new Error('Unauthorized')
      }
      
      // Verificar permisos en el workflow
      const hasAccess = await checkWorkflowAccess(user.id, documentName)
      
      if (!hasAccess) {
        throw new Error('Forbidden')
      }
      
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          color: generateUserColor(user.id)
        }
      }
    },
    
    // Cuando usuario se conecta
    async onConnect({ documentName, context }) {
      console.log(`User ${context.user.name} connected to ${documentName}`)
      
      // Notificar a otros usuarios
      await notifyUserJoined(documentName, context.user)
    },
    
    // Cuando usuario se desconecta
    async onDisconnect({ documentName, context }) {
      console.log(`User ${context.user.name} disconnected from ${documentName}`)
      
      await notifyUserLeft(documentName, context.user)
    },
    
    // Rate limiting
    async onStateless({ connection }) {
      // Limitar a 100 updates por segundo por usuario
      const userId = connection.context.user?.id
      if (userId) {
        await enforceRateLimit(userId, 100)
      }
    }
  })
}

// Iniciar servidor
export async function startSyncServer() {
  const server = createSyncServer()
  await server.listen()
  console.log('🚀 Sync server running on port 1234')
}
```

---

### **2. Cliente React con Yjs**

```typescript
// src/components/workflow/realtime-workflow-editor.tsx

import { useEffect, useState } from 'react'
import { HocuspocusProvider } from '@hocuspocus/provider'
import * as Y from 'yjs'
import ReactFlow, { Node, Edge } from 'reactflow'
import { useAuth } from '@/hooks/useAuth'

interface CollaborativeWorkflowEditorProps {
  workflowId: string
}

export function CollaborativeWorkflowEditor({ 
  workflowId 
}: CollaborativeWorkflowEditorProps) {
  const { user, token } = useAuth()
  const [provider, setProvider] = useState<HocuspocusProvider | null>(null)
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [participants, setParticipants] = useState<User[]>([])
  
  // Inicializar Yjs y provider
  useEffect(() => {
    const doc = new Y.Doc()
    
    const newProvider = new HocuspocusProvider({
      url: 'ws://localhost:1234',
      name: workflowId,
      document: doc,
      token: token || '',
      
      onConnect: () => {
        console.log('Connected to sync server')
      },
      
      onDisconnect: () => {
        console.log('Disconnected from sync server')
      },
      
      onStatus: ({ status }) => {
        console.log('Connection status:', status)
      },
      
      onAwarenessUpdate: ({ states }) => {
        // Actualizar lista de participantes
        const users = Array.from(states.values())
          .map((state: any) => state.user)
          .filter(Boolean)
        
        setParticipants(users)
      }
    })
    
    setYdoc(doc)
    setProvider(newProvider)
    
    // Cleanup
    return () => {
      newProvider.destroy()
      doc.destroy()
    }
  }, [workflowId, token])
  
  // Sincronizar nodos con Yjs
  useEffect(() => {
    if (!ydoc) return
    
    const yNodes = ydoc.getArray<Node>('nodes')
    const yEdges = ydoc.getArray<Edge>('edges')
    
    // Observer para cambios remotos
    const nodesObserver = () => {
      setNodes(yNodes.toArray())
    }
    
    const edgesObserver = () => {
      setEdges(yEdges.toArray())
    }
    
    yNodes.observe(nodesObserver)
    yEdges.observe(edgesObserver)
    
    // Inicializar estado
    setNodes(yNodes.toArray())
    setEdges(yEdges.toArray())
    
    return () => {
      yNodes.unobserve(nodesObserver)
      yEdges.unobserve(edgesObserver)
    }
  }, [ydoc])
  
  // Manejar cambios locales
  const handleNodesChange = (changes: any) => {
    if (!ydoc) return
    
    ydoc.transact(() => {
      const yNodes = ydoc.getArray<Node>('nodes')
      
      // Aplicar cambios al array de Yjs
      changes.forEach((change: any) => {
        if (change.type === 'add') {
          yNodes.push([change.item])
        } else if (change.type === 'remove') {
          const index = yNodes.toArray().findIndex(n => n.id === change.id)
          if (index >= 0) yNodes.delete(index, 1)
        } else if (change.type === 'position') {
          const index = yNodes.toArray().findIndex(n => n.id === change.id)
          if (index >= 0) {
            const node = yNodes.get(index)
            yNodes.delete(index, 1)
            yNodes.insert(index, [{ ...node, position: change.position }])
          }
        }
      })
    })
  }
  
  // Compartir posición del cursor
  useEffect(() => {
    if (!provider) return
    
    const awareness = provider.awareness
    
    const handleMouseMove = (e: MouseEvent) => {
      awareness.setLocalStateField('cursor', {
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [provider])
  
  // Renderizar cursores de otros usuarios
  const renderCollaboratorCursors = () => {
    if (!provider) return null
    
    const awareness = provider.awareness
    const states = awareness.getStates()
    
    return Array.from(states.entries())
      .filter(([clientId]) => clientId !== awareness.clientID)
      .map(([clientId, state]: [number, any]) => {
        if (!state.cursor || !state.user) return null
        
        return (
          <CollaboratorCursor
            key={clientId}
            user={state.user}
            position={state.cursor}
          />
        )
      })
  }
  
  return (
    <div className="relative w-full h-full">
      {/* Barra de participantes */}
      <ParticipantsBar participants={participants} currentUser={user} />
      
      {/* Editor de workflow */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        fitView
      >
        {/* Controles */}
        <Controls />
        <MiniMap />
        <Background />
      </ReactFlow>
      
      {/* Cursores de colaboradores */}
      {renderCollaboratorCursors()}
      
      {/* Panel de comentarios */}
      <CommentsPanel workflowId={workflowId} provider={provider} />
    </div>
  )
}
```

---

### **3. Sistema de Comentarios**

```typescript
// src/components/workflow/comments-panel.tsx

import { useEffect, useState } from 'react'
import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider'

interface Comment {
  id: string
  nodeId?: string // comentario en un nodo específico
  author: User
  content: string
  mentions: string[] // @mentions de otros usuarios
  resolved: boolean
  createdAt: number
  updatedAt: number
  replies: Comment[]
}

export function CommentsPanel({ 
  workflowId, 
  provider 
}: { 
  workflowId: string
  provider: HocuspocusProvider | null 
}) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const { user } = useAuth()
  
  useEffect(() => {
    if (!provider) return
    
    const doc = provider.document
    const yComments = doc.getArray<Comment>('comments')
    
    // Observer para cambios en comentarios
    const observer = () => {
      setComments(yComments.toArray())
    }
    
    yComments.observe(observer)
    setComments(yComments.toArray())
    
    return () => {
      yComments.unobserve(observer)
    }
  }, [provider])
  
  const addComment = (content: string, nodeId?: string) => {
    if (!provider || !user) return
    
    const doc = provider.document
    const yComments = doc.getArray<Comment>('comments')
    
    // Detectar mentions (@usuario)
    const mentions = extractMentions(content)
    
    const comment: Comment = {
      id: generateId(),
      nodeId,
      author: user,
      content,
      mentions,
      resolved: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      replies: []
    }
    
    doc.transact(() => {
      yComments.push([comment])
    })
    
    // Notificar a usuarios mencionados
    mentions.forEach(userId => {
      notifyUser(userId, {
        type: 'mention',
        workflowId,
        commentId: comment.id,
        message: `${user.name} te mencionó en un comentario`
      })
    })
  }
  
  const resolveComment = (commentId: string) => {
    if (!provider) return
    
    const doc = provider.document
    const yComments = doc.getArray<Comment>('comments')
    
    doc.transact(() => {
      const index = yComments.toArray().findIndex(c => c.id === commentId)
      if (index >= 0) {
        const comment = yComments.get(index)
        yComments.delete(index, 1)
        yComments.insert(index, [{
          ...comment,
          resolved: true,
          updatedAt: Date.now()
        }])
      }
    })
  }
  
  return (
    <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg border-l">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Comentarios</h3>
        
        {/* Lista de comentarios */}
        <div className="space-y-4 mb-4">
          {comments
            .filter(c => !c.resolved)
            .map(comment => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onResolve={() => resolveComment(comment.id)}
              />
            ))}
        </div>
        
        {/* Nuevo comentario */}
        <div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Añade un comentario... (@mencionar usuarios)"
            className="w-full p-2 border rounded"
            rows={3}
          />
          <button
            onClick={() => {
              addComment(newComment)
              setNewComment('')
            }}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Comentar
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

### **4. Sistema de Aprobaciones**

```typescript
// src/lib/collaboration/approval-system.ts

interface ApprovalRequest {
  id: string
  workflowId: string
  changeDescription: string
  requestedBy: User
  approvers: User[]
  requiredApprovals: number
  approvals: Approval[]
  rejections: Rejection[]
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  expiresAt: Date
  createdAt: Date
}

interface Approval {
  userId: string
  comment?: string
  approvedAt: Date
}

interface Rejection {
  userId: string
  reason: string
  rejectedAt: Date
}

class ApprovalSystem {
  /**
   * Solicita aprobación para cambio en workflow
   */
  async requestApproval(
    workflowId: string,
    changes: WorkflowChange[],
    config: ApprovalConfig
  ): Promise<ApprovalRequest> {
    // 1. Crear request de aprobación
    const request: ApprovalRequest = {
      id: generateId(),
      workflowId,
      changeDescription: this.summarizeChanges(changes),
      requestedBy: config.requestedBy,
      approvers: config.approvers,
      requiredApprovals: config.requiredApprovals || config.approvers.length,
      approvals: [],
      rejections: [],
      status: 'pending',
      expiresAt: new Date(Date.now() + config.timeoutMs),
      createdAt: new Date()
    }
    
    // 2. Guardar en DB
    await prisma.approvalRequest.create({ data: request })
    
    // 3. Notificar a aprobadores
    await this.notifyApprovers(request)
    
    // 4. Programar timeout
    await this.scheduleTimeout(request)
    
    return request
  }
  
  /**
   * Aprobar cambio
   */
  async approve(
    requestId: string,
    userId: string,
    comment?: string
  ): Promise<ApprovalRequest> {
    const request = await prisma.approvalRequest.findUnique({
      where: { id: requestId }
    })
    
    if (!request) {
      throw new Error('Approval request not found')
    }
    
    if (request.status !== 'pending') {
      throw new Error('Approval request is no longer pending')
    }
    
    // Verificar que el usuario es aprobador
    if (!request.approvers.some(a => a.id === userId)) {
      throw new Error('User is not an approver')
    }
    
    // Agregar aprobación
    const approval: Approval = {
      userId,
      comment,
      approvedAt: new Date()
    }
    
    request.approvals.push(approval)
    
    // Verificar si ya se alcanzaron las aprobaciones necesarias
    if (request.approvals.length >= request.requiredApprovals) {
      request.status = 'approved'
      
      // Aplicar cambios al workflow
      await this.applyChanges(request.workflowId, request.changes)
      
      // Notificar a todos
      await this.notifyApprovalComplete(request)
    }
    
    // Actualizar DB
    await prisma.approvalRequest.update({
      where: { id: requestId },
      data: request
    })
    
    return request
  }
  
  /**
   * Rechazar cambio
   */
  async reject(
    requestId: string,
    userId: string,
    reason: string
  ): Promise<ApprovalRequest> {
    const request = await prisma.approvalRequest.findUnique({
      where: { id: requestId }
    })
    
    if (!request || request.status !== 'pending') {
      throw new Error('Invalid approval request')
    }
    
    // Agregar rechazo
    const rejection: Rejection = {
      userId,
      reason,
      rejectedAt: new Date()
    }
    
    request.rejections.push(rejection)
    request.status = 'rejected'
    
    // Notificar rechazo
    await this.notifyRejection(request, rejection)
    
    // Actualizar DB
    await prisma.approvalRequest.update({
      where: { id: requestId },
      data: request
    })
    
    return request
  }
  
  /**
   * Notifica a aprobadores (email, Slack, push)
   */
  private async notifyApprovers(request: ApprovalRequest): Promise<void> {
    for (const approver of request.approvers) {
      // Email
      await sendEmail({
        to: approver.email,
        subject: `Aprobación requerida: ${request.changeDescription}`,
        template: 'approval-request',
        data: {
          requester: request.requestedBy.name,
          workflow: request.workflowId,
          changes: request.changeDescription,
          approveUrl: `${process.env.APP_URL}/approvals/${request.id}/approve`,
          rejectUrl: `${process.env.APP_URL}/approvals/${request.id}/reject`
        }
      })
      
      // Slack (si está conectado)
      const slackConnection = await getSlackConnection(approver.workspaceId)
      if (slackConnection) {
        await sendSlackMessage({
          connection: slackConnection,
          channel: approver.slackUserId,
          text: `⚠️ Aprobación requerida`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*${request.requestedBy.name}* solicita aprobación para:\n${request.changeDescription}`
              }
            },
            {
              type: 'actions',
              elements: [
                {
                  type: 'button',
                  text: { type: 'plain_text', text: '✅ Aprobar' },
                  style: 'primary',
                  url: `${process.env.APP_URL}/approvals/${request.id}/approve`
                },
                {
                  type: 'button',
                  text: { type: 'plain_text', text: '❌ Rechazar' },
                  style: 'danger',
                  url: `${process.env.APP_URL}/approvals/${request.id}/reject`
                }
              ]
            }
          ]
        })
      }
      
      // Push notification
      await sendPushNotification({
        userId: approver.id,
        title: 'Aprobación requerida',
        body: request.changeDescription,
        data: {
          type: 'approval-request',
          requestId: request.id
        }
      })
    }
  }
}
```

---

## 📊 Casos de Uso

### **1. Equipo de Marketing editando campaign workflow**

```
09:00 - María abre el workflow "Email Campaign"
09:05 - Juan se une y ve el cursor de María en tiempo real
09:07 - María añade nodo de "Segment Audience"
09:08 - Juan ve el cambio instantáneamente
09:10 - Juan comenta: "@María ¿usamos el segmento de últimos 30 días?"
09:11 - María responde en el comentario y ajusta el nodo
09:15 - María solicita aprobación del manager
09:20 - Manager aprueba desde Slack
09:21 - Workflow se activa automáticamente
```

### **2. Developer y PM colaborando en integración**

```
14:00 - PM describe en comentario: "Necesitamos integrar con Salesforce"
14:05 - Developer se une al workflow
14:07 - Developer añade nodos de integración
14:10 - PM ve cambios en tiempo real y comenta ajustes
14:15 - Ambos prueban el workflow juntos
14:20 - PM marca comentarios como resueltos
```

---

## 🚀 Plan de Implementación (2-3 Semanas)

### **Semana 1: Setup y Sync Básico**
- [ ] Configurar Hocuspocus server
- [ ] Integrar Yjs en React Flow
- [ ] Implementar sincronización de nodos/edges
- [ ] Testing básico de co-edición

### **Semana 2: Awareness y Comentarios**
- [ ] Mostrar cursores de otros usuarios
- [ ] Implementar sistema de comentarios
- [ ] Mentions y notificaciones
- [ ] UI de participantes activos

### **Semana 3: Aprobaciones y Polish**
- [ ] Sistema de aprobaciones
- [ ] Integraciones (Slack, Email)
- [ ] Testing E2E
- [ ] Optimización de performance

---

## 💰 Costos

| Componente | Costo Mensual |
|------------|---------------|
| Hocuspocus Cloud (alternativa) | $49-199 |
| Redis (Upstash) | $10-30 |
| WebSocket bandwidth | $5-20 |
| **TOTAL (self-hosted)** | **$15-50** |

**Precio al usuario:** Incluido en plan Professional ($199/mes) ✅

---

## 🎯 Próximos Pasos

**¿Empezamos?** 🚀

- **Opción J:** Setup Hocuspocus + sync básico
- **Opción K:** Implementar awareness (cursores)
- **Opción L:** Sistema de comentarios completo

