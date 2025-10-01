'use client';

import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { ChipsRow } from './ChipsRow';

interface PromptBarProps {
  onSubmit?: (prompt: string) => void;
  placeholder?: string;
  className?: string;
}

export function PromptBar({ 
  onSubmit, 
  placeholder = "Describe tu app con lenguaje natural…",
  className = ''
}: PromptBarProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && onSubmit) {
      onSubmit(prompt.trim());
      setPrompt('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[60%] max-w-2xl z-50 ${className}`}
    >
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full h-12 pl-12 pr-12 rounded-full border border-[var(--border)] bg-white placeholder-[var(--muted)] focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)] outline-none transition-all duration-300 text-[var(--text)] shadow-lg hover:shadow-xl focus:shadow-2xl"
            placeholder={placeholder}
          />
          <button 
            type="submit"
            disabled={!prompt.trim()}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--brand)] hover:text-[var(--brand-hover)] disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
          
          {/* Icono de IA decorativo con animación */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Sparkles className="w-4 h-4 text-[var(--muted)] animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Sugerencias rápidas con animación de entrada */}
      <div className="mt-4 animate-fade-in-up">
        <ChipsRow 
          items={[
            "Crear un chatbot para atención al cliente",
            "Automatizar el envío de emails",
            "Generar reportes automáticos",
            "Sincronizar datos entre sistemas"
          ]}
          onChipClick={setPrompt}
          className="justify-center"
        />
      </div>
    </form>
  );
}
