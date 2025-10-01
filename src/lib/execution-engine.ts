import fs from 'fs';
import path from 'path';

export interface WorkflowStep {
  id: string;
  type: string;
  name: string;
  config: any;
  next?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  trigger: {
    type: string;
    config: any;
  };
  steps: WorkflowStep[];
}

export interface RunStep {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  input?: any;
  output?: any;
  error?: string;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  duration?: number;
  triggerType: string;
  triggerData?: any;
  errorMessage?: string;
  steps: RunStep[];
}

function getRunsFilePath() {
  return path.join(process.cwd(), 'src', 'data', 'runs.json');
}

function readAllRuns(): WorkflowRun[] {
  const filePath = getRunsFilePath();
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as WorkflowRun[];
  } catch {
    return [];
  }
}

function writeAllRuns(runs: WorkflowRun[]) {
  const filePath = getRunsFilePath();
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(runs, null, 2));
}

function getWorkflowsFilePath() {
  return path.join(process.cwd(), 'src', 'data', 'workflows.json');
}

function readAllWorkflows(): WorkflowDefinition[] {
  const filePath = getWorkflowsFilePath();
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as WorkflowDefinition[];
  } catch {
    return [];
  }
}

function writeAllWorkflows(workflows: WorkflowDefinition[]) {
  const filePath = getWorkflowsFilePath();
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(workflows, null, 2));
}

// Step executors
async function executeStep(step: WorkflowStep, input: any): Promise<any> {
  const startTime = Date.now();
  
  try {
    switch (step.type) {
      case 'http_request':
        return await executeHttpRequest(step, input);
      case 'data_transform':
        return await executeDataTransform(step, input);
      case 'condition':
        return await executeCondition(step, input);
      case 'delay':
        return await executeDelay(step, input);
      case 'log':
        return await executeLog(step, input);
      default:
        throw new Error(`Tipo de paso no soportado: ${step.type}`);
    }
  } catch (error: any) {
    throw new Error(`Error en paso ${step.name}: ${error.message}`);
  }
}

async function executeHttpRequest(step: WorkflowStep, input: any): Promise<any> {
  const { url, method = 'GET', headers = {}, body } = step.config;
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return await response.json();
}

async function executeDataTransform(step: WorkflowStep, input: any): Promise<any> {
  const { transform } = step.config;
  
  if (typeof transform === 'function') {
    return transform(input);
  }
  
  // Simple field mapping
  if (typeof transform === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(transform)) {
      if (typeof value === 'string' && value.startsWith('$.')) {
        // Simple JSONPath-like access
        const path = value.slice(2).split('.');
        let current = input;
        for (const segment of path) {
          current = current?.[segment];
        }
        result[key] = current;
      } else {
        result[key] = value;
      }
    }
    return result;
  }
  
  return input;
}

async function executeCondition(step: WorkflowStep, input: any): Promise<any> {
  const { condition, trueValue, falseValue } = step.config;
  
  let result = false;
  if (typeof condition === 'function') {
    result = condition(input);
  } else if (typeof condition === 'string') {
    // Simple expression evaluation
    result = eval(condition.replace(/\$\./g, 'input.'));
  }
  
  return result ? trueValue : falseValue;
}

async function executeDelay(step: WorkflowStep, input: any): Promise<any> {
  const { duration } = step.config;
  await new Promise(resolve => setTimeout(resolve, duration || 1000));
  return input;
}

async function executeLog(step: WorkflowStep, input: any): Promise<any> {
  const { message, level = 'info' } = step.config;
  console.log(`[${level.toUpperCase()}] ${message}:`, input);
  return input;
}

// Main execution function
export async function executeWorkflow(workflowId: string, triggerData?: any): Promise<WorkflowRun> {
  const workflows = readAllWorkflows();
  const workflow = workflows.find(w => w.id === workflowId);
  
  if (!workflow) {
    throw new Error(`Workflow ${workflowId} no encontrado`);
  }
  
  const runId = `run_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const startedAt = new Date().toISOString();
  
  const run: WorkflowRun = {
    id: runId,
    workflowId: workflow.id,
    workflowName: workflow.name,
    status: 'running',
    startedAt,
    triggerType: workflow.trigger.type,
    triggerData,
    steps: []
  };
  
  // Save initial run
  const allRuns = readAllRuns();
  allRuns.push(run);
  writeAllRuns(allRuns);
  
  try {
    let currentData = triggerData || {};
    const stepMap = new Map(workflow.steps.map(step => [step.id, step]));
    const executedSteps = new Set<string>();
    
    // Find starting step (first step or one without dependencies)
    let currentStepId: string | undefined = workflow.steps[0]?.id;
    
    while (currentStepId && !executedSteps.has(currentStepId)) {
      const step = stepMap.get(currentStepId);
      if (!step) break;
      
      executedSteps.add(currentStepId);
      
      const runStep: RunStep = {
        id: step.id,
        name: step.name,
        type: step.type,
        status: 'running',
        startedAt: new Date().toISOString(),
        input: currentData
      };
      
      run.steps.push(runStep);
      
      try {
        const stepStartTime = Date.now();
        const output = await executeStep(step, currentData);
        const stepDuration = Date.now() - stepStartTime;
        
        runStep.status = 'completed';
        runStep.completedAt = new Date().toISOString();
        runStep.duration = stepDuration;
        runStep.output = output;
        
        currentData = output;
        currentStepId = step.next;
        
      } catch (error: any) {
        runStep.status = 'failed';
        runStep.completedAt = new Date().toISOString();
        runStep.error = error.message;
        
        run.status = 'failed';
        run.errorMessage = error.message;
        break;
      }
      
      // Update run in storage
      const updatedRuns = readAllRuns();
      const runIndex = updatedRuns.findIndex(r => r.id === runId);
      if (runIndex !== -1) {
        updatedRuns[runIndex] = run;
        writeAllRuns(updatedRuns);
      }
    }
    
    if (run.status === 'running') {
      run.status = 'completed';
    }
    
  } catch (error: any) {
    run.status = 'failed';
    run.errorMessage = error.message;
  }
  
  run.completedAt = new Date().toISOString();
  run.duration = new Date(run.completedAt).getTime() - new Date(run.startedAt).getTime();
  
  // Final update
  const finalRuns = readAllRuns();
  const runIndex = finalRuns.findIndex(r => r.id === runId);
  if (runIndex !== -1) {
    finalRuns[runIndex] = run;
    writeAllRuns(finalRuns);
  }
  
  return run;
}

// Initialize sample workflows if none exist
export function initializeSampleWorkflows() {
  const workflows = readAllWorkflows();
  if (workflows.length === 0) {
    const sampleWorkflows: WorkflowDefinition[] = [
      {
        id: 'wf_sample_1',
        name: 'Procesar Datos de Formulario',
        description: 'Procesa datos de formulario y envía notificación',
        trigger: {
          type: 'webhook',
          config: { path: '/webhook/form-submit' }
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
                timestamp: '$.timestamp'
              }
            },
            next: 'step_2'
          },
          {
            id: 'step_2',
            type: 'log',
            name: 'Registrar Datos',
            config: {
              message: 'Datos procesados',
              level: 'info'
            },
            next: 'step_3'
          },
          {
            id: 'step_3',
            type: 'http_request',
            name: 'Enviar Notificación',
            config: {
              url: 'https://api.example.com/notify',
              method: 'POST',
              headers: {
                'Authorization': 'Bearer token123'
              },
              body: {
                message: 'Nuevo formulario recibido',
                data: '$.'
              }
            }
          }
        ]
      },
      {
        id: 'wf_sample_2',
        name: 'Sincronizar Datos',
        description: 'Sincroniza datos entre sistemas',
        trigger: {
          type: 'schedule',
          config: { cron: '0 */6 * * *' }
        },
        steps: [
          {
            id: 'step_1',
            type: 'http_request',
            name: 'Obtener Datos Fuente',
            config: {
              url: 'https://api.source.com/data',
              method: 'GET'
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
              url: 'https://api.destination.com/sync',
              method: 'POST',
              body: '$.'
            }
          }
        ]
      }
    ];
    
    writeAllWorkflows(sampleWorkflows);
  }
}
