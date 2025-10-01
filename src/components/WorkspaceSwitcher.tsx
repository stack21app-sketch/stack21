'use client';

import React, { useState } from 'react';
import { ChevronDown, Plus, Building2, Users, Settings, Crown } from 'lucide-react';

interface Workspace {
  id: string;
  name: string;
  type: 'personal' | 'team' | 'enterprise';
  members: number;
  isActive: boolean;
  plan: 'free' | 'pro' | 'enterprise';
}

export function WorkspaceSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>({
    id: '1',
    name: 'Mi Empresa',
    type: 'team',
    members: 12,
    isActive: true,
    plan: 'pro'
  });

  const workspaces: Workspace[] = [
    {
      id: '1',
      name: 'Mi Empresa',
      type: 'team',
      members: 12,
      isActive: true,
      plan: 'pro'
    },
    {
      id: '2',
      name: 'Proyecto Personal',
      type: 'personal',
      members: 1,
      isActive: false,
      plan: 'free'
    },
    {
      id: '3',
      name: 'Startup XYZ',
      type: 'enterprise',
      members: 45,
      isActive: false,
      plan: 'enterprise'
    }
  ];

  const getWorkspaceIcon = (type: string) => {
    switch (type) {
      case 'personal': return <Building2 className="w-4 h-4" />;
      case 'team': return <Users className="w-4 h-4" />;
      case 'enterprise': return <Crown className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-600';
      case 'pro': return 'bg-blue-100 text-blue-600';
      case 'enterprise': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleWorkspaceChange = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    setIsOpen(false);
    console.log('Cambiando a workspace:', workspace.name);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-3 bg-white border border-[var(--border)] rounded-lg hover:border-[var(--brand)] transition-all duration-200 min-w-[200px]"
      >
        <div className="flex items-center gap-2">
          {getWorkspaceIcon(currentWorkspace.type)}
          <div className="text-left">
            <div className="font-medium text-[var(--text)] text-sm">
              {currentWorkspace.name}
            </div>
            <div className="text-xs text-[var(--muted)]">
              {currentWorkspace.members} miembro{currentWorkspace.members !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-[var(--muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-[var(--border)] z-50">
          <div className="p-4 border-b border-[var(--border)]">
            <h3 className="font-semibold text-[var(--text)]">Cambiar Workspace</h3>
            <p className="text-sm text-[var(--muted)]">Selecciona un workspace diferente</p>
          </div>

          <div className="py-2">
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => handleWorkspaceChange(workspace)}
                className={`w-full flex items-center gap-3 p-3 text-left hover:bg-[var(--pastel-blue)] transition-colors ${
                  workspace.isActive ? 'bg-[var(--pastel-blue)]' : ''
                }`}
              >
                <div className="flex-shrink-0">
                  {getWorkspaceIcon(workspace.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--text)] text-sm">
                      {workspace.name}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPlanBadge(workspace.plan)}`}>
                      {workspace.plan}
                    </span>
                    {workspace.isActive && (
                      <div className="w-2 h-2 bg-[var(--brand)] rounded-full"></div>
                    )}
                  </div>
                  <div className="text-xs text-[var(--muted)]">
                    {workspace.members} miembro{workspace.members !== 1 ? 's' : ''}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-[var(--border)]">
            <button className="w-full flex items-center gap-2 py-2 text-sm text-[var(--brand)] hover:text-[var(--brand-hover)] transition-colors">
              <Plus className="w-4 h-4" />
              Crear nuevo workspace
            </button>
            <button className="w-full flex items-center gap-2 py-2 text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors">
              <Settings className="w-4 h-4" />
              Gestionar workspaces
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
