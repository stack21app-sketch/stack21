'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  ShoppingCart, 
  Users, 
  FileText, 
  Calendar, 
  Zap, 
  ArrowRight,
  Star,
  Clock,
  TrendingUp
} from 'lucide-react';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Fácil' | 'Intermedio' | 'Avanzado';
  estimatedTime: string;
  popularity: number;
  icon: React.ReactNode;
  nodes: any[];
  edges: any[];
  tags: string[];
}

const templates: WorkflowTemplate[] = [
  {
    id: 'email-marketing',
    name: 'Email Marketing Automático',
    description: 'Automatiza el envío de emails de bienvenida, seguimiento y promociones',
    category: 'Marketing',
    difficulty: 'Fácil',
    estimatedTime: '15 min',
    popularity: 95,
    icon: <Mail className="w-6 h-6" />,
    tags: ['email', 'marketing', 'automation'],
    nodes: [
      { id: '1', type: 'input', label: 'Nuevo Suscriptor', position: { x: 100, y: 100 } },
      { id: '2', type: 'process', label: 'Validar Email', position: { x: 300, y: 100 } },
      { id: '3', type: 'process', label: 'Enviar Bienvenida', position: { x: 500, y: 100 } },
      { id: '4', type: 'process', label: 'Programar Seguimiento', position: { x: 700, y: 100 } },
      { id: '5', type: 'output', label: 'Email Enviado', position: { x: 900, y: 100 } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5' }
    ]
  },
  {
    id: 'ecommerce-order',
    name: 'Procesamiento de Pedidos',
    description: 'Gestiona automáticamente el flujo completo de pedidos en e-commerce',
    category: 'E-commerce',
    difficulty: 'Intermedio',
    estimatedTime: '30 min',
    popularity: 88,
    icon: <ShoppingCart className="w-6 h-6" />,
    tags: ['ecommerce', 'orders', 'inventory'],
    nodes: [
      { id: '1', type: 'input', label: 'Nuevo Pedido', position: { x: 100, y: 100 } },
      { id: '2', type: 'process', label: 'Verificar Stock', position: { x: 300, y: 100 } },
      { id: '3', type: 'decision', label: '¿En Stock?', position: { x: 500, y: 100 } },
      { id: '4', type: 'process', label: 'Procesar Pago', position: { x: 700, y: 50 } },
      { id: '5', type: 'process', label: 'Preparar Envío', position: { x: 900, y: 50 } },
      { id: '6', type: 'output', label: 'Pedido Completado', position: { x: 1100, y: 50 } },
      { id: '7', type: 'output', label: 'Sin Stock', position: { x: 700, y: 150 } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4', label: 'Sí' },
      { id: 'e4-5', source: '4', target: '5' },
      { id: 'e5-6', source: '5', target: '6' },
      { id: 'e3-7', source: '3', target: '7', label: 'No' }
    ]
  },
  {
    id: 'customer-support',
    name: 'Soporte al Cliente',
    description: 'Sistema inteligente de tickets y respuestas automáticas',
    category: 'Soporte',
    difficulty: 'Avanzado',
    estimatedTime: '45 min',
    popularity: 92,
    icon: <Users className="w-6 h-6" />,
    tags: ['support', 'tickets', 'ai'],
    nodes: [
      { id: '1', type: 'input', label: 'Nuevo Ticket', position: { x: 100, y: 100 } },
      { id: '2', type: 'process', label: 'Clasificar Urgencia', position: { x: 300, y: 100 } },
      { id: '3', type: 'ai', label: 'IA Analiza', position: { x: 500, y: 100 } },
      { id: '4', type: 'decision', label: '¿Respuesta IA?', position: { x: 700, y: 100 } },
      { id: '5', type: 'process', label: 'Asignar Agente', position: { x: 900, y: 50 } },
      { id: '6', type: 'output', label: 'Respuesta IA', position: { x: 900, y: 150 } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5', label: 'No' },
      { id: 'e4-6', source: '4', target: '6', label: 'Sí' }
    ]
  },
  {
    id: 'content-creation',
    name: 'Creación de Contenido',
    description: 'Automatiza la generación y distribución de contenido',
    category: 'Contenido',
    difficulty: 'Intermedio',
    estimatedTime: '25 min',
    popularity: 85,
    icon: <FileText className="w-6 h-6" />,
    tags: ['content', 'ai', 'social'],
    nodes: [
      { id: '1', type: 'input', label: 'Tema del Día', position: { x: 100, y: 100 } },
      { id: '2', type: 'ai', label: 'Generar Contenido', position: { x: 300, y: 100 } },
      { id: '3', type: 'process', label: 'Revisar Calidad', position: { x: 500, y: 100 } },
      { id: '4', type: 'process', label: 'Publicar Redes', position: { x: 700, y: 100 } },
      { id: '5', type: 'output', label: 'Contenido Publicado', position: { x: 900, y: 100 } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5' }
    ]
  },
  {
    id: 'appointment-booking',
    name: 'Reserva de Citas',
    description: 'Sistema automático de reservas y recordatorios',
    category: 'Productividad',
    difficulty: 'Fácil',
    estimatedTime: '20 min',
    popularity: 90,
    icon: <Calendar className="w-6 h-6" />,
    tags: ['booking', 'calendar', 'notifications'],
    nodes: [
      { id: '1', type: 'input', label: 'Solicitud Cita', position: { x: 100, y: 100 } },
      { id: '2', type: 'process', label: 'Verificar Disponibilidad', position: { x: 300, y: 100 } },
      { id: '3', type: 'process', label: 'Confirmar Cita', position: { x: 500, y: 100 } },
      { id: '4', type: 'process', label: 'Enviar Recordatorio', position: { x: 700, y: 100 } },
      { id: '5', type: 'output', label: 'Cita Confirmada', position: { x: 900, y: 100 } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5' }
    ]
  },
  {
    id: 'data-analysis',
    name: 'Análisis de Datos',
    description: 'Procesamiento automático y reportes de datos',
    category: 'Analytics',
    difficulty: 'Avanzado',
    estimatedTime: '40 min',
    popularity: 78,
    icon: <TrendingUp className="w-6 h-6" />,
    tags: ['analytics', 'data', 'reports'],
    nodes: [
      { id: '1', type: 'input', label: 'Datos Nuevos', position: { x: 100, y: 100 } },
      { id: '2', type: 'process', label: 'Limpiar Datos', position: { x: 300, y: 100 } },
      { id: '3', type: 'ai', label: 'IA Analiza', position: { x: 500, y: 100 } },
      { id: '4', type: 'process', label: 'Generar Reporte', position: { x: 700, y: 100 } },
      { id: '5', type: 'output', label: 'Reporte Listo', position: { x: 900, y: 100 } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5' }
    ]
  }
];

const categories = ['Todos', 'Marketing', 'E-commerce', 'Soporte', 'Contenido', 'Productividad', 'Analytics'];

export function WorkflowTemplates() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popularity');

  const filteredTemplates = templates
    .filter(template => 
      selectedCategory === 'Todos' || template.category === selectedCategory
    )
    .filter(template =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularity - a.popularity;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'difficulty':
          const difficultyOrder = { 'Fácil': 1, 'Intermedio': 2, 'Avanzado': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        default:
          return 0;
      }
    });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800';
      case 'Intermedio': return 'bg-yellow-100 text-yellow-800';
      case 'Avanzado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[var(--text)] mb-4">
          🚀 Templates de Workflows
        </h2>
        <p className="text-[var(--muted)] max-w-2xl mx-auto">
          Comienza rápido con estos templates predefinidos. Solo personaliza y ejecuta.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-[var(--brand)] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Buscar templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--brand)] focus:border-[var(--brand)] outline-none"
          />
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--brand)] focus:border-[var(--brand)] outline-none"
          >
            <option value="popularity">Más Populares</option>
            <option value="name">Nombre A-Z</option>
            <option value="difficulty">Dificultad</option>
          </select>
        </div>
      </div>

      {/* Grid de Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-[var(--pastel-blue)] text-[var(--brand)]">
                  {template.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text)] group-hover:text-[var(--brand)] transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-[var(--muted)]">{template.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">{template.popularity}</span>
              </div>
            </div>

            <p className="text-[var(--muted)] mb-4 text-sm leading-relaxed">
              {template.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {template.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(template.difficulty)}`}>
                {template.difficulty}
              </span>
              <div className="flex items-center gap-1 text-[var(--muted)] text-sm">
                <Clock className="w-4 h-4" />
                {template.estimatedTime}
              </div>
            </div>

            <button className="w-full py-2 bg-[var(--brand)] text-white rounded-lg hover:bg-[var(--brand-hover)] transition-colors flex items-center justify-center gap-2 group">
              <Zap className="w-4 h-4" />
              Usar Template
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
            No se encontraron templates
          </h3>
          <p className="text-[var(--muted)]">
            Intenta con otros términos de búsqueda o cambia la categoría.
          </p>
        </div>
      )}
    </div>
  );
}
