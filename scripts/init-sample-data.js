#!/usr/bin/env node

/**
 * 🚀 Inicializador de Datos de Muestra para Stack21
 * 
 * Este script inicializa todos los datos necesarios para que la plataforma
 * funcione correctamente desde el primer momento.
 */

const fs = require('fs');
const path = require('path');

// Función para crear directorio si no existe
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Función para escribir archivo JSON
function writeJsonFile(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Workflows de muestra
const sampleWorkflows = [
  {
    id: 'wf_sample_1',
    name: 'Procesar Datos de Formulario',
    description: 'Procesa datos de formulario y envía notificación por email',
    status: 'active',
    trigger: {
      type: 'webhook',
      config: { 
        path: '/webhook/form-submit',
        method: 'POST'
      }
    },
    steps: [
      {
        id: 'step_1',
        type: 'data_transform',
        name: 'Transformar Datos',
        config: {
          transform: {
            email: '$.email',
            name: '$.name',
            message: '$.message',
            timestamp: '$.timestamp',
            processed_at: '$.'
          }
        },
        next: 'step_2'
      },
      {
        id: 'step_2',
        type: 'log',
        name: 'Registrar Datos',
        config: {
          message: 'Datos de formulario procesados',
          level: 'info'
        },
        next: 'step_3'
      },
      {
        id: 'step_3',
        type: 'http_request',
        name: 'Enviar Notificación',
        config: {
          url: 'https://api.emailservice.com/send',
          method: 'POST',
          headers: {
            'Authorization': 'Bearer demo_token',
            'Content-Type': 'application/json'
          },
          body: {
            to: '$.email',
            subject: 'Formulario recibido',
            body: 'Hola $.name, hemos recibido tu mensaje: $.message'
          }
        }
      }
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'wf_sample_2',
    name: 'Sincronizar Datos CRM',
    description: 'Sincroniza datos entre sistemas CRM cada 6 horas',
    status: 'active',
    trigger: {
      type: 'schedule',
      config: { 
        cron: '0 */6 * * *',
        timezone: 'UTC'
      }
    },
    steps: [
      {
        id: 'step_1',
        type: 'http_request',
        name: 'Obtener Datos Fuente',
        config: {
          url: 'https://api.source-crm.com/contacts',
          method: 'GET',
          headers: {
            'Authorization': 'Bearer source_token'
          }
        },
        next: 'step_2'
      },
      {
        id: 'step_2',
        type: 'condition',
        name: 'Verificar Datos',
        config: {
          condition: 'input.length > 0',
          trueValue: '$.',
          falseValue: null
        },
        next: 'step_3'
      },
      {
        id: 'step_3',
        type: 'http_request',
        name: 'Enviar a Destino',
        config: {
          url: 'https://api.dest-crm.com/sync',
          method: 'POST',
          headers: {
            'Authorization': 'Bearer dest_token',
            'Content-Type': 'application/json'
          },
          body: '$.'
        }
      }
    ],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'wf_sample_3',
    name: 'Backup Automático',
    description: 'Crea backup de datos importantes diariamente',
    status: 'active',
    trigger: {
      type: 'schedule',
      config: { 
        cron: '0 2 * * *',
        timezone: 'UTC'
      }
    },
    steps: [
      {
        id: 'step_1',
        type: 'log',
        name: 'Iniciar Backup',
        config: {
          message: 'Iniciando proceso de backup',
          level: 'info'
        },
        next: 'step_2'
      },
      {
        id: 'step_2',
        type: 'http_request',
        name: 'Exportar Datos',
        config: {
          url: 'https://api.database.com/export',
          method: 'POST',
          headers: {
            'Authorization': 'Bearer db_token'
          },
          body: {
            tables: ['users', 'orders', 'products'],
            format: 'json'
          }
        },
        next: 'step_3'
      },
      {
        id: 'step_3',
        type: 'delay',
        name: 'Esperar Procesamiento',
        config: {
          duration: 5000
        },
        next: 'step_4'
      },
      {
        id: 'step_4',
        type: 'http_request',
        name: 'Subir a Storage',
        config: {
          url: 'https://api.storage.com/upload',
          method: 'POST',
          headers: {
            'Authorization': 'Bearer storage_token'
          },
          body: '$.'
        }
      }
    ],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Runs de muestra
const sampleRuns = [
  {
    id: 'run_sample_1',
    workflowId: 'wf_sample_1',
    workflowName: 'Procesar Datos de Formulario',
    status: 'completed',
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 3000).toISOString(),
    duration: 3000,
    triggerType: 'webhook',
    triggerData: {
      email: 'usuario@ejemplo.com',
      name: 'Juan Pérez',
      message: 'Hola, necesito información sobre sus servicios'
    },
    steps: [
      {
        id: 'step_1',
        name: 'Transformar Datos',
        type: 'data_transform',
        status: 'completed',
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 500).toISOString(),
        duration: 500,
        input: {
          email: 'usuario@ejemplo.com',
          name: 'Juan Pérez',
          message: 'Hola, necesito información sobre sus servicios'
        },
        output: {
          email: 'usuario@ejemplo.com',
          name: 'Juan Pérez',
          message: 'Hola, necesito información sobre sus servicios',
          timestamp: new Date().toISOString(),
          processed_at: new Date().toISOString()
        }
      },
      {
        id: 'step_2',
        name: 'Registrar Datos',
        type: 'log',
        status: 'completed',
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 500).toISOString(),
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 1000).toISOString(),
        duration: 500,
        input: {
          email: 'usuario@ejemplo.com',
          name: 'Juan Pérez',
          message: 'Hola, necesito información sobre sus servicios',
          timestamp: new Date().toISOString(),
          processed_at: new Date().toISOString()
        },
        output: {
          email: 'usuario@ejemplo.com',
          name: 'Juan Pérez',
          message: 'Hola, necesito información sobre sus servicios',
          timestamp: new Date().toISOString(),
          processed_at: new Date().toISOString()
        }
      },
      {
        id: 'step_3',
        name: 'Enviar Notificación',
        type: 'http_request',
        status: 'completed',
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 1000).toISOString(),
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 3000).toISOString(),
        duration: 2000,
        input: {
          email: 'usuario@ejemplo.com',
          name: 'Juan Pérez',
          message: 'Hola, necesito información sobre sus servicios',
          timestamp: new Date().toISOString(),
          processed_at: new Date().toISOString()
        },
        output: {
          success: true,
          messageId: 'msg_123456789',
          status: 'sent'
        }
      }
    ]
  },
  {
    id: 'run_sample_2',
    workflowId: 'wf_sample_2',
    workflowName: 'Sincronizar Datos CRM',
    status: 'completed',
    startedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000 + 15000).toISOString(),
    duration: 15000,
    triggerType: 'schedule',
    triggerData: { cron: '0 */6 * * *' },
    steps: [
      {
        id: 'step_1',
        name: 'Obtener Datos Fuente',
        type: 'http_request',
        status: 'completed',
        startedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000 + 8000).toISOString(),
        duration: 8000,
        input: {},
        output: [
          { id: 1, name: 'Cliente A', email: 'clienteA@test.com' },
          { id: 2, name: 'Cliente B', email: 'clienteB@test.com' }
        ]
      },
      {
        id: 'step_2',
        name: 'Verificar Datos',
        type: 'condition',
        status: 'completed',
        startedAt: new Date(Date.now() - 6 * 60 * 60 * 1000 + 8000).toISOString(),
        completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000 + 8500).toISOString(),
        duration: 500,
        input: [
          { id: 1, name: 'Cliente A', email: 'clienteA@test.com' },
          { id: 2, name: 'Cliente B', email: 'clienteB@test.com' }
        ],
        output: [
          { id: 1, name: 'Cliente A', email: 'clienteA@test.com' },
          { id: 2, name: 'Cliente B', email: 'clienteB@test.com' }
        ]
      },
      {
        id: 'step_3',
        name: 'Enviar a Destino',
        type: 'http_request',
        status: 'completed',
        startedAt: new Date(Date.now() - 6 * 60 * 60 * 1000 + 8500).toISOString(),
        completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000 + 15000).toISOString(),
        duration: 6500,
        input: [
          { id: 1, name: 'Cliente A', email: 'clienteA@test.com' },
          { id: 2, name: 'Cliente B', email: 'clienteB@test.com' }
        ],
        output: {
          success: true,
          synced: 2,
          errors: 0
        }
      }
    ]
  },
  {
    id: 'run_sample_3',
    workflowId: 'wf_sample_1',
    workflowName: 'Procesar Datos de Formulario',
    status: 'failed',
    startedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000 + 2000).toISOString(),
    duration: 2000,
    triggerType: 'webhook',
    triggerData: {
      email: 'test@ejemplo.com',
      name: 'Test User',
      message: 'Mensaje de prueba'
    },
    errorMessage: 'Error de conexión con el servicio de email',
    steps: [
      {
        id: 'step_1',
        name: 'Transformar Datos',
        type: 'data_transform',
        status: 'completed',
        startedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000 + 500).toISOString(),
        duration: 500,
        input: {
          email: 'test@ejemplo.com',
          name: 'Test User',
          message: 'Mensaje de prueba'
        },
        output: {
          email: 'test@ejemplo.com',
          name: 'Test User',
          message: 'Mensaje de prueba',
          timestamp: new Date().toISOString(),
          processed_at: new Date().toISOString()
        }
      },
      {
        id: 'step_2',
        name: 'Registrar Datos',
        type: 'log',
        status: 'completed',
        startedAt: new Date(Date.now() - 1 * 60 * 60 * 1000 + 500).toISOString(),
        completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000 + 1000).toISOString(),
        duration: 500,
        input: {
          email: 'test@ejemplo.com',
          name: 'Test User',
          message: 'Mensaje de prueba',
          timestamp: new Date().toISOString(),
          processed_at: new Date().toISOString()
        },
        output: {
          email: 'test@ejemplo.com',
          name: 'Test User',
          message: 'Mensaje de prueba',
          timestamp: new Date().toISOString(),
          processed_at: new Date().toISOString()
        }
      },
      {
        id: 'step_3',
        name: 'Enviar Notificación',
        type: 'http_request',
        status: 'failed',
        startedAt: new Date(Date.now() - 1 * 60 * 60 * 1000 + 1000).toISOString(),
        completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000 + 2000).toISOString(),
        duration: 1000,
        input: {
          email: 'test@ejemplo.com',
          name: 'Test User',
          message: 'Mensaje de prueba',
          timestamp: new Date().toISOString(),
          processed_at: new Date().toISOString()
        },
        error: 'Error de conexión con el servicio de email'
      }
    ]
  }
];

// Templates de muestra
const sampleTemplates = [
  {
    id: 'template_1',
    name: 'Notificación de Nuevo Usuario',
    description: 'Envía un email de bienvenida cuando se registra un nuevo usuario',
    category: 'Communication',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    steps: 3,
    apps: ['Email Service', 'Database'],
    popularity: 45,
    featured: true,
    workflow: {
      trigger: {
        type: 'webhook',
        config: { path: '/webhook/user-registered' }
      },
      steps: [
        {
          id: 'step_1',
          type: 'data_transform',
          name: 'Preparar Datos',
          config: {
            transform: {
              email: '$.email',
              name: '$.name',
              welcome_message: 'Bienvenido $.name!'
            }
          }
        },
        {
          id: 'step_2',
          type: 'http_request',
          name: 'Enviar Email',
          config: {
            url: 'https://api.email.com/send',
            method: 'POST',
            body: {
              to: '$.email',
              subject: 'Bienvenido a nuestra plataforma',
              body: '$.welcome_message'
            }
          }
        }
      ]
    }
  },
  {
    id: 'template_2',
    name: 'Sincronización de Inventario',
    description: 'Sincroniza el inventario entre múltiples tiendas online',
    category: 'E-commerce',
    difficulty: 'intermediate',
    estimatedTime: '15 min',
    steps: 5,
    apps: ['Shopify', 'WooCommerce', 'Database'],
    popularity: 32,
    featured: true,
    workflow: {
      trigger: {
        type: 'schedule',
        config: { cron: '0 */2 * * *' }
      },
      steps: [
        {
          id: 'step_1',
          type: 'http_request',
          name: 'Obtener Inventario Principal',
          config: {
            url: 'https://api.main-store.com/inventory',
            method: 'GET'
          }
        },
        {
          id: 'step_2',
          type: 'data_transform',
          name: 'Transformar Datos',
          config: {
            transform: {
              products: '$.products',
              timestamp: '$.'
            }
          }
        },
        {
          id: 'step_3',
          type: 'http_request',
          name: 'Actualizar Tienda 1',
          config: {
            url: 'https://api.store1.com/sync',
            method: 'POST',
            body: '$.'
          }
        },
        {
          id: 'step_4',
          type: 'http_request',
          name: 'Actualizar Tienda 2',
          config: {
            url: 'https://api.store2.com/sync',
            method: 'POST',
            body: '$.'
          }
        },
        {
          id: 'step_5',
          type: 'log',
          name: 'Registrar Sincronización',
          config: {
            message: 'Inventario sincronizado exitosamente',
            level: 'info'
          }
        }
      ]
    }
  },
  {
    id: 'template_3',
    name: 'Backup Automático de Base de Datos',
    description: 'Crea backups automáticos de la base de datos y los sube a cloud storage',
    category: 'Data Processing',
    difficulty: 'advanced',
    estimatedTime: '30 min',
    steps: 6,
    apps: ['Database', 'AWS S3', 'Email Service'],
    popularity: 28,
    featured: false,
    workflow: {
      trigger: {
        type: 'schedule',
        config: { cron: '0 2 * * *' }
      },
      steps: [
        {
          id: 'step_1',
          type: 'log',
          name: 'Iniciar Backup',
          config: {
            message: 'Iniciando proceso de backup',
            level: 'info'
          }
        },
        {
          id: 'step_2',
          type: 'http_request',
          name: 'Crear Dump de BD',
          config: {
            url: 'https://api.database.com/backup',
            method: 'POST',
            body: {
              tables: ['users', 'orders', 'products', 'settings'],
              format: 'sql'
            }
          }
        },
        {
          id: 'step_3',
          type: 'delay',
          name: 'Esperar Procesamiento',
          config: {
            duration: 10000
          }
        },
        {
          id: 'step_4',
          type: 'http_request',
          name: 'Subir a S3',
          config: {
            url: 'https://api.aws.com/s3/upload',
            method: 'POST',
            body: '$.'
          }
        },
        {
          id: 'step_5',
          type: 'http_request',
          name: 'Notificar Administrador',
          config: {
            url: 'https://api.email.com/send',
            method: 'POST',
            body: {
              to: 'admin@company.com',
              subject: 'Backup completado',
              body: 'El backup se completó exitosamente'
            }
          }
        },
        {
          id: 'step_6',
          type: 'log',
          name: 'Finalizar Proceso',
          config: {
            message: 'Backup completado exitosamente',
            level: 'info'
          }
        }
      ]
    }
  }
];

// Inicializar datos
console.log('🚀 Inicializando datos de muestra para Stack21...');

const dataDir = path.join(process.cwd(), 'src', 'data');

// Crear workflows
writeJsonFile(path.join(dataDir, 'workflows.json'), sampleWorkflows);
console.log('✅ Workflows de muestra creados');

// Crear runs
writeJsonFile(path.join(dataDir, 'runs.json'), sampleRuns);
console.log('✅ Runs de muestra creados');

// Crear templates
writeJsonFile(path.join(dataDir, 'templates.json'), sampleTemplates);
console.log('✅ Templates de muestra creados');

// Crear conexiones vacías si no existen
const connectionsPath = path.join(dataDir, 'connections.json');
if (!fs.existsSync(connectionsPath)) {
  writeJsonFile(connectionsPath, []);
  console.log('✅ Archivo de conexiones inicializado');
}

console.log('\n🎉 ¡Datos de muestra inicializados correctamente!');
console.log('📊 Estadísticas:');
console.log(`   - ${sampleWorkflows.length} workflows`);
console.log(`   - ${sampleRuns.length} runs de ejemplo`);
console.log(`   - ${sampleTemplates.length} templates`);
console.log('\n🚀 ¡Stack21 está listo para usar!');
