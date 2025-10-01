'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Send, 
  Smile, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video, 
  Users, 
  Settings,
  Search,
  Pin,
  Archive,
  Trash2,
  Edit,
  Reply,
  Copy,
  ThumbsUp,
  Heart,
  Laugh,
  Angry,
  CheckCircle,
  Clock,
  AlertCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react'

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

interface ChatRoomProps {
  roomId: string
  roomName: string
  participants: Array<{
    id: string
    name: string
    avatar?: string
    isOnline: boolean
    role: 'admin' | 'member' | 'guest'
    lastSeen?: Date
  }>
  messages: Message[]
  onSendMessage: (content: string, type?: 'text' | 'image' | 'file') => void
  onReactToMessage: (messageId: string, emoji: string) => void
  onReplyToMessage: (messageId: string) => void
  onEditMessage: (messageId: string, newContent: string) => void
  onDeleteMessage: (messageId: string) => void
  onPinMessage: (messageId: string) => void
  currentUser: {
    id: string
    name: string
    avatar?: string
  }
}

const emojiReactions = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '🔥']

export default function ChatRoom({
  roomId,
  roomName,
  participants,
  messages,
  onSendMessage,
  onReactToMessage,
  onReplyToMessage,
  onEditMessage,
  onDeleteMessage,
  onPinMessage,
  currentUser
}: ChatRoomProps) {
  const [messageInput, setMessageInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [showParticipants, setShowParticipants] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Simular usuarios escribiendo
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const randomUser = participants[Math.floor(Math.random() * participants.length)]
        if (randomUser.id !== currentUser.id) {
          setTypingUsers(prev => [...prev, randomUser.name])
          setTimeout(() => {
            setTypingUsers(prev => prev.filter(name => name !== randomUser.name))
          }, 3000)
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [participants, currentUser.id])

  const handleSendMessage = () => {
    if (!messageInput.trim() && !replyingTo) return

    onSendMessage(messageInput.trim(), 'text')
    setMessageInput('')
    setReplyingTo(null)
    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Simular subida de archivo
      onSendMessage(`Archivo: ${file.name}`, 'file')
    }
  }

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (timestamp: Date) => {
    const today = new Date()
    const messageDate = new Date(timestamp)
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Hoy'
    }
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Ayer'
    }
    
    return messageDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const onlineParticipants = participants.filter(p => p.isOnline)
  const pinnedMessages = messages.filter(m => m.isPinned)

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <CardTitle className="text-lg">{roomName}</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800 text-xs">
                  {onlineParticipants.length} en línea
                </Badge>
                <span className="text-sm text-gray-600">
                  {participants.length} miembros
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowParticipants(!showParticipants)}
            >
              <Users className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Pinned Messages */}
        {pinnedMessages.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Pin className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Mensajes fijados</span>
            </div>
            {pinnedMessages.map((message) => (
              <div key={message.id} className="text-sm text-yellow-700">
                <strong>{message.sender.name}:</strong> {message.content}
              </div>
            ))}
          </div>
        )}

        {/* Messages */}
        {messages.map((message, index) => {
          const isCurrentUser = message.sender.id === currentUser.id
          const showAvatar = index === 0 || messages[index - 1].sender.id !== message.sender.id
          const showDate = index === 0 || 
            new Date(message.timestamp).toDateString() !== 
            new Date(messages[index - 1].timestamp).toDateString()

          return (
            <div key={message.id}>
              {/* Date separator */}
              {showDate && (
                <div className="flex items-center justify-center my-4">
                  <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {formatDate(message.timestamp)}
                  </div>
                </div>
              )}

              <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex space-x-2 max-w-[70%] ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  {showAvatar && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={message.sender.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                        {getInitials(message.sender.name)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  {/* Message content */}
                  <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                    {/* Sender name */}
                    {showAvatar && (
                      <div className={`flex items-center space-x-2 mb-1 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs font-medium text-gray-700">
                          {message.sender.name}
                        </span>
                        {message.sender.role === 'admin' && (
                          <Badge className="bg-red-100 text-red-800 text-xs">Admin</Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    )}

                    {/* Message bubble */}
                    <div className={`group relative p-3 rounded-lg ${
                      isCurrentUser 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {/* Reply indicator */}
                      {message.replyTo && (
                        <div className={`mb-2 p-2 rounded border-l-2 ${
                          isCurrentUser ? 'bg-blue-400 border-blue-300' : 'bg-gray-200 border-gray-300'
                        }`}>
                          <div className="text-xs font-medium">
                            Respondiendo a {message.replyTo.sender}
                          </div>
                          <div className="text-xs opacity-75">
                            {message.replyTo.content}
                          </div>
                        </div>
                      )}

                      {/* Message content */}
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      
                      {/* Edited indicator */}
                      {message.isEdited && (
                        <span className="text-xs opacity-75 ml-2">(editado)</span>
                      )}

                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center space-x-2 p-2 bg-white/20 rounded">
                              <Paperclip className="h-3 w-3" />
                              <span className="text-xs">{attachment.name}</span>
                              <span className="text-xs opacity-75">({attachment.size})</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Message actions */}
                      <div className={`absolute top-0 ${
                        isCurrentUser ? '-left-2' : '-right-2'
                      } opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <div className="flex items-center space-x-1 bg-white rounded-lg shadow-lg border p-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onReplyToMessage(message.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Reply className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onPinMessage(message.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Pin className="h-3 w-3" />
                          </Button>
                          {isCurrentUser && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingMessage(message)}
                                className="h-6 w-6 p-0"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDeleteMessage(message.id)}
                                className="h-6 w-6 p-0 text-red-500"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Reactions */}
                    {message.reactions && message.reactions.length > 0 && (
                      <div className={`flex flex-wrap gap-1 mt-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        {message.reactions.map((reaction, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            onClick={() => onReactToMessage(message.id, reaction.emoji)}
                            className="h-6 px-2 text-xs hover:bg-gray-100"
                          >
                            {reaction.emoji} {reaction.count}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'está escribiendo' : 'están escribiendo'}...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      {/* Reply indicator */}
      {replyingTo && (
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium">Respondiendo a {replyingTo.sender.name}:</span>
              <span className="text-gray-600 ml-2">{replyingTo.content}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(null)}
            >
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={messageInput}
              onChange={(e) => {
                setMessageInput(e.target.value)
                setIsTyping(e.target.value.length > 0)
              }}
              onKeyPress={handleKeyPress}
              placeholder="Escribe un mensaje..."
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsRecording(!isRecording)}
            className={isRecording ? 'text-red-500' : ''}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() && !replyingTo}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Emoji picker */}
        {showEmojiPicker && (
          <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="grid grid-cols-8 gap-1">
              {emojiReactions.map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMessageInput(prev => prev + emoji)
                    setShowEmojiPicker(false)
                  }}
                  className="h-8 w-8 p-0 text-lg"
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,application/pdf,.doc,.docx,.txt"
      />
    </div>
  )
}
