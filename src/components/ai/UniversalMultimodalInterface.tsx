'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TimeDisplay } from '@/components/TimeDisplay';
import { 
  Mic, 
  MicOff, 
  Camera, 
  FileText, 
  Image, 
  Video,
  Send,
  Bot,
  User,
  Volume2,
  VolumeX
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  inputType: 'text' | 'voice' | 'image' | 'video';
}

export function UniversalMultimodalInterface() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '¡Hola! Soy tu asistente multimodal. Puedes hablar conmigo, enviar imágenes, videos o texto. ¿En qué puedo ayudarte?',
      timestamp: new Date(),
      inputType: 'text'
    }
  ]);
  const [activeMode, setActiveMode] = useState<'text' | 'voice' | 'image' | 'video'>('text');

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date(),
      inputType: activeMode
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simular respuesta de IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Entiendo tu solicitud: "${inputText}". Estoy procesando esta información y generando una respuesta optimizada para ti.`,
        timestamp: new Date(),
        inputType: 'text'
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setActiveMode('voice');
    }
  };

  const toggleVoiceOutput = () => {
    setIsSpeaking(!isSpeaking);
  };

  const getInputIcon = (type: string) => {
    switch (type) {
      case 'voice': return <Mic className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="card p-6 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Interfaz Multimodal Universal</h3>
            <p className="text-sm text-gray-600">Control por voz, texto e imagen</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleVoiceOutput}
            className={`p-2 rounded-lg transition-colors ${
              isSpeaking 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Modos de Entrada */}
      <div className="flex gap-2 mb-6">
        {[
          { mode: 'text', icon: FileText, label: 'Texto' },
          { mode: 'voice', icon: Mic, label: 'Voz' },
          { mode: 'image', icon: Image, label: 'Imagen' },
          { mode: 'video', icon: Video, label: 'Video' }
        ].map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => setActiveMode(mode as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeMode === mode
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="bg-white rounded-lg border border-gray-200 h-64 overflow-y-auto p-4 mb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-3 max-w-xs ${
                message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}>
                <div className={`p-2 rounded-full ${
                  message.type === 'user' 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div className={`p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    {getInputIcon(message.inputType)}
                    <span className="text-xs opacity-75">
                      <TimeDisplay timestamp={message.timestamp} format="time" />
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              activeMode === 'voice' ? 'Habla ahora...' :
              activeMode === 'image' ? 'Describe la imagen...' :
              activeMode === 'video' ? 'Describe el video...' :
              'Escribe tu mensaje...'
            }
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
            disabled={activeMode === 'voice' && isListening}
          />
          
          {activeMode === 'voice' && (
            <button
              onClick={toggleVoiceInput}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}
        </div>
        
        <button
          onClick={handleSendMessage}
          disabled={!inputText.trim() && activeMode !== 'voice'}
          className="px-4 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Estado de Procesamiento */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-3 bg-pink-100 rounded-lg border border-pink-200"
        >
          <div className="flex items-center gap-2 text-pink-700">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Escuchando...</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
