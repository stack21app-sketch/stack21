// Motor de Workflows Real para Stack21
export interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay' | 'webhook' | 'email' | 'data';
  name: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  status: 'active' | 'inactive' | 'draft' | 'error';
  createdAt: Date;
  updatedAt: Date;
  lastRun?: Date;
  executionCount: number;
  successRate: number;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  data: Record<string, any>;
  steps: Array<{
    stepId: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    startedAt?: Date;
    completedAt?: Date;
    error?: string;
    output?: any;
  }>;
}

class WorkflowEngine {
  private executions: Map<string, WorkflowExecution> = new Map();
  private activeWorkflows: Map<string, Workflow> = new Map();

  // Crear un nuevo workflow
  createWorkflow(workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'executionCount' | 'successRate'>): Workflow {
    const newWorkflow: Workflow = {
      ...workflow,
      id: `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      executionCount: 0,
      successRate: 100
    };

    this.activeWorkflows.set(newWorkflow.id, newWorkflow);
    return newWorkflow;
  }

  // Ejecutar un workflow
  async executeWorkflow(workflowId: string, triggerData?: any): Promise<WorkflowExecution> {
    const workflow = this.activeWorkflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    const execution: WorkflowExecution = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      workflowId,
      status: 'running',
      startedAt: new Date(),
      data: triggerData || {},
      steps: workflow.steps.map(step => ({
        stepId: step.id,
        status: 'pending'
      }))
    };

    this.executions.set(execution.id, execution);

    try {
      // Ejecutar pasos secuencialmente
      for (let i = 0; i < workflow.steps.length; i++) {
        const step = workflow.steps[i];
        const stepExecution = execution.steps[i];
        
        stepExecution.status = 'running';
        stepExecution.startedAt = new Date();

        try {
          const result = await this.executeStep(step, execution.data);
          stepExecution.status = 'completed';
          stepExecution.completedAt = new Date();
          stepExecution.output = result;
          
          // Actualizar datos para el siguiente paso
          execution.data = { ...execution.data, ...result };
        } catch (error) {
          stepExecution.status = 'failed';
          stepExecution.completedAt = new Date();
          stepExecution.error = error instanceof Error ? error.message : 'Unknown error';
          throw error;
        }
      }

      execution.status = 'completed';
      execution.completedAt = new Date();

      // Actualizar estadísticas del workflow
      workflow.executionCount++;
      workflow.lastRun = new Date();
      
      // Calcular tasa de éxito (simplificado)
      const recentExecutions = Array.from(this.executions.values())
        .filter(exec => exec.workflowId === workflowId)
        .slice(-10);
      
      const successfulExecutions = recentExecutions.filter(exec => exec.status === 'completed').length;
      workflow.successRate = Math.round((successfulExecutions / recentExecutions.length) * 100);

    } catch (error) {
      execution.status = 'failed';
      execution.completedAt = new Date();
      execution.error = error instanceof Error ? error.message : 'Unknown error';
    }

    return execution;
  }

  // Ejecutar un paso individual
  private async executeStep(step: WorkflowStep, data: Record<string, any>): Promise<any> {
    switch (step.type) {
      case 'trigger':
        return this.executeTrigger(step, data);
      case 'action':
        return this.executeAction(step, data);
      case 'condition':
        return this.executeCondition(step, data);
      case 'delay':
        return this.executeDelay(step, data);
      case 'webhook':
        return this.executeWebhook(step, data);
      case 'email':
        return this.executeEmail(step, data);
      case 'data':
        return this.executeDataTransform(step, data);
      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }
  }

  private async executeTrigger(step: WorkflowStep, data: Record<string, any>): Promise<any> {
    // Simular trigger
    await this.delay(100);
    return { triggered: true, timestamp: new Date().toISOString() };
  }

  private async executeAction(step: WorkflowStep, data: Record<string, any>): Promise<any> {
    // Simular acción
    await this.delay(200);
    return { action: step.name, result: 'success', data };
  }

  private async executeCondition(step: WorkflowStep, data: Record<string, any>): Promise<any> {
    // Simular condición
    await this.delay(50);
    const condition = step.config.condition || 'true';
    const result = this.evaluateCondition(condition, data);
    return { condition: condition, result, data };
  }

  private async executeDelay(step: WorkflowStep, data: Record<string, any>): Promise<any> {
    const delayMs = step.config.delay || 1000;
    await this.delay(delayMs);
    return { delayed: delayMs, data };
  }

  private async executeWebhook(step: WorkflowStep, data: Record<string, any>): Promise<any> {
    const url = step.config.url;
    if (!url) {
      throw new Error('Webhook URL not configured');
    }

    try {
      const response = await fetch(url, {
        method: step.config.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...step.config.headers
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return { webhook: url, response: result };
    } catch (error) {
      throw new Error(`Webhook failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async executeEmail(step: WorkflowStep, data: Record<string, any>): Promise<any> {
    // Simular envío de email
    await this.delay(300);
    return {
      email: {
        to: step.config.to || data.email,
        subject: step.config.subject || 'Notification',
        body: step.config.body || 'Default message',
        sent: true,
        timestamp: new Date().toISOString()
      }
    };
  }

  private async executeDataTransform(step: WorkflowStep, data: Record<string, any>): Promise<any> {
    // Simular transformación de datos
    await this.delay(100);
    const transform = step.config.transform || {};
    
    // Aplicar transformaciones simples
    const result = { ...data };
    for (const [key, value] of Object.entries(transform)) {
      result[key] = typeof value === 'function' ? value(data) : value;
    }
    
    return result;
  }

  private evaluateCondition(condition: string, data: Record<string, any>): boolean {
    try {
      // Evaluación simple de condiciones
      const context = { data, ...data };
      return new Function('data', `return ${condition}`)(context);
    } catch {
      return false;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Obtener workflow por ID
  getWorkflow(id: string): Workflow | undefined {
    return this.activeWorkflows.get(id);
  }

  // Obtener todos los workflows
  getAllWorkflows(): Workflow[] {
    return Array.from(this.activeWorkflows.values());
  }

  // Obtener ejecución por ID
  getExecution(id: string): WorkflowExecution | undefined {
    return this.executions.get(id);
  }

  // Obtener ejecuciones de un workflow
  getWorkflowExecutions(workflowId: string): WorkflowExecution[] {
    return Array.from(this.executions.values())
      .filter(exec => exec.workflowId === workflowId)
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
  }

  // Actualizar workflow
  updateWorkflow(id: string, updates: Partial<Workflow>): Workflow | null {
    const workflow = this.activeWorkflows.get(id);
    if (!workflow) {
      return null;
    }

    const updatedWorkflow = {
      ...workflow,
      ...updates,
      updatedAt: new Date()
    };

    this.activeWorkflows.set(id, updatedWorkflow);
    return updatedWorkflow;
  }

  // Eliminar workflow
  deleteWorkflow(id: string): boolean {
    return this.activeWorkflows.delete(id);
  }
}

// Instancia singleton del motor
export const workflowEngine = new WorkflowEngine();

// Funciones de utilidad
export const createSampleWorkflow = (): Workflow => {
  return workflowEngine.createWorkflow({
    name: 'Automatización de Leads',
    description: 'Procesa nuevos leads automáticamente',
    status: 'draft',
    steps: [
      {
        id: 'trigger_1',
        type: 'trigger',
        name: 'Nuevo Lead',
        config: { event: 'form_submit' },
        position: { x: 100, y: 100 }
      },
      {
        id: 'action_1',
        type: 'action',
        name: 'Validar Email',
        config: { action: 'validate_email' },
        position: { x: 300, y: 100 }
      },
      {
        id: 'condition_1',
        type: 'condition',
        name: '¿Email Válido?',
        config: { condition: 'data.email.includes("@")' },
        position: { x: 500, y: 100 }
      },
      {
        id: 'email_1',
        type: 'email',
        name: 'Enviar Bienvenida',
        config: {
          to: 'data.email',
          subject: '¡Bienvenido!',
          body: 'Gracias por tu interés.'
        },
        position: { x: 700, y: 50 }
      }
    ]
  });
};


