const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const templates = [
  {
    title: 'Gmail a Notion - Guardar emails importantes',
    summary: 'Automáticamente guarda emails importantes en una base de datos de Notion',
    description: 'Este workflow monitorea tu Gmail y cuando llega un email con ciertas palabras clave, lo guarda automáticamente en una base de datos de Notion para referencia futura.',
    category: 'Productivity',
    featured: true,
    tags: ['email', 'notion', 'productivity', 'automation'],
    definitionJson: {
      name: 'Gmail a Notion - Guardar emails importantes',
      description: 'Automáticamente guarda emails importantes en una base de datos de Notion',
      triggers: [
        {
          type: 'app_event',
          config: {
            appId: 'gmail',
            eventType: 'new_email',
            filters: {
              subject: 'importante|urgente|reunión',
            },
          },
        },
      ],
      steps: [
        {
          order: 1,
          type: 'app_action',
          name: 'Obtener detalles del email',
          appId: 'gmail',
          actionKey: 'get_email',
          config: {
            messageId: '{{trigger.messageId}}',
            format: 'full',
          },
        },
        {
          order: 2,
          type: 'app_action',
          name: 'Crear página en Notion',
          appId: 'notion',
          actionKey: 'create_page',
          config: {
            parent: {
              database_id: '{{connection.notion.databaseId}}',
            },
            properties: {
              'Título': {
                title: [
                  {
                    text: {
                      content: '{{step1.subject}}',
                    },
                  },
                ],
              },
              'De': {
                rich_text: [
                  {
                    text: {
                      content: '{{step1.from}}',
                    },
                  },
                ],
              },
              'Fecha': {
                date: {
                  start: '{{step1.date}}',
                },
              },
              'Importante': {
                checkbox: true,
              },
            },
            children: [
              {
                object: 'block',
                type: 'paragraph',
                paragraph: {
                  rich_text: [
                    {
                      text: {
                        content: '{{step1.body}}',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
      variables: {
        notionDatabaseId: '{{connection.notion.databaseId}}',
      },
      tags: ['email', 'notion', 'productivity'],
    },
  },
  {
    title: 'GitHub a Linear - Crear tareas automáticamente',
    summary: 'Crea tareas en Linear cuando se abren issues en GitHub',
    description: 'Este workflow conecta GitHub con Linear para automatizar la gestión de tareas. Cuando se abre un issue en GitHub, se crea automáticamente una tarea correspondiente en Linear.',
    category: 'Development',
    featured: true,
    tags: ['github', 'linear', 'development', 'project-management'],
    definitionJson: {
      name: 'GitHub a Linear - Crear tareas automáticamente',
      description: 'Crea tareas en Linear cuando se abren issues en GitHub',
      triggers: [
        {
          type: 'app_event',
          config: {
            appId: 'github',
            eventType: 'issue_opened',
          },
        },
      ],
      steps: [
        {
          order: 1,
          type: 'app_action',
          name: 'Obtener detalles del issue',
          appId: 'github',
          actionKey: 'get_issue',
          config: {
            owner: '{{trigger.repository.owner.login}}',
            repo: '{{trigger.repository.name}}',
            issue_number: '{{trigger.issue.number}}',
          },
        },
        {
          order: 2,
          type: 'app_action',
          name: 'Crear tarea en Linear',
          appId: 'linear',
          actionKey: 'create_issue',
          config: {
            team: '{{connection.linear.teamId}}',
            title: '[{{trigger.repository.name}}] {{step1.title}}',
            description: `**Issue de GitHub:** #{{step1.number}}\n\n{{step1.body}}\n\n**Repositorio:** {{trigger.repository.html_url}}`,
            priority: '{{step1.labels.includes("bug") ? 1 : 2}}',
            labels: ['{{step1.labels.join("", "")}}'],
          },
        },
      ],
      variables: {
        linearTeamId: '{{connection.linear.teamId}}',
      },
      tags: ['github', 'linear', 'development'],
    },
  },
  {
    title: 'Formulario a Google Sheets - Recopilar respuestas',
    summary: 'Guarda automáticamente las respuestas de formularios en Google Sheets',
    description: 'Este workflow recibe datos de formularios web y los guarda automáticamente en una hoja de cálculo de Google para análisis posterior.',
    category: 'Data Collection',
    featured: true,
    tags: ['forms', 'google-sheets', 'data', 'automation'],
    definitionJson: {
      name: 'Formulario a Google Sheets - Recopilar respuestas',
      description: 'Guarda automáticamente las respuestas de formularios en Google Sheets',
      triggers: [
        {
          type: 'http_webhook',
          config: {
            path: '/webhook/form-submissions',
            method: 'POST',
          },
        },
      ],
      steps: [
        {
          order: 1,
          type: 'app_action',
          name: 'Añadir fila a Google Sheets',
          appId: 'google-sheets',
          actionKey: 'append_sheet',
          config: {
            spreadsheetId: '{{connection.google-sheets.spreadsheetId}}',
            range: 'Sheet1!A:Z',
            values: [
              [
                '{{trigger.timestamp}}',
                '{{trigger.data.name}}',
                '{{trigger.data.email}}',
                '{{trigger.data.message}}',
                '{{trigger.data.source}}',
              ],
            ],
            valueInputOption: 'USER_ENTERED',
          },
        },
        {
          order: 2,
          type: 'app_action',
          name: 'Enviar confirmación por email',
          appId: 'gmail',
          actionKey: 'send_email',
          config: {
            to: '{{trigger.data.email}}',
            subject: 'Gracias por tu mensaje',
            body: 'Hemos recibido tu mensaje y lo hemos guardado en nuestro sistema. Te contactaremos pronto.',
            isHtml: false,
          },
        },
      ],
      variables: {
        spreadsheetId: '{{connection.google-sheets.spreadsheetId}}',
      },
      tags: ['forms', 'google-sheets', 'data'],
    },
  },
  {
    title: 'Slack Alert - Notificaciones de errores',
    summary: 'Envía alertas a Slack cuando ocurren errores en el sistema',
    description: 'Este workflow monitorea logs de errores y envía notificaciones inmediatas a un canal de Slack para que el equipo pueda responder rápidamente.',
    category: 'Monitoring',
    featured: true,
    tags: ['slack', 'monitoring', 'alerts', 'errors'],
    definitionJson: {
      name: 'Slack Alert - Notificaciones de errores',
      description: 'Envía alertas a Slack cuando ocurren errores en el sistema',
      triggers: [
        {
          type: 'http_webhook',
          config: {
            path: '/webhook/error-alerts',
            method: 'POST',
          },
        },
      ],
      steps: [
        {
          order: 1,
          type: 'app_action',
          name: 'Enviar alerta a Slack',
          appId: 'slack',
          actionKey: 'send_message',
          config: {
            channel: '#alerts',
            text: '🚨 *Error detectado*',
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*Error:* {{trigger.data.error}}\n*Servicio:* {{trigger.data.service}}\n*Timestamp:* {{trigger.data.timestamp}}\n*Severidad:* {{trigger.data.severity}}`,
                },
              },
              {
                type: 'actions',
                elements: [
                  {
                    type: 'button',
                    text: {
                      type: 'plain_text',
                      text: 'Ver logs',
                    },
                    url: '{{trigger.data.logUrl}}',
                  },
                ],
              },
            ],
          },
        },
      ],
      variables: {},
      tags: ['slack', 'monitoring', 'alerts'],
    },
  },
  {
    title: 'HTTP Proxy - Procesar y reenviar requests',
    summary: 'Proxy HTTP que procesa, transforma y reenvía requests a diferentes APIs',
    description: 'Este workflow actúa como un proxy inteligente que recibe requests HTTP, los procesa, transforma los datos y los reenvía a diferentes APIs según la configuración.',
    category: 'Integration',
    featured: false,
    tags: ['http', 'proxy', 'integration', 'api'],
    definitionJson: {
      name: 'HTTP Proxy - Procesar y reenviar requests',
      description: 'Proxy HTTP que procesa, transforma y reenvía requests a diferentes APIs',
      triggers: [
        {
          type: 'http_webhook',
          config: {
            path: '/webhook/proxy',
            method: 'POST',
          },
        },
      ],
      steps: [
        {
          order: 1,
          type: 'code_step',
          name: 'Procesar datos de entrada',
          codeLang: 'javascript',
          code: `
// Procesar y transformar los datos de entrada
const inputData = JSON.parse(trigger.body);
const processedData = {
  ...inputData,
  processedAt: new Date().toISOString(),
  source: 'proxy-workflow',
  // Añadir validaciones y transformaciones aquí
};

return { processedData };
          `,
          config: {
            timeout: 5000,
          },
        },
        {
          order: 2,
          type: 'app_action',
          name: 'Reenviar a API destino',
          appId: 'http',
          actionKey: 'http_request',
          config: {
            method: 'POST',
            url: '{{connection.destination.apiUrl}}',
            headers: {
              'Authorization': 'Bearer {{connection.destination.apiKey}}',
              'Content-Type': 'application/json',
            },
            body: '{{step1.processedData}}',
          },
        },
        {
          order: 3,
          type: 'code_step',
          name: 'Procesar respuesta',
          codeLang: 'javascript',
          code: `
// Procesar la respuesta de la API destino
const response = step2;
const finalResponse = {
  success: response.ok,
  data: response.data,
  timestamp: new Date().toISOString(),
  requestId: trigger.headers['x-request-id'] || 'unknown',
};

return { finalResponse };
          `,
          config: {
            timeout: 5000,
          },
        },
      ],
      variables: {
        destinationApiUrl: '{{connection.destination.apiUrl}}',
      },
      tags: ['http', 'proxy', 'integration'],
    },
  },
];

async function seedTemplates() {
  try {
    console.log('🌱 Sembrando templates...');

    for (const template of templates) {
      await prisma.template.upsert({
        where: { id: template.title.toLowerCase().replace(/\s+/g, '-') },
        update: template,
        create: {
          id: template.title.toLowerCase().replace(/\s+/g, '-'),
          ...template,
        },
      });
      console.log(`✅ Template "${template.title}" sembrado`);
    }

    console.log('🎉 Todos los templates han sido sembrados exitosamente');
  } catch (error) {
    console.error('❌ Error sembrando templates:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedTemplates()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedTemplates };
