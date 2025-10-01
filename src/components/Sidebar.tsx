'use client';

import React from 'react';
import { Home, Workflow, Folder, Settings, Bell, User, BarChart3, Database, TestTube, BookOpen, Zap, MessageSquare, Mail, CreditCard, Shield, Server, Archive } from 'lucide-react';

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
  className?: string;
}

const sidebarItems = [
  { id: 'home', icon: Home, label: 'Inicio', tooltip: 'Dashboard principal' },
  { id: 'workflows', icon: Workflow, label: 'Workflows', tooltip: 'Gestionar flujos de trabajo' },
  { id: 'chatbot', icon: MessageSquare, label: 'Chatbots', tooltip: 'Chatbots con IA' },
  { id: 'emails', icon: Mail, label: 'Emails', tooltip: 'Automatización de emails' },
  { id: 'billing', icon: CreditCard, label: 'Facturación', tooltip: 'Gestión de pagos' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', tooltip: 'Métricas y estadísticas' },
  { id: 'admin', icon: Shield, label: 'Admin', tooltip: 'Panel de administración' },
  { id: 'monitoring', icon: Server, label: 'Monitoreo', tooltip: 'Monitoreo del sistema' },
  { id: 'backups', icon: Archive, label: 'Backups', tooltip: 'Gestión de respaldos' },
  { id: 'integrations', icon: Zap, label: 'Integraciones', tooltip: 'Conectar herramientas' },
  { id: 'templates', icon: Folder, label: 'Plantillas', tooltip: 'Plantillas predefinidas' },
  { id: 'docs', icon: BookOpen, label: 'Docs', tooltip: 'Documentación' },
  { id: 'testing', icon: TestTube, label: 'Testing', tooltip: 'Tests automatizados' },
  { id: 'settings', icon: Settings, label: 'Ajustes', tooltip: 'Configuración' },
];

const topItems = [
  { id: 'notifications', icon: Bell, label: 'Notificaciones', tooltip: 'Ver notificaciones' },
  { id: 'profile', icon: User, label: 'Perfil', tooltip: 'Mi perfil' },
];

export function Sidebar({ activeItem = 'home', onItemClick, className = '' }: SidebarProps) {
  const handleItemClick = (itemId: string) => {
    if (onItemClick) {
      onItemClick(itemId);
    }
  };

  return (
    <div className={`w-16 bg-[var(--surface)] border-r border-[var(--border)] flex flex-col h-screen ${className}`}>
      {/* Logo minimalista */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="w-8 h-8 bg-[var(--brand)] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">S</span>
        </div>
      </div>

      {/* Navegación principal */}
      <nav className="flex-1 py-4">
        <div className="flex flex-col items-center gap-6">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`sidebar-icon group relative ${
                  isActive ? 'active' : ''
                }`}
                title={item.tooltip}
              >
                <IconComponent className="w-5 h-5" />
                
                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.tooltip}
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Elementos superiores */}
      <div className="py-4 border-t border-[var(--border)]">
        <div className="flex flex-col items-center gap-6">
          {topItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`sidebar-icon group relative ${
                  isActive ? 'active' : ''
                }`}
                title={item.tooltip}
              >
                <IconComponent className="w-5 h-5" />
                
                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.tooltip}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
