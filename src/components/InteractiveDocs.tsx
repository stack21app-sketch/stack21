'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Code, 
  Play, 
  Copy, 
  Check,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  FileText,
  Zap,
  Settings,
  Users,
  Database
} from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  content: string;
  code?: string;
  category: 'getting-started' | 'api' | 'workflows' | 'integrations' | 'deployment';
  level: number;
  children?: DocSection[];
}

export function InteractiveDocs() {
  const [sections, setSections] = useState<DocSection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    // Simular documentación
    const mockSections: DocSection[] = [
      {
        id: 'getting-started',
        title: 'Comenzar con Stack21',
        content: 'Guía completa para empezar a usar Stack21 y crear tu primer workflow.',
        category: 'getting-started',
        level: 0,
        children: [
          {
            id: 'installation',
            title: 'Instalación',
            content: 'Aprende cómo instalar y configurar Stack21 en tu entorno.',
            code: `npm install stack21
# o
yarn add stack21
# o
pnpm add stack21`,
            category: 'getting-started',
            level: 1
          },
          {
            id: 'first-workflow',
            title: 'Tu Primer Workflow',
            content: 'Crea tu primer workflow paso a paso.',
            code: `import { Workflow } from 'stack21';

const workflow = new Workflow('Mi Primer Workflow')
  .addStep('trigger', { type: 'webhook' })
  .addStep('process', { type: 'data-transform' })
  .addStep('action', { type: 'email-send' });

await workflow.execute();`,
            category: 'getting-started',
            level: 1
          }
        ]
      },
      {
        id: 'api-reference',
        title: 'Referencia de API',
        content: 'Documentación completa de todas las APIs disponibles en Stack21.',
        category: 'api',
        level: 0,
        children: [
          {
            id: 'workflows-api',
            title: 'API de Workflows',
            content: 'Endpoints para gestionar workflows.',
            code: `GET /api/workflows
POST /api/workflows
PUT /api/workflows/:id
DELETE /api/workflows/:id`,
            category: 'api',
            level: 1
          },
          {
            id: 'analytics-api',
            title: 'API de Analytics',
            content: 'Endpoints para obtener métricas y analytics.',
            code: `GET /api/analytics
GET /api/analytics/overview
GET /api/analytics/trends`,
            category: 'api',
            level: 1
          }
        ]
      },
      {
        id: 'workflows-guide',
        title: 'Guía de Workflows',
        content: 'Aprende a crear workflows avanzados y automatizaciones complejas.',
        category: 'workflows',
        level: 0,
        children: [
          {
            id: 'workflow-builder',
            title: 'Workflow Builder',
            content: 'Usa el editor visual para crear workflows.',
            category: 'workflows',
            level: 1
          },
          {
            id: 'triggers',
            title: 'Triggers y Eventos',
            content: 'Configura diferentes tipos de triggers para tus workflows.',
            category: 'workflows',
            level: 1
          }
        ]
      },
      {
        id: 'integrations',
        title: 'Integraciones',
        content: 'Conecta Stack21 con tus herramientas favoritas.',
        category: 'integrations',
        level: 0,
        children: [
          {
            id: 'google-workspace',
            title: 'Google Workspace',
            content: 'Integra Gmail, Drive, Calendar y más.',
            category: 'integrations',
            level: 1
          },
          {
            id: 'slack',
            title: 'Slack',
            content: 'Envía notificaciones y automatiza mensajes.',
            category: 'integrations',
            level: 1
          }
        ]
      },
      {
        id: 'deployment',
        title: 'Despliegue',
        content: 'Guías para desplegar Stack21 en producción.',
        category: 'deployment',
        level: 0,
        children: [
          {
            id: 'docker',
            title: 'Docker',
            content: 'Despliega usando Docker y Docker Compose.',
            code: `docker build -t stack21 .
docker run -p 3000:3000 stack21`,
            category: 'deployment',
            level: 1
          },
          {
            id: 'vercel',
            title: 'Vercel',
            content: 'Despliega en Vercel con un solo comando.',
            code: `vercel --prod`,
            category: 'deployment',
            level: 1
          }
        ]
      }
    ];
    setSections(mockSections);
  }, []);

  const filteredSections = sections.filter(section => 
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (section.children && section.children.some(child => 
      child.title.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'getting-started':
        return <Zap className="w-4 h-4" />;
      case 'api':
        return <Code className="w-4 h-4" />;
      case 'workflows':
        return <Settings className="w-4 h-4" />;
      case 'integrations':
        return <Users className="w-4 h-4" />;
      case 'deployment':
        return <Database className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'getting-started':
        return 'bg-green-100 text-green-800';
      case 'api':
        return 'bg-blue-100 text-blue-800';
      case 'workflows':
        return 'bg-purple-100 text-purple-800';
      case 'integrations':
        return 'bg-orange-100 text-orange-800';
      case 'deployment':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderSection = (section: DocSection, level: number = 0) => {
    const isExpanded = expandedSections.has(section.id);
    const hasChildren = section.children && section.children.length > 0;

    return (
      <div key={section.id} className="mb-2">
        <div
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
            selectedSection === section.id
              ? 'bg-blue-50 border border-blue-200'
              : 'hover:bg-gray-50'
          }`}
          onClick={() => {
            setSelectedSection(section.id);
            if (hasChildren) {
              toggleSection(section.id);
            }
          }}
        >
          <div className="flex items-center space-x-3">
            <div className={`p-1 rounded ${getCategoryColor(section.category)}`}>
              {getCategoryIcon(section.category)}
            </div>
            <div>
              <h3 className={`font-medium text-gray-900 ${level > 0 ? 'text-sm' : ''}`}>
                {section.title}
              </h3>
              <p className="text-sm text-gray-600">{section.content}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSection(section.id);
                }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-6 mt-2 space-y-1"
          >
            {section.children?.map(child => renderSection(child, level + 1))}
          </motion.div>
        )}
      </div>
    );
  };

  const selectedSectionData = sections.find(s => s.id === selectedSection) ||
    sections.flatMap(s => s.children || []).find(s => s?.id === selectedSection);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Documentación Interactiva</h2>
          <p className="text-gray-600">Explora la documentación completa de Stack21</p>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Play className="w-4 h-4" />
            <span>Tour Interactivo</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navegación */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar documentación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            
            <div className="space-y-2">
              {filteredSections.map(section => renderSection(section))}
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {selectedSectionData ? (
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`p-2 rounded-lg ${getCategoryColor(selectedSectionData.category)}`}>
                    {getCategoryIcon(selectedSectionData.category)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedSectionData.title}</h3>
                    <p className="text-gray-600">{selectedSectionData.content}</p>
                  </div>
                </div>

                {selectedSectionData.code && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Código de Ejemplo</h4>
                      <button
                        onClick={() => copyCode(selectedSectionData.code!)}
                        className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        {copiedCode === selectedSectionData.code ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        <span className="text-sm">
                          {copiedCode === selectedSectionData.code ? 'Copiado!' : 'Copiar'}
                        </span>
                      </button>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code>{selectedSectionData.code}</code>
                    </pre>
                  </div>
                )}

                <div className="prose max-w-none">
                  <h4>Detalles</h4>
                  <p>Esta sección contiene información detallada sobre {selectedSectionData.title.toLowerCase()}.</p>
                  
                  <h4>Próximos Pasos</h4>
                  <ul>
                    <li>Revisa la documentación relacionada</li>
                    <li>Prueba los ejemplos de código</li>
                    <li>Explora las integraciones disponibles</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona una sección</h3>
                <p className="text-gray-600">Elige una sección de la documentación para ver su contenido</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
