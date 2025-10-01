'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { PromptBar } from '@/components/PromptBar';
import { GlobalSearch } from '@/components/GlobalSearch';
import { NotificationCenter } from '@/components/NotificationCenter';
import { WorkspaceSwitcher } from '@/components/WorkspaceSwitcher';
import { UserProfileMenu } from '@/components/UserProfileMenu';

interface DashboardClientProps {
  children: React.ReactNode;
}

export function DashboardClient({ children }: DashboardClientProps) {
  const [activeItem, setActiveItem] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    // Aquí podrías agregar navegación programática si es necesario
  };

  const handlePromptSubmit = (prompt: string) => {
    console.log('Prompt enviado:', prompt);
    // Aquí implementarías la lógica para procesar el prompt
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Barra lateral */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-16'} transition-all duration-300`}>
        <Sidebar 
          activeItem={activeItem} 
          onItemClick={handleItemClick}
        />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Encabezado superior */}
        <header className="h-16 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-semibold text-[var(--text)]">
              Stack21
            </h1>
            <WorkspaceSwitcher />
          </div>
          
          <div className="flex items-center gap-4">
            {/* Barra de búsqueda global */}
            <GlobalSearch />
            
            {/* Centro de notificaciones */}
            <NotificationCenter />
            
            {/* Menú de perfil de usuario */}
            <UserProfileMenu />
          </div>
        </header>

        {/* Área de contenido */}
        <main className="flex-1 overflow-auto bg-[#F8FAFC]">
          {children}
        </main>
      </div>

      {/* Barra de prompt flotante */}
      <PromptBar onSubmit={handlePromptSubmit} />
    </div>
  );
}
