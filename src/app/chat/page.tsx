'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Settings, 
  Users, 
  Hash, 
  Lock, 
  Star,
  Pin,
  Archive,
  MoreVertical,
  Phone,
  Video,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Edit,
  Trash2,
  UserPlus,
  Shield,
  Crown
} from 'lucide-react'
import ChatRoom from '@/components/chat/chat-room'
import { SafeTimeDisplay } from '@/components/SafeTimeDisplay';

interface ChatRoom {
  id: string
  name: string
  type: 'direct' | 'group' | 'channel'
  lastMessage?: {
    content: string
    timestamp: Date
    sender: string
  }
  unreadCount: number
  isOnline: boolean
  participants: Array<{
    id: string
    name: string
    avatar?: string
    isOnline: boolean
    role: 'admin' | 'member' | 'guest'
  }>
  isPinned: boolean
  isMuted: boolean
  isArchived: boolean
}

interface Message {
  id: string
  content: string
  timestamp: Date
  sender: {
    id: string
    name: string
    avatar?: string
    isOnline: boolean
    role: 'admin' | 'member' | 'guest'
  }
  type: 'text' | 'image' | 'file' | 'system'
  replyTo?: {
    id: string
    content: string
    sender: string
  }
  reactions: {
    emoji: string
    count: number
    users: string[]
  }[]
  isEdited?: boolean
  isPinned?: boolean
  attachments?: {
    id: string
    name: string
    type: string
    size: string
    url: string
  }[]
}

const mockRooms: ChatRoom[] = [
  {
    id: '1',
    name: 'General',
    type: 'channel',
    lastMessage: {
      content: '¡Hola equipo! ¿Cómo va el proyecto?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      sender: 'María García'
    },
    unreadCount: 3,
    isOnline: true,
    participants: [
      { id: '1', name: 'María García', isOnline: true, role: 'admin' },
      { id: '2', name: 'Carlos López', isOnline: true, role: 'member' },
      { id: '3', name: 'Ana Martín', isOnline: false, role: 'member' },
      { id: '4', name: 'David Rodríguez', isOnline: true, role: 'member' }
    ],
    isPinned: true,
    isMuted: false,
    isArchived: false
  },
  {
    id: '2',
    name: 'Desarrollo',
    type: 'channel',
    lastMessage: {
      content: 'El bug está solucionado, podemos hacer deploy',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      sender: 'Carlos López'
    },
    unreadCount: 0,
    isOnline: true,
    participants: [
      { id: '1', name: 'María García', isOnline: true, role: 'admin' },
      { id: '2', name: 'Carlos López', isOnline: true, role: 'member' },
      { id: '3', name: 'Ana Martín', isOnline: false, role: 'member' }
    ],
    isPinned: true,
    isMuted: false,
    isArchived: false
  },
  {
    id: '3',
    name: 'María García',
    type: 'direct',
    lastMessage: {
      content: 'Perfecto, gracias por la actualización',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      sender: 'María García'
    },
    unreadCount: 1,
    isOnline: true,
    participants: [
      { id: '1', name: 'María García', isOnline: true, role: 'admin' }
    ],
    isPinned: false,
    isMuted: false,
    isArchived: false
  },
  {
    id: '4',
    name: 'Marketing',
    type: 'channel',
    lastMessage: {
      content: 'La campaña de Black Friday está lista',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      sender: 'Ana Martín'
    },
    unreadCount: 0,
    isOnline: false,
    participants: [
      { id: '1', name: 'María García', isOnline: true, role: 'admin' },
      { id: '3', name: 'Ana Martín', isOnline: false, role: 'member' },
      { id: '5', name: 'Laura Sánchez', isOnline: true, role: 'member' }
    ],
    isPinned: false,
    isMuted: true,
    isArchived: false
  },
  {
    id: '5',
    name: 'Carlos López',
    type: 'direct',
    lastMessage: {
      content: '¿Podemos revisar el código juntos?',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      sender: 'Carlos López'
    },
    unreadCount: 0,
    isOnline: true,
    participants: [
      { id: '2', name: 'Carlos López', isOnline: true, role: 'member' }
    ],
    isPinned: false,
    isMuted: false,
    isArchived: false
  }
]

const mockMessages: Message[] = [
  {
    id: '1',
    content: '¡Hola equipo! ¿Cómo va el proyecto?',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    sender: {
      id: '1',
      name: 'María García',
      isOnline: true,
      role: 'admin'
    },
    type: 'text',
    reactions: [
      { emoji: '👍', count: 3, users: ['2', '3', '4'] },
      { emoji: '🎉', count: 1, users: ['2'] }
    ]
  },
  {
    id: '2',
    content: 'Todo va muy bien, estamos en el 80% del desarrollo',
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
    sender: {
      id: '2',
      name: 'Carlos López',
      isOnline: true,
      role: 'member'
    },
    type: 'text',
    reactions: []
  },
  {
    id: '3',
    content: 'Excelente trabajo equipo! 🚀',
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    sender: {
      id: '1',
      name: 'María García',
      isOnline: true,
      role: 'admin'
    },
    type: 'text',
    reactions: [
      { emoji: '🚀', count: 2, users: ['2', '4'] }
    ]
  }
]

export default function ChatPage() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(mockRooms[0])
  const [rooms, setRooms] = useState<ChatRoom[]>(mockRooms)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateRoom, setShowCreateRoom] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const currentUser = {
    id: 'current',
    name: 'Usuario Actual',
    avatar: undefined
  }

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendMessage = (content: string, type: 'text' | 'image' | 'file' = 'text') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      sender: {
        id: currentUser.id,
        name: currentUser.name,
        isOnline: true,
        role: 'member'
      },
      type,
      reactions: []
    }

    setMessages(prev => [...prev, newMessage])
    
    // Actualizar último mensaje en la sala
    if (selectedRoom) {
      setRooms(prev => prev.map(room => 
        room.id === selectedRoom.id 
          ? {
              ...room,
              lastMessage: {
                content,
                timestamp: new Date(),
                sender: currentUser.name
              }
            }
          : room
      ))
    }
  }

  const handleReactToMessage = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(message => {
      if (message.id === messageId) {
        const existingReaction = message.reactions.find(r => r.emoji === emoji)
        if (existingReaction) {
          return {
            ...message,
            reactions: message.reactions.map(r =>
              r.emoji === emoji
                ? { ...r, count: r.count + 1, users: [...r.users, currentUser.id] }
                : r
            )
          }
        } else {
          return {
            ...message,
            reactions: [...message.reactions, { emoji, count: 1, users: [currentUser.id] }]
          }
        }
      }
      return message
    }))
  }

  const handleReplyToMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (message) {
      // Implementar lógica de respuesta
      console.log('Replying to:', message.content)
    }
  }

  const handleEditMessage = (messageId: string, newContent: string) => {
    setMessages(prev => prev.map(message =>
      message.id === messageId
        ? { ...message, content: newContent, isEdited: true }
        : message
    ))
  }

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(message => message.id !== messageId))
  }

  const handlePinMessage = (messageId: string) => {
    setMessages(prev => prev.map(message =>
      message.id === messageId
        ? { ...message, isPinned: !message.isPinned }
        : message
    ))
  }

  // Removed formatTime function - using TimeDisplay component instead

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const totalUnreadCount = rooms.reduce((sum, room) => sum + room.unreadCount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Chat en Tiempo Real</h1>
                <p className="text-gray-600">Comunícate con tu equipo en tiempo real</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {totalUnreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {totalUnreadCount} mensajes no leídos
                </Badge>
              )}
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Button>
              <Button
                onClick={() => setShowCreateRoom(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Sala
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
          {/* Sidebar - Lista de salas */}
          <div className="lg:col-span-1">
            <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Conversaciones</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCreateRoom(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar conversaciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>

              <CardContent className="p-0 overflow-y-auto">
                <div className="space-y-1">
                  {filteredRooms.map((room) => {
                    const onlineCount = room.participants.filter(p => p.isOnline).length
                    return (
                      <div
                        key={room.id}
                        className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                          selectedRoom?.id === room.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                        }`}
                        onClick={() => setSelectedRoom(room)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              room.type === 'direct' 
                                ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                                : 'bg-gradient-to-r from-purple-500 to-pink-500'
                            }`}>
                              {room.type === 'direct' ? (
                                <span className="text-white font-medium text-sm">
                                  {getInitials(room.name)}
                                </span>
                              ) : (
                                <Hash className="h-5 w-5 text-white" />
                              )}
                            </div>
                            {room.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {room.name}
                              </h3>
                              <div className="flex items-center space-x-1">
                                {room.isPinned && <Pin className="h-3 w-3 text-yellow-500" />}
                                {room.isMuted && <VolumeX className="h-3 w-3 text-gray-400" />}
                                {room.unreadCount > 0 && (
                                  <Badge className="bg-blue-500 text-white text-xs">
                                    {room.unreadCount}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            {room.lastMessage && (
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-gray-600 truncate">
                                  {room.lastMessage.sender}: {room.lastMessage.content}
                                </p>
                                <span className="text-xs text-gray-500">
                                  <SafeTimeDisplay timestamp={room.lastMessage.timestamp} format="time" />
                                </span>
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {onlineCount} en línea
                              </span>
                              {room.type === 'channel' && (
                                <Badge className="bg-gray-100 text-gray-700 text-xs">
                                  Canal
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              {selectedRoom ? (
                <ChatRoom
                  roomId={selectedRoom.id}
                  roomName={selectedRoom.name}
                  participants={selectedRoom.participants}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onReactToMessage={handleReactToMessage}
                  onReplyToMessage={handleReplyToMessage}
                  onEditMessage={handleEditMessage}
                  onDeleteMessage={handleDeleteMessage}
                  onPinMessage={handlePinMessage}
                  currentUser={currentUser}
                />
              ) : (
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Selecciona una conversación
                    </h3>
                    <p className="text-gray-600">
                      Elige una conversación del panel lateral para comenzar a chatear
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
