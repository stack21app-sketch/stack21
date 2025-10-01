'use client';

import React from 'react';
import { Plus, Workflow, FileText, Users, Settings, Zap, Database, Bot, Image, Music, Code } from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

export function QuickActions() {
  const actions: QuickAction[] = [
    {
      id: '1',
      title: 'Nuevo Workflow',
      description: 'Crear automatización',
      icon: <Workflow className="w-5 h-5" />,
      color: 'bg-[var(--pastel-blue)] hover:bg-[var(--pastel-green)]',
      onClick: () => console.log('Nuevo workflow')
    },
    {
      id: '2',
      title: 'Documento',
      description: 'Crear documento',
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-[var(--pastel-green)] hover:bg-[var(--pastel-yellow)]',
      onClick: () => console.log('Nuevo documento')
    },
    {
      id: '3',
      title: 'Equipo',
      description: 'Invitar miembros',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-[var(--pastel-yellow)] hover:bg-[var(--pastel-pink)]',
      onClick: () => console.log('Invitar equipo')
    },
    {
      id: '4',
      title: 'Configuración',
      description: 'Ajustes del workspace',
      icon: <Settings className="w-5 h-5" />,
      color: 'bg-[var(--pastel-pink)] hover:bg-[var(--pastel-purple)]',
      onClick: () => console.log('Configuración')
    },
    {
      id: '5',
      title: 'IA Assistant',
      description: 'Chat con IA',
      icon: <Bot className="w-5 h-5" />,
      color: 'bg-[var(--pastel-purple)] hover:bg-[var(--pastel-orange)]',
      onClick: () => console.log('IA Assistant')
    },
    {
      id: '6',
      title: 'Base de Datos',
      description: 'Gestionar datos',
      icon: <Database className="w-5 h-5" />,
      color: 'bg-[var(--pastel-orange)] hover:bg-[var(--pastel-cyan)]',
      onClick: () => console.log('Base de datos')
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-6 shadow-soft">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[var(--brand)] rounded-lg">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-[var(--text)]">Acciones Rápidas</h3>
          <p className="text-sm text-[var(--muted)]">Accede a las funciones más usadas</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`p-4 rounded-lg ${action.color} text-left transition-all duration-300 hover:scale-105 hover:shadow-medium group`}
          >
            <div className="flex items-center gap-3">
              <div className="text-[var(--text)] group-hover:scale-110 transition-transform duration-300">
                {action.icon}
              </div>
              <div>
                <h4 className="font-medium text-[var(--text)] text-sm">{action.title}</h4>
                <p className="text-xs text-[var(--muted)]">{action.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--border)]">
        <button className="w-full flex items-center justify-center gap-2 py-2 text-sm text-[var(--brand)] hover:text-[var(--brand-hover)] transition-colors">
          <Plus className="w-4 h-4" />
          Ver todas las acciones
        </button>
      </div>
    </div>
  );
}
