'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Command, X, Clock, FileText, Workflow, User, Settings } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'workflow' | 'document' | 'user' | 'setting';
  url: string;
  icon: React.ReactNode;
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Datos de ejemplo para la búsqueda
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Automatización de Leads',
      description: 'Workflow para procesar leads de Facebook Ads',
      type: 'workflow',
      url: '/dashboard/workflows/1',
      icon: <Workflow className="w-4 h-4" />
    },
    {
      id: '2',
      title: 'Documentación API',
      description: 'Guía completa de la API de Stack21',
      type: 'document',
      url: '/docs/api',
      icon: <FileText className="w-4 h-4" />
    },
    {
      id: '3',
      title: 'Configuración de Usuario',
      description: 'Ajustes personales y preferencias',
      type: 'setting',
      url: '/dashboard/settings',
      icon: <Settings className="w-4 h-4" />
    }
  ];

  useEffect(() => {
    if (query.length > 2) {
      const filtered = mockResults.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    // Aquí implementarías la navegación
    console.log('Navegando a:', result.url);
    setIsOpen(false);
    setQuery('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--muted)] bg-white border border-[var(--border)] rounded-lg hover:border-[var(--brand)] hover:text-[var(--text)] transition-all duration-200 min-w-[200px]"
      >
        <Search className="w-4 h-4" />
        <span>Buscar...</span>
        <div className="flex items-center gap-1 ml-auto">
          <Command className="w-3 h-3" />
          <span className="text-xs">K</span>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <div className="relative w-full max-w-2xl mx-4">
        <div className="bg-white rounded-xl shadow-2xl border border-[var(--border)] overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b border-[var(--border)]">
            <Search className="w-5 h-5 text-[var(--muted)]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar workflows, documentos, configuraciones..."
              className="flex-1 text-[var(--text)] placeholder-[var(--muted)] outline-none"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {results.length > 0 ? (
              <div className="py-2">
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className={`w-full flex items-center gap-3 p-3 text-left hover:bg-[var(--pastel-blue)] transition-colors ${
                      index === selectedIndex ? 'bg-[var(--pastel-blue)]' : ''
                    }`}
                  >
                    <div className="text-[var(--brand)]">{result.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-[var(--text)]">{result.title}</div>
                      <div className="text-sm text-[var(--muted)]">{result.description}</div>
                    </div>
                    <div className="text-xs text-[var(--muted)] uppercase">
                      {result.type}
                    </div>
                  </button>
                ))}
              </div>
            ) : query.length > 2 ? (
              <div className="p-8 text-center text-[var(--muted)]">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No se encontraron resultados para "{query}"</p>
              </div>
            ) : (
              <div className="p-8 text-center text-[var(--muted)]">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Escribe para buscar workflows, documentos y más...</p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <span className="px-2 py-1 bg-[var(--pastel-blue)] text-xs rounded">workflows</span>
                  <span className="px-2 py-1 bg-[var(--pastel-green)] text-xs rounded">documentos</span>
                  <span className="px-2 py-1 bg-[var(--pastel-yellow)] text-xs rounded">configuraciones</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
