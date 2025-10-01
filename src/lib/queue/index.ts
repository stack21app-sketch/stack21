// Sistema de colas para ejecución de workflows
import { Queue, Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';
import { prisma } from '@/lib/prisma';
import { getConnector } from '@/lib/connectors';
import { WorkflowDefinition, StepDefinition, RunPayload } from '@/types/automation';

// Configuración de Redis
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
});

// Colas
export const runQueue = new Queue('runs', { connection: redis });
export const scheduleQueue = new Queue('schedules', { connection: redis });
export const dlqQueue = new Queue('runs-dlq', { connection: redis });

// Worker para ejecutar workflows
const runWorker = new Worker(
  'runs',
  async (job: Job) => {
    const { runId, workflowId, input } = job.data;
    
    try {
      // Obtener workflow y run
      const workflow = await prisma.workflow.findUnique({
        where: { id: workflowId },
        include: {
          steps: {
            orderBy: { order: 'asc' },
          },
        },
      });

      if (!workflow) {
        throw new Error('Workflow no encontrado');
      }

      const run = await prisma.run.findUnique({
        where: { id: runId },
        include: {
          runSteps: {
            orderBy: { startedAt: 'asc' },
          },
        },
      });

      if (!run) {
        throw new Error('Run no encontrado');
      }

      // Actualizar estado a running
      await prisma.run.update({
        where: { id: runId },
        data: { status: 'RUNNING' },
      });

      // Ejecutar pasos secuencialmente
      let currentInput = input;
      let totalCost = 0;

      for (const step of workflow.steps) {
        const runStep = await prisma.runStep.create({
          data: {
            runId: runId,
            stepId: step.id,
            name: (step as any).name || (step as any).actionKey || (step as any).type || 'step',
            status: 'PENDING',
            input: currentInput,
          },
        });

        try {
          // Actualizar estado a running
          await prisma.runStep.update({
            where: { id: runStep.id },
            data: { status: 'RUNNING' },
          });

          // Ejecutar paso (asegurar StepDefinition con name)
          const stepForExec = { name: (step as any).name || (step as any).actionKey || step.type || 'step', ...step } as any;
          const result = await executeStep(stepForExec, currentInput, workflow.projectId);
          
          // Actualizar con resultado
          await prisma.runStep.update({
            where: { id: runStep.id },
            data: {
              status: 'COMPLETED',
              output: result.data,
              finishedAt: new Date(),
            },
          });

          currentInput = result.data;
          totalCost += result.costCents || 0;

        } catch (stepError) {
          // Marcar paso como fallido
          await prisma.runStep.update({
            where: { id: runStep.id },
            data: {
              status: 'FAILED',
              error: stepError instanceof Error ? stepError.message : 'Error desconocido',
              finishedAt: new Date(),
            },
          });

          // Si el paso es crítico, fallar todo el workflow (acceso seguro a JsonValue)
          const cfg = (typeof step.config === 'object' && step.config !== null ? (step.config as any) : {}) as any;
          if (cfg.critical !== false) {
            throw stepError;
          }
        }
      }

      // Marcar run como completado
      await prisma.run.update({
        where: { id: runId },
        data: {
          status: 'COMPLETED',
          output: currentInput,
          costCents: totalCost,
          finishedAt: new Date(),
        },
      });

    } catch (error) {
      // Marcar run como fallido
      await prisma.run.update({
        where: { id: runId },
        data: {
          status: 'FAILED',
          error: error instanceof Error ? error.message : 'Error desconocido',
          finishedAt: new Date(),
        },
      });

      // Mover a cola de dead letter
      await dlqQueue.add('failed-run', {
        runId,
        error: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
      });

      throw error;
    }
  },
  { connection: redis }
);

// Worker para schedules
const scheduleWorker = new Worker(
  'schedules',
  async (job: Job) => {
    const { workflowId, cronExpression } = job.data;
    
    // Crear run para el workflow programado
    const run = await prisma.run.create({
      data: {
        workflowId,
        status: 'PENDING',
        input: {
          trigger: {
            type: 'schedule',
            cron: cronExpression,
            triggeredAt: new Date().toISOString(),
          },
        },
        costCents: 0,
      },
    });

    // Encolar ejecución
    await runQueue.add('execute-workflow', {
      runId: run.id,
      workflowId,
      input: run.input,
    });
  },
  { connection: redis }
);

// Función para ejecutar un paso individual
async function executeStep(
  step: StepDefinition, 
  input: any, 
  projectId: string
): Promise<{ data: any; costCents?: number }> {
  
  switch (step.type) {
    case 'app_action':
      return await executeAppAction(step, input, projectId);
    
    case 'code_step':
      return await executeCodeStep(step, input);
    
    case 'condition':
      return await executeCondition(step, input);
    
    case 'loop':
      return await executeLoop(step, input, projectId);
    
    case 'delay':
      return await executeDelay(step, input);
    
    case 'http_request':
      return await executeHttpRequest(step, input);
    
    default:
      throw new Error(`Tipo de paso no soportado: ${step.type}`);
  }
}

// Ejecutar acción de app
async function executeAppAction(
  step: StepDefinition, 
  input: any, 
  projectId: string
): Promise<{ data: any; costCents?: number }> {
  
  if (!step.appId || !step.actionKey) {
    throw new Error('App ID y action key son requeridos para acciones de app');
  }

  // Obtener conector
  const connector = getConnector(step.appId);
  if (!connector) {
    throw new Error(`Conector no encontrado: ${step.appId}`);
  }

  // Obtener conexión
  const connection = await prisma.connection.findFirst({
    where: {
      appId: step.appId,
      projectId: projectId,
      isActive: true,
    },
  });

  if (!connection) {
    throw new Error(`Conexión no encontrada para ${step.appId}`);
  }

  // Descifrar credenciales
  const credentials = decryptCredentials(connection, process.env.ENCRYPTION_KEY || 'default-key');

  // Ejecutar acción
  const result = await connector.executeAction(step.actionKey, step.config, credentials);
  
  return {
    data: result,
    costCents: calculateCost(step.appId, step.actionKey),
  };
}

// Ejecutar código
async function executeCodeStep(
  step: StepDefinition, 
  input: any
): Promise<{ data: any; costCents?: number }> {
  
  if (!step.code) {
    throw new Error('Código es requerido para code steps');
  }

  // TODO: Implementar sandbox seguro para ejecutar código
  // Por ahora, solo retornamos el input
  return {
    data: input,
    costCents: 0,
  };
}

// Ejecutar condición
async function executeCondition(
  step: StepDefinition, 
  input: any
): Promise<{ data: any; costCents?: number }> {
  
  // TODO: Implementar lógica de condiciones
  return {
    data: input,
    costCents: 0,
  };
}

// Ejecutar loop
async function executeLoop(
  step: StepDefinition, 
  input: any, 
  projectId: string
): Promise<{ data: any; costCents?: number }> {
  
  // TODO: Implementar lógica de loops
  return {
    data: input,
    costCents: 0,
  };
}

// Ejecutar delay
async function executeDelay(
  step: StepDefinition, 
  input: any
): Promise<{ data: any; costCents?: number }> {
  
  const delayMs = step.config?.delayMs || 1000;
  await new Promise(resolve => setTimeout(resolve, delayMs));
  
  return {
    data: input,
    costCents: 0,
  };
}

// Ejecutar HTTP request
async function executeHttpRequest(
  step: StepDefinition, 
  input: any
): Promise<{ data: any; costCents?: number }> {
  
  const { method = 'GET', url, headers = {}, body } = step.config || {};
  
  if (!url) {
    throw new Error('URL es requerida para HTTP requests');
  }

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const responseData = await response.text();
  let data;
  try {
    data = JSON.parse(responseData);
  } catch {
    data = responseData;
  }

  return {
    data: {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      data,
    },
    costCents: 0,
  };
}

// Función para descifrar credenciales
function decryptCredentials(connection: any, key: string): any {
  // TODO: Implementar descifrado real
  return {
    access_token: 'mock-token',
    refresh_token: 'mock-refresh-token',
  };
}

// Función para calcular costo
function calculateCost(appId: string, actionKey: string): number {
  // TODO: Implementar cálculo de costos real
  return 1; // 1 centavo por acción
}

// Función para encolar un run
export async function queueRun(runId: string, workflowId: string, input: any) {
  await runQueue.add('execute-workflow', {
    runId,
    workflowId,
    input,
  });
}

// Función para programar un workflow
export async function scheduleWorkflow(workflowId: string, cronExpression: string) {
  await scheduleQueue.add('schedule-workflow', {
    workflowId,
    cronExpression,
  }, {
    repeat: {
      pattern: cronExpression,
    },
  });
}

// Función para cancelar programación
export async function unscheduleWorkflow(workflowId: string) {
  const jobs = await scheduleQueue.getRepeatableJobs();
  for (const job of jobs) {
    if (job.name === 'schedule-workflow' && job.key.includes(workflowId)) {
      await scheduleQueue.removeRepeatableByKey(job.key);
    }
  }
}

// Exportar workers para mantenerlos activos
export { runWorker, scheduleWorker };
