'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MessageSquare, Settings, Play, Pause, Users, Bot, Zap } from 'lucide-react';

export default function ChatbotPage() {
  const [activeTab, setActiveTab] = useState('chatbots');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Chatbots Inteligentes
              </h1>
              <p className="text-gray-600">
                Crea asistentes virtuales que atienden a tus clientes 24/7
              </p>
            </div>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 shadow-sm">
              <Plus className="w-5 h-5" />
              Crear Chatbot
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 p-6 mb-8"
        >
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('chatbots')}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'chatbots' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mis Chatbots
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'templates' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Plantillas
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'analytics' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Analytics
            </button>
          </div>
        </motion.div>

        {/* Content */}
        {activeTab === 'chatbots' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Chatbot Card 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text)]">Asistente de Ventas</h3>
                    <p className="text-sm text-[var(--muted)]">Atención al cliente</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600">En línea</span>
                </div>
              </div>
              <p className="text-sm text-[var(--muted)] mb-4">
                Responde preguntas sobre productos, precios y disponibilidad.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="font-semibold text-[var(--text)]">1,247</div>
                  <div className="text-[var(--muted)]">Conversaciones</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="font-semibold text-[var(--text)]">94%</div>
                  <div className="text-[var(--muted)]">Satisfacción</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2">
                  <Pause className="w-4 h-4" />
                  Pausar
                </button>
                <button className="px-3 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chatbot Card 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text)]">Soporte Técnico</h3>
                    <p className="text-sm text-[var(--muted)]">Ayuda técnica</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-yellow-600">Pausado</span>
                </div>
              </div>
              <p className="text-sm text-[var(--muted)] mb-4">
                Ayuda con problemas técnicos y guías de solución.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="font-semibold text-[var(--text)]">892</div>
                  <div className="text-[var(--muted)]">Conversaciones</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="font-semibold text-[var(--text)]">87%</div>
                  <div className="text-[var(--muted)]">Resolución</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  Activar
                </button>
                <button className="px-3 py-2 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Nuevo Chatbot */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-[var(--border)] p-6 hover:border-[var(--brand)] transition-colors cursor-pointer">
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="font-semibold text-[var(--text)] mb-2">Crear Nuevo Chatbot</h3>
                <p className="text-sm text-[var(--muted)]">
                  Construye tu asistente virtual personalizado
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'templates' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Template Cards */}
            {[
              { name: 'Atención al Cliente', desc: 'Responde preguntas frecuentes', icon: '🎯' },
              { name: 'Soporte Técnico', desc: 'Ayuda con problemas técnicos', icon: '🔧' },
              { name: 'Ventas', desc: 'Guía de compra y recomendaciones', icon: '💰' },
              { name: 'Onboarding', desc: 'Bienvenida a nuevos usuarios', icon: '🚀' },
              { name: 'FAQ', desc: 'Preguntas frecuentes automatizadas', icon: '❓' },
              { name: 'Booking', desc: 'Reservas y citas', icon: '📅' }
            ].map((template, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-center">
                  <div className="text-4xl mb-4">{template.icon}</div>
                  <h3 className="font-semibold text-[var(--text)] mb-2">{template.name}</h3>
                  <p className="text-sm text-[var(--muted)] mb-4">{template.desc}</p>
                  <button className="w-full px-4 py-2 bg-[var(--brand)] text-white rounded-lg hover:bg-[var(--brand-hover)] transition-colors">
                    Usar Plantilla
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Métricas */}
            <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6">
              <h3 className="font-semibold text-[var(--text)] mb-4">Métricas Generales</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">2,139</div>
                  <div className="text-sm text-blue-600">Conversaciones</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">91%</div>
                  <div className="text-sm text-green-600">Satisfacción</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">87%</div>
                  <div className="text-sm text-purple-600">Resolución</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">3.2s</div>
                  <div className="text-sm text-orange-600">Tiempo respuesta</div>
                </div>
              </div>
            </div>

            {/* Gráfico */}
            <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6">
              <h3 className="font-semibold text-[var(--text)] mb-4">Conversaciones por día</h3>
              <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-[var(--muted)]">Gráfico de conversaciones</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}