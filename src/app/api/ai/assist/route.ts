import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import OpenAI from 'openai';

const AIWorkflowRequestSchema = z.object({
  description: z.string().min(10).max(1000),
  projectId: z.string().cuid(),
  context: z.object({
    existingConnections: z.array(z.string()).optional(),
    preferredApps: z.array(z.string()).optional(),
    complexity: z.enum(['simple', 'medium', 'complex']).optional(),
  }).optional(),
});

// Inicializar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/ai/assist - Generar workflow con IA
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { description, projectId, context } = AIWorkflowRequestSchema.parse(body);

    // Verificar que el proyecto pertenece al usuario
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        workspace: {
          members: {
            some: { userId: token.sub },
          },
        },
      },
      include: {
        // connections: {
        //   include: {
        //     app: true,
        //   },
        // },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    // Obtener apps disponibles
    // const availableApps = await prisma.app.findMany({
    //   where: { isActive: true },
    //   select: {
    //     id: true,
    //     name: true,
    //     slug: true,
    //     description: true,
    //     category: true,
    //     oauthType: true,
    //   },
    // });
    const availableApps: any[] = [];

    // Obtener templates existentes para referencia
    // const templates = await prisma.template.findMany({
    //   where: { featured: true },
    //   take: 5,
    //   select: {
    //     title: true,
    //     summary: true,
    //     definitionJson: true,
    //   },
    // });
    const templates: any[] = [];

    // Preparar contexto para la IA
    const systemPrompt = `
Eres un experto en automatización de workflows. Tu tarea es analizar la descripción del usuario y generar un workflow completo usando la plataforma Stack21.

APPS DISPONIBLES:
${availableApps.map(app => `- ${app.name} (${app.slug}): ${app.description} - Tipo: ${app.oauthType}`).join('\n')}

CONEXIONES EXISTENTES DEL USUARIO:
Ninguna

TEMPLATES DE REFERENCIA:
${templates.map(t => `- ${t.title}: ${t.summary}`).join('\n')}

Responde SOLO con un JSON válido que contenga:
{
  "workflow": {
    "name": "Nombre del workflow",
    "description": "Descripción detallada",
    "triggers": [
      {
        "type": "http_webhook|schedule|app_event|manual",
        "config": { /* configuración específica */ }
      }
    ],
    "steps": [
      {
        "order": 1,
        "type": "app_action|code_step|condition|loop|delay|http_request",
        "name": "Nombre del paso",
        "appId": "id_del_app_si_aplica",
        "actionKey": "clave_de_acción_si_aplica",
        "codeLang": "javascript|python_si_aplica",
        "code": "código_si_aplica",
        "config": { /* configuración del paso */ }
      }
    ],
    "variables": { /* variables del workflow */ },
    "tags": ["tag1", "tag2"]
  },
  "suggestions": {
    "missingConnections": ["app1", "app2"],
    "optimizations": ["sugerencia1", "sugerencia2"],
    "alternatives": []
  },
  "explanation": "Explicación detallada del workflow generado"
}

IMPORTANTE:
- Usa solo apps disponibles en la lista
- Prioriza conexiones existentes del usuario
- Genera workflows realistas y funcionales
- Incluye manejo de errores cuando sea apropiado
- Explica claramente cada paso del workflow
`;

    const userPrompt = `
DESCRIPCIÓN DEL USUARIO:
${description}

CONTEXTO ADICIONAL:
- Complejidad preferida: ${context?.complexity || 'medium'}
- Apps preferidas: ${context?.preferredApps?.join(', ') || 'ninguna'}
- Conexiones existentes: ninguna

Genera un workflow que automatice exactamente lo que el usuario solicita.
`;

    // Llamar a OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No se recibió respuesta de la IA');
    }

    // Parsear respuesta JSON
    let aiResponse;
    try {
      aiResponse = JSON.parse(response);
    } catch (parseError) {
      console.error('Error parseando respuesta de IA:', parseError);
      return NextResponse.json(
        { error: 'Error procesando respuesta de la IA' },
        { status: 500 }
      );
    }

    // Validar estructura básica
    if (!aiResponse.workflow || !aiResponse.workflow.name || !aiResponse.workflow.steps) {
      return NextResponse.json(
        { error: 'Respuesta de IA inválida' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      workflow: aiResponse.workflow,
      suggestions: aiResponse.suggestions || {
        missingConnections: [],
        optimizations: [],
        alternatives: [],
      },
      explanation: aiResponse.explanation || 'Workflow generado automáticamente',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error generando workflow con IA:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
