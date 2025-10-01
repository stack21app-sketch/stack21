'use client';

import React, { useState } from 'react';
import { User, Settings, LogOut, CreditCard, HelpCircle, Moon, Sun, Bell, Shield } from 'lucide-react';

export function UserProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const menuItems = [
    {
      icon: <User className="w-4 h-4" />,
      label: 'Mi Perfil',
      description: 'Información personal y preferencias',
      onClick: () => console.log('Mi Perfil')
    },
    {
      icon: <Settings className="w-4 h-4" />,
      label: 'Configuración',
      description: 'Ajustes de la cuenta',
      onClick: () => console.log('Configuración')
    },
    {
      icon: <CreditCard className="w-4 h-4" />,
      label: 'Facturación',
      description: 'Plan y métodos de pago',
      onClick: () => console.log('Facturación')
    },
    {
      icon: <Bell className="w-4 h-4" />,
      label: 'Notificaciones',
      description: 'Preferencias de notificaciones',
      onClick: () => console.log('Notificaciones')
    },
    {
      icon: <Shield className="w-4 h-4" />,
      label: 'Seguridad',
      description: 'Contraseña y autenticación',
      onClick: () => console.log('Seguridad')
    },
    {
      icon: <HelpCircle className="w-4 h-4" />,
      label: 'Ayuda y Soporte',
      description: 'Centro de ayuda y contacto',
      onClick: () => console.log('Ayuda')
    }
  ];

  const handleLogout = () => {
    console.log('Cerrando sesión...');
    // Implementar lógica de logout
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    console.log('Cambiando tema:', isDarkMode ? 'claro' : 'oscuro');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 text-[var(--muted)] hover:text-[var(--text)] hover:bg-gray-100 rounded-lg transition-all duration-200"
      >
        <div className="w-8 h-8 bg-[var(--brand)] rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-[var(--text)]">Usuario</div>
          <div className="text-xs text-[var(--muted)]">usuario@empresa.com</div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-[var(--border)] z-50">
          <div className="p-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[var(--brand)] rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text)]">Usuario</h3>
                <p className="text-sm text-[var(--muted)]">usuario@empresa.com</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                    Pro
                  </span>
                  <span className="text-xs text-[var(--muted)]">Plan activo</span>
                </div>
              </div>
            </div>
          </div>

          <div className="py-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-[var(--pastel-blue)] transition-colors"
              >
                <div className="text-[var(--muted)]">{item.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-[var(--text)] text-sm">
                    {item.label}
                  </div>
                  <div className="text-xs text-[var(--muted)]">
                    {item.description}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-[var(--border)]">
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-[var(--pastel-blue)] transition-colors rounded-lg"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-[var(--muted)]" />
              ) : (
                <Moon className="w-4 h-4 text-[var(--muted)]" />
              )}
              <div className="flex-1">
                <div className="font-medium text-[var(--text)] text-sm">
                  {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
                </div>
                <div className="text-xs text-[var(--muted)]">
                  Cambiar tema de la interfaz
                </div>
              </div>
            </button>
          </div>

          <div className="p-4 border-t border-[var(--border)]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-red-50 text-red-600 transition-colors rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              <div className="flex-1">
                <div className="font-medium text-sm">Cerrar Sesión</div>
                <div className="text-xs text-red-500">
                  Salir de tu cuenta
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
