'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Mail, Send, Users, Clock, BarChart3, Settings, Play, Pause, ShoppingCart } from 'lucide-react';

export default function EmailsPage() {
  const [activeTab, setActiveTab] = useState('campaigns');

  return (
    <div className="min-h-screen bg-[var(--bg)] p-6">
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
              <h1 className="text-3xl font-bold text-[var(--text)] mb-2">
                Automatización de Emails
              </h1>
              <p className="text-[var(--muted)]">
                Crea y gestiona campañas de email marketing automatizadas
              </p>
            </div>
            <button className="px-6 py-3 bg-[var(--brand)] text-white rounded-lg hover:bg-[var(--brand-hover)] transition-colors font-medium flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nueva Campaña
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">1,247</div>
                <div className="text-sm text-[var(--muted)]">Emails enviados</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">892</div>
                <div className="text-sm text-[var(--muted)]">Suscriptores</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">24.5%</div>
                <div className="text-sm text-[var(--muted)]">Tasa de apertura</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Send className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text)]">8.3%</div>
                <div className="text-sm text-[var(--muted)]">Tasa de clics</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6 mb-8"
        >
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'campaigns' 
                  ? 'bg-white text-[var(--brand)] shadow-sm' 
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              Campañas
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'templates' 
                  ? 'bg-white text-[var(--brand)] shadow-sm' 
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              Plantillas
            </button>
            <button
              onClick={() => setActiveTab('automation')}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'automation' 
                  ? 'bg-white text-[var(--brand)] shadow-sm' 
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              Automatización
            </button>
            <button
              onClick={() => setActiveTab('lists')}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'lists' 
                  ? 'bg-white text-[var(--brand)] shadow-sm' 
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              Listas
            </button>
          </div>
        </motion.div>

        {/* Content */}
        {activeTab === 'campaigns' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Campaign Card 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text)]">Newsletter Semanal</h3>
                    <p className="text-sm text-[var(--muted)]">Marketing</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600">Activa</span>
                </div>
              </div>
              <p className="text-sm text-[var(--muted)] mb-4">
                Newsletter con las últimas novedades y ofertas especiales.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="font-semibold text-[var(--text)]">892</div>
                  <div className="text-[var(--muted)]">Enviados</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="font-semibold text-[var(--text)]">24.5%</div>
                  <div className="text-[var(--muted)]">Apertura</div>
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

            {/* Campaign Card 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text)]">Bienvenida</h3>
                    <p className="text-sm text-[var(--muted)]">Onboarding</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-yellow-600">Programada</span>
                </div>
              </div>
              <p className="text-sm text-[var(--muted)] mb-4">
                Email de bienvenida para nuevos suscriptores.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="font-semibold text-[var(--text)]">156</div>
                  <div className="text-[var(--muted)]">Enviados</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="font-semibold text-[var(--text)]">31.2%</div>
                  <div className="text-[var(--muted)]">Apertura</div>
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

            {/* Nueva Campaña */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-[var(--border)] p-6 hover:border-[var(--brand)] transition-colors cursor-pointer">
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="font-semibold text-[var(--text)] mb-2">Crear Nueva Campaña</h3>
                <p className="text-sm text-[var(--muted)]">
                  Diseña tu email desde cero
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'templates' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Template Cards */}
            {[
              { name: 'Newsletter', desc: 'Plantilla para newsletters', preview: '📰' },
              { name: 'Promoción', desc: 'Ofertas y descuentos', preview: '🎉' },
              { name: 'Bienvenida', desc: 'Onboarding de usuarios', preview: '👋' },
              { name: 'Recordatorio', desc: 'Seguimiento de eventos', preview: '⏰' },
              { name: 'Confirmación', desc: 'Confirmaciones de compra', preview: '✅' },
              { name: 'Reactivación', desc: 'Recuperar usuarios inactivos', preview: '🔄' }
            ].map((template, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-center">
                  <div className="text-4xl mb-4">{template.preview}</div>
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

        {activeTab === 'automation' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6">
              <h3 className="font-semibold text-[var(--text)] mb-4">Flujos de Automatización</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-[var(--border)] rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-[var(--text)]">Nuevo Suscriptor</h4>
                  </div>
                  <p className="text-sm text-[var(--muted)] mb-3">
                    Email de bienvenida → Seguimiento → Oferta especial
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Activo</span>
                  </div>
                </div>
                <div className="border border-[var(--border)] rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-[var(--text)]">Carrito Abandonado</h4>
                  </div>
                  <p className="text-sm text-[var(--muted)] mb-3">
                    Recordatorio → Descuento → Última oportunidad
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs text-yellow-600">Pausado</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'lists' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[var(--text)]">Listas de Contactos</h3>
                <button className="px-4 py-2 bg-[var(--brand)] text-white rounded-lg hover:bg-[var(--brand-hover)] transition-colors">
                  Nueva Lista
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-[var(--border)] rounded-lg p-4">
                  <h4 className="font-semibold text-[var(--text)] mb-2">Newsletter</h4>
                  <div className="text-2xl font-bold text-blue-600 mb-1">892</div>
                  <div className="text-sm text-[var(--muted)]">contactos</div>
                </div>
                <div className="border border-[var(--border)] rounded-lg p-4">
                  <h4 className="font-semibold text-[var(--text)] mb-2">Clientes Activos</h4>
                  <div className="text-2xl font-bold text-green-600 mb-1">456</div>
                  <div className="text-sm text-[var(--muted)]">contactos</div>
                </div>
                <div className="border border-[var(--border)] rounded-lg p-4">
                  <h4 className="font-semibold text-[var(--text)] mb-2">Prospectos</h4>
                  <div className="text-2xl font-bold text-purple-600 mb-1">234</div>
                  <div className="text-sm text-[var(--muted)]">contactos</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}